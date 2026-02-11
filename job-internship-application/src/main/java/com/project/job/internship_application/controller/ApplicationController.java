package com.project.job.internship_application.controller;

import com.project.job.internship_application.dto.*;
import com.project.job.internship_application.entity.*;
import com.project.job.internship_application.service.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<Applications> create(
            @Valid @RequestBody ApplicationCreateDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Map DTO → entity in controller or service
        Applications app = new Applications();
        app.setCompanyName(dto.getCompanyName());
        app.setRole(dto.getRole());
        app.setApplicationDate(dto.getApplicationDate());
        app.setNotes(dto.getNotes());
        app.setStatus(dto.getStatus() != null ? dto.getStatus() : ApplicationStatus.APPLIED);

        Applications saved = applicationService.createApplication(app, userDetails.getUsername());

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponseDto>> myApplications(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<Applications> apps = applicationService.getMyApplications(userDetails.getUsername());

        List<ApplicationResponseDto> response = apps.stream()
                .map(app -> ApplicationResponseDto.builder()
                        .id(app.getId())
                        .companyName(app.getCompanyName())
                        .role(app.getRole())
                        .status(app.getStatus())
                        .applicationDate(app.getApplicationDate())
                        .notes(app.getNotes())
                        .resume(app.getResume() != null ?
                                ResumeDto.builder()
                                        .id(app.getResume().getId())
                                        .fileName(app.getResume().getFileName())
                                        .filePath("/resumes/" + app.getResume().getStoredName())
                                        .build()
                                : null)
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Applications> updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status,
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                applicationService.updateStatus(id, status, userDetails.getUsername())
        );
    }

    @PutMapping("/{id}/resume/{resumeId}")
    public ResponseEntity<String> attachResume(
            @PathVariable Long id,
            @PathVariable Long resumeId,
            @AuthenticationPrincipal UserDetails userDetails) {

        applicationService.attachResume(id, resumeId, userDetails.getUsername());
        return ResponseEntity.ok("Resume attached successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        applicationService.deleteApplication(id, userDetails.getUsername());
        return ResponseEntity.ok("Application deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Applications> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Applications app = applicationService.getApplicationByIdAndUser(
                id, userDetails.getUsername()
        );
        return ResponseEntity.ok(app);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Applications> update(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationCreateDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {

        Applications updated = applicationService.updateApplication(
                id, dto, userDetails.getUsername()
        );
        return ResponseEntity.ok(updated);
    }
}