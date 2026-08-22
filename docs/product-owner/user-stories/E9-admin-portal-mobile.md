# E9 — Admin, Portal, Mobile surfaces

## Background

FinPulse ships three clients that share the Java API entry and shared packages.

## User Stories

### US-18 Admin console

**As an** ops user, **I want** an admin web app, **so that** I can manage clients, portfolios, and transactions.

**Acceptance Criteria**

1. GIVEN `pnpm dev:admin`  
   WHEN I open the admin app pointed at :8801  
   THEN core management pages load against the API

### US-19 Portal

**As an** investor, **I want** a portal web app, **so that** I can view portfolios and markets in the browser.

**Acceptance Criteria**

1. GIVEN `pnpm dev:portal`  
   WHEN I use the portal against :8801  
   THEN portfolio/market flows work for seeded data

### US-20 Mobile

**As an** investor, **I want** a mobile app, **so that** I can monitor portfolios on the go.

**Acceptance Criteria**

1. GIVEN Expo mobile with `EXPO_PUBLIC_API_BASE_URL`  
   WHEN I open dashboard/watchlist  
   THEN data loads from the API entry
