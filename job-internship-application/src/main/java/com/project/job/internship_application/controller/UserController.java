package com.project.job.internship_application.controller;

import com.project.job.internship_application.dto.*;
import com.project.job.internship_application.entity.User;
import com.project.job.internship_application.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(
            @RequestBody @Valid UserDto userDto) {
        return new ResponseEntity<>(
                userService.saveUser(userDto),
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginDTO loginDto) {
        try {
            String token = userService.verifyUser(loginDto);
            return ResponseEntity.ok(new LoginResponse(token));
        } catch (RuntimeException ex) {
            String message = ex.getMessage();
            String field = "general";

            if (message.contains("not found") || message.contains("exist")) {
                field = "email";
                message = "Email not found";
            } else if (message.contains("password") || message.contains("Invalid")) {
                field = "password";
                message = "Incorrect password";
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(field, message));
        }
    }

    // Keep these records

    @PostMapping("/forgot-password")
    public ResponseEntity<ErrorResponse> forgotPassword(
            @RequestBody @Valid ForgotPasswordDto dto) {
        try {
            userService.forgotPassword(dto);
            return ResponseEntity.ok(new ErrorResponse("general", "If the email exists, a reset link has been sent."));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("email", ex.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ErrorResponse> resetPassword(
            @RequestBody @Valid ResetPasswordDto dto) {
        try {
            userService.resetPassword(dto);
            return ResponseEntity.ok(new ErrorResponse("general", "Password updated successfully"));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("general", ex.getMessage()));
        }
    }
}

// ── Simple response DTOs ── (you can keep them in the same file or move to dto package)

record LoginResponse(String token) {}

record ErrorResponse(String field, String message) {}