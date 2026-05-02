// ─── Core Process Types ────────────────────────────────────────────────────

export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  color?: ProcessColor;
}

export interface ProcessColor {
  bg: string;
  border: string;
  text: string;
}

export interface ProcessResult {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  responseTime: number;
}

// ─── Gantt Chart ───────────────────────────────────────────────────────────

export interface GanttBlock {
  pid: string;
  start: number;
  end: number;
  color: ProcessColor;
  level?: number; // for MLFQ
}

// ─── Metrics ───────────────────────────────────────────────────────────────

export interface SchedulingMetrics {
  results: ProcessResult[];
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  avgResponseTime: number;
  cpuUtilization: number;
  throughput: number;
  contextSwitches: number;
  totalTime: number;
}

export interface SimulationResult {
  gantt: GanttBlock[];
  metrics: SchedulingMetrics;
}

// ─── Algorithm ─────────────────────────────────────────────────────────────

export type AlgorithmId = 'fcfs' | 'sjf' | 'srtf' | 'priority' | 'rr' | 'hrrn' | 'mlfq';

export interface AlgorithmInfo {
  id: AlgorithmId;
  name: string;
  fullName: string;
  tag: string;
  description: string;
  preemptive: boolean;
  pros: string[];
  cons: string[];
}

// ─── Anomaly Detection ─────────────────────────────────────────────────────

export type AnomalyType = 'error' | 'warning' | 'info';

export interface Anomaly {
  type: AnomalyType;
  title: string;
  description: string;
  fix: string;
  affectedProcesses?: string[];
}

// ─── Recommendation ────────────────────────────────────────────────────────

export interface Recommendation {
  algorithm: AlgorithmId;
  algorithmName: string;
  confidence: number; // 0–100
  reason: string;
  tradeoffs: string;
}

// ─── Quantum Optimization ──────────────────────────────────────────────────

export interface QuantumAnalysis {
  avgBurst: number;
  medianBurst: number;
  stdDev: number;
  minBurst: number;
  maxBurst: number;
  suggestedQuantum: number;
  tooSmall: number;
  tooLarge: number;
  assessment: 'too-small' | 'optimal' | 'too-large' | 'ok';
}

// ─── Compare Mode ──────────────────────────────────────────────────────────

export type CompareResults = Record<AlgorithmId, SchedulingMetrics>;

// ─── Simulation State ──────────────────────────────────────────────────────

export type SimulationTab = 'simulate' | 'compare' | 'presets' | 'reports';
export type RightTab = 'ai' | 'anomalies' | 'optimizer';
export type PlaybackState = 'idle' | 'playing' | 'paused' | 'done';

export interface SimulationStore {
  // Processes
  processes: Process[];
  addProcess: () => void;
  removeProcess: (id: string) => void;
  updateProcess: (id: string, field: keyof Process, value: string | number) => void;
  setProcesses: (processes: Process[]) => void;
  randomizeProcesses: () => void;

  // Algorithm
  algorithm: AlgorithmId;
  setAlgorithm: (id: AlgorithmId) => void;
  quantum: number;
  setQuantum: (q: number) => void;
  contextSwitchCost: number;
  setContextSwitchCost: (c: number) => void;

  // Simulation
  simResult: SimulationResult | null;
  runSimulation: () => void;
  clearResult: () => void;

  // Playback
  playbackIndex: number;
  playbackState: PlaybackState;
  playbackSpeed: number;
  setPlaybackSpeed: (s: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;

  // Compare
  compareResults: CompareResults | null;
  runCompare: () => void;

  // UI
  activeTab: SimulationTab;
  setActiveTab: (tab: SimulationTab) => void;
  rightTab: RightTab;
  setRightTab: (tab: RightTab) => void;

  // AI
  aiAnalysis: string;
  aiLoading: boolean;
  runAIAnalysis: () => Promise<void>;

  // CSV
  showCSVImport: boolean;
  setShowCSVImport: (v: boolean) => void;
}
