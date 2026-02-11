package com.project.job.internship_application.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendInterviewReminder(String toEmail, String companyName, LocalDate interviewDate) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Upcoming Interview Reminder: " + companyName);
        message.setText(
                "Hello!\n\n" +
                        "This is a reminder that you have an interview scheduled with " + companyName +
                        " on " + interviewDate + ".\n\n" +
                        "Good luck!\n" +
                        "Your Job Tracker App"
        );

        mailSender.send(message);
    }
}
