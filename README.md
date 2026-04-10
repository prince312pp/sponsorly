Software Requirements Specification (SRS) for Sponsorly
1. Introduction
1.1 Purpose
The purpose of this document is to define the comprehensive software requirements for Sponsorly, a web-based marketplace connecting content creators with potential sponsors. This document serves as a detailed guide for developers, quality assurance teams, and project stakeholders.
1.2 Document Conventions
•	**REQ-[ID]**: Functional Requirements.
•	**NFR-[ID]**: Non-Functional Requirements.
•	**API-[Path]**: API Endpoints.
1.3 Project Scope
Sponsorly is an end-to-end platform for sponsorship management. It facilitates:
•	**User Discovery**: Multi-faceted search for creators and sponsors.
•	**Profile Management**: Rich media profiles with verified social links and budget transparency.
•	**Interactive Dashboards**: Role-specific views for managing collaborations.
•	**Support System**: Integrated contact and help mechanism.
1.4 Definitions, Acronyms, and Abbreviations
•	**NESTJS**: Backend framework used for API development.
•	**MONGODB**: NoSQL database for flexible user data storage.
•	**JWT**: JSON Web Token for stateless authentication.
•	**CREATOR**: User offering placement (Influencers, Bloggers).
•	**SPONSOR**: User seeking placement (Brands, Agencies).
2. Overall Description
2.1 Product Perspective
Sponsorly is a full-stack application with a decoupled architecture:
•	**Frontend**: Static HTML/Vanilla CSS/TailwindCSS served via NestJS `ServeStaticModule`.
•	**Backend**: NestJS REST API with Mongoose ODM for MongoDB interaction.
•	**Database**: MongoDB Atlas for persistent storage.
2.2 User Classes and Characteristics
:---	:---	:---
**Guest**	Unauthenticated user.	Landing page browsing, registration, login.
**Creator**	Content owner.	Profile setup (social links, stats), discovery (finding brands), dashboard.
**Sponsor**	Brand/Advertiser.	Profile setup (company info, budget), discovery (filtering creators), dashboard.
2.3 Operating Environment
•	**Browser Compatibility**: Chrome, Firefox, Safari, Edge (Latest versions).
•	**Responsive Design**: Primary focus on Desktop and Tablet; Mobile optimization for profile viewing.
•	**Backend Stack**: Node.js/Bun, NestJS, MongoDB.
2.4 Design and Implementation Constraints
•	**Language**: TypeScript (Backend & Scripts).
•	**Styling**: TailwindCSS 4.x for utility-first styling.
•	**Authentication**: JWT-based with Passport.js strategy.
•	**Static Assets**: Frontend files served from the `/public` directory.
3. System Features
3.1 User Authentication & Account Management
Description: Secure registration and login flow with role selection.
•	**REQ-1**: Support for 'Creator' and 'Sponsor' registration paths.
•	**REQ-2**: Password hashing using Bcrypt.
•	**REQ-3**: JWT issuance upon successful login for subsequent API requests.
•	**REQ-4**: Session persistence via `localStorage` on the frontend.
3.2 Dynamic Profile Engineering
Description: Detailed profile setup tailored to user roles.
•	**REQ-5**: Creators must input Audience Reach, Platform, Handle, and Social Links.
•	**REQ-6**: Sponsors must input Company Name, Number of Employees, and Budget Range.
•	**REQ-7**: Users can update their Bio, Location, and Links via the Edit Profile interface.
3.3 Discovery Mechanism
Description: Cross-role search and filtering.
•	**REQ-8**: Sponsors can filter creators by role.
•	**REQ-9**: Creators can browse sponsor requirements.
•	**REQ-10**: Support for pagination and limit parameters in discovery queries.
3.4 Interactive Dashboard
Description: A central hub for managing platform activity.
•	**REQ-11**: Display user-specific stats (Followers for Creators, Reach for Sponsors).
•	**REQ-12**: Quick links to Edit Profile, Discover, and Settings.
4. External Interface Requirements
4.1 User Interfaces
:---	:---	:---
**Home**	`/`	Hero section, value proposition, and CTA.
**Login**	`/login.html`	Credentials input and error handling.
**Registration**	`/register-creator.html` / `register-sponsor.html`	Step-based role-specific forms.
**Dashboard**	`/dashboard.html`	Private user area with activity overview.
**Discover**	`/discover.html`	Search interface for finding partners.
**Profile**	`/profile.html`	Public/Private view of user details.
4.2 Software Interfaces (API Specification)
:---	:---	:---	:---
`POST`	`/api/auth/register`	Create a new user account.	No
`POST`	`/api/auth/login`	Authenticate and get JWT.	No
`POST`	`/api/auth/profile`	Retrieve current user profile.	Yes (JWT)
`PUT`	`/api/auth/update-profile`	Update user profile data.	Yes (JWT)
`POST`	`/api/auth/discover`	Query users based on role.	Yes (JWT)
`POST`	`/api/auth/contact-support`	Submit a support ticket.	No
4.3 Communication Interfaces
•	**HTTP/HTTPS**: Used for all client-server communication.
•	**Email (Nodemailer)**: Used for notifications and support queries.
5. System Requirements (Data Model)
5.1 User Schema (MongoDB/Mongoose)
•	**Basic Info**: `firstName`, `lastName`, `email` (Unique), `password`, `role`.
•	**Engagement**: `verified` (Boolean), `bio`, `location`.
•	**Media**: `links` (Array of `{label, url}`).
•	**Creator Fields**: `platform`, `handle`, `followers`, `dob`, `audienceReach`.
•	**Sponsor Fields**: `companyName`, `noOfEmployees`, `budget`, `requirements`.
6. Non-Functional Requirements
6.1 Performance
•	**NFR-1**: API response time for discovery should be under 300ms.
•	**NFR-2**: Frontend pages should load in under 1.5s on 4G networks.
6.2 Security
•	**NFR-3**: All data transmission must be over HTTPS.
•	**NFR-4**: Use of `HttpOnly` cookies or secure `localStorage` practices for tokens.
•	**NFR-5**: Rate limiting on Auth endpoints to prevent brute-force attacks.
6.3 Reliability & Maintainability
•	**NFR-6**: 99.9% uptime target for the API.
•	**NFR-7**: Comprehensive logging of server errors (NestJS default + custom logs).
7. Appendices
•	**Flow**: User -> Register -> Login -> Setup Profile -> Discover -> Collaborate.
•	**Future Enhancements**: Direct messaging, Payment integration