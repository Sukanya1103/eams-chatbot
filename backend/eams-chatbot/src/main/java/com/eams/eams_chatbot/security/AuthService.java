package com.eams.eams_chatbot.service;

import com.eams.eams_chatbot.dto.request.LoginRequest;
import com.eams.eams_chatbot.dto.response.LoginResponse;
import com.eams.eams_chatbot.model.User;
import com.eams.eams_chatbot.repository.UserRepository;
import com.eams.eams_chatbot.repository.EmployeeRepository;
import com.eams.eams_chatbot.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmployeeRepository employeeRepository;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!user.isActive()) {
            throw new BadCredentialsException("This account has been deactivated");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        var employee = user.getEmployeeId() == null ? null : employeeRepository.findById(user.getEmployeeId()).orElse(null);
        String displayName = employee != null && employee.getName() != null ? employee.getName() : user.getEmail();
        String accessToken = jwtTokenProvider.generateAccessToken(user, displayName);

        // TODO: once the Employee module exists, look up the Employee by
        // user.getEmployeeId() and use its real name + managerId here
        // instead of these placeholders.
        LoginResponse.UserSummary userSummary = LoginResponse.UserSummary.builder()
                .userId(user.getId())
                .employeeId(user.getEmployeeId())
                .name(displayName)
                .email(user.getEmail())
                .role(user.getRole())
                .managerId(employee == null ? null : employee.getManagerId())
                .build();

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(accessToken) // TODO: implement a real, separate refresh token
                .user(userSummary)
                .build();
    }
}
