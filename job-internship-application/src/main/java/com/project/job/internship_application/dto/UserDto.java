package com.project.job.internship_application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Data
public class UserDto {

    private Long userId;

    // Username: 5–15 chars, letters, digits, _ .
    // No starting/ending with _ or .
    // No consecutive _ or .
    @NotNull(message = "Username cannot be null")
    @NotBlank(message = "Username cannot be blank")
    @Pattern(
            regexp = "^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]{5,15}(?<![_.])$",
            message = "Invalid username format"
    )
    private String username;

    // First Name: Capital letter, only alphabets, min 2 chars
    @NotNull(message = "First name cannot be null")
    @NotBlank(message = "First name cannot be blank")
    @Pattern(
            regexp = "^[A-Z][a-z]{1,29}$",
            message = "First name must start with capital letter and contain only alphabets"
    )
    private String firstName;

    // Last Name: Optional, supports space & hyphen
    @Pattern(
            regexp = "^[A-Za-z]+([ -][A-Za-z]+)*$",
            message = "Last name can contain only letters, spaces, or hyphens"
    )
    private String lastName;

    // Password: min 8 chars, 1 upper, 1 lower, 1 digit, 1 special char
    @NotNull(message = "Password cannot be null")
    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must contain uppercase, lowercase, digit, and special character"
    )
    private String password;

    // Email: Standard email validation
    @NotNull(message = "Email cannot be null")
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    private String email;

}