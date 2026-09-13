package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.dto.request.RegisterEmployeeRequest;
import com.eams.eams_chatbot.dto.response.EmployeeResponse;
import com.eams.eams_chatbot.model.Employee;
import com.eams.eams_chatbot.model.User;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private static final String PASSWORD_CHARS =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeResponse registerEmployee(RegisterEmployeeRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A user with this email already exists");
        }

        String temporaryPassword = generateTemporaryPassword();

        // Employee created first (without userId yet) so we have its id to
        // link back from User — then patched with the userId once User exists.
        Employee employee = Employee.builder()
                .name(request.getName())
                .email(request.getEmail())
                .designation(request.getDesignation())
                .department(request.getDepartment())
                .managerId(request.getManagerId())
                .dateOfJoining(request.getDateOfJoining())
                .contactNumber(request.getContactNumber())
                .build();
        employee = employeeRepository.save(employee);

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(temporaryPassword))
                .role(request.getRole())
                .employeeId(employee.getId())
                .active(true)
                .build();
        user = userRepository.save(user);

        employee.setUserId(user.getId());
        employee = employeeRepository.save(employee);

        return EmployeeResponse.builder()
                .employeeId(employee.getId())
                .userId(user.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .role(user.getRole())
                .designation(employee.getDesignation())
                .department(employee.getDepartment())
                .managerId(employee.getManagerId())
                .dateOfJoining(employee.getDateOfJoining())
                .temporaryPassword(temporaryPassword)
                .build();
    }

    private String generateTemporaryPassword() {
        StringBuilder sb = new StringBuilder(12);
        for (int i = 0; i < 12; i++) {
            sb.append(PASSWORD_CHARS.charAt(RANDOM.nextInt(PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }
}