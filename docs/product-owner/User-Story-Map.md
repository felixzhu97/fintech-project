# User Story Map — FinPulse

> Jeff Patton story map + Mermaid journeys + GWT epics in files.  
> Story bodies and acceptance criteria live under [user-stories/](./user-stories/); this page is the index (single source).

## Personas

| Role | Description |
| ---- | ----------- |
| Investor | Uses portal / mobile for portfolio, watchlists, quotes, payments |
| Advisor / Ops | Uses admin to manage customers, accounts, portfolios, transactions |
| Guest / new user | Registers and authenticates |
| Developer | Seeds data, runs local stack, extends APIs |

## Journey overview

### Authenticate and onboard

```mermaid
journey
    title Authenticate and onboard
    section Account
        Register: 5: Guest
        Login: 5: Investor
        View profile: 4: Investor
        Change password: 3: Investor
```

### Understand portfolio

```mermaid
journey
    title Understand portfolio
    section Portfolio
        Open portfolio summary: 5: Investor
        Inspect positions: 5: Investor
        Review risk / allocation: 4: Investor
    section Markets
        Browse watchlist: 5: Investor
        View quotes: 5: Investor
```

### Trade and settle

```mermaid
journey
    title Trade and settle
    section Orders
        Place order: 5: Investor
        See fills / trades: 4: Investor
    section Money
        Make payment: 4: Investor
        See settlement status: 3: Ops
```

### Operate (Admin)

```mermaid
journey
    title Operate platform
    section Admin
        Manage customers: 5: Ops
        Manage portfolios: 5: Ops
        Review transactions: 4: Ops
        Review behavior analytics: 3: Ops
```

---

## Backbone map

| Auth | Customers & accounts | Instruments & markets | Portfolios | Watchlists & quotes | Trading | Payments | Analytics | Surfaces |
| ---- | -------------------- | --------------------- | ---------- | ------------------- | ------- | -------- | --------- | -------- |
| [E1](./user-stories/E1-auth.md) | [E2](./user-stories/E2-customers-accounts.md) | [E3](./user-stories/E3-instruments-markets.md) | [E4](./user-stories/E4-portfolios-positions.md) | [E5](./user-stories/E5-watchlists-quotes.md) | [E6](./user-stories/E6-orders-trades.md) | [E7](./user-stories/E7-payments-settlements.md) | [E8](./user-stories/E8-analytics-risk.md) | [E9](./user-stories/E9-admin-portal-mobile.md) |

| Bonds & options | Blockchain demo |
| --------------- | --------------- |
| [E10](./user-stories/E10-bonds-options.md) | [E11](./user-stories/E11-blockchain-demo.md) |

## Related

- [Glossary](../Glossary.md)
- [API](../developer/api.md)
- [C4](../developer/c4-model/)
