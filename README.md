# OENEXA AI Engineer — Frontend Platform

> **Component:** `[AI-FE] 💻` OENEXA AI Engineer Frontend  
> **Repository:** `oenexa-ai-engineer-frontend`  
> **Framework:** React 18 & Vite 5 | TypeScript | Tailwind CSS | Monaco Editor  
> **Architecture:** Decoupled Autonomous AI Operating System UI  

---

## 🚀 Overview

The **OENEXA AI Engineer Frontend** is a modern, responsive web application for the OENEXA AI Operating System. It provides real-time collaboration with the 10-Agent Autonomous Ecosystem, 7-layer memory hierarchy telemetry, Model Context Protocol (MCP v1.0) inspection, Monaco code editing, audio transcription, SVG diagram generation, and subscription quota monitoring.

## 🛠️ Technology Stack

- **Framework:** React 18 & Vite 5
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Material-UI 5 (MUI)
- **Editor:** Monaco Code Editor (`@monaco-editor/react`)
- **AI Agent Suite:** 10-Agent Autonomous DAG (Software Engineer, System Architect, DevOps, Security, Research, Product Manager, Data Engineer, QA & Verification, Finance, Customer Support), ReAct Self-Healing Reflection Loop, and Local-First Privacy
- **Protocol & Memory:** MCP v1.0 Client Tools & 7-Layer Memory Hierarchy Telemetry Modal
- **Multimodal:** Real-time microphone audio transcription, speech synthesis, vision OCR, SVG architecture generation
- **Testing:** Vitest & React Testing Library (Zero-Mock Policy, 100% In-Process Real Verification)
- **Architecture:** Polyrepo decoupled frontend communicating with `oenexa-ai-engineer-backend` via reverse proxy (`/api`).

---

## 📁 Project Structure

```text
oenexa-ai-engineer-frontend/
├── src/
│   ├── components/      # UI components, modals, and telemetry views
│   ├── services/        # Decoupled HTTP API client services
│   ├── types/           # Domain and protocol TypeScript definitions
│   ├── App.tsx          # Main application shell and layout
│   ├── App.test.tsx     # 100% zero-mock Vitest test suite
│   ├── main.tsx         # React root initialization
│   └── index.css        # Tailwind design tokens
├── index.html           # HTML5 shell entry
├── package.json         # Project manifests and dependencies
├── vite.config.ts       # Vite configuration with /api reverse proxy
├── tailwind.config.js   # Tailwind style customization
├── Dockerfile           # Multi-stage Node 22 + Nginx Alpine runner
└── nginx.conf           # SPA routing + /api reverse proxy
```

---

## 🛠️ Development & Build Commands

```bash
# Run unit & component tests (Zero-Mock Policy)
npm test

# Start local development server (http://localhost:5173)
npm run dev

# Build production bundle
npm run build
```
