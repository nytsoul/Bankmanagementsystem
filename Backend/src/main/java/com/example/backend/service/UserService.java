package com.example.backend.service;

import com.example.backend.dto.UserDTO;
import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO getUserById(String id);
    UserDTO updateUser(String id, UserDTO userDTO);
    void deleteUser(String id);
}
