# Project Dependency Reference

**Why-corroboration catalog.** Every row is a `Claim in why` you can paste or adapt into a commit/PR why paragraph, plus an official URL that supports that claim. Prefer specific docs pages over marketing homepages.

When adding a dependency: add a row with claim + deep link — never library name alone.

For lab research / open-source hubs and open models, also use [market-tech-analysis sources](../../market-tech-analysis/references/sources.md) and arXiv abs pages.

## AI / Model reference set

For model-driven changes such as ASR, TTS, LLM, RAG, agent, benchmark, or algorithm updates, do not stop at a single docs link.

When available, use this full reference set in both the commit and PR:

1. One **academic** source, preferably the arXiv abs page or official paper page
2. One **Hugging Face** model, collection, or paper page
3. One official **vendor blog**, release note, or announcement page
4. The upstream **GitHub repository** or official implementation docs when they are the implementation source

Example (claims → URLs):

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Cite the ASR method paper for Qwen3-ASR work | Qwen3-ASR Technical Report | [arXiv:2601.21337](https://arxiv.org/abs/2601.21337) |
| Point reviewers at model cards / collection | Qwen3-ASR HF collection | [Hugging Face collection](https://huggingface.co/collections/Qwen/qwen3-asr) |
| Cite official release notes | Qwen3-ASR blog | [qwen.ai blog](https://qwen.ai/blog?id=qwen3asr) |
| Point at upstream implementation | QwenLM/Qwen3-ASR | [GitHub](https://github.com/QwenLM/Qwen3-ASR) |

Open models (Qwen / DeepSeek / Zhipu GLM / Intern / Llama / Gemma / Mistral): [Open models](../../market-tech-analysis/references/sources.md#open-models). Research hubs: [Open-source & research hubs](../../market-tech-analysis/references/sources.md#open-source--research-hubs-required). Speech & image: [Open-source speech & image](../../market-tech-analysis/references/sources.md#open-source-speech--image).

## Frontend

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Build admin/portal with React 19 | React 19 | [React docs](https://react.dev/) |
| Bundle web apps with Vite | Vite | [Vite guide](https://vitejs.dev/guide/) |
| Style UI with Emotion | Emotion | [Emotion docs](https://emotion.sh/docs/introduction) |
| Manage shared client state with Redux Toolkit | Redux Toolkit | [RTK docs](https://redux-toolkit.js.org/) |
| Use lodash for collection / object helpers | lodash | [lodash docs](https://lodash.com/docs/) |
| Ship mobile with Expo | Expo | [Expo docs](https://docs.expo.dev/) |
| Share React Native UI with Emotion Native | Emotion Native | [Emotion Native](https://emotion.sh/docs/@emotion/native) |
| Type-check with TypeScript | TypeScript | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) |
| Lint TS/JS with project ESLint rules | ESLint | [ESLint docs](https://eslint.org/docs/latest/) |
| Unit-test frontend with Vitest / Jest | Vitest | [Vitest guide](https://vitest.dev/guide/) |
| Install and run monorepo scripts with pnpm | pnpm | [pnpm CLI](https://pnpm.io/cli/install) |
| Track product analytics events | @fintech/analytics | packages/analytics |

## Backend

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Serve gateway / CRUD in Go | Go | [Go documentation](https://go.dev/doc/) |
| Talk to Postgres with pgx | jackc/pgx | [pgx docs](https://github.com/jackc/pgx) |
| Serve analytics / ML APIs with FastAPI | FastAPI | [FastAPI docs](https://fastapi.tiangolo.com/) |
| Store time-series / market data in TimescaleDB | TimescaleDB | [Timescale docs](https://docs.timescale.com/) |
| Cache quotes and sessions in Redis | Redis | [Redis docs](https://redis.io/docs/) |
| Stream events via Kafka when used | Apache Kafka | [Kafka docs](https://kafka.apache.org/documentation/) |
| Persist relational data in PostgreSQL | PostgreSQL | [PostgreSQL docs](https://www.postgresql.org/docs/) |

## Build & Tooling

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Orchestrate apps with pnpm workspaces | pnpm workspaces | [Workspaces](https://pnpm.io/workspaces) |
| Run local stacks with Docker Compose | Docker Compose | [Compose](https://docs.docker.com/compose/) |
| Git hook runner for local quality gates | Husky | [Husky](https://typicode.github.io/husky/) |
| Run linters only on staged files | lint-staged | [lint-staged](https://github.com/lint-staged/lint-staged#readme) |

## Learning References

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Use evolutionary design / refactoring vocabulary | Martin Fowler | [martinfowler.com](https://martinfowler.com/) |
| Cite Clean Code / craftsmanship practices | Robert C. Martin | [cleancoder.com](https://blog.cleancoder.com/) |
| Cite XP / manifesto values for delivery trade-offs | Agile Manifesto | [agilemanifesto.org](https://agilemanifesto.org/) |
| Cite academic papers (abs page) | arXiv | [arxiv.org](https://arxiv.org/) |
| Cite model cards / collections / spaces | Hugging Face | [huggingface.co](https://huggingface.co/) |
| Google eng / SRE / style / Cloud claim rows | Google Ecosystem | [§ Google Ecosystem](#google-ecosystem) below |

## Google Ecosystem

**Full Google ecosystem** (engineering, SRE, AI/research, Android, Cloud) — not Cloud-only. **UI design stays Apple HIG** (do not cite Material Design for product UI in this repo). Pick the row whose claim matches the commit/PR why. Prefer deep links over homepages.

### Engineering practices & style

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Code review / CL quality | Google eng-practices | [Code Review](https://google.github.io/eng-practices/review/) |
| Go formatting / idioms | Effective Go | [Effective Go](https://go.dev/doc/effective_go) |
| TypeScript style (frontend when relevant) | Google TypeScript Style Guide | [tsguide.html](https://google.github.io/styleguide/tsguide.html) |
| JavaScript style (frontend when relevant) | Google JavaScript Style Guide | [jsguide.html](https://google.github.io/styleguide/jsguide.html) |
| Style guide index (other languages) | Google Style Guides | [styleguide index](https://google.github.io/styleguide/) |

### SRE & production

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| SRE practices / reliability culture | sre.google | [Site Reliability Engineering](https://sre.google/) |
| Latency / traffic / errors / saturation (golden signals) | SRE Book | [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) |
| Eliminating toil / automation | SRE Book | [Eliminating Toil](https://sre.google/sre-book/eliminating-toil/) |

### Android / mobile (when relevant)

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Android app architecture / quality | Android Developers | [Guide to app architecture](https://developer.android.com/topic/architecture) |
| AOSP / Android Java conventions | AOSP | [Java code style](https://source.android.com/docs/setup/contribute/code-style) |

### AI & research (complements arXiv / Hugging Face sets)

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Gemini / Google AI developer APIs | ai.google.dev | [Google AI for Developers](https://ai.google.dev/) |
| Google Research publications | research.google | [research.google](https://research.google/) · [Publications](https://research.google/pubs/) |

### Google Cloud (subset of ecosystem)

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Secure / resilient / performant / cost-effective topology | Well-Architected Framework | [Architecture Framework](https://docs.cloud.google.com/architecture/framework) |
| Reliability as a design pillar | Well-Architected Reliability | [Reliability pillar](https://docs.cloud.google.com/architecture/framework/reliability) |
| Performance optimization | Well-Architected Performance | [Performance optimization](https://docs.cloud.google.com/architecture/framework/performance-optimization) |
| Cost / right-sizing | Well-Architected Cost | [Cost optimization](https://docs.cloud.google.com/architecture/framework/cost-optimization) |
| SLOs, ops readiness, reduce toil | Well-Architected Ops | [Operational excellence](https://docs.cloud.google.com/architecture/framework/operational-excellence) |
| Scalable / resilient app patterns (incl. golden signals) | Cloud Architecture Center | [Scalable and resilient apps](https://docs.cloud.google.com/architecture/scalable-and-resilient-apps) |
| Go on Google Cloud | GCP Go | [Go on Google Cloud](https://cloud.google.com/go) |

## Design References

Product UI design for this repo: **Apple HIG only** (not Material).

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Product UI follows Apple design principles | Apple Human Interface Guidelines | [Apple Design](https://developer.apple.com/design/) |
| Guidelines hub for HIG topics | Apple HIG | [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) |
| Style components with Emotion (no second CSS system) | Emotion | [Emotion docs](https://emotion.sh/docs/introduction) |

## UX References

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Clarity and layout deference in product UI | Apple HIG Layout | [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) |
| Typography hierarchy | Apple HIG Typography | [Typography](https://developer.apple.com/design/human-interface-guidelines/typography) |
| Color system and contrast | Apple HIG Color | [Color](https://developer.apple.com/design/human-interface-guidelines/color) |
| Purposeful motion | Apple HIG Motion | [Motion](https://developer.apple.com/design/human-interface-guidelines/motion) |
| Accessibility for inclusive UI | Apple HIG Accessibility | [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) |
| Keep brokerage-like clarity and density | Robinhood product patterns | Existing FinPulse UI + Emotion tokens |

## Jira

| Claim in why | Artifact | Official doc |
|--------------|----------|--------------|
| Track FinPulse work in Jira Cloud | Jira site | [felixzhu.atlassian.net](https://felixzhu.atlassian.net) |
| FinPulse project backlog / SP | Project EXP | [EXP project](https://felixzhu.atlassian.net/projects/EXP) |
