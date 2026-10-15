# OENEXA AI Engineer UI - Development Notes & Architecture Log

> **Component Role:** `[AI-FE] 💻` (Frontend UI)  
> **Paired Backend Service:** `[AI-BE] ⚡` [`oenexa-ai-engineer-backend`](../oenexa-ai-engineer-backend) (`http://localhost:8080/api`)  
> **Frontend Stack:** React 18, Vite 5, TypeScript, Tailwind CSS, Material-UI 5, Monaco Editor  
> **Backend Stack:** Java 25+, Spring Boot 4.1.1, Spring MVC REST  
> **Master Ecosystem Directory:** [`AI_AGENT_DEVELOPER_REPO_MAPPING.md`](../AI_AGENT_DEVELOPER_REPO_MAPPING.md)  

---

## 1. System Design & Frontend Architecture

### 1.1 Directory Structure
```
oenexa-ai-engineer-frontend/
├── src/
│   ├── App.tsx          # Main layout: AppBar, dark mode toggle, backend health monitor, Monaco Editor
│   ├── main.tsx         # React root initialization
│   └── index.css        # Tailwind directives and base styles
├── index.html           # HTML5 host page
├── package.json         # Dependencies and scripts (vite, react, @monaco-editor/react, mui)
├── tailwind.config.js   # Tailwind design tokens and dark mode config
└── vite.config.ts       # Vite configuration with `/api` proxy to backend (localhost:8080)
```

### 1.2 Technology & Integration Standards
1. **Editor Integration:** Monaco Editor imported as default `Editor` from `@monaco-editor/react`. Configured with Java syntax highlighting, dark/light theme syncing.
2. **Backend Communication:** Vite reverse-proxies `/api` requests to backend service on port 8080.
3. **Responsive UI & Themes:** Dark/Light mode synchronization via Tailwind classes and Material-UI theme toggles.

---

## 2. Step-by-Step Development Log

| Step # | File / Component | Change Description                                                           | Result                                                            |
|:-------|:-----------------|:-----------------------------------------------------------------------------|:------------------------------------------------------------------|
| **01** | Repo Separation  | Transferred UI files into isolated repository root                           | Clean decoupled codebase without Maven/Gradle dependencies.       |
| **02** | `App.tsx`        | Fixed Monaco Editor import from named to default import                      | `npm run build` succeeds cleanly with zero bundle errors.         |
| **03** | Configuration    | Configured proxy route `/api` to `http://localhost:8080` in `vite.config.ts` | Allows seamless local full-stack development without CORS issues. |
| **04** | Feature Upgrades | Ported and redesigned full feature suite from platform: Multi-Agent Workflows, AI Assistant Chat, RAG Knowledge Base, and Monaco Editor. | 100% test pass on Vitest, clean production bundle with zero warnings. |
| **05** | Docker Runner Integration | Integrated with backend Docker Runner suite (`Dockerfile.frontend`, `nginx.conf`, `docker-compose.yml`, `docker-runner.sh`/`.ps1`). Verified dual IPv4/IPv6 Nginx listeners, SPA fallback, and `/api/` reverse proxy to Spring Boot backend on port 3000. | All 4 containers achieve 100% healthy status in automated stack. |

---

## 3. Developer & AI Agent Guide

### Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
