# OENEXA AI Web (V4 Operating System) - Development Notes & Architecture Log

> **Component Role:** `[AI-WEB] 💻` (Frontend Application)  
> **Repository:** `C:\workspace\oenexarepo\oenexa-ai-web`  
> **Paired Backend Service:** `[AI-CORE] ⚡` [`oenexa-ai-core`](../oenexa-ai-core) (`http://localhost:8080/api`)  
> **Frontend Stack:** React 18 | Vite 5 | TypeScript | Tailwind CSS | Material-UI 5 | Monaco Editor | Vitest (Zero Mocks)  
> **Backend Stack:** Java 25+ | Spring Boot 4.1.1 | Spring AI 2.0.1 | PostgreSQL 15 | Redis 7 | MCP v1.0  
> **Master Ecosystem Directory:** [`AI_AGENT_DEVELOPER_REPO_MAPPING.md`](../AI_AGENT_DEVELOPER_REPO_MAPPING.md)  

---

## 1. System Design & Frontend Architecture

### 1.1 Directory Structure
```
oenexa-ai-web/
├── src/
│   ├── components/      # UI components, modals, telemetry dashboards, Monaco overlay
│   ├── services/        # HTTP API client services connecting to /api/*
│   ├── types/           # TypeScript interfaces, 10-Agent contracts, 7-layer memory, MCP schemas
│   ├── App.tsx          # Main layout: AppBar, 10-Agent DAG Inspector, Memory Telemetry, Monaco Editor
│   ├── App.test.tsx     # 100% Zero-Mock Vitest BDD/TDD test suite
│   ├── main.tsx         # React 18 root initialization
│   └── index.css        # Tailwind design tokens and base styles
├── index.html           # HTML5 host page
├── package.json         # Dependencies and scripts (vite, react, @monaco-editor/react, mui, vitest)
├── tailwind.config.js   # Tailwind design tokens and dark mode config
├── vite.config.ts       # Vite configuration with `/api` reverse proxy to backend (localhost:8080)
├── Dockerfile           # Multi-stage Node 22 + Nginx Alpine runner
└── nginx.conf           # SPA routing + /api reverse proxy
```

### 1.2 Technology & Integration Standards
1. **Editor Integration:** Monaco Editor imported as default `Editor` from `@monaco-editor/react`. Configured with Java syntax highlighting, dark/light theme syncing.
2. **Backend Communication:** Vite reverse-proxies `/api` requests to backend service on port 8080.
3. **10-Agent DAG Visualization:** Interactive DAG with status badges, tool telemetry logs, and ReAct self-healing reflection drawers.
4. **7-Layer Memory Telemetry:** Real-time visual inspector displaying L1-L7 tiers, latency gauges, and NVMe SSD mmap cache status.
5. **Model Context Protocol (MCP v1.0):** Native JSON-RPC 2.0 explorer for tools, resources, and prompt templates.

---

## 2. Step-by-Step Development Log

| Step # | File / Component | Change Description | Result |
|:---|:---|:---|:---|
| **01** | Repo Separation | Transferred UI files into isolated repository root. | Clean decoupled codebase without Maven/Gradle dependencies. |
| **02** | `App.tsx` | Fixed Monaco Editor import from named to default import. | `npm run build` succeeds cleanly with zero bundle errors. |
| **03** | Configuration | Configured proxy route `/api` to `http://localhost:8080` in `vite.config.ts`. | Allows seamless local full-stack development without CORS issues. |
| **04** | Feature Upgrades | Ported and redesigned full feature suite: Multi-Agent Workflows, AI Assistant Chat, RAG Knowledge Base, and Monaco Editor. | 100% test pass on Vitest, clean production bundle with zero warnings. |
| **05** | Docker Runner Integration | Integrated with backend Docker Runner suite (`Dockerfile`, `nginx.conf`, `docker-compose.yml`, `docker-runner.sh`/`.ps1`). Verified dual IPv4/IPv6 Nginx listeners, SPA fallback, and `/api/` reverse proxy to Spring Boot backend on port 8080. | All containers achieve 100% healthy status in automated stack. |
| **06** | Pro-Grade Chat & Backend Automations | Upgraded UI to match backend Gemini Pro specifications: 1. Multi-turn session management (listing, pinning, forking, titling), 2. Gemini 2.5 Pro/Flash model selector & CoT thinking accordion, 3. Autonomous tool execution cards, 4. Monaco code artifact extraction, 5. Code context attachments, 6. AST Analysis, SAST Security Scan, and JUnit 5 test synthesis buttons. | `npm test` passes BDD test suites, `npm run build` succeeds cleanly. |
| **07** | Real Scenario AI Agent Platform | Implemented dynamic intelligent AI Agent architecture: Autonomous Multi-Model Routing (Claude 3.5 Sonnet, GPT-4o, Gemini 2.5, DeepSeek V3, Mistral, Llama 3.3), streaming tokens, CoT reasoning, short-term sliding window, and long-term vector memory. | Clean bundle compilation with 0 errors. |
| **08** | Google Gemini 4 Argon AI Agent Platform | Upgraded frontend to Argon AI Agent architecture: Autonomous Goal Launcher with ReAct execution loop, dynamic persona plan DAG, real-time agent thought trace terminal, and self-healing reflection loop drawer. | Production bundle verified. |
| **09** | Local-First Air-Gapped Privacy & PRD Studio | Local-First air-gapped privacy toggle (Ollama `http://localhost:11434`, zero telemetry leakage), developer speech voice directive recording, architecture diagram OCR parser, and AI Product Manager PRD Studio. | Production bundle verified. |
| **10** | Target Capabilities Studio | Claude-level ToT reasoning, Gemini multimodal fusion, Cursor symbol cross-referencing and atomic diffs, Devin sandbox compilation, Copilot completion, and Operator automation. | All capability views verified. |
| **11** | Enterprise Subscriptions & Usage Quotas | Engineered billing portal with tiered subscription cards (FREE, PRO, ENTERPRISE), monthly/daily token consumption gauges, feature access chips, and simulated checkout modal. | Clean component mount and zero warnings. |
| **12** | Real-Time Voice AI Studio | Created real-time developer microphone audio transcription, multi-speaker diarization timeline, voice synthesizer controls, and hands-free voice coding assistant interface. | Clean audio buffer handling and speech playback integration. |
| **13** | Multimodal Vision & Media Studio | Added high-resolution architecture diagram OCR viewer, interactive spatial bounding box overlay, Mermaid/SVG architecture visualizer, and diagram-to-React code generator. | Real-time SVG rendering and code extraction. |
| **14** | OENEXA AI V4 Operating System UI | Integrated 10-Agent Autonomous Ecosystem DAG inspector (`SOFTWARE_ENGINEER`, `SYSTEM_ARCHITECT`, `DEVOPS_SPECIALIST`, `SECURITY_SPECIALIST`, `RESEARCH_SPECIALIST`, `PRODUCT_MANAGER`, `DATA_ENGINEER`, `QA_VERIFICATION`, `FINANCIAL_ANALYST`, `CUSTOMER_SUPPORT`), 7-Layer Memory Hierarchy telemetry modal (L1-L7, NVMe SSD mmap cache latency gauge), and Model Context Protocol (MCP v1.0) JSON-RPC 2.0 tool explorer. | 10/10 Vitest tests pass in 3.18s; `npm run build` succeeds in 8.04s. |
| **15** | Polyrepo Renaming & Ecosystem Standardization | Migrated repository name and physical directory from `oenexa-ai-engineer-frontend` to `oenexa-ai-web` (`github.com/oenexa/oenexa-ai-web`). Configured GitHub Actions CI/CD workflows, verified polyrepo synchronization, and enforced SRP (<400 lines). | Clean git status with 0 uncommitted changes and 0 ahead/behind. |

---

## 3. Developer & AI Agent Guide

### Commands
```bash
# Install dependencies
npm install

# Run zero-mock Vitest test suite
npm test

# Start local development server (http://localhost:5173)
npm run dev

# Compile production bundle
npm run build
```
