package com.project.job.internship_application.service;

import com.project.job.internship_application.dto.ForgotPasswordDto;
import com.project.job.internship_application.dto.LoginDTO;
import com.project.job.internship_application.dto.ResetPasswordDto;
import com.project.job.internship_application.dto.UserDto;
import com.project.job.internship_application.entity.User;
import com.project.job.internship_application.repository.UserRepository;
import com.project.job.internship_application.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public User saveUser(UserDto userDto) {
        // Basic validation (can be moved to controller or validator)
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = User.builder()
                .username(userDto.getUsername())
                .firstName(userDto.getFirstName())
                .lastName(userDto.getLastName())
                .email(userDto.getEmail())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .build();

        return userRepository.save(user);
    }

    public String verifyUser(LoginDTO userDto) {
        System.out.println("Login attempt - Email: " + userDto.getEmail());

        User user = userRepository.findByEmail(userDto.getEmail());

        if (user == null) {
            System.out.println("→ User NOT found for email: " + userDto.getEmail());
            throw new RuntimeException("Email not found");
        }

        System.out.println("→ User found: " + user.getEmail() +
                ", stored password hash: " + user.getPassword().substring(0, 10) + "...");

        boolean passwordMatches = passwordEncoder.matches(userDto.getPassword(), user.getPassword());
        System.out.println("→ Password matches: " + passwordMatches);

        if (!passwordMatches) {
            throw new RuntimeException("Incorrect password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        System.out.println("→ Token generated successfully (length: " + token.length() + ")");

        return token;
    }

    public void forgotPassword(ForgotPasswordDto dto) {
        if (!userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("User does not exist");
        }

    }

    public void resetPassword(ResetPasswordDto dto) {
        User user = userRepository.findByEmail(dto.getEmail());

        if (user == null) {
            throw new RuntimeException("User does not exist");
        }

        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        userRepository.save(user);
    }
}