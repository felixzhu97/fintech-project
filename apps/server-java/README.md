# FinPulse Java API slice (Spring Boot + H2)

Per-feature layout follows global Developer skill:
`controller → service → domain ← infra` (+ `mapper`).

Current feature: **preference** (user-preferences). Root package also exposes
`GET /health`.

Default port **8802**. Go gateway proxies `/api/v1/user-preferences*` via
`JAVA_BACKEND_URL`.

## Package layout

```text
com.finpulse.server/
├── ServerApplication / HealthController / ApiExceptionHandler
└── preference/
    ├── controller/          # HTTP adapters (no business rules)
    ├── service/             # use-case orchestration
    ├── domain/
    │   ├── model/           # rich aggregates
    │   └── repository/      # repository ports
    ├── mapper/              # DTO ↔ domain
    ├── dto/                 # request / response
    └── infra/persistence/   # JPA entity + Spring Data + adapter
```

## Stack

| Concern | Framework capability |
|---------|----------------------|
| HTTP | Spring Web (`@RestController`, `MockMvc`) |
| Persistence | Spring Data JPA (driven adapter in `infra`) |
| Schema | Liquibase (`db/changelog`) — Hibernate `ddl-auto: validate` |
| DB | H2 in-memory (`MODE=PostgreSQL`) |
| Validation | `spring-boot-starter-validation` |

## Run (Bazel)

From repo root:

```bash
bazel run //apps/server-java:server
bazel test //apps/server-java:UserPreferenceControllerTest
```

Or from this directory: `make run` / `make test`.
