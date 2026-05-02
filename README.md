# ⚡ CPUSched — Advanced CPU Scheduling Visualizer v2.0

A production-grade, interactive CPU Scheduling simulator built with React, TypeScript, Tailwind CSS, Zustand, Recharts, and Framer Motion. Powered by Claude AI for intelligent workload analysis.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

---

## 📁 Project Structure

```
src/
├── algorithms/          # 7 complete scheduling algorithm implementations
│   ├── fcfs.ts          # First Come First Served
│   ├── sjf.ts           # Shortest Job First
│   ├── srtf.ts          # Shortest Remaining Time First
│   ├── priority.ts      # Preemptive Priority Scheduling
│   ├── roundRobin.ts    # Round Robin
│   ├── hrrn.ts          # Highest Response Ratio Next
│   ├── mlfq.ts          # Multi-Level Feedback Queue
│   ├── shared.ts        # Shared metrics calculator
│   └── index.ts         # Algorithm dispatcher
│
├── engine/              # Analysis engines
│   ├── simulationEngine.ts    # Re-exports all engines
│   ├── metricsEngine.ts       # Gantt/queue derivation
│   ├── anomalyEngine.ts       # Convoy, starvation, high switching detection
│   ├── recommendationEngine.ts # Rule-based algorithm recommendation
│   └── quantumEngine.ts       # RR quantum optimizer
│
├── store/
│   └── useSimulationStore.ts  # Zustand global state
│
├── hooks/
│   ├── useSimulation.ts       # Derived simulation state hook
│   └── usePlayback.ts         # Playback controls hook
│
├── pages/
│   ├── LandingPage.tsx        # Animated landing with feature showcase
│   ├── SimulationPage.tsx     # Main 3-column simulation layout
│   ├── ComparePage.tsx        # All-algorithm comparison dashboard
│   ├── SetupPage.tsx          # Presets & edge case explorer
│   └── ReportsPage.tsx        # Full metrics report + export
│
├── components/
│   ├── common/          # Button, Badge, Divider, Tooltip, Modal
│   ├── simulator/       # GanttChart, QueueDisplay, CPUDisplay, PlaybackControls
│   │                    # AIPanel, AnomalyPanel, QuantumOptimizerPanel
│   ├── charts/          # MetricsChart, UtilizationDonut, WaitTimeChart, TimelineChart
│   ├── cards/           # MetricCard, AnomalyCard, RecommendationCard
│   ├── tables/          # ProcessResultTable, CompareTable
│   └── ui/              # ProcessTable, AlgorithmSelector, QuantumControl,
│                        # ContextSwitchControl, SpeedControl, CSVImport
│
├── data/
│   ├── algorithms.ts    # Algorithm metadata (pros/cons/descriptions)
│   └── presets.ts       # 6 edge case preset scenarios
│
├── types/index.ts       # All TypeScript interfaces
│
└── utils/
    ├── helpers.ts       # Colors, math utils, formatters
    ├── validators.ts    # Process validation, CSV parser
    └── export.ts        # CSV, JSON, SVG export functions
```

---

## 🧠 Algorithms Implemented

| Algorithm | Type | Key Feature |
|-----------|------|-------------|
| **FCFS** | Non-preemptive | Arrival order, simple, convoy effect risk |
| **SJF** | Non-preemptive | Minimum avg wait, optimal non-preemptive |
| **SRTF** | Preemptive | Optimal overall wait, high context switches |
| **Priority** | Preemptive | Urgency-based, starvation risk |
| **Round Robin** | Preemptive | Fair time-sharing, quantum-dependent |
| **HRRN** | Non-preemptive | Aging via response ratio, no starvation |
| **MLFQ** | Preemptive | Self-adapting, favors I/O-bound processes |

---

## 📊 Metrics Computed

**Per Process:**
- Completion Time (CT)
- Turnaround Time (TAT = CT − AT)
- Waiting Time (WT = TAT − BT)
- Response Time (RT = first run − AT)

**Overall:**
- Average WT, TAT, RT
- CPU Utilization %
- Throughput (processes/ms)
- Context Switch Count
- Context Switch Waste (switches × cost)
- Efficiency Loss %

---

## 🔥 Features

- **Real-Time Gantt Animation** — step-by-step playback with speed control
- **Live Queue Display** — ready, running, completed process chips
- **AI Analysis** — Claude AI analyzes workload and recommends best algorithm
- **Anomaly Detection** — convoy effect, starvation, high switching, low utilization
- **Quantum Optimizer** — mathematically suggests optimal RR quantum
- **Compare Mode** — run all 7 algorithms simultaneously with visual bar charts
- **6 Edge Case Presets** — pre-loaded scenarios that expose scheduling failures
- **Export** — CSV results, JSON scenario, SVG Gantt chart
- **CSV Import** — import custom process data
- **Context Switch Cost** — calculate wasted time and efficiency loss

---

## 📤 Export Formats

| Format | Content |
|--------|---------|
| **CSV** | Per-process metrics (CT, TAT, WT, RT) |
| **JSON** | Full scenario: processes + algorithm + gantt + metrics |
| **SVG** | Vector Gantt chart for reports/presentations |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v3 |
| State Management | Zustand v4 |
| Charts | Recharts v2 |
| Animations | Framer Motion v11 |
| Icons | Lucide React |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |

---

## 🧪 Edge Case Presets

1. **Convoy Effect** — FCFS with one long job blocking many short ones
2. **Starvation** — Priority scheduling starves low-priority processes
3. **Heavy Switching** — Small RR quantum causes excessive context switches
4. **Equal Arrival** — All processes at t=0, clean baseline comparison
5. **Mixed Workload** — Ideal scenario for MLFQ demonstration
6. **Priority Flooding** — Many equal-priority processes stressing the scheduler

---

## 📌 Usage Guide

1. **Simulate Tab** — Add/edit processes, choose algorithm, press Play
2. **Compare Tab** — Auto-runs all 7 algorithms on your current processes
3. **Presets Tab** — Load edge case scenarios, explore scheduling pitfalls
4. **Reports Tab** — Full metrics dashboard + export options
5. **AI Panel** — Click "Analyze with Claude AI" after running a simulation
6. **Issues Panel** — Auto-detected anomalies with fix recommendations
7. **Optimizer Panel** — Quantum suggestions for Round Robin

---

## 🔮 Architecture — Future Extensions

The modular engine design supports adding:
- Multi-core scheduling (run N processes in parallel)
- EDF / Rate-Monotonic (real-time scheduling)
- Process I/O bursts and blocking states
- User authentication + scenario history (add Supabase)
- AI-powered workload classification
- Cloud scheduler simulation
