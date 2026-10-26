package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.dto.request.ApplyLeaveRequest;
import com.eams.eams_chatbot.enums.Role;
import com.eams.eams_chatbot.model.Employee;
import com.eams.eams_chatbot.model.LeaveRequest;
import com.eams.eams_chatbot.model.User;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.repository.LeaveRequestRepository;
import com.eams.eams_chatbot.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class LeaveServiceTest {
    private LeaveRequestRepository leaveRepository;
    private EmployeeRepository employeeRepository;
    private LeaveService service;
    private UserPrincipal employeePrincipal;

    @BeforeEach
    void setUp() {
        leaveRepository = mock(LeaveRequestRepository.class);
        employeeRepository = mock(EmployeeRepository.class);
        service = new LeaveService(leaveRepository, employeeRepository);
        employeePrincipal = new UserPrincipal(User.builder().id("user-1").email("employee@example.com")
                .role(Role.EMPLOYEE).employeeId("employee-1").active(true).build());
    }

    @Test
    void savesPendingRequestUsingAuthenticatedEmployeesProfile() {
        when(employeeRepository.findById("employee-1")).thenReturn(Optional.of(Employee.builder()
                .id("employee-1").name("Asha Employee").build()));
        when(leaveRepository.save(any(LeaveRequest.class))).thenAnswer(invocation -> {
            LeaveRequest request = invocation.getArgument(0);
            request.setId("leave-1");
            return request;
        });
        ApplyLeaveRequest request = request(LocalDate.parse("2026-10-26"), LocalDate.parse("2026-10-27"));

        var response = service.apply(request, employeePrincipal);

        assertEquals("leave-1", response.getLeaveId());
        assertEquals("employee-1", response.getEmployeeId());
        assertEquals("Asha Employee", response.getEmployeeName());
        assertEquals("PENDING", response.getStatus().name());
        verify(leaveRepository).save(any(LeaveRequest.class));
    }

    @Test
    void rejectsEndDateBeforeStartDateWithoutSaving() {
        ApplyLeaveRequest request = request(LocalDate.parse("2026-10-27"), LocalDate.parse("2026-10-26"));
        assertThrows(ResponseStatusException.class, () -> service.apply(request, employeePrincipal));
        verify(leaveRepository, never()).save(any());
    }

    @Test
    void employeeHistoryQueryUsesPrincipalEmployeeId() {
        when(leaveRepository.findByEmployeeIdOrderBySubmittedAtDesc("employee-1")).thenReturn(List.of());
        service.list(employeePrincipal);
        verify(leaveRepository).findByEmployeeIdOrderBySubmittedAtDesc("employee-1");
        verify(leaveRepository, never()).findAllByOrderBySubmittedAtDesc();
    }

    private ApplyLeaveRequest request(LocalDate start, LocalDate end) {
        ApplyLeaveRequest request = new ApplyLeaveRequest();
        request.setType(com.eams.eams_chatbot.enums.LeaveType.CASUAL);
        request.setStartDate(start);
        request.setEndDate(end);
        request.setReason("Family event");
        return request;
    }
}
