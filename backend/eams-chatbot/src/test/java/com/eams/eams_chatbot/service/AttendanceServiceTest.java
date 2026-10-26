package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.enums.Role;
import com.eams.eams_chatbot.model.AttendanceRecord;
import com.eams.eams_chatbot.model.AttendanceSession;
import com.eams.eams_chatbot.model.Employee;
import com.eams.eams_chatbot.model.User;
import com.eams.eams_chatbot.repository.AttendanceRecordRepository;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.mongodb.client.result.UpdateResult;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class AttendanceServiceTest {
    private AttendanceRecordRepository attendanceRepository;
    private EmployeeRepository employeeRepository;
    private MongoTemplate mongoTemplate;
    private AttendanceService service;
    private UserPrincipal employeePrincipal;

    @BeforeEach void setUp() {
        attendanceRepository = mock(AttendanceRecordRepository.class);
        employeeRepository = mock(EmployeeRepository.class);
        mongoTemplate = mock(MongoTemplate.class);
        UpdateResult migration = mock(UpdateResult.class);
        when(migration.getMatchedCount()).thenReturn(1L);
        when(mongoTemplate.updateFirst(any(Query.class), any(Update.class), eq(AttendanceRecord.class))).thenReturn(migration);
        service = new AttendanceService(attendanceRepository, employeeRepository, mongoTemplate);
        employeePrincipal = new UserPrincipal(User.builder().id("user-1").email("employee@example.com")
                .role(Role.EMPLOYEE).employeeId("employee-1").active(true).build());
        when(employeeRepository.findById("employee-1")).thenReturn(Optional.of(Employee.builder().id("employee-1").name("Employee").build()));
        when(attendanceRepository.findByEmployeeIdOrderByDateDesc("employee-1")).thenReturn(List.of());
    }

    @Test void firstCheckInCreatesSessionForAuthenticatedEmployee() {
        when(attendanceRepository.findByEmployeeIdAndDate(eq("employee-1"), any(LocalDate.class))).thenReturn(Optional.empty());
        when(attendanceRepository.save(any(AttendanceRecord.class))).thenAnswer(call -> call.getArgument(0));
        AttendanceRecord saved = service.checkIn(employeePrincipal);
        assertEquals("employee-1", saved.getEmployeeId());
        assertNotNull(saved.getCheckIn());
        assertEquals(1, saved.getSessions().size());
        assertEquals("CHECKED_IN", saved.getState());
    }

    @Test void secondCheckInPreservesCompletedSession() {
        Instant in = Instant.now().minusSeconds(7200), out = Instant.now().minusSeconds(3600);
        AttendanceRecord day = AttendanceRecord.builder().employeeId("employee-1").employeeName("Employee")
                .date(LocalDate.now()).checkIn(in).checkOut(out).sessions(new ArrayList<>(List.of(new AttendanceSession("one", in, out)))).build();
        when(attendanceRepository.findByEmployeeIdAndDate(eq("employee-1"), any(LocalDate.class))).thenReturn(Optional.of(day));
        when(attendanceRepository.save(any(AttendanceRecord.class))).thenAnswer(call -> call.getArgument(0));
        AttendanceRecord saved = service.checkIn(employeePrincipal);
        assertEquals(2, saved.getSessions().size());
        assertEquals(out, saved.getSessions().getFirst().getCheckOut());
        assertNull(saved.getSessions().getLast().getCheckOut());
        assertNull(saved.getCheckOut());
    }

    @Test void checkoutClosesLatestActiveSessionAndKeepsHistory() {
        Instant firstIn = Instant.now().minusSeconds(8000), firstOut = Instant.now().minusSeconds(7000), secondIn = Instant.now().minusSeconds(120);
        AttendanceRecord day = AttendanceRecord.builder().employeeId("employee-1").date(LocalDate.now())
                .checkIn(firstIn).sessions(new ArrayList<>(List.of(new AttendanceSession("one", firstIn, firstOut), new AttendanceSession("two", secondIn, null)))).build();
        when(attendanceRepository.findByEmployeeIdOrderByDateDesc("employee-1")).thenReturn(List.of(day));
        when(attendanceRepository.save(day)).thenReturn(day);
        AttendanceRecord saved = service.checkOut(employeePrincipal);
        assertEquals(firstOut, saved.getSessions().getFirst().getCheckOut());
        assertTrue(saved.getSessions().getLast().getCheckOut().isAfter(secondIn));
        assertEquals("CHECKED_OUT", saved.getState());
    }

    @Test void duplicateActiveCheckInIsRejected() {
        AttendanceRecord active = AttendanceRecord.builder().employeeId("employee-1").date(LocalDate.now())
                .checkIn(Instant.now()).sessions(new ArrayList<>(List.of(new AttendanceSession("one", Instant.now(), null)))).build();
        when(attendanceRepository.findByEmployeeIdOrderByDateDesc("employee-1")).thenReturn(List.of(active));
        assertThrows(ResponseStatusException.class, () -> service.checkIn(employeePrincipal));
        verify(attendanceRepository, never()).save(any());
    }

    @Test void checkoutWithoutActiveSessionIsRejected() {
        assertThrows(ResponseStatusException.class, () -> service.checkOut(employeePrincipal));
        verify(attendanceRepository, never()).save(any());
    }

    @Test void optimisticWriteConflictIsReportedInsteadOfCreatingAnotherSession() {
        when(attendanceRepository.findByEmployeeIdAndDate(eq("employee-1"), any(LocalDate.class))).thenReturn(Optional.empty());
        when(attendanceRepository.save(any(AttendanceRecord.class))).thenThrow(new OptimisticLockingFailureException("stale attendance version"));
        assertThrows(ResponseStatusException.class, () -> service.checkIn(employeePrincipal));
    }

    @Test void competingFirstCheckInsCannotInsertTwoDailyRecords() {
        when(attendanceRepository.findByEmployeeIdAndDate(eq("employee-1"), any(LocalDate.class))).thenReturn(Optional.empty());
        AtomicReference<AttendanceRecord> inserted = new AtomicReference<>();
        when(attendanceRepository.save(any(AttendanceRecord.class))).thenAnswer(call -> {
            AttendanceRecord candidate = call.getArgument(0);
            if (!inserted.compareAndSet(null, candidate)) throw new DuplicateKeyException("duplicate daily id");
            return candidate;
        });
        AttendanceRecord first = service.checkIn(employeePrincipal);
        assertEquals(1, first.getSessions().size());
        assertThrows(ResponseStatusException.class, () -> service.checkIn(employeePrincipal));
        assertEquals(1, inserted.get().getSessions().size());
    }

    @Test void reviewerCannotCheckInAsAnEmployee() {
        UserPrincipal manager = new UserPrincipal(User.builder().id("manager").email("manager@example.com")
                .role(Role.MANAGER).employeeId("manager-1").active(true).build());
        assertThrows(ResponseStatusException.class, () -> service.checkIn(manager));
        verify(attendanceRepository, never()).save(any());
    }
}
