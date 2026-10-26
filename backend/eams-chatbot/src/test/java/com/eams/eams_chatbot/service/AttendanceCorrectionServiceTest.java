package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.dto.request.AttendanceCorrectionRequestDto;
import com.eams.eams_chatbot.enums.Role;
import com.eams.eams_chatbot.model.Employee;
import com.eams.eams_chatbot.model.User;
import com.eams.eams_chatbot.repository.AttendanceCorrectionRepository;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AttendanceCorrectionServiceTest {
    private AttendanceCorrectionRepository correctionRepository;
    private AttendanceCorrectionService service;
    private UserPrincipal principal;
    @BeforeEach void setUp() {
        correctionRepository = mock(AttendanceCorrectionRepository.class);
        EmployeeRepository employeeRepository = mock(EmployeeRepository.class);
        service = new AttendanceCorrectionService(correctionRepository, employeeRepository);
        principal = new UserPrincipal(User.builder().id("u1").email("e@example.com").role(Role.EMPLOYEE).employeeId("e1").active(true).build());
        when(employeeRepository.findById("e1")).thenReturn(Optional.of(Employee.builder().id("e1").name("Employee").build()));
    }
    @Test void savesCorrectionAsPendingForPrincipalEmployee() {
        when(correctionRepository.save(any())).thenAnswer(call -> call.getArgument(0));
        var saved = service.submit(request(LocalDate.now().minusDays(1), LocalDate.now().minusDays(1), LocalTime.of(9, 0), LocalTime.of(17, 0)), principal);
        assertEquals("e1", saved.getEmployeeId());
        assertEquals("PENDING", saved.getStatus());
        assertTrue(saved.getRequestedCheckOut().isAfter(saved.getRequestedCheckIn()));
    }
    @Test void rejectsCheckoutBeforeCheckin() {
        var request = request(LocalDate.now().minusDays(1), LocalDate.now().minusDays(1), LocalTime.of(18, 0), LocalTime.of(9, 0));
        assertThrows(ResponseStatusException.class, () -> service.submit(request, principal));
        verify(correctionRepository, never()).save(any());
    }
    @Test void supportsValidOvernightCorrection() {
        when(correctionRepository.save(any())).thenAnswer(call -> call.getArgument(0));
        var saved = service.submit(request(LocalDate.now().minusDays(1), LocalDate.now(), LocalTime.of(22, 0), LocalTime.of(6, 0)), principal);
        assertTrue(saved.getRequestedCheckOut().isAfter(saved.getRequestedCheckIn()));
    }
    private AttendanceCorrectionRequestDto request(LocalDate inDate, LocalDate outDate, LocalTime in, LocalTime out) {
        var request = new AttendanceCorrectionRequestDto(); request.setAttendanceDate(inDate); request.setCheckInTime(in);
        request.setCheckOutDate(outDate); request.setCheckOutTime(out); request.setReason("Forgot to check in"); return request;
    }
}
