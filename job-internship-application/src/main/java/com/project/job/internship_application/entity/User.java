package com.project.job.internship_application.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "user")  // or "users" if that's your table name
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String username;
    private String firstName;
    private String lastName;
    private String password;
    private String email;

    // THIS IS THE FIX: Prevent infinite loop when serializing
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore  // ← Critical: Stops Jackson from serializing this field
    @Builder.Default
    private List<Applications> applications = new ArrayList<>();

    // Optional: If you have resumes too
    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    // @JsonIgnore
    // @Builder.Default
    // private List<Resume> resumes = new ArrayList<>();
}