package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private String id;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String role;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String adminRegistrationKey;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private Boolean isActive;
    private Date createdAt;
}
