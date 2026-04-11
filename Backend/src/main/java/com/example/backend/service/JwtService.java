package com.example.backend.service;

public interface JwtService {
    String generateToken(String email);
    String extractEmail(String token);
    boolean validateToken(String token);
}
