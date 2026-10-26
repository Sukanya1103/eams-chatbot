package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.dto.request.ApplyWorkFromHomeRequest;
import com.eams.eams_chatbot.enums.Role;
import com.eams.eams_chatbot.model.Employee;
import com.eams.eams_chatbot.model.User;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.repository.WorkFromHomeRequestRepository;
import com.eams.eams_chatbot.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class WorkFromHomeServiceTest {
    private WorkFromHomeRequestRepository repository;
    private WorkFromHomeService service;
    private UserPrincipal principal;
    @BeforeEach void setUp() {
        repository = mock(WorkFromHomeRequestRepository.class);
        EmployeeRepository employeeRepository = mock(EmployeeRepository.class);
        service = new WorkFromHomeService(repository, employeeRepository);
        principal = new UserPrincipal(User.builder().id("u1").email("e@example.com").role(Role.EMPLOYEE).employeeId("e1").active(true).build());
        when(employeeRepository.findById("e1")).thenReturn(Optional.of(Employee.builder().id("e1").name("Employee").build()));
    }
    @Test void savesRequestPendingUnderAuthenticatedEmployee() {
        when(repository.save(any())).thenAnswer(call -> call.getArgument(0));
        var saved = service.apply(request(LocalDate.now(), LocalDate.now().plusDays(1)), principal);
        assertEquals("e1", saved.getEmployeeId()); assertEquals("PENDING", saved.getStatus());
    }
    @Test void rejectsEndDateBeforeStartDate() {
        assertThrows(ResponseStatusException.class, () -> service.apply(request(LocalDate.now(), LocalDate.now().minusDays(1)), principal));
        verify(repository, never()).save(any());
    }
    private ApplyWorkFromHomeRequest request(LocalDate start, LocalDate end) {
        var request = new ApplyWorkFromHomeRequest(); request.setStartDate(start); request.setEndDate(end); request.setReason("Appointment"); return request;
    }
}
