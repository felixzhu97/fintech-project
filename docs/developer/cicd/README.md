# CI/CD

GitHub Actions workflows for FinPulse.

## Workflows

| File | Purpose |
| ---- | ------- |
| [`.github/workflows/ci.yml`](../../../.github/workflows/ci.yml) | PR/push gate: pnpm install, package build, typecheck, lint; Bazel Java controller tests + `//:server` build |
| [`.github/workflows/coverage.yml`](../../../.github/workflows/coverage.yml) | Coverage reporting |

## Diagram

See [cicd-workflow.puml](./cicd-workflow.puml) for the high-level CI flow.

## Local parity

```bash
pnpm install --frozen-lockfile
pnpm --filter './packages/**' build
pnpm test:type
pnpm lint
bazel test //:AuthControllerTest //:CustomerAccountControllerTest # … see ci.yml
bazel build //:server
```

## Render PlantUML

```bash
plantuml -tpng docs/developer/cicd/*.puml
```
