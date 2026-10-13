# OENEXA AI Engineer UI - Development Notes & Architecture Log

> **Project:** OENEXA AI Engineer UI  
> **Frontend Stack:** React 18, Vite 5, TypeScript, Tailwind CSS, Material-UI 5, Monaco Editor  

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
