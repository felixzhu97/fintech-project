# E4 — Portfolios & Positions

## Background

Investors need portfolios and positions to understand holdings and performance.

## User Stories

### US-08 Portfolio CRUD

**As an** investor or ops user, **I want** portfolios, **so that** holdings are grouped meaningfully.

**Acceptance Criteria**

1. GIVEN an account/customer context  
   WHEN portfolio CRUD is used  
   THEN portfolios persist and are listable

### US-09 Positions

**As an** investor, **I want** positions in a portfolio, **so that** I can see quantity per instrument.

**Acceptance Criteria**

1. GIVEN a portfolio and instrument  
   WHEN position CRUD/batch is used  
   THEN positions reflect quantity and instrument references
