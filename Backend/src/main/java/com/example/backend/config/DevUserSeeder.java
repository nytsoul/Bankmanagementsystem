package com.example.backend.config;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DevUserSeeder {

    @Bean
    CommandLineRunner seedDefaultUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${seed.admin.email}") String adminEmail,
            @Value("${seed.admin.password}") String adminPassword,
            @Value("${seed.admin.first-name}") String firstName,
            @Value("${seed.admin.last-name}") String lastName) {
        return args -> {
            if (userRepository.count() > 0 || userRepository.existsByEmail(adminEmail)) {
                return;
            }

            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .firstName(firstName)
                    .lastName(lastName)
                    .role(User.UserRole.ADMIN)
                    .isActive(true)
                    .build();

            userRepository.save(admin);
            System.out.println("Seeded default admin user: " + adminEmail);
        };
    }
}
