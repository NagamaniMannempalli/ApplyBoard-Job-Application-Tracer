package com.project.job.internship_application.controller;

import com.project.job.internship_application.dto.ResumeUploadResponse;
import com.project.job.internship_application.entity.Resume;
import com.project.job.internship_application.service.ResumeService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ResumeUploadResponse> upload(
            @RequestParam MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) throws Exception {

        Resume savedResume = resumeService.uploadResume(file, userDetails.getUsername());

        ResumeUploadResponse response = new ResumeUploadResponse(
                savedResume.getId(),
                savedResume.getFileName(),
                "Resume uploaded successfully"
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Resume>> myResumes(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                resumeService.getMyResumes(userDetails.getUsername())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        resumeService.deleteResume(id, userDetails.getUsername());
        return ResponseEntity.ok("Resume deleted");
    }

    // ── Force download instead of inline view ──
    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveResume(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/resumes", filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                System.out.println("Downloading resume: " + filename + " | Size: " + resource.contentLength() + " bytes");

                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")  // ← changed to attachment
                        .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                        .header(HttpHeaders.PRAGMA, "no-cache")
                        .header(HttpHeaders.EXPIRES, "0")
                        .body(resource);
            } else {
                System.out.println("File not found: " + filePath.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            System.out.println("Malformed URL error: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}