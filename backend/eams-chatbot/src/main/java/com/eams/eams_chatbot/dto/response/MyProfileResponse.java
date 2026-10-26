package com.eams.eams_chatbot.dto.response;

import com.eams.eams_chatbot.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class MyProfileResponse {
    private String employeeId;
    private String name;
    private String email;
    private Role role;
    private String designation;
    private String department;
    private String managerId;
    private LocalDate dateOfJoining;
    private LocalDate dateOfBirth;
    private String contactNumber;
}
