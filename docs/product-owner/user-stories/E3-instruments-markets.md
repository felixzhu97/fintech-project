# E3 — Instruments & Markets

## Background

Trading and portfolios depend on a catalog of Instruments and related market data.

## User Stories

### US-06 Instrument catalog

**As a** user, **I want** instruments available via API, **so that** positions and orders reference real symbols.

**Acceptance Criteria**

1. GIVEN seeded instruments  
   WHEN `GET /api/v1/instruments`  
   THEN instruments are returned with stable ids/symbols

### US-07 Market data records

**As an** ops user, **I want** market-data CRUD, **so that** historical observations can be stored.

**Acceptance Criteria**

1. GIVEN market-data payloads  
   WHEN market-data endpoints are used  
   THEN records persist per API contract
