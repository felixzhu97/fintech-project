# E8 — Analytics & Risk

## Background

Python analytics provide portfolio aggregates, risk metrics, forecasts, and behavior events.

## User Stories

### US-16 Portfolio analytics

**As an** investor or admin, **I want** portfolio aggregates and risk summaries, **so that** I understand exposure.

**Acceptance Criteria**

1. GIVEN backend services are up  
   WHEN analytics/portfolio and risk endpoints are called (via :8801 entry or :8800)  
   THEN aggregate/risk payloads are returned

### US-17 Behavior & forecast

**As an** admin, **I want** behavior events and forecast hooks, **so that** product analytics and ML demos work.

**Acceptance Criteria**

1. GIVEN an event payload  
   WHEN `POST /api/v1/analytics/events`  
   THEN the event is stored and listable
2. GIVEN an MLflow model URI  
   WHEN forecast model endpoint is called  
   THEN predictions are returned or a clear error is shown
