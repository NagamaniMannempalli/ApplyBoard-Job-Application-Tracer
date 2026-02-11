package com.project.job.internship_application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResumeUploadResponse {
    private Long id;
    private String fileName;
    private String message;
}