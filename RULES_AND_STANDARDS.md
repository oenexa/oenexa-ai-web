# OENEXA Developer & AI Agent Constitution: Rules, Standards & Architecture Log

> **MANDATE:** Strict compliance is required for all AI agents and software engineers contributing to `oenexa-ai-engineer-frontend`.

---

## 1. Core Engineering Rules & Invariants

### 1.1 Strictly NO Mock Tests (Real DOM Testing)
- **Rule:** Do NOT use shallow rendering or dummy stubbing where real component mounting applies.
- **Why:** Real user flows guarantee that accessibility labels, dark mode class mutations, and event handlers work as expected.
- **How:** Use Vitest and `@testing-library/react` with real user events wrapped in `act(...)`.

### 1.2 BDD & TDD Testing Standards
- **Rule:** Frontend test suites must be written in Behavior-Driven Development (BDD) style with explicit `Feature`, `Scenario`, `Given`, `When`, `Then` blocks.
- **Why:** Bridges UX and accessibility requirements directly with automated DOM verification.
- **How:** Implemented via Vitest suites (`App.test.tsx`) asserting on accessible roles, labels, and real DOM states.

### 1.2 Immutability & Clean State Flow
- **Rule:** Never mutate state objects directly. Use functional React state setters and strict TypeScript interfaces.
- **Why:** Prevents subtle re-rendering bugs and race conditions.

### 1.3 Zero Deprecations & Zero Warnings
- **Rule:** Bundles and test suites must run without deprecation notices or missing export warnings.
- **How:** Enforced via `npm test` and `npm run build`.

### 1.4 100% Quality Gate
- **Rule:** All UI views and components must have accompanying Vitest tests.
- **How:** Enforced via `npm test` prior to production commits.

### 1.5 Architecture Rationale Report
- **Rule:** Every component, hook, and utility must document:
  1. **Why:** User experience or architectural goal.
  2. **How:** Mechanism, styling tokens, and event flow.

---

## 2. Verified Test Execution Log

- **Command:** `npm test`
- **Engine:** Vitest 1.6.0 with `jsdom`
- **Result:** `Test Files 1 passed (1), Tests 2 passed (2)` (Zero warnings).
- **Production Build:** `npm run build` $\rightarrow$ `built in 2.0s` (`dist/`).
