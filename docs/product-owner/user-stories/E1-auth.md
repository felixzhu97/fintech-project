# E1 — Auth

## Background

Investors and operators need secure registration, login, and session management before using FinPulse surfaces.

## User Stories

### US-01 Register

**As a** guest, **I want** to register with email and password, **so that** I can access FinPulse.

**Acceptance Criteria**

1. GIVEN valid registration payload  
   WHEN `POST /api/v1/auth/register`  
   THEN the API returns token + customer and persists the user
2. GIVEN duplicate email  
   WHEN register is attempted  
   THEN the API returns a client error without creating a second user

### US-02 Login

**As a** registered user, **I want** to log in, **so that** I receive a bearer token for API calls.

**Acceptance Criteria**

1. GIVEN valid credentials  
   WHEN `POST /api/v1/auth/login`  
   THEN the API returns `{ token, customer }`
2. GIVEN invalid credentials  
   WHEN login is attempted  
   THEN the API rejects the request

### US-03 Session

**As a** signed-in user, **I want** `/auth/me`, logout, and change-password, **so that** I can manage my session.

**Acceptance Criteria**

1. GIVEN a valid Bearer token  
   WHEN `GET /api/v1/auth/me`  
   THEN the current customer is returned
2. GIVEN a valid Bearer token  
   WHEN `POST /api/v1/auth/logout`  
   THEN the session is invalidated (204)
