# E6 — Orders & Trades

## Background

Users place orders and observe resulting trades.

## User Stories

### US-12 Orders

**As an** investor, **I want** to create and view orders, **so that** I can trade instruments.

**Acceptance Criteria**

1. GIVEN a valid order payload  
   WHEN order APIs are used  
   THEN orders persist and are retrievable

### US-13 Trades

**As an** investor or ops user, **I want** trades, **so that** fills are visible.

**Acceptance Criteria**

1. GIVEN trade records  
   WHEN trade APIs are used  
   THEN trades list/detail match the API contract (including optional surveillance fields when enabled)
