# Software Requirements Specification (SRS) for Sponsorly

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the software requirements for **Sponsorly**, a web-based marketplace that connects content creators with potential sponsors. This document is intended for project stakeholders, developers, and testers.

### 1.2 Document Conventions
This document follows standard typographical conventions. Functional requirements are identified by the prefix `REQ-` followed by a unique number.

### 1.3 Project Scope
Sponsorly is designed to simplify the sponsorship discovery process. It allows creators to list their platforms and audience reach, while enabling sponsors to find creators that align with their brand's target audience and budget. Key goals include:
- Centralizing creator and sponsor profiles.
- Providing a search/discovery mechanism for collaborations.
- Ensuring secure user authentication and profile management.

### 1.4 References
- [NestJS Documentation](https://docs.nestjs.com/)
- [MongoDB/Mongoose Documentation](https://mongoosejs.com/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [ISO/IEC/IEEE 29148:2018 Standard](https://www.iso.org/standard/72087.html)

### 1.5 Definitions, Acronyms, and Abbreviations
- **JWT**: JSON Web Token, used for secure session handling.
- **RBAC**: Role-Based Access Control, defining permissions based on user roles.
- **Creator**: A user providing content services (e.g., Influencer).
- **Sponsor**: A user seeking advertising or partnership opportunities (e.g., Brand).
- **CRUD**: Create, Read, Update, Delete operations.

---

## 2. Overall Description

### 2.1 Product Perspective
Sponsorly is a standalone web application. It utilizes a NestJS backend for business logic and API services, and a static frontend (HTML, Vanilla CSS, TailwindCSS) for the user interface. Data is persisted in a MongoDB database.

### 2.2 User Classes and Characteristics
- **Creator**: Individuals looking for brand partnerships.
- **Sponsor**: Brands or companies looking to promote products.
- **Guest**: Unauthenticated users with read-only access to public pages.

### 2.3 Operating Environment
- **Browser**: Chrome, Firefox, Safari, Edge (Latest 2 versions).
- **Mobile**: Responsive for iOS and Android browsers.
- **Server**: Node.js/Bun runtime, MongoDB Atlas or local deployment.

### 2.4 Design and Implementation Constraints
- **Language**: TypeScript throughout the stack.
- **Architecture**: Modular Monolith using NestJS.
- **Database Schema**: Document-oriented (NoSQL) for flexibility.

### 2.5 Assumptions and Dependencies
- **Assumptions**: Users have a stable internet connection and a valid email address.
- **Dependencies**: Reliance on MongoDB for data availability and Nodemailer for communication alerts.

---

## 3. System Features

### 3.1 User Authentication (High Priority)
**Description**: Secure account creation and role-based access control.
**Stimulus/Response**: 
- Input: Email/Password -> Output: Session Token (JWT).
**Functional Requirements**:
- **REQ-1**: Validate email formats and domain existence.
- **REQ-2**: Encrypt passwords using Salted Bcrypt (Cost Factor 10).
- **REQ-3**: Implement JWT expiration (default 24 hours).

### 3.2 Dynamic Discovery (High Priority)
**Description**: Role-specific search results.
**Functional Requirements**:
- **REQ-4**: Sponsors can filter creators by platform, followers, and location.
- **REQ-5**: Creators can browse sponsor profiles and requirements.

### 3.3 Profile Engineering (Medium Priority)
**Description**: Rich profile management for professional branding.
**Functional Requirements**:
- **REQ-6**: Creators must provide links to social platforms (verified via schema).
- **REQ-7**: Sponsors must define budget ranges for transparency.

### 3.4 Business Rules
- **Rule 1**: Only "Verified" creators are visible in the discovery directory.
- **Rule 2**: Users cannot change their Email address after registration (requires admin intervention).

---

## 4. External Interface Requirements

### 4.1 User Interfaces
- Modern, high-performance UI using TailwindCSS.
- Interactive components like navigation bars, dashboard cards, and search filters.

### 4.2 Software Interfaces
- **API**: RESTful JSON API.
- **Database**: MongoDB (via Mongoose).
- **ORM**: Mongoose for schema definition.

### 4.3 Communication Interfaces
- **HTTPS**: TLS 1.2+ for all data in transit.
- **Webhooks**: Future support for payment status updates.

---

## 5. Non-Functional Requirements

### 5.1 Performance
- API response time < 500ms for standard queries.
- Support for 100+ concurrent active sessions.

### 5.2 Security
- Implementation of CORS (Cross-Origin Resource Sharing) policies.
- Protection against Common Web Vulnerabilities (XSS, CSRF, NoSQL Injection).

### 5.3 Reliability
- Automatic data backups (daily).
- Graceful error handling with user-friendly messages.

---

## 6. System Quality Attributes

### 6.1 Portability
- The application shall be containerizable (Docker) for consistent deployment across cloud providers.

### 6.2 Scalability
- The stateless nature of JWT authentication allows horizontal scaling of the backend.

### 6.3 Availability
- Target uptime of 99.5% excluding scheduled maintenance.

---

## 7. Appendices
- **Future Feature**: Direct Messaging system between Creators and Sponsors.
- **Future Feature**: Review and Rating system for completed collaborations.