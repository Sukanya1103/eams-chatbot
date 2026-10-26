package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.dto.request.UpdateMyProfileRequest;
import com.eams.eams_chatbot.dto.response.MyProfileResponse;
import com.eams.eams_chatbot.enums.Role;
import com.eams.eams_chatbot.model.Employee;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class MyProfileService {

    private final EmployeeRepository employeeRepository;

    public MyProfileResponse getMyProfile(UserPrincipal caller) {
        return toResponse(findEmployee(caller), caller.getRole());
    }

    public MyProfileResponse updateMyProfile(UserPrincipal caller, UpdateMyProfileRequest request) {
        Employee employee = findEmployee(caller);
        employee.setDateOfBirth(request.getDateOfBirth());
        String phone = request.getContactNumber();
        employee.setContactNumber(phone == null || phone.isBlank() ? null : phone.trim());
        return toResponse(employeeRepository.save(employee), caller.getRole());
    }

    private Employee findEmployee(UserPrincipal caller) {
        if (caller.getEmployeeId() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee profile not found");
        }
        return employeeRepository.findById(caller.getEmployeeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee profile not found"));
    }

    private MyProfileResponse toResponse(Employee employee, Role role) {
        return MyProfileResponse.builder()
                .employeeId(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .role(role)
                .designation(employee.getDesignation())
                .department(employee.getDepartment())
                .managerId(employee.getManagerId())
                .dateOfJoining(employee.getDateOfJoining())
                .dateOfBirth(employee.getDateOfBirth())
                .contactNumber(employee.getContactNumber())
                .build();
    }
}
