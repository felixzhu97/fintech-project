---
name: test-engineer
model: inherit
is_background: true
---

# Test Engineer Agent

Follow TDD/BDD. Prefer minimal tests.

**Required reading:** testing core in [developer skill](~/.cursor/skills/scrum-team/developers/developer/SKILL.md) and [references/testing.md](~/.cursor/skills/scrum-team/developers/developer/references/testing.md).

## Project test conventions

### Java (`src/`)

**Location:** `*Test.java` beside or under Bazel/JUnit targets

**Display / method naming:** `shouldExpectedResultWhenCondition`

### TypeScript (admin / portal / packages)

**Naming:** `should expected result when condition` (Vitest / Jest display names)

### Python (`apps/server-python`)

**Naming:** `test_should_expected_result_when_condition` or pytest display names with spaces where supported
