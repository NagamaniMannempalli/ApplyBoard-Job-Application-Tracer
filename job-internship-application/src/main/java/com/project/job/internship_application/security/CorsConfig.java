package com.project.job.internship_application.security;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import java.util.List;
@Configuration public class CorsConfig {
    @Bean public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",
                "http://localhost:5173",
                "https://*.vercel.app"
        ));
        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        );
        configuration.setAllowedHeaders( List.of("Authorization", "Content-Type") );
        configuration.setExposedHeaders( List.of("Authorization") );
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); return source;
    }
}