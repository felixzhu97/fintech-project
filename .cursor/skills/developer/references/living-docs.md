# Living Docs Sync

Code that changes architecture, domain language, or product capabilities must update living docs in the **same PR**. Pure test/style/chore with no product or architecture meaning does not.

## Documents

| Document | Path | Owns |
|----------|------|------|
| Architecture / C4 | [docs/en/rd/c4/](../../../../docs/en/rd/c4/) · [docs/zh/rd/c4/](../../../../docs/zh/rd/c4/) | Context / containers / components (`.puml` is source of truth) |
| Domain / data | [docs/en/rd/domain/](../../../../docs/en/rd/domain/) · [docs/zh/rd/domain/](../../../../docs/zh/rd/domain/) | Preferred Terms, entities, ER |
| Product docs | [docs/en/product/](../../../../docs/en/product/) · [docs/zh/product/](../../../../docs/zh/product/) | Journeys, capability status |
| API notes | [docs/en/rd/api/](../../../../docs/en/rd/api/) · [docs/zh/rd/api/](../../../../docs/zh/rd/api/) | Public API prefixes / contracts |

## Trigger matrix

If **any** row matches, update the listed doc(s) in the same PR. If none match, mark N/A on the checklist.

| Change | Update |
|--------|--------|
| New or renamed Preferred Term, business concept, frontend route, API prefix | Domain docs |
| New subdomain / module, container boundary, external system, or cross-cutting platform service | C4 context/containers |
| Backend layering or major package/component structure | C4 components (Go / Python) |
| Frontend routes, shells, shared app structure | C4 components (admin / portal / mobile) |
| Local or production deploy topology, ports, hosting | C4 + runbooks / README |
| New user-visible capability, nav/module add/remove, delivery status change | Product docs |
| Pure unit/integration tests, formatting, dependency bump with no product/architecture semantics | None (N/A) |

### C4 layer cheat sheet

| File area | Update when |
|-----------|-------------|
| `*-context.puml` | New external actor/system or system purpose change |
| `*-containers.puml` | New app container / subdomain / major data store |
| `*-components.puml` | New module packages or layer wiring |
| Deploy / README ports | Port, host, or runtime topology change |

`.puml` first. Regenerate diagrams when PlantUML is available; otherwise note in the PR that rendered assets are stale.

## Workflow

1. Implement the code change.
2. Run the trigger matrix; update every matched doc.
3. Include doc updates in the same PR (same commit or a follow-up docs commit on the same branch).
4. Checklist: Domain / C4 / Product — done or N/A per matrix.

## Example — new Quotes cache path

Adding Redis quote cache + `/api/v1/quotes`:

1. **Domain** — Preferred Term for Quote / Watchlist if new.
2. **C4** — containers/components for Go gateway + Redis.
3. **API** — document the quotes route contract.
4. **Product** — note investor-visible watchlist freshness if user-facing.
