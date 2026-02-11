# 🚀 ApplyBoard -- Job Application Tracker

A full-stack Job & Internship Application Tracking System that helps
users manage, monitor, and organize their job applications efficiently.

This platform allows users to track application status, upload resumes,
receive interview reminders, and securely manage their job search
process.

------------------------------------------------------------------------

## 🏗️ Tech Stack

### 🔹 Frontend

-   React.js
-   Context API
-   Axios
-   CSS (Light/Dark Mode Support)
-   JWT Authentication

### 🔹 Backend

-   Spring Boot
-   Spring Security
-   JWT Authentication
-   Spring Data JPA (Hibernate)
-   MySQL
-   REST APIs
-   Email Service (JavaMailSender)
-   Scheduled Tasks (@EnableScheduling)

------------------------------------------------------------------------

## 📂 Project Structure

    ApplyBoard-Job-Application-Tracer/
    │
    ├── job-application-frontend/        # React Frontend
    │   ├── public/
    │   ├── src/
    │   │   ├── api/
    │   │   ├── context/
    │   │   ├── AddApplication.js
    │   │   ├── Dashboard.js
    │   │   ├── EditApplication.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── ...
    │   └── package.json
    │
    ├── job-internship-application/      # Spring Boot Backend
    │   ├── src/main/java/com/project/job/internship_application/
    │   │   ├── controller/
    │   │   ├── service/
    │   │   ├── repository/
    │   │   ├── entity/
    │   │   ├── security/
    │   │   └── dto/
    │   ├── src/main/resources/
    │   │   └── application.properties
    │   └── pom.xml
    │
    └── README.md

------------------------------------------------------------------------

## ✨ Features

### 🔐 Authentication & Security

-   User Registration & Login
-   JWT-based Stateless Authentication
-   Spring Security Configuration
-   Password Encryption (BCrypt)

### 📌 Application Management

-   Add new job applications
-   Edit applications
-   Delete applications
-   Track application status:
    -   APPLIED
    -   INTERVIEW
    -   OFFER
    -   REJECTED
    -   GHOSTED

### 📄 Resume Management

-   Upload resume
-   Associate resume with application
-   File storage support

### 📧 Email Integration


-   Interview reminder scheduler

### 🌙 UI Features

-   Dark Mode / Light Mode toggle
-   Clean dashboard interface
-   Pagination support

------------------------------------------------------------------------

## 🔄 API Endpoints Overview

### User APIs

    POST   /user/register
    POST   /user/login
    POST   /user/forgot-password
    POST   /user/reset-password

### Application APIs

    GET    /applications
    POST   /applications
    PUT    /applications/{id}
    DELETE /applications/{id}

### Resume APIs

    POST   /resumes/upload
    GET    /resumes

------------------------------------------------------------------------

## ⚙️ Setup Instructions

### 🔹 Backend Setup (Spring Boot)

1.  Navigate to backend folder:

```{=html}
<!-- -->
```
    cd job-internship-application

2.  Configure environment variables:

```{=html}
<!-- -->
```
    spring.datasource.username=${DB_USERNAME}
    spring.datasource.password=${DB_PASSWORD}
    spring.mail.username=${MAIL_USERNAME}
    spring.mail.password=${MAIL_PASSWORD}
    jwt.secret=${JWT_SECRET}

3.  Run application:

```{=html}
<!-- -->
```
    mvn spring-boot:run

Server runs on:

    http://localhost:8080

------------------------------------------------------------------------

### 🔹 Frontend Setup (React)

1.  Navigate to frontend:

```{=html}
<!-- -->
```
    cd job-application-frontend

2.  Install dependencies:

```{=html}
<!-- -->
```
    npm install

3.  Start application:

```{=html}
<!-- -->
```
    npm start

Frontend runs on:

    http://localhost:3000

------------------------------------------------------------------------

## 🗄️ Database Design

### Applications Table

-   id
-   company_name
-   role
-   status (ENUM)
-   application_date
-   notes
-   created_at
-   user_id
-   resume_id

### Users Table

-   user_id
-   email
-   username
-   password
-   first_name
-   last_name


------------------------------------------------------------------------

## 👨‍💻 Author

Nagamani Mannempalli\
Full Stack Developer\
Spring Boot \| React \| JWT \| MySQL
