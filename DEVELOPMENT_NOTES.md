# OENEXA AI Web — Master Architecture & Operation Guide

> **System:** `[AI-WEB] 💻` OENEXA AI Operating System Frontend  
> **Repository:** `C:\workspace\oenexarepo\oenexa-ai-web` | `github.com/oenexa/oenexa-ai-web`  
> **Paired Backend Service:** `[AI-CORE] ⚡` [`oenexa-ai-core`](../oenexa-ai-core) (`http://localhost:8080/api`)  
> **Frontend Stack:** React 18 | Vite 5 | TypeScript | Tailwind CSS | Material-UI 5 | Monaco Editor | Vitest (Zero Mocks)  
> **Design Language:** OENEXA Minimalist Cockpit (Obsidian/Slate dark mode, Cyan status glows, Real scenario chat, Minimalist HUD)

---

## 1. System Overview & Minimalist UX

OENEXA AI Web delivers a streamlined, distraction-free cockpit for interacting with autonomous multi-agent engineering swarms.

### Architectural Principles

1. **Clean Architecture & Real Data Only:** Zero static mock clutter or fake data generators. The interface renders real scenario chat streams, live virtual thread telemetry, and verified compiler artifacts.
2. **Minimalist Focal Point:** A single floating goal input bar with instant 1-click architecture preset chips.
3. **Structured Concurrency Telemetry:** Displays live active virtual thread count, wall-clock ms, sequential equivalent ms, and speedup factor.
4. **Virtual Thread Grid:** Real-time visibility into per-agent thread execution records (`oenexa-vthread-*`), thread memory allocations, stages, and outputs.
5. **Consolidated Artifacts Strip:** One-click clipboard copy for code and architecture artifacts synthesized across threads.

---

## 2. Directory Structure

```
oenexa-ai-web/
├── src/
│   ├── components/
│   │   ├── navigation/        # PlatformNavigationBar with Chat vs Swarm Threads switcher
│   │   └── tabs/              # OenexaAgentSwarmTab (< 400 lines SRP)
│   ├── services/
│   │   ├── agentThreadOrchestratorService.ts  # /api/v4/agents/swarm client with air-gapped fallback
│   │   ├── memoryHierarchyService.ts          # 6-tier SSD-first memory telemetry
│   │   └── scenarioResponseEngine.ts          # Dynamic scenario response generation
│   ├── types/
│   │   └── agentEcosystem.ts                  # Typed contracts for 12 agents, thread states, and strategies
│   ├── App.tsx                # Main application cockpit
│   ├── App.test.tsx           # 100% Zero-mock Vitest test suite
│   └── main.tsx               # Entrypoint
├── vite.config.ts             # Reverse proxy /api to http://localhost:8080
└── package.json
```

---

## 3. Concurrency Strategies & View Modes

* **`PARALLEL_MAX_SPEED`:** Executes all 6 core agents in parallel virtual threads. Delivers maximum throughput ($4.5\times - 5.5\times$ speedup).
* **`PHASED_PIPELINE`:** Executes agents in 3 sequential waves:
  - Stage 1: Architecture & Design
  - Stage 2: Core Engineering & Security
  - Stage 3: Verification & Deployment
* **View Switcher:**
  - `💬 Chat`: Real scenario conversational AI assistant with multi-turn context.
  - `⚡ Swarm Threads`: Live OENEXA multi-agent virtual thread orchestrator.

---

## 4. Engineering Standards & Verification

* **Zero-Mock Policy:** Vitest suites assert real component lifecycles and business services without test doubles.
* **Single Responsibility Principle (SRP):** All UI and service files strictly stay $< 400\text{ lines}$.
* **Commands:**
  ```bash
  # Execute zero-mock Vitest suite
  npm test

  # Launch local development server (http://localhost:5173)
  npm run dev

  # Compile optimized production bundle
  npm run build
  ```
