package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.config.CompensationPolicyProperties;
import com.eams.eams_chatbot.dto.request.SubmitCompensationRequest;
import com.eams.eams_chatbot.enums.CompensationDayType;
import com.eams.eams_chatbot.enums.CompensationStatus;
import com.eams.eams_chatbot.enums.Role;
import com.eams.eams_chatbot.model.AttendanceRecord;
import com.eams.eams_chatbot.model.CompensationRequest;
import com.eams.eams_chatbot.model.Employee;
import com.eams.eams_chatbot.model.User;
import com.eams.eams_chatbot.repository.AttendanceRecordRepository;
import com.eams.eams_chatbot.repository.CompensationRequestRepository;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class CompensationServiceTest {
    private CompensationRequestRepository compensationRepository;
    private AttendanceRecordRepository attendanceRepository;
    private EmployeeRepository employeeRepository;
    private CompensationPolicyProperties policy;
    private CompensationService service;
    private UserPrincipal employee;
    private LocalDate workDate;

    @BeforeEach void setUp() {
        compensationRepository = mock(CompensationRequestRepository.class);
        attendanceRepository = mock(AttendanceRecordRepository.class);
        employeeRepository = mock(EmployeeRepository.class);
        policy = configuredPolicy();
        service = new CompensationService(compensationRepository, attendanceRepository, employeeRepository, policy);
        employee = principal("employee-user", "employee-1", Role.EMPLOYEE);
        workDate = lastSaturday();
        when(employeeRepository.findById("employee-1")).thenReturn(Optional.of(Employee.builder()
                .id("employee-1").name("Employee One").managerId("manager-1").build()));
    }

    @Test void failsClosedWhenPolicyIsNotConfigured() {
        policy.setEnabled(false);
        assertThrows(ResponseStatusException.class, () -> service.submit(request(workDate), employee));
        verifyNoInteractions(attendanceRepository, compensationRepository);
    }

    @Test void savesOnlyServerVerifiedAttendanceAndPrincipalOwnership() {
        Instant checkIn = Instant.parse("2026-10-24T02:00:00Z");
        Instant checkOut = checkIn.plusSeconds(8 * 60 * 60L);
        when(attendanceRepository.findByEmployeeIdAndDate("employee-1", workDate)).thenReturn(Optional.of(
                AttendanceRecord.builder().employeeId("employee-1").date(workDate).checkIn(checkIn).checkOut(checkOut).build()));
        when(compensationRepository.save(any(CompensationRequest.class))).thenAnswer(call -> {
            CompensationRequest saved = call.getArgument(0); saved.setId("request-1"); return saved;
        });

        var saved = service.submit(request(workDate), employee);

        assertEquals("request-1", saved.getId());
        assertEquals("employee-1", saved.getEmployeeId());
        assertEquals(480, saved.getVerifiedWorkedMinutes());
        assertEquals(checkIn, saved.getVerifiedCheckIn());
        assertEquals(CompensationStatus.PENDING, saved.getStatus());
        verify(attendanceRepository).findByEmployeeIdAndDate("employee-1", workDate);
    }

    @Test void missingAttendanceIsRejectedWithoutSaving() {
        when(attendanceRepository.findByEmployeeIdAndDate("employee-1", workDate)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> service.submit(request(workDate), employee));
        verify(compensationRepository, never()).save(any());
    }

    @Test void incompleteAttendanceIsRejected() {
        when(attendanceRepository.findByEmployeeIdAndDate("employee-1", workDate)).thenReturn(Optional.of(
                AttendanceRecord.builder().employeeId("employee-1").date(workDate).checkIn(Instant.now()).build()));
        assertThrows(ResponseStatusException.class, () -> service.submit(request(workDate), employee));
        verify(compensationRepository, never()).save(any());
    }

    @Test void weekdayIsNotTreatedAsAHolidayWithoutAnAuthoritativeHolidaySource() {
        LocalDate weekday = lastSaturday().plusDays(2);
        when(attendanceRepository.findByEmployeeIdAndDate("employee-1", weekday)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> service.submit(request(weekday), employee));
        verify(attendanceRepository, never()).findByEmployeeIdAndDate(any(), any());
    }

    @Test void unsupportedTypeAndDuplicateWorkDateAreRejected() {
        policy.setAllowedTypes(Set.of("SUPPORTED_TYPE"));
        assertThrows(ResponseStatusException.class, () -> service.submit(request(workDate), employee));
        policy.setAllowedTypes(Set.of("COMP_TIME"));
        when(compensationRepository.existsByEmployeeIdAndWorkDate("employee-1", workDate)).thenReturn(true);
        assertThrows(ResponseStatusException.class, () -> service.submit(request(workDate), employee));
        verify(attendanceRepository, never()).findByEmployeeIdAndDate(any(), any());
    }

    @Test void employeeCannotReviewAndManagerCannotReviewTheirOwnRequest() {
        assertThrows(ResponseStatusException.class, () -> service.review("request-1", true, null, employee));
        UserPrincipal manager = principal("manager-user", "employee-1", Role.MANAGER);
        CompensationRequest own = pending("employee-1");
        when(compensationRepository.findById("request-1")).thenReturn(Optional.of(own));
        assertThrows(ResponseStatusException.class, () -> service.review("request-1", true, null, manager));
        verify(compensationRepository, never()).save(any());
    }

    @Test void managerCanReviewDirectReportOnce() {
        UserPrincipal manager = principal("manager-user", "manager-1", Role.MANAGER);
        CompensationRequest pending = pending("employee-1");
        when(compensationRepository.findById("request-1")).thenReturn(Optional.of(pending));
        when(employeeRepository.findById("employee-1")).thenReturn(Optional.of(Employee.builder()
                .id("employee-1").name("Employee One").managerId("manager-1").build()));
        when(compensationRepository.save(pending)).thenReturn(pending);
        var approved = service.review("request-1", true, "Verified", manager);
        assertEquals(CompensationStatus.APPROVED, approved.getStatus());
        assertEquals("manager@example.com", approved.getReviewedBy());
        assertThrows(ResponseStatusException.class, () -> service.review("request-1", false, null, manager));
        verify(compensationRepository, times(1)).save(pending);
    }

    @Test void managerPendingListContainsOnlyDirectReports() {
        UserPrincipal manager = principal("manager-user", "manager-1", Role.MANAGER);
        when(employeeRepository.findByManagerId("manager-1")).thenReturn(List.of(Employee.builder().id("employee-1").build()));
        when(compensationRepository.findByStatusOrderBySubmittedAtDesc(CompensationStatus.PENDING))
                .thenReturn(List.of(pending("employee-1"), pending("other-employee")));
        var results = service.pending(manager);
        assertEquals(1, results.size());
        assertEquals("employee-1", results.getFirst().getEmployeeId());
    }

    private CompensationPolicyProperties configuredPolicy() {
        var value = new CompensationPolicyProperties();
        value.setEnabled(true);
        value.setMinimumWorkedHours(BigDecimal.valueOf(8));
        value.setAllowedTypes(Set.of("COMP_TIME"));
        value.setEligibleDayTypes(Set.of(CompensationDayType.WEEKLY_OFF));
        value.setReviewerRoles(Set.of(Role.MANAGER, Role.HR));
        return value;
    }
    private UserPrincipal principal(String userId, String employeeId, Role role) {
        String email = role == Role.MANAGER ? "manager@example.com" : "employee@example.com";
        return new UserPrincipal(User.builder().id(userId).email(email).employeeId(employeeId).role(role).active(true).build());
    }
    private SubmitCompensationRequest request(LocalDate date) {
        var request = new SubmitCompensationRequest(); request.setWorkDate(date); request.setCompensationType("COMP_TIME"); request.setReason("Worked scheduled weekly off"); return request;
    }
    private CompensationRequest pending(String employeeId) {
        return CompensationRequest.builder().id("request-1").employeeId(employeeId).status(CompensationStatus.PENDING).version(0L).build();
    }
    private LocalDate lastSaturday() {
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        return today.minusDays((today.getDayOfWeek().getValue() - 6 + 7) % 7);
    }
}
