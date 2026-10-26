package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.config.CompensationPolicyProperties;
import com.eams.eams_chatbot.dto.request.SubmitCompensationRequest;
import com.eams.eams_chatbot.dto.response.CompensationOptionsResponse;
import com.eams.eams_chatbot.dto.response.CompensationResponse;
import com.eams.eams_chatbot.enums.CompensationDayType;
import com.eams.eams_chatbot.enums.CompensationStatus;
import com.eams.eams_chatbot.enums.Role;
import com.eams.eams_chatbot.model.AttendanceRecord;
import com.eams.eams_chatbot.model.CompensationRequest;
import com.eams.eams_chatbot.model.Employee;
import com.eams.eams_chatbot.repository.AttendanceRecordRepository;
import com.eams.eams_chatbot.repository.CompensationRequestRepository;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class CompensationService {
    public static final String POLICY_UNAVAILABLE = "Compensation eligibility rules have not been configured. Please contact HR.";
    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Kolkata");
    private final CompensationRequestRepository compensationRepository;
    private final AttendanceRecordRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final CompensationPolicyProperties policy;

    public CompensationOptionsResponse options() {
        return CompensationOptionsResponse.builder().available(policy.isConfigured())
                .supportedTypes(policy.isConfigured() ? Set.copyOf(policy.getAllowedTypes()) : Set.of())
                .message(policy.isConfigured() ? null : POLICY_UNAVAILABLE).build();
    }

    public CompensationResponse submit(SubmitCompensationRequest request, UserPrincipal caller) {
        requireConfigured();
        Employee employee = employeeCaller(caller);
        LocalDate today = LocalDate.now(BUSINESS_ZONE);
        if (request.getWorkDate().isAfter(today)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Work date cannot be in the future");
        if (!policy.getAllowedTypes().contains(request.getCompensationType()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This compensation type is not supported by the configured policy");
        CompensationDayType dayType = dayType(request.getWorkDate());
        if (dayType != CompensationDayType.WEEKLY_OFF || !policy.getEligibleDayTypes().contains(dayType))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This work date is not eligible under the configured policy. Company holidays cannot be verified by the current holiday source.");
        if (compensationRepository.existsByEmployeeIdAndWorkDate(employee.getId(), request.getWorkDate()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A compensation request already exists for this work date");

        AttendanceRecord attendance = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), request.getWorkDate())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "No attendance record exists for this work date; eligibility cannot be verified"));
        if (attendance.getCheckIn() == null || attendance.getCheckOut() == null)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Complete check-in and check-out records are required to verify eligibility");
        LocalDate checkInDate = attendance.getCheckIn().atZone(BUSINESS_ZONE).toLocalDate();
        LocalDate checkOutDate = attendance.getCheckOut().atZone(BUSINESS_ZONE).toLocalDate();
        if (!request.getWorkDate().equals(attendance.getDate()) || !checkInDate.equals(request.getWorkDate())
                || checkOutDate.isBefore(checkInDate) || checkOutDate.isAfter(checkInDate.plusDays(1)))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Attendance timestamps do not match the selected work date");
        Duration worked = Duration.ofSeconds(attendance.getTotalWorkedSeconds());
        if (worked.isZero() || worked.isNegative())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The attendance timestamps are invalid; eligibility cannot be verified");
        long minimumNanos = policy.getMinimumWorkedHours().multiply(BigDecimal.valueOf(3_600_000_000_000L))
                .setScale(0, RoundingMode.CEILING).longValueExact();
        if (worked.compareTo(Duration.ofNanos(minimumNanos)) < 0)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Verified attendance does not meet the configured minimum working duration");

        Instant now = Instant.now();
        String requestId = UUID.nameUUIDFromBytes((employee.getId() + ":" + request.getWorkDate()).getBytes(StandardCharsets.UTF_8)).toString();
        CompensationRequest entity = CompensationRequest.builder().id(requestId).employeeId(employee.getId()).employeeName(employee.getName())
                .workDate(request.getWorkDate()).dayType(dayType).verifiedCheckIn(attendance.getCheckIn())
                .verifiedCheckOut(attendance.getCheckOut()).verifiedWorkedMinutes(worked.toMinutes())
                .compensationType(request.getCompensationType()).reason(request.getReason().trim())
                .status(CompensationStatus.PENDING).submittedAt(now).updatedAt(now).build();
        try { return CompensationResponse.from(compensationRepository.save(entity)); }
        catch (DuplicateKeyException ex) { throw new ResponseStatusException(HttpStatus.CONFLICT, "A compensation request already exists for this work date"); }
    }

    public List<CompensationResponse> myRequests(UserPrincipal caller) {
        Employee employee = employeeCaller(caller);
        return compensationRepository.findByEmployeeIdOrderBySubmittedAtDesc(employee.getId()).stream().map(CompensationResponse::from).toList();
    }

    public List<CompensationResponse> pending(UserPrincipal caller) {
        requireReviewer(caller);
        List<CompensationRequest> requests = compensationRepository.findByStatusOrderBySubmittedAtDesc(CompensationStatus.PENDING);
        if (caller.getRole() == Role.MANAGER) {
            List<String> teamIds = employeeRepository.findByManagerId(caller.getEmployeeId()).stream().map(Employee::getId).toList();
            requests = requests.stream().filter(request -> teamIds.contains(request.getEmployeeId())).toList();
        }
        return requests.stream().map(CompensationResponse::from).toList();
    }

    public CompensationResponse get(String id, UserPrincipal caller) {
        CompensationRequest request = compensationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compensation request not found"));
        if (caller.getRole() == Role.EMPLOYEE && Objects.equals(request.getEmployeeId(), caller.getEmployeeId())) return CompensationResponse.from(request);
        authorizeReviewerFor(request, caller);
        return CompensationResponse.from(request);
    }

    public CompensationResponse review(String id, boolean approve, String comments, UserPrincipal caller) {
        requireReviewer(caller);
        CompensationRequest request = compensationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Compensation request not found"));
        authorizeReviewerFor(request, caller);
        if (request.getStatus() != CompensationStatus.PENDING)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only pending compensation requests can be reviewed");
        Instant now = Instant.now();
        request.setStatus(approve ? CompensationStatus.APPROVED : CompensationStatus.REJECTED);
        request.setReviewedBy(caller.getEmail());
        request.setReviewerComments(comments == null || comments.isBlank() ? null : comments.trim());
        request.setReviewedAt(now);
        request.setUpdatedAt(now);
        try { return CompensationResponse.from(compensationRepository.save(request)); }
        catch (OptimisticLockingFailureException ex) { throw new ResponseStatusException(HttpStatus.CONFLICT, "This request was already reviewed by another reviewer"); }
    }

    private void authorizeReviewerFor(CompensationRequest request, UserPrincipal caller) {
        requireReviewer(caller);
        if (Objects.equals(request.getEmployeeId(), caller.getEmployeeId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Reviewers cannot approve or reject their own requests");
        if (caller.getRole() == Role.MANAGER) {
            Employee employee = employeeRepository.findById(request.getEmployeeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee profile not found"));
            if (!caller.getEmployeeId().equals(employee.getManagerId()))
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Managers can review only direct reports");
        }
    }

    private void requireReviewer(UserPrincipal caller) {
        requireConfigured();
        if (caller.getRole() == Role.EMPLOYEE || !policy.getReviewerRoles().contains(caller.getRole()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to review compensation requests");
        if (caller.getRole() == Role.MANAGER && caller.getEmployeeId() == null)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Manager employee profile is required to review requests");
    }

    private Employee employeeCaller(UserPrincipal caller) {
        if (caller.getRole() != Role.EMPLOYEE || caller.getEmployeeId() == null)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only employees can access their compensation requests");
        return employeeRepository.findById(caller.getEmployeeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee profile not found"));
    }

    private void requireConfigured() {
        if (!policy.isConfigured()) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, POLICY_UNAVAILABLE);
    }

    private CompensationDayType dayType(LocalDate date) {
        return switch (date.getDayOfWeek()) {
            case SATURDAY, SUNDAY -> CompensationDayType.WEEKLY_OFF;
            default -> CompensationDayType.REGULAR_WORKDAY;
        };
    }
}
