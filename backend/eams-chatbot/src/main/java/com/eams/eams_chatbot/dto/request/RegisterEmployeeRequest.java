package com.eams.eams_chatbot.dto.request;

import com.eams.eams_chatbot.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

// What HR (or Admin) submits to register a new employee. No password field —
// see EmployeeService: a temporary password is generated server-side and
// returned once in the response, never chosen by the person registering them.
@Data
public class RegisterEmployeeRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotNull
    private Role role; // ADMIN, HR, MANAGER, or EMPLOYEE

    @NotBlank
    private String designation;

    @NotBlank
    private String department;

    // Optional — null means no manager (e.g. this hire IS a manager/HR/admin
    // with nobody above them in the reporting line).
    private String managerId;

    private LocalDate dateOfJoining;

    private String contactNumber;
}