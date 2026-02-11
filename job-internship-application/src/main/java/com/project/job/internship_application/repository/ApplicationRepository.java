package com.project.job.internship_application.repository;

import com.project.job.internship_application.entity.ApplicationStatus;
import com.project.job.internship_application.entity.Applications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Applications,Long> {
    List<Applications> findByUserUserId(Long userId);
    Optional<Applications> findByIdAndUserUserId(Long id, Long userId);
    @Query("SELECT a FROM Applications a WHERE a.status = :status AND a.applicationDate = :date")
    List<Applications> findByStatusAndApplicationDate(
            @Param("status") ApplicationStatus status,
            @Param("date") LocalDate date
    );
}
