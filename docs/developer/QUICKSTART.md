# FinPulse Quick Start

## 1. Prerequisites

| Software | Version | Notes |
| -------- | ------- | ----- |
| Node.js | >= 20 | Frontend workspaces |
| pnpm | 10.x | Root `packageManager` |
| Python | >= 3.10 | `apps/server-python` |
| JDK | 21+ | Root Java API (`src/`, Bazel) |
| Docker | recent | Used by backend start script |
| Bazelisk | optional | `bazel build //:server` |

```bash
node --version
pnpm --version
python3 --version
java --version
```

## 2. Install

```bash
git clone https://github.com/felixzhu97/explore-portfolio.git
cd explore-portfolio
pnpm install
```

## 3. Run locally

```bash
pnpm dev:server   # Docker + Python :8800 + Java :8801 + seed
pnpm dev:admin    # admin
pnpm dev:portal   # portal
pnpm dev:mobile   # Expo
```

| Service | URL |
| ------- | --- |
| Java API (entry) | http://127.0.0.1:8801 |
| Python Analytics | http://127.0.0.1:8800 |
| Admin | Vite admin app |
| Portal | Vite portal app |

Stop backends: `pnpm stop:backend`.

Client env:

- Admin: `VITE_API_BASE_URL` (e.g. `http://127.0.0.1:8801/api/v1`) or Vite proxy
- Mobile: `EXPO_PUBLIC_API_BASE_URL` (e.g. `http://localhost:8801`)

## 4. Architecture snapshot

```text
apps/admin · apps/portal · apps/mobile
              │ HTTPS / JSON
              ▼
     Java API :8801  ──►  Postgres / H2
              │
              └── HTTP ──►  Python :8800 (apps/server-python)
```

Java feature modules: `controller → service → domain ← infra` (+ `mapper`). Domain has **no** outward dependencies.

Preferred Terms: [Glossary](../Glossary.md).

## 5. Useful scripts

| Script | Purpose |
| ------ | ------- |
| `pnpm dev:server` | Start Docker + Python + Java + seed (`scripts/backend/start-backend.sh`) |
| `pnpm generate-seed-data` | Seed via Java API |
| `pnpm test:api` | Python pytest |
| `pnpm test:type` / `pnpm lint` | Frontend gates |
| `bazel test //:…ControllerTest` | Java controller tests (CI) |

## 6. Living docs

| Doc | Path |
| --- | ---- |
| Glossary | [../Glossary.md](../Glossary.md) |
| API | [api.md](./api.md) |
| C4 | [c4-model/](./c4-model/) |
| CI/CD | [cicd/](./cicd/) |
| User Story Map | [../product-owner/User-Story-Map.md](../product-owner/User-Story-Map.md) |
