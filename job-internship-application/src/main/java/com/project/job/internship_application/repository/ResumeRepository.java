package com.project.job.internship_application.repository;

import com.project.job.internship_application.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByUserUserId(Long userId);
}