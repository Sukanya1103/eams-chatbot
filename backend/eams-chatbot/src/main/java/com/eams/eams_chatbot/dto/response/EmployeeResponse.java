package com.eams.eams_chatbot.dto.response;

import com.eams.eams_chatbot.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {

    private String employeeId;
    private String userId;
    private String name;
    private String email;
    private Role role;
    private String designation;
    private String department;
    private String managerId;
    private LocalDate dateOfJoining;

    // Only ever populated on the registration response, so HR can share it
    // with the new hire once. Never returned by any other endpoint —
    // there's no way to "look up" a temp password after the fact.
    private String temporaryPassword;
}