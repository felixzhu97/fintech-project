# C4 model — FinPulse

PlantUML C4 diagrams for the current FinPulse monorepo.

## Files

| File | Level | Description |
| ---- | ----- | ----------- |
| [C1-Context.puml](./C1-Context.puml) | Context | People and external systems |
| [C2-Container.puml](./C2-Container.puml) | Container | Admin, portal, mobile, Java API, Python analytics, data stores |
| [C3-Component.puml](./C3-Component.puml) | Component | **Single** diagram: Java feature modules + Python analytics + UI apps |
| [C4-Code-Domain-Model.puml](./C4-Code-Domain-Model.puml) | Code | Core domain types |
| [C4-Deployment.puml](./C4-Deployment.puml) | Deployment | **Single** diagram: local/dev and production notes in one view |

> Component and Deployment are intentionally **not** split into Backend/Frontend or Production sibling files.

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
