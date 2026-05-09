import { create } from 'zustand';
import type { Process, AlgorithmId, SimulationTab, SimulationResult, SchedulingMetrics } from '@/types';
import { runAlgorithm } from '@/algorithms';
import { runMultiCoreSimulation } from '@/engine/multiCoreEngine';
import { ALGORITHM_INFO } from '@/data/algorithms';
import { randomProcesses, generatePID } from '@/utils/helpers';
import { getAnalyzeEndpoint } from '@/utils/apiConfig';

interface SimStore {
  processes: Process[];
  nextId: number;
  addProcess: () => void;
  removeProcess: (id: string) => void;
  updateProcess: (id: string, field: keyof Process, value: string | number) => void;
  setProcesses: (processes: Process[]) => void;
  randomizeProcesses: () => void;
  algorithm: AlgorithmId;
  setAlgorithm: (id: AlgorithmId) => void;
  quantum: number;
  setQuantum: (q: number) => void;
  contextSwitchCost: number;
  setContextSwitchCost: (c: number) => void;
  mode: 'single' | 'multi';
  setMode: (mode: 'single' | 'multi') => void;
  coreCount: number;
  setCoreCount: (count: number) => void;
  simResult: SimulationResult | null;
  runSimulation: () => void;
  clearResult: () => void;
  playbackIndex: number;
  playbackState: 'idle' | 'playing' | 'paused' | 'done';
  playbackSpeed: number;
  setPlaybackSpeed: (s: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  stepForward: () => void;
  compareResults: Record<string, SchedulingMetrics> | null;
  runCompare: () => void;
  activeTab: SimulationTab;
  setActiveTab: (tab: SimulationTab) => void;
  aiAnalysis: string;
  aiLoading: boolean;
  runAIAnalysis: () => Promise<void>;
  showCSVImport: boolean;
  setShowCSVImport: (v: boolean) => void;
}

const DEFAULT_PROCESSES: Process[] = [
  { id: 'P1', arrivalTime: 0, burstTime: 6, priority: 2 },
  { id: 'P2', arrivalTime: 1, burstTime: 4, priority: 3 },
  { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 1 },
  { id: 'P4', arrivalTime: 3, burstTime: 2, priority: 4 },
  { id: 'P5', arrivalTime: 4, burstTime: 5, priority: 2 },
];

let playbackTimer: ReturnType<typeof setTimeout> | null = null;

export const useSimulationStore = create<SimStore>((set, get) => ({
  processes: DEFAULT_PROCESSES,
  nextId: 6,
  addProcess() {
    const { nextId } = get();
    set((s) => ({
      processes: [...s.processes, { id: generatePID(nextId), arrivalTime: 0, burstTime: 4, priority: 1 }],
      nextId: nextId + 1,
      simResult: null,
    }));
  },
  removeProcess(id) { set((s) => ({ processes: s.processes.filter((p) => p.id !== id), simResult: null })); },
  updateProcess(id, field, value) {
    set((s) => ({
      processes: s.processes.map((p) =>
        p.id === id ? { ...p, [field]: field === 'id' ? String(value) : Number(value) } : p
      ),
      simResult: null,
    }));
  },
  setProcesses(processes) { set({ processes, simResult: null }); },
  randomizeProcesses() {
    const n = 4 + Math.floor(Math.random() * 3);
    set({ processes: randomProcesses(n), nextId: n + 1, simResult: null });
  },

  algorithm: 'rr',
  setAlgorithm(id) { set({ algorithm: id, simResult: null }); },
  quantum: 3,
  setQuantum(q) { set({ quantum: Math.max(1, q), simResult: null }); },
  contextSwitchCost: 1,
  setContextSwitchCost(c) { set({ contextSwitchCost: Math.max(0, c) }); },
  mode: 'single',
  setMode(mode) { set({ mode, simResult: null }); },
  coreCount: 2,
  setCoreCount(count) { set({ coreCount: Math.max(2, count), simResult: null }); },

  simResult: null,
  runSimulation() {
    const { algorithm, processes, quantum, mode, coreCount } = get();
    const result = mode === 'multi'
      ? runMultiCoreSimulation(algorithm, processes, quantum, coreCount)
      : runAlgorithm(algorithm, processes, quantum);
    set({ simResult: result, playbackIndex: 0, playbackState: 'idle' });
  },
  clearResult() { set({ simResult: null, playbackIndex: 0, playbackState: 'idle' }); },

  playbackIndex: 0,
  playbackState: 'idle',
  playbackSpeed: 2,
  setPlaybackSpeed(s) { set({ playbackSpeed: s }); },

  play() {
    const { simResult, playbackIndex } = get();
    if (!simResult) get().runSimulation();
    const result = get().simResult;
    if (!result) return;
    let startIdx = playbackIndex >= result.gantt.length ? 0 : playbackIndex;
    set({ playbackState: 'playing', playbackIndex: startIdx });
    if (playbackTimer) clearTimeout(playbackTimer);
    const tick = () => {
      const s = get();
      if (s.playbackState !== 'playing' || !s.simResult) return;
      const next = s.playbackIndex + 1;
      if (next > s.simResult.gantt.length) { set({ playbackState: 'done' }); return; }
      set({ playbackIndex: next });
      playbackTimer = setTimeout(tick, 1100 / s.playbackSpeed);
    };
    playbackTimer = setTimeout(tick, 80);
  },
  pause() { if (playbackTimer) clearTimeout(playbackTimer); set({ playbackState: 'paused' }); },
  reset() { if (playbackTimer) clearTimeout(playbackTimer); set({ playbackIndex: 0, playbackState: 'idle', simResult: null }); },
  stepForward() {
    const { simResult, playbackIndex } = get();
    if (!simResult) { get().runSimulation(); set({ playbackIndex: 1 }); return; }
    if (playbackIndex < simResult.gantt.length) set({ playbackIndex: playbackIndex + 1 });
  },

  compareResults: null,
  runCompare() {
    const { processes, quantum } = get();
    const results: Record<string, SchedulingMetrics> = {};
    ALGORITHM_INFO.forEach((algo) => {
      try {
        const r = runAlgorithm(algo.id, processes, quantum);
        if (r) results[algo.id] = r.metrics;
      } catch (e) { console.error('Compare failed:', algo.id, e); }
    });
    set({ compareResults: results });
  },

  activeTab: 'simulate',
  setActiveTab(tab) { set({ activeTab: tab }); },

  aiAnalysis: '',
  aiLoading: false,
  async runAIAnalysis() {
    const { simResult, algorithm, processes, quantum } = get();
    if (!simResult) return;
    set({ aiLoading: true, aiAnalysis: '' });
    const m = simResult.metrics;
    const algoName = ALGORITHM_INFO.find((a) => a.id === algorithm)?.fullName ?? algorithm;
    try {
      const endpoint = getAnalyzeEndpoint();
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algoName,
          quantum,
          processes,
          metrics: m,
        }),
      });
      if (!res.ok) {
        let errData;
        try {
          errData = await res.json();
        } catch {
          errData = { error: res.statusText };
        }
        const msg = errData?.error || res.statusText;
        set({ aiAnalysis: `API Error ${res.status}: ${msg}`, aiLoading: false });
        return;
      }
      const data = await res.json();
      const text = data.analysis ?? 'Analysis unavailable.';
      set({ aiAnalysis: text, aiLoading: false });
    } catch (e) { 
      console.error('AI analysis error:', e);
      set({ aiAnalysis: `Error: ${e instanceof Error ? e.message : String(e)}`, aiLoading: false }); 
    }
  },

  showCSVImport: false,
  setShowCSVImport(v) { set({ showCSVImport: v }); },
}));
