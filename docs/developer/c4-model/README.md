# C4 model — FinPulse

PlantUML C4 diagrams for the current FinPulse monorepo.

## Visual tracks

| Track | Files | Style |
| ----- | ----- | ----- |
| **Structural C4** | C1–C3, Deployment | Official **`C4_blue_new`** theme (wireframe; covers components too) |
| **Domain** | Code domain model | Shared zinc look via [`style-zinc.puml`](./style-zinc.puml) |

Do not mix `C4_blue_new` into domain diagrams (and do not apply `style-zinc.puml` to structural C4). Prefer `C4_blue_new` over bare `!NEW_C4_STYLE=1` so Component diagrams keep the wireframe look.

## Files

| File | Level | Description |
| ---- | ----- | ----------- |
| [C1-Context.puml](./C1-Context.puml) | Context | People and external systems |
| [C2-Container.puml](./C2-Container.puml) | Container | Admin, portal, mobile, Java API, Python analytics, data stores |
| [C3-Component.puml](./C3-Component.puml) | Component | **Single** diagram: Java feature modules + Python analytics + UI apps |
| [C4-Code-Domain-Model.puml](./C4-Code-Domain-Model.puml) | Code | DDD class model: AggregateRoot / Entity / ValueObject + associations (aligned to `com.finpulse.server.*.domain`) |
| [C4-Deployment.puml](./C4-Deployment.puml) | Deployment | **Single** diagram: local/dev and production notes in one view |
| [style-zinc.puml](./style-zinc.puml) | Shared | Zinc styles for Code (and later Dynamics) |

> Component and Deployment are intentionally **not** split into Backend/Frontend or Production sibling files.

### Code / domain model notes

- Stereotypes: **AggregateRoot**, **Entity**, **ValueObject** (see diagram legend).
- Composition (`*--`) = ownership inside an aggregate; open aggregation / arrows = reference by id.
- Typed Id / Money / Symbol VOs express ubiquitous language; Java may still store bare `UUID` until extracted.

### When to open which track

- Boundaries / deploy topology → Structural C4 (`C4_blue_new`).
- Ubiquitous language / aggregates → Code domain model.

## Stack (current)

| Container | Tech | Port |
| --------- | ---- | ---- |
| Admin | React + Vite + Emotion | Vite default |
| Portal | React + Vite + Emotion | Vite default |
| Mobile | React Native + Expo | Expo |
| Java API | Spring Boot (Bazel `//:server`) | **8801** (entry) |
| Python Analytics | FastAPI | **8800** |
| DB | Postgres (Docker) / H2 local prefs | — |

## Render

```bash
# requires plantuml on PATH
plantuml -tpng docs/developer/c4-model/*.puml
```

PNG output is optional; commit `.puml` + this README as source of truth. Online: [PlantUML server](https://www.plantuml.com/plantuml/uml/).

## Related

- [Glossary](../../Glossary.md)
- [QUICKSTART](../QUICKSTART.md)
- [API](../api.md)
