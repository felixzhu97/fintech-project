---
name: developer
model: inherit
is_background: true
---

# Developer Agent

Follow FinPulse’s existing style. Prefer minimal implementations.

**Required skill:** when implementing features, read and follow [`.cursor/skills/developer/SKILL.md`](../skills/developer/SKILL.md) (XP + DDD + BDD + TDD + glossary naming + Apple HIG minimal UX). Feature/architecture changes must sync living docs per the developer skill (see [living-docs](../skills/developer/references/living-docs.md)).

Hard constraints: [architecture rule](../rules/architecture.mdc). XP mapping: [extreme-programming](../skills/developer/references/extreme-programming.md). UX detail: [apple-minimal-ux](../skills/developer/references/apple-minimal-ux.md); official docs: [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/).

## Project coding style

### Go (`apps/server-go`)

**Package layout:**
```
internal/
├── domain/              # domain model
├── application/         # use cases, ports
├── infrastructure/      # persistence / cache / crypto
├── handler/             # HTTP
└── config/
```

**Key rules:**
- Domain is pure Go structs + behavior; no pgx / HTTP types leaking in
- Repository interfaces live in application ports; implementations in `infrastructure/persistence`
- Naming follows domain terms; see developer skill → `references/clean-code-naming.md`
- Use clear sentinels for errors (e.g. `application.ErrNotFound`)

**Example — domain model:**
```go
type Account struct {
	AccountID   string
	CustomerID  string
	AccountType string
	Currency    string
	Status      string
}
```

**Example — port:**
```go
type AccountRepo interface {
	GetByID(ctx context.Context, accountID string) (*domain.Account, error)
	Add(ctx context.Context, a *domain.Account) (*domain.Account, error)
}
```

### Python (`apps/server-python`)

- Keep FastAPI routers thin; business logic in service / use-case layers
- When sharing a public API contract with Go, keep paths and fields consistent

### TypeScript (admin / portal)

**Package layout:**
```
apps/admin/src/
├── components/
├── pages/
├── shared/
└── ...
```

**Key rules:**
- React + Emotion; reuse `@fintech/ui`, `@fintech/utils`, `@fintech/analytics`
- Redux Toolkit for cross-page state; lodash for collection/object helpers
- Prefer types; naming follows glossary Preferred Terms + clean-code-naming

### React Native (mobile)

- Expo + existing store / socket patterns
- API base via `EXPO_PUBLIC_API_BASE_URL`; do not hardcode environments

## Implementation flow

1. **XP:** align on customer value / Jira AC; small mergeable slices; see [extreme-programming](../skills/developer/references/extreme-programming.md)
2. **BDD:** clarify behavior with Given-When-Then (match Jira AC)
3. **TDD:** Red → Green → Refactor; test names `should expected result when condition`
4. **DDD:** rules in domain; application only orchestrates
5. **Domain naming:** Preferred Terms first, then Clean Code form
6. **UI/UX:** Apple HIG + brokerage-like clarity (see apple-minimal-ux)
7. **Branch / Commit / PR / Jira:** `<type>/<slug>` (Jira key only in commit/PR) + Chain PRs; follow [developer](../skills/developer/SKILL.md) §6 and [Product Owner](../skills/product-owner/SKILL.md)
8. **Run tests / green CI** → then commit per the standards above

## Minimal principles

- Minimize each change (Small Releases)
- YAGNI / Simple Design: no speculative features or abstractions
- No redundant comments
- Keep code lean; keep refactoring after green
