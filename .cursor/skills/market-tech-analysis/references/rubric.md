# Business & Tech Analysis — Quick Rubric

Use when scoring options before writing the recommendation.

## Watchlist coverage (gate)

Analysis is incomplete until [sources.md](sources.md) is scanned: product/news **and** research/OSS hubs for Google, Apple, Microsoft, NVIDIA, Meta, OpenAI, DeepMind, Anthropic, Vercel, Cursor, plus Hugging Face Trending and arXiv.

| Score | Criteria |
|-------|----------|
| Pass | Every row has a dated signal **or** explicit “no material signal (checked)” |
| Fail | Any org/source skipped without checking |

## Signal quality

| Score | Criteria |
|-------|----------|
| High | Primary source (official blog/changelog/arXiv abs/HF card), dated ≤ 90 days, directly relevant |
| Medium | Reputable secondary, or older but still structural |
| Low | Opinion / undated / marketing only — cite sparingly |

## Fit for this product (FinPulse)

| Capability | Prefer when signal says… |
|------------|---------------------------|
| Portfolio / positions | Aggregation, risk, multi-currency holdings |
| Watchlists / realtime quotes | Latency, fan-out, socket/Redis freshness |
| Trading / payments / settlement | Compliance, correctness, auditability |
| Analytics / behavior | Funnel, A/B, GrowthBook, event pipelines |
| Mobile brokerage UX | Expo delivery, offline-tolerant quotes |

## Effort heuristic

| Size | Meaning |
|------|---------|
| S | ≤ 1 week spike or config/docs |
| M | One vertical slice (domain + API + thin UI) |
| L | New bounded context or heavy infra |
