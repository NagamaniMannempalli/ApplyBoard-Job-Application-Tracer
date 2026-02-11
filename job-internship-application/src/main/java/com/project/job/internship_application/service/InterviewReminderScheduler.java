package com.project.job.internship_application.service;

import com.project.job.internship_application.entity.ApplicationStatus;
import com.project.job.internship_application.entity.Applications;
import com.project.job.internship_application.entity.User;
import com.project.job.internship_application.repository.ApplicationRepository;
import com.project.job.internship_application.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@EnableScheduling
public class InterviewReminderScheduler {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Autowired
    public InterviewReminderScheduler(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            EmailService emailService) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 8 * * ?") // Every day at 8:00 AM
    public void sendDailyInterviewReminders() {
        LocalDate today = LocalDate.now();
        LocalDate reminderDate = today.plusDays(3); // 3 days before

        List<Applications> upcoming = applicationRepository.findByStatusAndApplicationDate(
                ApplicationStatus.INTERVIEW,
                reminderDate
        );

        for (Applications app : upcoming) {
            User user = userRepository.findByUserId(app.getUser().getUserId());
            if (user != null && user.getEmail() != null) {
                emailService.sendInterviewReminder(
                        user.getEmail(),
                        app.getCompanyName(),
                        app.getApplicationDate()
                );
            }
        }
    }
}
