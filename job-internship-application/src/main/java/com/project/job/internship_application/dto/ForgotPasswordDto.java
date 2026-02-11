package com.project.job.internship_application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordDto {
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email")
    private String email;
}
