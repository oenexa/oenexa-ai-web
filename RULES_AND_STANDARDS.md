# OENEXA Developer & AI Agent Constitution: Rules, Standards & Architecture Log

> **MANDATE:** Strict compliance is required for all AI agents and software engineers contributing to `oenexa-ai-web`.  
> **Component:** `[AI-WEB] 💻` OENEXA AI Web Frontend  
> **Repository:** `C:\workspace\oenexarepo\oenexa-ai-web`  
> **Paired Backend:** `[AI-CORE] ⚡` [`oenexa-ai-core`](../oenexa-ai-core) (`http://localhost:8080/api`)  
> **Framework:** React 18 | Vite 5 | TypeScript | Tailwind CSS | Material-UI 5 | Monaco Editor | Vitest  

---

## 1. Core Engineering Rules & Invariants

### 1.0 Inviolable AI Agent & Developer Law: Symbolic Step-by-Step Ledger
- **Rule:** Every UI change, component addition, or architectural refactor MUST be recorded in `DEVELOPMENT_NOTES.md` using standard symbolic notation (`[SYMBOL] TAG | TARGET`).
- **Approved Symbolic Tags:**
  - `[AI-WEB] 💻` Frontend UI Application Core
  - `[AGENT] 🤖` 10-Agent Autonomous DAG & Thought Trace Views
  - `[MEMORY] 🧠` 7-Layer Memory Hierarchy Telemetry Modal
  - `[MCP] 🔌` Model Context Protocol (MCP v1.0) JSON-RPC Explorer
  - `[BILLING] 💳` Subscription Tiers & Token Consumption Gauges
  - `[VOICE] 🎙️` Real-Time Microphone Transcription & Diarization
  - `[MEDIA] 🎨` Diagram OCR, Bounding Box & SVG Generator
  - `[EDITOR] 📝` Monaco Editor Integration & Artifact Extraction
  - `[REPO] 📦` Polyrepo Standardization & Version Control

### 1.1 Strictly NO Mock Tests (Real DOM Testing)
- **Rule:** Do NOT use shallow rendering or dummy stubbing where real component mounting applies.
- **Why:** Real user flows guarantee that accessibility labels, dark mode class mutations, and event handlers work as expected.
- **How:** Use Vitest and `@testing-library/react` with real user events wrapped in `act(...)`.

### 1.2 Single Responsibility Principle (SRP < 400 Lines Limit)
- **Rule:** Every React component, custom hook, or utility module must remain strictly under **400 lines** of clean code.
- **Why:** Large monolithic components create re-render bottlenecks, complicate state management, and make unit testing fragile.
- **How:** Extract sub-components (dialogs, cards, toolbars) and encapsulate state logic in reusable hooks.

### 1.3 Immutability & Clean State Flow
- **Rule:** Never mutate state objects directly. Use functional React state setters and strict TypeScript interfaces.
- **Why:** Prevents subtle re-rendering bugs and race conditions.

### 1.4 Zero Deprecations & Zero Compiler Warnings
- **Rule:** Production bundles and test suites must compile without deprecation notices, missing export warnings, or unused variables.
- **How:** Enforced via `npm test` and `npm run build`.

### 1.5 Quality Gate
- **Rule:** All UI views and components must have accompanying Vitest tests.
- **How:** Enforced via `npm test` prior to production commits.

---

## 2. Technical Stack & Standards Matrix

| Capability                | Frontend Standard (`oenexa-ai-web`)                           |
|:--------------------------|:--------------------------------------------------------------|
| **Framework**             | **React 18** (Vite 5)                                         |
| **Language**              | **TypeScript** (strict mode)                                  |
| **Styling**               | **Tailwind CSS & Material-UI 5**                              |
| **Editor**                | **Monaco Code Editor** (`@monaco-editor/react`)               |
| **AI Layer UI**           | **10-Agent Autonomous DAG**, Real-time Thought Terminal       |
| **Memory UI**             | **7-Layer Memory Hierarchy Telemetry Modal** (L1-L7 gauges)   |
| **Protocol UI**           | **Model Context Protocol (MCP v1.0)** JSON-RPC 2.0 Explorer   |
| **Testing Engine**        | **Vitest 1.6.0 + React Testing Library (Zero Mocks)**         |
| **Quality Gate**          | **0 Warnings, 100% Tests passing, SRP < 400 lines**           |

---

## 3. Verified Verification Logs

### Frontend Vitest & Vite Build Verification
- **Command:** `npm test && npm run build`
- **Engine:** Vitest 1.6.0 with `jsdom`
- **Result:**
  - `vitest run`: **100% passing** (10/10 tests passed in 3.18s).
  - `vite build`: **Built cleanly in 8.04s** (`dist/` ready for production with zero bundle errors).
