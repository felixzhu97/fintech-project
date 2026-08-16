# Skills index

This directory holds project Skills. The always-on thin rule is [`.cursor/rules/architecture.mdc`](../rules/architecture.mdc).

## Rules vs Skills

| | Rules | Skills |
|--|-------|--------|
| When loaded | alwaysApply | Agent reads on demand by description |
| This repo | Single `architecture.mdc` | Triggered by task below |

## Skills

| Skill | Description |
|-------|-------------|
| [developer](./developer/) | **Primary skill:** XP / DDD / BDD / TDD / glossary / Apple HIG minimal UX / Commit·PR / testing core |
| [business-analysis](./business-analysis/) | Business Analysis: ubiquitous language, domain understanding, business rules, bridge collaboration (not ferry) |
| [market-tech-analysis](./market-tech-analysis/) | Commercial moves + tech analysis → tech–business recommendations (requires real-time search) |
| [product-owner](./product-owner/) | Product Owner: user stories, acceptance criteria, DoD, Jira MCP |

## How to use

- Day-to-day development / tests / commits / UX / XP cadence → `developer`
- Domain analysis / business rules / ubiquitous language / Business Analysis → Agent `business-analyst` (skill: `business-analysis`)
- Commercial moves / competitors / GTM → Agent `market-analyst` (skill: `market-tech-analysis`)
- Frontier research / papers / model trends → Agent `tech-analyst` (skill: `market-tech-analysis`)
- Joint tech–business brief → `market-analyst` + `tech-analyst` + skill `market-tech-analysis`
- User stories / backlog / Jira tickets → `product-owner`
