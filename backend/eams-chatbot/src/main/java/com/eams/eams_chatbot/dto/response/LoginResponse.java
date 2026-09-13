package com.eams.eams_chatbot.dto.response;

import com.eams.eams_chatbot.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private UserSummary user;

    // Mirrors the frontend's AuthUser type exactly (types/user.ts) —
    // keep these two in sync any time one changes.
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSummary {
        private String userId;
        private String employeeId;
        private String name;
        private String email;
        private Role role;
        private String managerId;
    }
}