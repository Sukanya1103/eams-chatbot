package com.eams.eams_chatbot.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

// Profile/work data for an employee — name, department, who they report to.
// Deliberately separate from User (login credentials + role): this is what
// DataScopeService reads to answer "which employees does this manager own",
// without that logic ever touching authentication concerns.
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "employees")
public class Employee {

    @Id
    private String id;

    // Links back to the User document with login credentials.
    private String userId;

    private String name;
    private String email;
    private String designation;
    private String department;

    // Null for employees with no manager (e.g. the manager is themselves
    // top-level, or an Admin/HR account with no reporting line).
    private String managerId;

    private LocalDate dateOfJoining;
    private String contactNumber;
}