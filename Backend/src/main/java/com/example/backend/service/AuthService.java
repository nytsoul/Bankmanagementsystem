package com.example.backend.service;

import com.example.backend.dto.UserDTO;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.LoginResponse;
import com.example.backend.entity.User;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    User register(UserDTO userDTO);
    User getUserByEmail(String email);
    User getCurrentUser();
}
