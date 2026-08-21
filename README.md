# FinPulse

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Go](https://img.shields.io/badge/Go-1.24-00ADD8.svg)](https://go.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220.svg)](https://pnpm.io/)

FinPulse brings financial technology into everyday life. Our mission is to drive breakthroughs that benefit people, society, and the portfolios we manage every day.

Chinese docs: [docs/zh/README.md](docs/zh/README.md)

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Analytics](#analytics)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Testing](#testing)
- [Documentation](#documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Features

| Area | Capability |
|------|------------|
| **Portfolio** | Holdings, performance, and account views for investors and advisors |
| **Markets** | Watchlists, quotes, and stock detail on mobile and web |
| **Risk** | Insights and risk metrics for portfolio monitoring |
| **Payments / trading** | Payment and trade flows from the mobile client |
| **Admin** | Client, portfolio, and transaction management console |
| **Analytics** | Shared `@fintech/analytics` event tracking and GrowthBook A/B hooks |

## Screenshots

### Mobile

<p align="center">
  <img src="./screenshots/finpulse-mobile-dashboard.png" width="200" alt="Mobile dashboard">
  <img src="./screenshots/finpulse-mobile-watchlist.png" width="200" alt="Mobile watchlist">
  <img src="./screenshots/finpulse-mobile-stock-detail.png" width="200" alt="Mobile stock detail">
</p>
<p align="center">
  <img src="./screenshots/finpulse-mobile-insights.png" width="200" alt="Mobile insights">
  <img src="./screenshots/finpulse-mobile-account.png" width="200" alt="Mobile account">
  <img src="./screenshots/finpulse-mobile-new-payment.png" width="200" alt="Mobile new payment">
</p>

### Admin

<p align="center">
  <img src="./screenshots/finpulse-admin-dashboard.png" width="280" alt="Admin dashboard">
  <img src="./screenshots/finpulse-admin-portfolio.png" width="280" alt="Admin portfolio">
  <img src="./screenshots/finpulse-admin-transactions.png" width="280" alt="Admin transactions">
  <img src="./screenshots/finpulse-admin-clients.png" width="280" alt="Admin clients">
</p>

## Tech Stack

| Layer | Choice |
|-------|--------|
| Web | React 19 + Vite, Emotion, Radix UI |
| Mobile | React Native + Expo |
| Shared packages | `@fintech/analytics`, `@fintech/ui`, `@fintech/utils` |
| Backend | Python FastAPI (analytics, portfolio, quotes, events, AI/ML), Go gateway + CRUD, Java user-preferences slice |
| Data | TimescaleDB, Redis, Kafka |
| Tooling | pnpm workspaces, TypeScript 5; Bazel for root Java API (`src/`) |

Architecture notes: [docs/en/rd/c4/](docs/en/rd/c4/), [docs/en/rd/togaf/](docs/en/rd/togaf/).

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| pnpm | 10.6+ |
| Python | 3.10+ |
| Docker | latest (for local backend stack) |
| Bazelisk | optional; Bazel for root Java (`//:server`) |

## Getting Started

```bash
git clone https://github.com/felixzhu97/explore-portfolio.git
cd explore-portfolio
pnpm install
```

```bash
pnpm dev:admin    # admin @ http://localhost:4200
pnpm dev:portal   # portal @ http://localhost:3001
pnpm dev:mobile   # Expo mobile
pnpm dev:server   # Docker + Python :8800 + Go :8801 + seed data
```

After the backend is up, use `http://127.0.0.1:8801` as the API entry.

- Admin analytics: set `VITE_API_BASE_URL` (e.g. `http://127.0.0.1:8801/api/v1`) or use the default dev proxy.
- Mobile analytics: set `EXPO_PUBLIC_API_BASE_URL` (e.g. `http://localhost:8801`; `/api/v1` is appended automatically).

## Analytics

Portal, admin, and mobile use `@fintech/analytics` via `AnalyticsProvider` and `useAnalytics().track()` / `identify()`. Events post to `POST /api/v1/analytics/events` (Console transport when no API is configured in development). The admin **Behavior** page (`/behavior`) lists events; row click opens a drawer with user details (`userId`, email, name).

## Project Structure

```text
explore-portfolio/
├── src/               # Java (Spring): health + user-preferences; Bazel //:server
├── apps/
│   ├── admin/         # React admin console
│   ├── portal/        # React portal
│   ├── mobile/        # React Native (Expo)
│   ├── server-python/ # FastAPI services
├── packages/
│   ├── analytics/     # @fintech/analytics
│   ├── ui/            # @fintech/ui
│   └── utils/         # @fintech/utils
├── scripts/           # Backend start, seed, database helpers
└── docs/              # Product, data, and R&D docs (en / zh)
```

### Java (root `src/`)

Per-feature packages follow `controller → service → domain ← infra` (+ `mapper`).
Current slice: **preference**. Default port **8802** (H2). For Postgres:

```bash
bazel run //:server
```

```bash
bazel run //:server
bazel test //:UserPreferenceControllerTest
# or: make -f Makefile.java java-run / java-test
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev:admin` | Admin Vite dev server |
| `pnpm dev:portal` | Portal Vite dev server |
| `pnpm dev:mobile` | Expo mobile |
| `pnpm dev:server` | Backend (Docker + APIs + seed) |
| `pnpm build` | Build admin (and workspace deps as configured) |
| `pnpm test:all` | Run workspace unit tests |
| `pnpm test:api` | Python API tests |
| `pnpm lint` | ESLint (admin) |

## Testing

```bash
pnpm test:all
pnpm test:all:coverage
pnpm test:api
```

## Documentation

| Doc | Link |
|-----|------|
| English docs index | [docs/en/README.md](docs/en/README.md) |
| Chinese docs index | [docs/zh/README.md](docs/zh/README.md) |
| C4 model | [docs/en/rd/c4/](docs/en/rd/c4/) |
| TOGAF | [docs/en/rd/togaf/](docs/en/rd/togaf/) |
| ER diagrams | [docs/en/data/er-diagram/](docs/en/data/er-diagram/) |
| TODO | [docs/en/TODO.md](docs/en/TODO.md) |

## Deployment

**Vercel (admin)**

| Setting | Value |
|---------|-------|
| Root | `/` |
| Build | `pnpm install && pnpm --filter finpulse-admin build` |
| Output | `apps/admin/dist` |

See [`vercel.json`](vercel.json) for project-specific config.

## Contributing

Issues and pull requests are welcome. Please follow the [Code of Conduct](CODE_OF_CONDUCT.md). Prefer small, focused PRs with a clear why and test notes.

## Security

Report vulnerabilities as described in [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © Felix Zhu
