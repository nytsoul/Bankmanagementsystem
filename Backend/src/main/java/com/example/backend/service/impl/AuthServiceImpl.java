package com.example.backend.service.impl;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.dto.UserDTO;
import com.example.backend.entity.User;
import com.example.backend.exception.UnauthorizedException;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService;
import com.example.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());
        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .user(convertToDTO(user))
                .build();
    }

    @Override
    public User register(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new UnauthorizedException("Email already registered");
        }

        User user = User.builder()
                .email(userDTO.getEmail())
                .password(passwordEncoder.encode(userDTO.getEmail())) // TODO: Use password from DTO
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
                .role(User.UserRole.CUSTOMER)
                .isActive(true)
                .build();

        return userRepository.save(user);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }

    @Override
    public User getCurrentUser() {
        throw new UnsupportedOperationException("Implement with Spring Security context");
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole().name())
                .address(user.getAddress())
                .city(user.getCity())
                .state(user.getState())
                .zipCode(user.getZipCode())
                .isActive(user.getIsActive())
                .build();
    }
}
