# DDD Rich Model (FinPulse)

Aligned with [architecture rule](../../../rules/architecture.mdc).

## Rich vs anemic

| Rich (preferred) | Anemic (avoid) |
|------------------|----------------|
| Entity methods enforce invariants | Entity is only fields + getters/setters |
| Use case loads aggregate, calls domain API, saves | Use case contains all if/else business rules |
| VO validates on construction | Primitives passed everywhere (`string accountID`) |

## Patterns

### Entity / Aggregate (Go)

```go
type AccountStatus string

const (
	AccountStatusOpen   AccountStatus = "OPEN"
	AccountStatusClosed AccountStatus = "CLOSED"
)

type Account struct {
	AccountID   string
	CustomerID  string
	Status      AccountStatus
}

func NewAccount(accountID, customerID string) *Account {
	return &Account{
		AccountID:  accountID,
		CustomerID: customerID,
		Status:     AccountStatusOpen,
	}
}

func (a *Account) Close() error {
	if a.Status == AccountStatusClosed {
		return fmt.Errorf("account already closed: %s", a.AccountID)
	}
	a.Status = AccountStatusClosed
	return nil
}
```

### Repository

```go
// application ports
type AccountRepo interface {
	GetByID(ctx context.Context, accountID string) (*domain.Account, error)
	Save(ctx context.Context, a *domain.Account) (*domain.Account, error)
}
```

Implementation lives in `infrastructure/persistence/` only.

### Use Case (orchestration)

```go
func (s *AccountService) CloseAccount(ctx context.Context, accountID string) error {
	account, err := s.repo.GetByID(ctx, accountID)
	if err != nil {
		return err
	}
	if err := account.Close(); err != nil {
		return err
	}
	_, err = s.repo.Save(ctx, account)
	return err
}
```

Business rules like “cannot close twice” stay on `Account`, not in the use case.

## Ubiquitous language

Source of truth: domain docs under [docs/en/rd/domain/](../../../../docs/en/rd/domain/) / [docs/zh/rd/domain/](../../../../docs/zh/rd/domain/).

- Name **types, variables, and methods** with the glossary **Preferred Term (English)** for that bounded context
- Example: `Close()`, not `updateStatusFlag` — only if `Close` is the preferred verb
- Keep the **same** terms in BDD scenarios, unit tests, domain code, REST/DTO fields, and commits
- New concept workflow: domain doc entry → domain model → API → PR references the doc change
- Ownership: developer implements Preferred Terms; business-analyst guards consistency
