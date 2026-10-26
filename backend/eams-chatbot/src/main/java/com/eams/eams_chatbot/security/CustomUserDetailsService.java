package com.eams.eams_chatbot.security;

import com.eams.eams_chatbot.model.User;
import com.eams.eams_chatbot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// Used by Spring Security during login to look up the user, and by
// JwtAuthFilter to re-load the user on every subsequent authenticated request.
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No user found with email: " + email));

        return new com.eams.eams_chatbot.security.UserPrincipal(user);
    }
}