# OENEXA AI Engineer UI - Development Notes & Architecture Log

> **Component Role:** `[AI-WEB] 💻` (Frontend UI)  
> **Paired Backend Service:** `[AI-CORE] ⚡` [`oenexa-ai-core`](../oenexa-ai-core) (`http://localhost:8080/api`)  
> **Frontend Stack:** React 18, Vite 5, TypeScript, Tailwind CSS, Material-UI 5, Monaco Editor  
> **Backend Stack:** Java 25+, Spring Boot 4.1.1, Spring MVC REST  
> **Master Ecosystem Directory:** [`AI_AGENT_DEVELOPER_REPO_MAPPING.md`](../AI_AGENT_DEVELOPER_REPO_MAPPING.md)  

---

## 1. System Design & Frontend Architecture

### 1.1 Directory Structure
```
oenexa-ai-web/
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
| **06** | Pro-Grade Chat & Backend Automations | Upgraded UI to match backend Gemini Pro specifications: 1. Multi-turn session management (listing, pinning, forking, titling), 2. Gemini 2.5 Pro/Flash model selector & CoT thinking accordion, 3. Autonomous tool execution cards (`ast_analyzer`, `security_scanner`, `test_synthesizer`, `code_refactoring`, `architecture_diagram`), 4. Monaco code artifact extraction with "Load in Editor" & "Copy", 5. Code context attachments from editor, 6. Code Workspace AST Analysis, SAST Security Scan, and JUnit 5 test synthesis buttons, 7. Dynamic 23-module discovery grid. | `npm test` passes 6/6 BDD test suites, `npm run build` succeeds cleanly in 9s with 0 warnings. |
| **07** | Real Scenario AI Agent Platform (Claude, Argon & Devin AI) | Completely removed static canned chat responses in favor of live dynamic intelligent AI Agent architecture: 1. Autonomous Multi-Model Routing (Claude 3.5 Sonnet, GPT-4o, Gemini 2.5, DeepSeek V3, Mistral Large, Llama 3.3, OENEXA Custom), 2. Live Intelligent Chat integration with streaming tokens, CoT reasoning, and dynamic response ranking, 3. AI Memory Architecture Inspector (Short-Term sliding window up to 50 turns, context auto-summarization, Long-Term PostgreSQL user facts & preferences), 4. Phase 3 Repository Understanding & Vector RAG (stack detection, symbol indexing for Java, React, SQL, and cosine similarity chunk search), 5. Autonomous 7-Agent Collaborative Pipeline (Architecture, Code, Bug Fix, Test, DevOps, Documentation, Security). | `npm test` passes 9/9 BDD test scenarios, `npm run build` generates production bundle in 8.12s with 0 errors. |
| **08** | Google Gemini 4 Argon Autonomous AI Agent Platform | Upgraded frontend to the flagship Google Gemini 4 Argon Autonomous AI Agent architecture: 1. Autonomous Goal Launcher with ReAct execution loop (`PLANNING` ➔ `DECOMPOSITION` ➔ `TOOL_EXECUTION` ➔ `SELF_HEALING_VERIFICATION` ➔ `REFLECTION` ➔ `COMPLETED`), 2. Dynamic 7-Persona Plan DAG with task status, persona badges, and tool output inspectors, 3. Real-Time Agent Thought Trace & Tool Telemetry Terminal (`#090d16` dark terminal streaming fine-grained persona thinking and tool invocations), 4. Self-Healing Reflection Loop drawer with resolved cycles, root-cause diagnosis, unified git patch diff preview, and one-click "Apply Patch to Editor" action, 5. On-demand manual self-healing cycle simulator, 6. Goal execution metrics and confidence score reporting (99% Zero-Mock Verified). | `npm test` passes 12/12 BDD test scenarios, `npm run build` succeeds in 8.59s with zero bundle errors. |
| **09** | Local-First Air-Gapped Privacy, Multimodal Ingestion & AI Product Manager PRD Studio | Fully implemented Step 09 matching backend Step 38 capabilities: 1. **Local-First & Air-Gapped Privacy**: Global status bar toggle and badge (`Air-Gapped: 100% Zero Leakage` / `Cloud Hybrid Mode`), local privacy audit card (Ollama `http://localhost:11434`, model `llama3.3:latest`, 8192 MB VRAM limit, zero telemetry leakage), 2. **Native Multimodal Context Ingestion**: Developer speech voice directive recording with transcription ingestion, architecture PNG diagram OCR/spatial layout parser, and OpenAPI specification doc vectorizer across both Argon console and Chat tabs, 3. **AI Product Manager Persona (`PRODUCT_MANAGER_AGENT`)**: Lead persona in 7-stage ReAct plan DAG generating autonomous PRD and INVEST user stories with Gherkin BDD acceptance criteria, 4. **Tab 7: AI Product Manager & PRD Studio**: Interactive PRD synthesis workbench with problem statement, key platform features, INVEST story cards with story points chips and Gherkin checklists, and technical constraints. | `npm test` passes 16/16 BDD test scenarios, `npm run build` compiles production bundle in 8.66s with zero errors. |
| **10** | Target Capabilities Studio (Claude Reasoning, Gemini Multimodal, Cursor Coding, Devin Sandbox, GitHub Copilot, OpenAI Operator) | Implemented full Step 10 Target Capabilities Studio in Tab 8: 1. **Claude-Level Reasoning**: Tree-of-Thought (ToT) exploration, competing architectural hypothesis cards (Hexagonal vs Microservices vs Layered), architectural/feasibility scoring, trade-off analysis, and reflection validation verdict, 2. **Gemini-Level Multimodal Intelligence**: Visual architecture diagram OCR/spatial layout inspection with layer/component breakdown, Mermaid C4 viewer, speech audio directives transcription, and multimodal context fusion, 3. **Cursor-Level Coding**: Codebase-wide symbol cross-referencing, `@context` reference curation (`@file`, `@folder`, `@symbol`, `@git`, `@codebase`), and Atomic Multi-File Patch generator with side-by-side diffs, 4. **Devin-Level Autonomous Task Execution**: End-to-end sandbox execution pipeline (Workspace Ingestion ➔ Sandbox Compilation ➔ Zero-Mock Test Suite Execution with 100% JaCoCo coverage ➔ SAST Security & Air-Gapped Verification) with real-time logs and exit code 0 validation, 5. **GitHub Copilot-Level Code Completion**: Real-time inline ghost-text code completion synthesis, prefix/suffix prompt tester, and candidate suggestions with latency and confidence metrics, 6. **OpenAI Operator-Level Automation**: Multi-step environment workflows (Docker container builds, K8s deployments, Flyway migrations, SAST security scans) with action tracking and completion status. | `npm test` passes 22/22 BDD test scenarios, `npm run build` succeeds in 7.87s with zero errors. |

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
