# OENEXA AI Engineer UI – Development Process, Prompts & Operating Manual

> **Scope:** Frontend Development Process, UI AI Agent Prompts, Component Architecture, and Quality Standards for `oenexa-ai-web`.  
> **Target Runtime:** React 18 | Vite 5 | TypeScript | Tailwind CSS | Material-UI 5 | Monaco Editor  

---

## 1. Frontend Development Process Workflow

```
[1. Wireframe & User Story] ──> [2. Component & State Design] ──> [3. Implementation]
                                                                        │
[6. Production Build Verification] <── [5. Theme & A11y Audit]  <── [4. API Integration]
```

### Stage 1: UI Requirements & Wireframe Breakdown
- Establish interactive goals: code editing, AI response streaming, telemetry viewing, theme switching.
- Identify reusable component primitives.

### Stage 2: Component & State Architecture
- Structure components under `src/components/`, pages under `src/pages/`, and shared state/context under `src/context/`.
- Ensure clean decoupling between visual presentation and API communication hooks.

### Stage 3: Implementation (React + TypeScript)
- Use functional components with strict TypeScript types and interfaces.
- Utilize Tailwind utility classes for layout, typography, and dark mode transitions.
- Use Material-UI for complex interactive controls (AppBar, Dialogs, Menus).

### Stage 4: API Integration & Backend Synchronization
- Connect to backend services using standard `fetch` or Axios through the `/api/*` reverse proxy configured in `vite.config.ts`.
- Provide graceful loading indicators (`CircularProgress`), error toasts, and offline fallbacks.

### Stage 5: Accessibility (a11y) & Theme Testing
- Verify contrast ratios across light and dark modes.
- Ensure proper `aria-label` attributes on icon buttons and keyboard navigable editor controls.

### Stage 6: Build Verification Gate
- Run:
  ```bash
  npm run build
  ```
- Ensure zero bundle errors and verify bundle chunk sizes.

---

## 2. Frontend AI Agent Prompts Library

### 2.1 UI Component Engineer Prompt
```text
System: You are the OENEXA Frontend Component Engineer.
Role: Build accessible, responsive React 18 components in TypeScript using Tailwind CSS and Material-UI.
Guidelines:
1. Always write strict TypeScript types for props, state, and API models.
2. Support dark/light mode seamlessly via Tailwind dark: variants and MUI themes.
3. Keep components modular, composable, and clean.
```

### 2.2 Monaco Editor & Code Assist Specialist Prompt
```text
System: You are the OENEXA Code Editor Specialist.
Role: Manage Monaco Editor integration, code decorations, inline diffs, and language support.
Guidelines:
1. Import Monaco Editor cleanly using default import `Editor from '@monaco-editor/react'`.
2. Configure appropriate language syntax (Java, TypeScript, Python, SQL) and synchronized themes ('vs-dark' and 'light').
3. Handle resize and viewport events smoothly without layout thrashing.
```

---

## 3. Developer & AI Operating Rules

1. **Clean Dependencies:** Avoid unnecessary heavy packages; leverage Vite's fast HMR and tree-shaking.
2. **Build Gate:** Always confirm `npm run build` succeeds before committing code changes.
3. **Change Logging:** Document each component milestone in `DEVELOPMENT_NOTES.md`.
