package com.project.job.internship_application.dto;

import com.project.job.internship_application.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponseDto {
    private Long id;
    private String companyName;
    private String role;
    private ApplicationStatus status;
    private LocalDate applicationDate;
    private String notes;
    private ResumeDto resume; // nested DTO
}