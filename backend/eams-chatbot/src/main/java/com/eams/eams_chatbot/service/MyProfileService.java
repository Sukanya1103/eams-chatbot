package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.dto.request.UpdateMyProfileRequest;
import com.eams.eams_chatbot.dto.response.MyProfileResponse;
import com.eams.eams_chatbot.enums.Role;
import com.eams.eams_chatbot.model.Employee;
import com.eams.eams_chatbot.model.User;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.repository.UserRepository;
import com.eams.eams_chatbot.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class MyProfileService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public MyProfileResponse getMyProfile(UserPrincipal caller) {
        User user = findUser(caller);
        return findEmployee(caller, user)
                .map(employee -> toResponse(employee, caller.getRole()))
                .orElseGet(() -> toAccountOnlyResponse(user));
    }

    public MyProfileResponse updateMyProfile(UserPrincipal caller, UpdateMyProfileRequest request) {
        User user = findUser(caller);
        Employee employee = findEmployee(caller, user).orElseGet(() -> Employee.builder()
                .userId(user.getId())
                .name(request.getName().trim())
                .email(user.getEmail())
                .build());
        employee.setName(request.getName().trim());
        employee.setDateOfBirth(request.getDateOfBirth());
        String phone = request.getContactNumber();
        employee.setContactNumber(phone == null || phone.isBlank() ? null : phone.trim());
        employee = employeeRepository.save(employee);
        if (user.getEmployeeId() == null) {
            user.setEmployeeId(employee.getId());
            userRepository.save(user);
        }
        return toResponse(employee, caller.getRole());
    }

    private User findUser(UserPrincipal caller) {
        return userRepository.findById(caller.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found"));
    }

    private java.util.Optional<Employee> findEmployee(UserPrincipal caller, User user) {
        if (caller.getEmployeeId() != null) {
            java.util.Optional<Employee> linked = employeeRepository.findById(caller.getEmployeeId());
            if (linked.isPresent()) return linked;
        }
        return employeeRepository.findByUserId(user.getId());
    }

    private MyProfileResponse toAccountOnlyResponse(User user) {
        return MyProfileResponse.builder()
                .email(user.getEmail())
                .role(user.getRole())
                .build();
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
