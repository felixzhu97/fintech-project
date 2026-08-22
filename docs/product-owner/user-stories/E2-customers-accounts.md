# E2 — Customers & Accounts

## Background

Admin and portal need CRUD for Customer and Account as the foundation for portfolios and payments.

## User Stories

### US-04 Manage customers

**As an** advisor/ops user, **I want** to create and update customers, **so that** client records stay accurate.

**Acceptance Criteria**

1. GIVEN authorized access  
   WHEN customer CRUD endpoints are called  
   THEN customers persist and list/filter as documented in the API

### US-05 Manage accounts

**As an** advisor/ops user, **I want** to manage accounts for a customer, **so that** portfolios and cash can be attached.

**Acceptance Criteria**

1. GIVEN a customer  
   WHEN account CRUD is used  
   THEN accounts are linked to the customer and appear in list/detail APIs
