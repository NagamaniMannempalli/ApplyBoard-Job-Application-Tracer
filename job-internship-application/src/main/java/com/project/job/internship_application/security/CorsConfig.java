package com.project.job.internship_application.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;


@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // Frontend URL
        String frontendUrl = System.getenv("FRONTEND_URL");

        if (frontendUrl == null) {
            frontendUrl = "http://localhost:3000";
        }

        configuration.setAllowedOriginPatterns(List.of("*"));

        // HTTP methods allowed
        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        // Headers allowed
        configuration.setAllowedHeaders(
                List.of("Authorization", "Content-Type")
        );

        // Expose headers to frontend
        configuration.setExposedHeaders(
                List.of("Authorization")
        );

        // Allow cookies / credentials
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;

    }
}
