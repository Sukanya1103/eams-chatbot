package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.dto.request.AttendanceCorrectionRequestDto;
import com.eams.eams_chatbot.model.AttendanceCorrectionRequest;
import com.eams.eams_chatbot.model.Employee;
import com.eams.eams_chatbot.repository.AttendanceCorrectionRepository;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service @RequiredArgsConstructor
public class AttendanceCorrectionService {
    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Kolkata");
    private final AttendanceCorrectionRepository correctionRepository;
    private final EmployeeRepository employeeRepository;

    public List<AttendanceCorrectionRequest> list(UserPrincipal caller) {
        Employee employee = employee(caller);
        return correctionRepository.findByEmployeeIdOrderBySubmittedAtDesc(employee.getId());
    }

    public AttendanceCorrectionRequest submit(AttendanceCorrectionRequestDto request, UserPrincipal caller) {
        Employee employee = employee(caller);
        if (request.getAttendanceDate().isAfter(LocalDate.now(BUSINESS_ZONE)))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Attendance corrections must be for today or an earlier date");
        Instant checkIn = LocalDateTime.of(request.getAttendanceDate(), request.getCheckInTime()).atZone(BUSINESS_ZONE).toInstant();
        Instant checkOut = LocalDateTime.of(request.getCheckOutDate(), request.getCheckOutTime()).atZone(BUSINESS_ZONE).toInstant();
        if (!checkOut.isAfter(checkIn)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Check-out must be later than check-in");
        if (request.getCheckOutDate().isBefore(request.getAttendanceDate()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Check-out date cannot be before attendance date");
        if (request.getCheckOutDate().isAfter(request.getAttendanceDate().plusDays(1)))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "An overnight attendance correction cannot span more than one day");
        AttendanceCorrectionRequest saved = AttendanceCorrectionRequest.builder().employeeId(employee.getId())
                .employeeName(employee.getName()).attendanceDate(request.getAttendanceDate()).requestedCheckIn(checkIn)
                .requestedCheckOut(checkOut).reason(request.getReason().trim())
                .remarks(request.getRemarks() == null ? null : request.getRemarks().trim())
                .agendas(request.getAgendas() == null ? List.of() : request.getAgendas())
                .referenceLinks(request.getReferenceLinks() == null ? List.of() : request.getReferenceLinks())
                .status("PENDING").submittedAt(Instant.now()).build();
        return correctionRepository.save(saved);
    }

    private Employee employee(UserPrincipal caller) {
        if (caller.getEmployeeId() == null) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Employee profile is required");
        return employeeRepository.findById(caller.getEmployeeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee profile not found"));
    }
}
