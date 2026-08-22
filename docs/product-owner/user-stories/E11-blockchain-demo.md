# E11 — Blockchain demo

## Background

Mobile includes a demo path for wallet connect / ETH transfer on a test network (e.g. Sepolia).

## User Stories

### US-23 Blockchain demo

**As an** investor (demo), **I want** to connect a wallet and try a testnet transfer, **so that** I can explore blockchain UX safely.

**Acceptance Criteria**

1. GIVEN mobile blockchain screens and a testnet configuration  
   WHEN I connect a wallet  
   THEN the app shows connection state without affecting production funds
2. GIVEN a connected wallet on testnet  
   WHEN I initiate a demo transfer  
   THEN the app shows success/failure feedback from the JSON-RPC path
