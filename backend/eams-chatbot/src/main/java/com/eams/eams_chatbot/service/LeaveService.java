package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.dto.request.ApplyLeaveRequest;
import com.eams.eams_chatbot.dto.response.LeaveResponse;
import com.eams.eams_chatbot.enums.LeaveStatus;
import com.eams.eams_chatbot.enums.Role;
import com.eams.eams_chatbot.model.Employee;
import com.eams.eams_chatbot.model.LeaveRequest;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.repository.LeaveRequestRepository;
import com.eams.eams_chatbot.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service @RequiredArgsConstructor
public class LeaveService {
    private final LeaveRequestRepository leaveRepository;
    private final EmployeeRepository employeeRepository;

    public LeaveResponse apply(ApplyLeaveRequest request, UserPrincipal caller) {
        if (caller.getRole() != Role.EMPLOYEE || caller.getEmployeeId() == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only employees can submit leave requests");
        }
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date must be on or after start date");
        }
        Employee employee = employeeRepository.findById(caller.getEmployeeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee profile not found"));
        LeaveRequest saved = leaveRepository.save(LeaveRequest.builder().employeeId(employee.getId())
                .employeeName(employee.getName()).type(request.getType()).startDate(request.getStartDate())
                .endDate(request.getEndDate()).reason(request.getReason().trim())
                .halfDay(request.isHalfDay()).status(LeaveStatus.PENDING)
                .submittedAt(Instant.now()).build());
        return LeaveResponse.from(saved);
    }

    public List<LeaveResponse> list(UserPrincipal caller) {
        List<LeaveRequest> requests;
        if (caller.getRole() == Role.ADMIN || caller.getRole() == Role.HR) {
            requests = leaveRepository.findAllByOrderBySubmittedAtDesc();
        } else if (caller.getRole() == Role.MANAGER && caller.getEmployeeId() != null) {
            var teamIds = employeeRepository.findByManagerId(caller.getEmployeeId()).stream().map(Employee::getId).toList();
            requests = leaveRepository.findAllByOrderBySubmittedAtDesc().stream()
                    .filter(r -> teamIds.contains(r.getEmployeeId())).toList();
        } else if (caller.getRole() == Role.EMPLOYEE && caller.getEmployeeId() != null) {
            requests = leaveRepository.findByEmployeeIdOrderBySubmittedAtDesc(caller.getEmployeeId());
        } else {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to view leave requests");
        }
        return requests.stream().map(LeaveResponse::from).toList();
    }

    public LeaveResponse review(String id, boolean approve, UserPrincipal caller) {
        if (caller.getRole() != Role.ADMIN && caller.getRole() != Role.HR && caller.getRole() != Role.MANAGER) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only reviewers can update leave requests");
        }
        LeaveRequest leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Leave request not found"));
        if (caller.getRole() == Role.MANAGER) {
            Employee employee = employeeRepository.findById(leave.getEmployeeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee profile not found"));
            if (caller.getEmployeeId() == null || !caller.getEmployeeId().equals(employee.getManagerId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can review only your direct reports");
            }
        }
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This leave request has already been reviewed");
        }
        leave.setStatus(approve ? LeaveStatus.APPROVED : LeaveStatus.REJECTED);
        leave.setApprovedBy(caller.getEmail());
        return LeaveResponse.from(leaveRepository.save(leave));
    }
}
