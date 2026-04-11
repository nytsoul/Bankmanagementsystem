package com.example.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String firstName;

    private String lastName;

    @Indexed(unique = true, sparse = true)
    private String phoneNumber;

    private UserRole role;

    private String address;
    private String city;
    private String state;
    private String zipCode;

    private Boolean isActive = true;

    private Set<String> accountIds = new HashSet<>();

    public enum UserRole {
        CUSTOMER, ADMIN
    }
}
