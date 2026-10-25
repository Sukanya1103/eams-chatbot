package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.enums.AttendanceStatus;
import com.eams.eams_chatbot.enums.Role;
import com.eams.eams_chatbot.model.AttendanceRecord;
import com.eams.eams_chatbot.model.AttendanceSession;
import com.eams.eams_chatbot.model.Employee;
import com.eams.eams_chatbot.repository.AttendanceRecordRepository;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class AttendanceService {
    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Kolkata");
    private final AttendanceRecordRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final MongoTemplate mongoTemplate;

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
        if (hasActiveSession(employee.getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You already have an active attendance session");
        LocalDate today = LocalDate.now(BUSINESS_ZONE);
        var existing = attendanceRepository.findByEmployeeIdAndDate(employee.getId(), today);
        AttendanceRecord record = existing
                .orElseGet(() -> AttendanceRecord.builder().id(dailyId(employee.getId(), today))
                        .employeeId(employee.getId()).employeeName(employee.getName()).date(today)
                        .status(AttendanceStatus.PRESENT).sessions(new ArrayList<>()).build());
        if (existing.isPresent()) upgradeLegacyVersion(record);
        List<AttendanceSession> sessions = new ArrayList<>(record.getSessions());
        sessions.add(new AttendanceSession(UUID.randomUUID().toString(), Instant.now(), null));
        record.setSessions(sessions);
        record.setCheckIn(sessions.getFirst().getCheckIn());
        record.setCheckOut(null);
        try { return attendanceRepository.save(record); }
        catch (DuplicateKeyException | OptimisticLockingFailureException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Attendance changed in another request. Refresh and try again");
        }
    }

    public AttendanceRecord checkOut(UserPrincipal caller) {
        Employee employee = employee(caller);
        List<AttendanceRecord> records = attendanceRepository.findByEmployeeIdOrderByDateDesc(employee.getId());
        for (AttendanceRecord record : records) {
            List<AttendanceSession> sessions = new ArrayList<>(record.getSessions());
            for (int i = sessions.size() - 1; i >= 0; i--) {
                AttendanceSession session = sessions.get(i);
                if (session.getCheckOut() == null) {
                    upgradeLegacyVersion(record);
                    Instant now = Instant.now();
                    if (session.getCheckIn() == null || !now.isAfter(session.getCheckIn()))
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "Checkout time must be after check-in");
                    session.setCheckOut(now);
                    record.setSessions(sessions);
                    record.setCheckOut(sessions.stream().allMatch(item -> item.getCheckOut() != null)
                            ? sessions.getLast().getCheckOut() : null);
                    try { return attendanceRepository.save(record); }
                    catch (OptimisticLockingFailureException ex) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT, "Attendance changed in another request. Refresh and try again");
                    }
                }
            }
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Check in before checking out; there is no active session");
    }

    private boolean hasActiveSession(String employeeId) {
        return attendanceRepository.findByEmployeeIdOrderByDateDesc(employeeId).stream()
                .flatMap(record -> record.getSessions().stream()).anyMatch(session -> session.getCheckOut() == null);
    }

    private String dailyId(String employeeId, LocalDate date) {
        return UUID.nameUUIDFromBytes((employeeId + ":" + date).getBytes(StandardCharsets.UTF_8)).toString();
    }

    private void upgradeLegacyVersion(AttendanceRecord record) {
        if (record.getVersion() != null) return;
        var result = mongoTemplate.updateFirst(Query.query(Criteria.where("_id").is(record.getId()).and("version").exists(false)),
                new Update().set("version", 1L), AttendanceRecord.class);
        if (result.getMatchedCount() == 0)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Attendance changed in another request. Refresh and try again");
        record.setVersion(1L);
    }

    private Employee employee(UserPrincipal caller) {
        if (caller.getRole() != Role.EMPLOYEE || caller.getEmployeeId() == null)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only employees can check in or out");
        return employeeRepository.findById(caller.getEmployeeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee profile not found"));
    }
}
