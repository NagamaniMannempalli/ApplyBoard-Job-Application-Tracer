package com.project.job.internship_application.service;

import com.project.job.internship_application.entity.ApplicationStatus;
import com.project.job.internship_application.entity.Applications;
import com.project.job.internship_application.entity.Resume;
import com.project.job.internship_application.entity.User;
import com.project.job.internship_application.repository.ApplicationRepository;
import com.project.job.internship_application.repository.ResumeRepository;
import com.project.job.internship_application.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.project.job.internship_application.dto.ApplicationCreateDto;

import java.util.Collections;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              UserRepository userRepository,ResumeRepository resumeRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.resumeRepository=resumeRepository;
    }

    public Applications createApplication(Applications app, String email) {
        User user = userRepository.findByEmail(email);
        if(user==null){
            throw new RuntimeException("User not found");
        }
        app.setUser(user);
        return applicationRepository.save(app);
    }

    public List<Applications> getMyApplications(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return Collections.emptyList();
        }

        // Use fetch join or EntityGraph to load resume
        return applicationRepository.findByUserUserId(user.getUserId());
    }

    public Applications updateStatus(
            Long appId,
            ApplicationStatus status,
            String email) {

        User user = userRepository.findByEmail(email);
        if(user==null) {
            throw new RuntimeException("User not found");
        }

        Applications app = applicationRepository
                .findByIdAndUserUserId(appId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setStatus(status);
        return applicationRepository.save(app);
    }

    public Applications attachResume(
            Long appId,
            Long resumeId,
            String email) {

        User user = userRepository.findByEmail(email);
                if(user==null) {
                    throw new RuntimeException("User not found");
                }

        Applications app = applicationRepository
                .findByIdAndUserUserId(appId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (!resume.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized resume access");
        }

        app.setResume(resume);
        return applicationRepository.save(app);
    }
    public void deleteApplication(Long appId, String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Applications app = applicationRepository
                .findByIdAndUserUserId(appId, user.getUserId())
                .orElseThrow(() -> new RuntimeException("Application not found or not owned by user"));

        applicationRepository.delete(app);
    }
    public Applications getApplicationByIdAndUser(Long id, String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return applicationRepository
                .findByIdAndUserUserId(id, user.getUserId())
                .orElseThrow(() -> new RuntimeException("Application not found or not owned by user"));
    }

    public Applications updateApplication(Long id, ApplicationCreateDto dto, String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        Applications app = applicationRepository
                .findByIdAndUserUserId(id, user.getUserId())
                .orElseThrow(() -> new RuntimeException("Application not found or not owned by user"));

        // Update fields
        app.setCompanyName(dto.getCompanyName());
        app.setRole(dto.getRole());
        app.setApplicationDate(dto.getApplicationDate());
        app.setNotes(dto.getNotes());
        app.setStatus(dto.getStatus() != null ? dto.getStatus() : app.getStatus());

        return applicationRepository.save(app);
    }
}
