package com.eams.eams_chatbot.config;

import com.eams.eams_chatbot.enums.Role;
import com.eams.eams_chatbot.model.User;
import com.eams.eams_chatbot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Runs once every time the app starts, but only ever CREATES a user if the
// whole users collection is empty — so this is safe to leave in place
// permanently and won't overwrite or duplicate anything after the first run.
// This is how you get your very first login: after that, this Admin
// account registers everyone else through the normal HR/Admin flow.
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.seed.email:admin@eams.com}")
    private String seedEmail;

    @Value("${admin.seed.password:ChangeMe123!}")
    private String seedPassword;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // already have users — never touch existing data
        }

        User admin = User.builder()
                .email(seedEmail)
                .passwordHash(passwordEncoder.encode(seedPassword))
                .role(Role.ADMIN)
                .active(true)
                .build();

        userRepository.save(admin);

        System.out.println("=================================================");
        System.out.println(" Seeded first Admin account:");
        System.out.println(" Email:    " + seedEmail);
        System.out.println(" Password: " + seedPassword);
        System.out.println(" Change this password after your first login.");
        System.out.println("=================================================");
    }
}