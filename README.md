# OENEXA AI Engineer - Frontend

Modern, high-performance web interface for the OENEXA AI Engineer ecosystem.

---

## 🚀 Overview

- **Framework:** React 18 & Vite 5
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Material-UI 5 (MUI)
- **Editor:** Monaco Code Editor (`@monaco-editor/react`)
- **AI Agent Engine:** Google Gemini 4 Argon ReAct Planner, Dynamic 7-Persona DAG, Real-Time Trace Streaming, and Self-Healing Reflection Loop
- **Testing:** Vitest & React Testing Library (Strictly Real Tests, No Mocks, 12/12 BDD Scenarios Passing)
- **Architecture:** Polyrepo decoupled frontend communicating with `oenexa-ai-engineer-backend` via reverse proxy (`/api`).

---

## 📁 Project Structure

```text
oenexa-ai-engineer-frontend/
├── src/
│   ├── components/      # UI components and panels
│   ├── test/            # Vitest integration and unit test suites
│   ├── App.tsx          # Main application shell with editor and health monitor
│   ├── main.tsx         # React root initialization
│   └── index.css        # Tailwind directives and design tokens
├── index.html           # HTML5 shell entry
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration with /api proxy to localhost:8080
├── tailwind.config.js   # Tailwind style customization
├── DEVELOPMENT_NOTES.md # Step-by-step engineering log
└── RULES_AND_STANDARDS.md# Architecture and quality standards
```

---

## 🛠️ Development & Build Commands

```bash
# Run unit & component tests
npm test

# Start local development server (http://localhost:5173)
npm run dev

# Build production bundle
npm run build
```

## 🐳 Running with Docker Stack (Frontend + Backend)

The frontend can be launched as part of the full containerized ecosystem from the backend repo:

```bash
cd ../oenexa-ai-engineer-backend

# Launch full stack (Frontend on http://localhost:3000, Backend on http://localhost:8080)
./docker-runner.sh up

# Or on Windows PowerShell:
.\docker-runner.ps1 up
```

