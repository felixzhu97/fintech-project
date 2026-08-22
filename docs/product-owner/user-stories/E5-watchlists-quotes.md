# E5 — Watchlists & Quotes

## Background

Investors follow symbols and need quotes (REST and streaming where available).

## User Stories

### US-10 Watchlists

**As an** investor, **I want** watchlists and items, **so that** I can track symbols of interest.

**Acceptance Criteria**

1. GIVEN an authenticated user  
   WHEN watchlist and watchlist-item APIs are used  
   THEN lists and items persist

### US-11 Quotes

**As an** investor, **I want** quotes for symbols, **so that** I see current prices.

**Acceptance Criteria**

1. GIVEN symbols  
   WHEN quote APIs (Java and/or Python aggregate/WS) are used  
   THEN quote payloads are returned or streamed per API docs
