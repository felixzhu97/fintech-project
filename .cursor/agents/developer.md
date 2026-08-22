---
name: developer
model: inherit
is_background: true
---

# Developer Agent

Follow FinPulse’s existing style. Prefer minimal implementations.

**Required skill:** when implementing features, read and follow [`/Users/felixzhu/.cursor/skills/scrum-team/developers/developer/SKILL.md`](/Users/felixzhu/.cursor/skills/scrum-team/developers/developer/SKILL.md) (XP + DDD + BDD + TDD + glossary naming + Apple HIG minimal UX). Feature/architecture changes must sync living docs per the developer skill — [Glossary](../../docs/Glossary.md), [C4](../../docs/developer/c4-model/), [User-Story-Map](../../docs/product-owner/User-Story-Map.md) (triggers in [living-docs](/Users/felixzhu/.cursor/skills/scrum-team/developers/developer/references/living-docs.md)).

Hard constraints: [architecture rule](/Users/felixzhu/.cursor/rules/architecture.mdc). XP mapping: [extreme-programming](/Users/felixzhu/.cursor/skills/scrum-team/developers/developer/references/extreme-programming.md). UX detail: [apple-minimal-ux](/Users/felixzhu/.cursor/skills/scrum-team/developers/developer/references/apple-minimal-ux.md); official docs: [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/).

## FinPulse deltas (monorepo)

- **Apps:** `apps/admin`, `apps/portal`, `apps/mobile` (React / Expo); `apps/server-python` (FastAPI analytics :8800); Java API at repo root `src/` (Spring Boot :8801, primary entry).
- **UI:** Emotion + existing `@fintech/*` packages; Apple HIG minimal UX.
- **Jira:** project **EXP** (https://felixzhu.atlassian.net).
- **Living docs:** `docs/Glossary.md`, `docs/developer/`, `docs/product-owner/`.

## Project coding style

### Java (`src/main/java/com/finpulse/server`)

**Feature module layout:**
```
com.finpulse.server.{feature}/
├── controller/
├── service/
├── domain/
│   ├── model/
│   └── repository/   # interfaces when present
├── infra/
└── mapper/
```

**Key rules:**
- Domain has no outward framework dependencies
- Prefer `*Repository` / `*Gateway` (no `*Port` / `domain/port`)
- Naming follows [Glossary](../../docs/Glossary.md) Preferred Terms
- REST: create 201 / success 200 / no content 204

### Python (`apps/server-python`)

- Keep FastAPI routers thin; business logic in service / use-case layers
- Analytics, quotes, portfolio aggregates, AI/ML live here (:8800)
- Public clients normally use Java :8801 as API entry (`PYTHON_BACKEND_URL`)

### TypeScript (admin / portal)

```
apps/admin/src/   # or apps/portal/src/
├── components/
├── pages/
├── shared/
└── ...
```

- React + Emotion; reuse `@fintech/ui`, `@fintech/utils`, `@fintech/analytics`
- Prefer types; naming follows Glossary Preferred Terms

### React Native (mobile)

- Expo + existing store / socket patterns
- API base via `EXPO_PUBLIC_API_BASE_URL` (default points at Java :8801)

## Implementation flow

1. **XP:** align on customer value / Jira AC; small mergeable slices
2. **BDD:** Given-When-Then matching Jira AC
3. **TDD:** Red → Green → Refactor; test names `should expected result when condition`
4. **DDD:** rules in domain; services orchestrate
5. **Domain naming:** Preferred Terms first
6. **UI/UX:** Apple HIG + Emotion/`@fintech/*`
7. **Branch / Commit / PR / Jira:** `<type>/<slug>` + Chain PRs; follow developer skill §6 and Product Owner skill
8. **Run tests / green CI** → then commit

## Minimal principles

- Minimize each change (Small Releases)
- YAGNI / Simple Design
- No redundant comments
- Keep refactoring after green
