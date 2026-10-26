package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.dto.request.ApplyWorkFromHomeRequest;
import com.eams.eams_chatbot.model.Employee;
import com.eams.eams_chatbot.model.WorkFromHomeRequest;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.repository.WorkFromHomeRequestRepository;
import com.eams.eams_chatbot.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.List;

@Service @RequiredArgsConstructor
public class WorkFromHomeService {
    private final WorkFromHomeRequestRepository requestRepository;
    private final EmployeeRepository employeeRepository;

    public List<WorkFromHomeRequest> list(UserPrincipal caller) {
        return requestRepository.findByEmployeeIdOrderBySubmittedAtDesc(employee(caller).getId());
    }

    public WorkFromHomeRequest apply(ApplyWorkFromHomeRequest request, UserPrincipal caller) {
        Employee employee = employee(caller);
        if (request.getEndDate().isBefore(request.getStartDate()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date must be on or after start date");
        return requestRepository.save(WorkFromHomeRequest.builder().employeeId(employee.getId()).employeeName(employee.getName())
                .startDate(request.getStartDate()).endDate(request.getEndDate()).reason(request.getReason().trim())
                .remarks(request.getRemarks() == null ? null : request.getRemarks().trim()).status("PENDING")
                .submittedAt(Instant.now()).build());
    }

    private Employee employee(UserPrincipal caller) {
        if (caller.getEmployeeId() == null) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Employee profile is required");
        return employeeRepository.findById(caller.getEmployeeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee profile not found"));
    }
}
