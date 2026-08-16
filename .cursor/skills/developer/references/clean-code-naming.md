# Clean Code — Naming & Minimal Design

> Based on Robert C. Martin's *Clean Code*, plus FinPulse **Ubiquitous Language**.

## Glossary first (required)

Canonical source: [docs/en/rd/domain/](../../../../docs/en/rd/domain/) · [docs/zh/rd/domain/](../../../../docs/zh/rd/domain/)

| Rule | Detail |
|------|--------|
| Preferred Term | English Preferred Term is the only name for code, API, tests, commits |
| One concept, one word | Do not introduce synonyms (`Holding` vs `Position`) |
| Glossary before code | New domain concept → add/update domain docs in the same change |
| Align surfaces | Same term in BDD scenarios, domain methods, variables, DTOs, UI models |

```go
// ❌ BAD — technical / synonym, not glossary
holding := store.Get(id)
holding.Closed = true

// ✅ GOOD — Preferred Terms (Account / Position)
account, err := repository.GetByID(ctx, accountID)
if err != nil { return err }
if err := account.Close(); err != nil { return err }
```

```typescript
// ❌ BAD
const items = rows.filter(r => r.flag);

// ✅ GOOD — domain nouns from glossary
const openPositions = positions.filter(position => position.quantity > 0);
```

If domain docs lack a term you need: update the docs (developer ownership: implement with Preferred Terms; coordinate with business-analyst for consistency), then code.

## Naming form (Clean Code)

### Principles

- **Domain noun/verb first**, then Clean Code style
- **Avoid vague names**: No `data`, `list`, `temp`, `info`, `obj`, `mgr`
- **State the purpose**: Name reveals intent without a comment
- **One concept per word**: Choose `get` OR `fetch`, not both in the same codebase area
- **Functions are verbs** using domain vocabulary: `Close`, `AddPosition` (not `updateStatusFlag`)
- **Classes/types are nouns** from the glossary: `Account`, `Position`, `Watchlist`

### Variables

```go
// ❌ BAD
var d int
tmp := ""
list := []string{}

// ✅ GOOD — domain + intent
accountID := "…"
pendingOrders := []domain.Order{}
```

```typescript
// ❌ BAD
const x = items.filter(i => i.flag);
const result = process(data);

// ✅ GOOD
const activeWatchlists = watchlists.filter(watchlist => watchlist.isActive);
const closedAccounts = closeInactiveAccounts(accounts);
```

### Boolean naming

```go
isActive := true
hasPermission := false
canProceed := true
shouldRetry := false
```

Avoid double negatives (`isNotDisabled`). Prefer positive forms (`isEnabled`).

### Methods

```go
// ❌ BAD — vague / flag-driven
func HandleRequest() {}
func ProcessOrder(order Order, validate, sendEmail bool) {}

// ✅ GOOD — intent + single responsibility
func ValidateOrder(order Order) error {}
func SaveOrder(ctx context.Context, order Order) error {}
func SendOrderConfirmation(order Order) error {}
```

```typescript
// ❌ BAD
function handleClick() { /* ... */ }
function createReport(includeCharts: boolean, includeSummary: boolean) { /* ... */ }

// ✅ GOOD
function onSubmitButtonClick() { /* ... */ }
function createDetailedReport() { /* ... */ }
function createSummaryReport() { /* ... */ }
```

## Functions (minimal)

1. **Small** — Prefer a handful of lines; extract when nesting grows
2. **Do One Thing** — One level of abstraction per function
3. **Few arguments** — 0 ideal, 1–2 OK; 3+ → introduce a request type / struct
4. **No flag arguments** — Split into explicit methods instead of `boolean` switches
5. **No surprising side effects** — Name matches what the function actually does

## Errors

- Fail fast at the start of the method
- Return/wrap specific errors with context (ids, amounts, state)
- Never empty `catch` / ignored `err` without policy

## Comments

- Prefer clear names over comments that restate the code
- Comments explain **why**, not **what**
- Delete commented-out code (use git)

## Quick anti-patterns

| Smell | Fix |
|-------|-----|
| `data` / `info` / `manager` | Name the domain concept |
| Method > ~20 lines | Extract private helpers |
| Boolean parameter | Two named methods |
| Anemic entity + logic in use case | Move rule into domain method |
| `Utils` dumping ground | Place behavior next to the type that owns it |
