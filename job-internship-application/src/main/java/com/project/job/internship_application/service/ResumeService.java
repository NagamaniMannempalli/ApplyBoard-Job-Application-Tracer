package com.project.job.internship_application.service;

import com.project.job.internship_application.entity.Resume;
import com.project.job.internship_application.entity.User;
import com.project.job.internship_application.repository.ResumeRepository;
import com.project.job.internship_application.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    // IMPORTANT: This path MUST match the one used in ResumeController.serveResume()
    private static final String UPLOAD_DIR = "uploads/resumes";

    public ResumeService(ResumeRepository resumeRepository,
                         UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    public Resume uploadResume(MultipartFile file, String email) throws IOException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Create directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique stored name
        String originalFilename = file.getOriginalFilename();
        String storedName = UUID.randomUUID() + "_" + originalFilename;

        // Full server-side path
        Path serverPath = uploadPath.resolve(storedName);

        // Save file to disk
        Files.copy(file.getInputStream(), serverPath);

        // Relative URL path that frontend will use
        String publicFilePath = "/resumes/" + storedName;

        // Debug logs (remove later if not needed)
        System.out.println("Resume uploaded:");
        System.out.println("  Original name: " + originalFilename);
        System.out.println("  Stored name: " + storedName);
        System.out.println("  Server path: " + serverPath.toAbsolutePath());
        System.out.println("  Public path: " + publicFilePath);
        System.out.println("  Size: " + Files.size(serverPath) + " bytes");

        Resume resume = Resume.builder()
                .fileName(originalFilename)
                .storedName(storedName)
                .filePath(publicFilePath)   // ← this is what frontend uses
                .uploadedAt(LocalDateTime.now())
                .user(user)
                .build();

        return resumeRepository.save(resume);
    }

    public List<Resume> getMyResumes(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return resumeRepository.findByUserUserId(user.getUserId());
    }

    public void deleteResume(Long resumeId, String email) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        if (!resume.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        // Delete physical file
        try {
            Path filePath = Paths.get(UPLOAD_DIR, resume.getStoredName());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Failed to delete file: " + e.getMessage());
        }

        resumeRepository.delete(resume);
    }
}