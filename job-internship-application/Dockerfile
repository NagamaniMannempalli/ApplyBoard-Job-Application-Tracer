# Use lightweight JDK image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# Build jar
RUN ./mvnw clean package -DskipTests

# Expose Render port
EXPOSE 8080

# Run the jar
CMD ["java", "-jar", "target/job-internship-application-0.0.1-SNAPSHOT.jar"]