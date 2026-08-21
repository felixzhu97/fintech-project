# FinPulse Java API slice (Spring Boot + H2)

业务域划分下的 Spring 服务：当前业务域 **preference**（user-preferences），另有根包 `GET /health`。

Default port **8802**. Go gateway proxies `/api/v1/user-preferences*` via `JAVA_BACKEND_URL`.

## Package layout

```text
com.finpulse.server/
├── ServerApplication / HealthController / ApiExceptionHandler   # 根包
└── preference/                                                  # 业务域
    ├── controller/
    ├── service/
    ├── repository/
    ├── domain/
    └── dto/
```

后续业务域（如 `customer/`、`portfolio/`）复制同一套域内五包结构。

## Stack

| Concern | Framework capability |
|---------|----------------------|
| HTTP | Spring Web (`@RestController`, `MockMvc`) |
| Persistence | Spring Data JPA (`JpaRepository`) |
| Schema | Liquibase (`db/changelog`) — Hibernate `ddl-auto: validate` |
| DB | H2 in-memory (`MODE=PostgreSQL`) |
| Validation | `spring-boot-starter-validation` |
| Boilerplate | Lombok (`@Builder`, `@Value`, `@RequiredArgsConstructor`, …) |
| JSON | Jackson (`SNAKE_CASE` naming) |
| DI / boot | `@SpringBootApplication`, constructor injection |

## Schema (Liquibase)

Changelog root: `src/main/resources/db/changelog/db.changelog-master.xml`

| ChangeSet | Purpose |
|-----------|---------|
| `001-create-user-preference` | Create `user_preference` (aligned with `scripts/db/schema.sql`, no FK to `customer`) |

Hibernate uses `ddl-auto: validate` so migrations own the schema.

## Run

```bash
# from repo root
bazel run //apps/server-java:server

# or
cd apps/server-java && make bazel-run
```

H2 console: `http://127.0.0.1:8802/h2-console` (JDBC URL `jdbc:h2:mem:finpulse`).

## Test / build

```bash
bazel test //apps/server-java:UserPreferenceControllerTest
bazel build //apps/server-java:server
```

After changing Maven coordinates in root `MODULE.bazel`:

```bash
REPIN=1 bazel run @maven//:pin
```

## Endpoints

- `GET /health` → `{"status":"ok"}`
- CRUD `/api/v1/user-preferences` — same snake_case JSON contract as the former Go handlers
