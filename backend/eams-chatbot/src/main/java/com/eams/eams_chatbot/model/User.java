package com.eams.eams_chatbot.model;

import com.eams.eams_chatbot.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

// Login identity only — name/department/manager etc. live in Employee.
// Kept separate so "who can log in" and "who this person is at work"
// don't get tangled together.
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String passwordHash;

    private Role role;

    // Links to the Employee document with the actual profile data.
    private String employeeId;

    private boolean active;
}

