package com.example.backend.service.impl;

import com.example.backend.dto.UserDTO;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(String id) {
        return userRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    public UserDTO updateUser(String id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail());
        }

        if (userDTO.getFirstName() != null) {
            user.setFirstName(userDTO.getFirstName());
        }

        if (userDTO.getLastName() != null) {
            user.setLastName(userDTO.getLastName());
        }

        if (userDTO.getPhoneNumber() != null) {
            user.setPhoneNumber(userDTO.getPhoneNumber());
        }

        if (userDTO.getRole() != null) {
            user.setRole(User.UserRole.valueOf(userDTO.getRole().toUpperCase()));
        }

        if (userDTO.getAddress() != null) {
            user.setAddress(userDTO.getAddress());
        }

        if (userDTO.getCity() != null) {
            user.setCity(userDTO.getCity());
        }

        if (userDTO.getState() != null) {
            user.setState(userDTO.getState());
        }

        if (userDTO.getZipCode() != null) {
            user.setZipCode(userDTO.getZipCode());
        }

        if (userDTO.getIsActive() != null) {
            user.setIsActive(userDTO.getIsActive());
        }

        User saved = userRepository.save(user);
        return convertToDTO(saved);
    }

    @Override
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
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
