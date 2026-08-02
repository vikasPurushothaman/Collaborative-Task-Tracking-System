# Enterprise Task Tracking & Management System Backend

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot 3.x](https://img.shields.io/badge/Spring_Boot-3.3.2-green.svg)](https://spring.io/projects/spring-boot)
[![Spring Security 6](https://img.shields.io/badge/Spring_Security-6.x-blue.svg)](https://spring.io/projects/spring-security)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

An enterprise-grade, high-performance backend system for a collaborative **Task Tracking & Management Application**. Built with **Java 21**, **Spring Boot 3.3.2**, **Spring Security 6 with JWT Token Rotation**, **Spring Data JPA (Hibernate)**, **MapStruct**, **WebSocket STOMP**, **OpenAI Integration**, and **Swagger OpenAPI 3**.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture & Design Principles](#architecture--design-principles)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Database Configuration](#database-configuration)
- [Environment Variables](#environment-variables)
- [Getting Started & Installation](#getting-started--installation)
- [Running Tests](#running-tests)
- [Swagger OpenAPI Documentation](#swagger-openapi-documentation)
- [API Authentication & JWT Token Flow](#api-authentication--jwt-token-flow)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [REST Endpoints Summary](#rest-endpoints-summary)
- [Screenshots Placeholder](#screenshots-placeholder)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

The Task Tracking & Management System provides a complete production-ready foundation for managing projects, team memberships, tasks, comments, file attachments, and real-time notification streams. It includes advanced multi-criteria task search and filtering (JPA Specifications), soft-delete with restoration capability, automated JPA entity auditing, background scheduling for deadline warnings, and AI-assisted task description and summary generation powered by OpenAI.

---

## Key Features

- **Authentication & Security:**
  - JWT Authentication (Access Token & Refresh Token Rotation).
  - BCrypt Password Hashing.
  - Role-Based Access Control (ADMIN, PROJECT_MANAGER, TEAM_MEMBER).
  - Secure Password Change, Password Reset, Profile Management.

- **User Management:**
  - Complete Admin User CRUD.
  - Enable / Disable / Suspend accounts.
  - Paginated user list and search across names & emails.

- **Project Management:**
  - Project CRUD with Project Manager assignment.
  - Invite and remove project members.
  - Real-time project invitation notifications.

- **Team Management:**
  - Team creation, owner assignment, member join/leave operations.

- **Task Management:**
  - Comprehensive Task CRUD with soft-delete (`isDeleted`) and restore functionality.
  - Assign / Reassign task, update priority (LOW, MEDIUM, HIGH, URGENT) and status (OPEN, IN_PROGRESS, REVIEW, COMPLETED).
  - Advanced search and filtering via JPA Specifications (Search, Status, Priority, Assigned User, Project, Date Ranges).

- **Task Comments & Attachments:**
  - Interactive task comment threads with user ownership authorization.
  - Multipart file upload & streaming (Supported: PDF, DOCX, PNG, JPEG, ZIP) saved in local `uploads/` directory.

- **Real-Time Notifications:**
  - WebSocket (STOMP broker) endpoint `/ws`.
  - Notifications pushed for Task Assignment, Task Updates, Comments, Deadline Warnings, and Project Invitations.

- **AI Integration (OpenAI):**
  - AI-generated task descriptions from titles (`/api/ai/generate-description`).
  - Automated AI task summaries (`/api/ai/summarize-task`).

- **Auditing & Scheduling:**
  - Automated JPA auditing (`createdAt`, `updatedAt`, `createdBy`, `updatedBy`).
  - Scheduled cron jobs for deadline alerts and expired token purges.

---

## Technology Stack

- **Language:** Java 21 LTS
- **Framework:** Spring Boot 3.3.2 (Spring Web, Spring Security, Spring Data JPA, WebSocket)
- **Database:** MySQL 8.x
- **ORM:** Hibernate / Spring Data JPA
- **DTO Mapping:** MapStruct 1.5.5.Final
- **Validation:** Jakarta Validation (`@NotBlank`, `@Email`, `@Future`, `@NotNull`)
- **Documentation:** Springdoc OpenAPI 3 (Swagger UI)
- **Token Security:** JJWT (Java JWT 0.12.5)
- **AI Client:** RestTemplate / OpenAI REST API
- **Testing:** JUnit 5, Mockito, Spring Security Test, H2 In-Memory DB (for tests)
- **Build Tool:** Apache Maven

---

## Architecture & Design Principles

The application adheres strictly to **Clean Architecture** and **SOLID principles**:
1. **Layered Separation:** Controller $\rightarrow$ Service Interface $\rightarrow$ Service Implementation $\rightarrow$ Repository $\rightarrow$ Database.
2. **Immutability & Direct Exposure Prevention:** Entities are never exposed directly to REST endpoints; request/response DTOs and MapStruct mappers decouple external contracts from database persistence models.
3. **Dependency Injection:** Constructor Injection throughout all Spring components; field injection is forbidden.
4. **Standardized Responses:** All APIs return a uniform `ApiResponse<T>` payload containing `success`, `message`, `data`, and ISO `timestamp`.

---

## Folder Structure

```
src
 ├── main
 │   ├── java
 │   │   └── com
 │   │       └── tasktracker
 │   │           ├── ai             # OpenAI Service integration
 │   │           ├── attachment     # File attachment helper models
 │   │           ├── audit          # AuditorAware Spring Security listener
 │   │           ├── config         # Security, WebSocket, OpenAPI Spring configurations
 │   │           ├── controller     # REST Controllers
 │   │           ├── dto            # Request and Response DTOs
 │   │           ├── entity         # JPA Entities (User, Task, Project, Team, etc.)
 │   │           ├── enums          # Role, TaskStatus, TaskPriority, UserStatus
 │   │           ├── exception      # Custom Exceptions & GlobalExceptionHandler
 │   │           ├── jwt            # JwtTokenProvider, JwtAuthenticationFilter, EntryPoints
 │   │           ├── mapper         # MapStruct interfaces
 │   │           ├── notification   # WebSocket STOMP notification handlers
 │   │           ├── repository     # JPA Repositories & JPA Specifications
 │   │           ├── response       # Unified ApiResponse & PagedResponse wrappers
 │   │           ├── scheduler      # Scheduled cron background tasks
 │   │           ├── security       # UserPrincipal & CustomUserDetailsService
 │   │           ├── service        # Business Service Interfaces
 │   │           ├── serviceImpl    # Business Service Implementations
 │   │           ├── util           # Common Utilities
 │   │           └── validation     # Validation helpers
 │   └── resources
 │       ├── application.properties
 │       ├── application-dev.properties
 │       └── application-prod.properties
 └── test
     └── java
         └── com
             └── tasktracker        # Unit & Integration Tests (JUnit 5 / Mockito)
```

---

## Prerequisites

- **Java JDK 21** or later installed.
- **Apache Maven 3.8+** installed.
- **MySQL 8.0+** instance running.

---

## Database Configuration

Create the database in your MySQL server:

```sql
CREATE DATABASE task_tracker_db;
```

Update your database credentials in `src/main/resources/application-dev.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/task_tracker_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```

---

## Environment Variables

| Variable Name | Description | Default / Example |
| :--- | :--- | :--- |
| `DB_URL` | Production JDBC Connection URL | `jdbc:mysql://localhost:3306/task_tracker_prod_db` |
| `DB_USERNAME` | Production Database User | `root` |
| `DB_PASSWORD` | Production Database Password | `secret` |
| `JWT_SECRET` | 256-bit Base64-encoded secret key for JWT signing | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |
| `OPENAI_API_KEY` | OpenAI API Key for Task AI generation | `sk-...` |

---

## Getting Started & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/task-tracker-backend.git
   cd task-tracker-backend
   ```

2. **Build the application with Maven:**
   ```bash
   mvn clean package
   ```

3. **Run the Spring Boot application:**
   ```bash
   mvn spring-boot:run
   ```

---

## Running Tests

Execute the comprehensive unit test suite using JUnit 5 and Mockito:

```bash
mvn clean test
```

---

## Swagger OpenAPI Documentation

Once the application is running, access Swagger UI in your web browser:

- **Swagger UI URL:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON Docs:** `http://localhost:8080/v3/api-docs`

> [!TIP]
> You can authorize endpoints in Swagger UI by clicking the **Authorize** button and pasting `Bearer <your_access_token>`.

---

## API Authentication & JWT Token Flow

```
+--------+           +-------------------+           +----------------------+
| Client |  -------> | /api/auth/login   |  -------> | Generates Access &   |
|        | <-------  | (Email, Password) | <-------  | Refresh Tokens       |
+--------+           +-------------------+           +----------------------+
    |
    |  Header: Authorization: Bearer <access_token>
    v
+---------------------------------------------------------------------------+
| JwtAuthenticationFilter -> Validates Signature & Expiration -> SecurityContext|
+---------------------------------------------------------------------------+
```

---

## Role-Based Access Control (RBAC)

- `ADMIN`: Full access to user management (Create, Update, Delete, Enable/Disable Users), project manager assignment, and global system administration.
- `PROJECT_MANAGER`: Create & manage projects, manage tasks, invite/remove project members.
- `TEAM_MEMBER`: View assigned projects/teams, manage assigned tasks, post comments, upload attachments.

---

## REST Endpoints Summary

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Login & obtain tokens | Public |
| `POST` | `/api/auth/logout` | Revoke refresh token | Authenticated |
| `POST` | `/api/auth/refresh` | Refresh access token | Public |
| `POST` | `/api/auth/forgot-password` | Request password reset token | Public |
| `POST` | `/api/auth/reset-password` | Reset password | Public |
| `POST` | `/api/auth/change-password` | Change user password | Authenticated |

### Users (`/api/users`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users` | Create user | ADMIN |
| `GET` | `/api/users` | Paginated user list / search | ADMIN, PROJECT_MANAGER |
| `GET` | `/api/users/me` | View current user profile | Authenticated |
| `PUT` | `/api/users/me` | Update current user profile | Authenticated |
| `GET` | `/api/users/{id}` | Get user by ID | Authenticated |
| `PUT` | `/api/users/{id}` | Update user by ID | ADMIN |
| `DELETE` | `/api/users/{id}` | Delete user | ADMIN |
| `PATCH` | `/api/users/{id}/disable` | Disable user account | ADMIN |
| `PATCH` | `/api/users/{id}/enable` | Enable user account | ADMIN |

### Projects (`/api/projects`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/projects` | Create project | ADMIN, PROJECT_MANAGER |
| `GET` | `/api/projects` | List projects (paginated) | Authenticated |
| `GET` | `/api/projects/{id}` | Get project by ID | Authenticated |
| `PUT` | `/api/projects/{id}` | Update project | ADMIN, PROJECT_MANAGER |
| `DELETE` | `/api/projects/{id}` | Delete project | ADMIN |
| `POST` | `/api/projects/{id}/invite` | Invite project member | ADMIN, PROJECT_MANAGER |
| `DELETE` | `/api/projects/{id}/members/{userId}` | Remove member | ADMIN, PROJECT_MANAGER |
| `PATCH` | `/api/projects/{id}/assign-manager` | Assign project manager | ADMIN |
| `GET` | `/api/projects/{id}/members` | List project members | Authenticated |

### Teams (`/api/teams`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/teams` | Create team | Authenticated |
| `GET` | `/api/teams` | List teams (paginated) | Authenticated |
| `GET` | `/api/teams/{id}` | Get team details | Authenticated |
| `PUT` | `/api/teams/{id}` | Update team | Authenticated |
| `DELETE` | `/api/teams/{id}` | Delete team | Authenticated |
| `POST` | `/api/teams/{id}/join` | Join team | Authenticated |
| `POST` | `/api/teams/{id}/leave` | Leave team | Authenticated |
| `POST` | `/api/teams/{id}/invite` | Invite team member | Authenticated |
| `DELETE` | `/api/teams/{id}/members/{userId}` | Remove team member | Authenticated |

### Tasks (`/api/tasks`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/tasks` | Create task | Authenticated |
| `GET` | `/api/tasks` | List tasks (paginated) | Authenticated |
| `GET` | `/api/tasks/{id}` | Get task details | Authenticated |
| `PUT` | `/api/tasks/{id}` | Update task | Authenticated |
| `DELETE` | `/api/tasks/{id}` | Soft delete task | Authenticated |
| `POST` | `/api/tasks/{id}/restore` | Restore soft-deleted task | Authenticated |
| `PATCH` | `/api/tasks/{id}/assign` | Assign user to task | Authenticated |
| `PATCH` | `/api/tasks/{id}/status` | Update task status | Authenticated |
| `PATCH` | `/api/tasks/{id}/priority` | Update task priority | Authenticated |
| `GET` | `/api/tasks/search` | Search tasks by keyword | Authenticated |
| `GET` | `/api/tasks/filter` | Multi-criteria task filter | Authenticated |
| `GET` | `/api/tasks/assigned/{userId}` | List tasks assigned to user | Authenticated |

### Comments & Attachments
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/comments` | Post task comment | Authenticated |
| `PUT` | `/api/comments/{id}` | Edit comment | Authenticated |
| `DELETE` | `/api/comments/{id}` | Delete comment | Authenticated |
| `GET` | `/api/comments/task/{taskId}` | List task comments | Authenticated |
| `POST` | `/api/attachments/upload` | Upload attachment file | Authenticated |
| `GET` | `/api/attachments/{id}` | Get attachment metadata | Authenticated |
| `GET` | `/api/attachments/{id}/download` | Stream attachment binary | Authenticated |
| `DELETE` | `/api/attachments/{id}` | Delete attachment | Authenticated |

### AI Assistance (`/api/ai`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/generate-description` | Generate AI task description | Authenticated |
| `POST` | `/api/ai/summarize-task` | Generate AI task summary | Authenticated |

---

## Screenshots Placeholder

```
[Insert Dashboard Screenshot Here]
[Insert Swagger UI Screenshot Here]
[Insert Task Filter Matrix Screenshot Here]
```

---

## Future Improvements

- [ ] Redis caching for frequent project/user lookups.
- [ ] AWS S3 / Google Cloud Storage integration for attachment storage.
- [ ] OAuth2 Social Login (Google / GitHub).
- [ ] Email notification integration via SendGrid / Spring Mail.

---

## Contributing

1. Fork the Project repository.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## License

Distributed under the Apache 2.0 License. See `LICENSE` for more information.
