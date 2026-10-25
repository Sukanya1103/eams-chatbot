package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.enums.AttendanceStatus;
import com.eams.eams_chatbot.enums.Role;
import com.eams.eams_chatbot.model.AttendanceRecord;
import com.eams.eams_chatbot.model.Employee;
import com.eams.eams_chatbot.repository.AttendanceRecordRepository;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.Instant;
import java.util.List;

@Service @RequiredArgsConstructor
public class AttendanceService {
    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Kolkata");
    private final AttendanceRecordRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public List<AttendanceRecord> list(UserPrincipal caller) {
        if (caller.getRole() == Role.ADMIN || caller.getRole() == Role.HR) return attendanceRepository.findAllByOrderByDateDesc();
        if (caller.getRole() == Role.MANAGER && caller.getEmployeeId() != null) {
            var ids = employeeRepository.findByManagerId(caller.getEmployeeId()).stream().map(Employee::getId).toList();
            return attendanceRepository.findAllByOrderByDateDesc().stream().filter(r -> ids.contains(r.getEmployeeId())).toList();
        }
        if (caller.getRole() == Role.EMPLOYEE && caller.getEmployeeId() != null)
            return attendanceRepository.findByEmployeeIdOrderByDateDesc(caller.getEmployeeId());
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to view attendance records");
    }

    public AttendanceRecord checkIn(UserPrincipal caller) {
        Employee employee = employee(caller);
        LocalDate today = LocalDate.now(BUSINESS_ZONE);
        if (attendanceRepository.findByEmployeeIdAndDate(employee.getId(), today).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You already have an attendance record for today");
        try {
            return attendanceRepository.save(AttendanceRecord.builder().employeeId(employee.getId()).employeeName(employee.getName())
                    .date(today).checkIn(Instant.now()).status(AttendanceStatus.PRESENT).build());
        } catch (DuplicateKeyException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You already have an attendance record for today");
        }
    }

    public AttendanceRecord checkOut(UserPrincipal caller) {
        Employee employee = employee(caller);
        AttendanceRecord record = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), LocalDate.now(BUSINESS_ZONE))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "Check in before checking out"));
        if (record.getCheckOut() != null) throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already checked out");
        record.setCheckOut(Instant.now());
        return attendanceRepository.save(record);
    }

    private Employee employee(UserPrincipal caller) {
        if (caller.getRole() != Role.EMPLOYEE || caller.getEmployeeId() == null)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only employees can check in or out");
        return employeeRepository.findById(caller.getEmployeeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee profile not found"));
    }
}
