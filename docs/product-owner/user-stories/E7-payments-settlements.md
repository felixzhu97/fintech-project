# E7 — Payments & Settlements

## Background

Funding, payouts, cash transactions, and settlements complete the money lifecycle.

## User Stories

### US-14 Payments

**As an** investor, **I want** to submit payments, **so that** I can fund activity.

**Acceptance Criteria**

1. GIVEN a valid payment payload  
   WHEN payment APIs are used  
   THEN payment persists (fraud fields may be present when scoring is enabled)

### US-15 Settlements & cash

**As an** ops user, **I want** settlements and cash transactions, **so that** post-trade money movement is tracked.

**Acceptance Criteria**

1. GIVEN settlement/cash payloads  
   WHEN corresponding APIs are used  
   THEN records persist per API docs
