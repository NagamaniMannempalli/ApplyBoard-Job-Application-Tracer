package com.project.job.internship_application.dto;

import com.project.job.internship_application.entity.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ApplicationCreateDto {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Role is required")
    private String role;

    private LocalDate applicationDate;

    private String notes;

    private ApplicationStatus status;  // optional – defaults to APPLIED in controller
}