import type { Process, ProcessColor } from '@/types';

// ─── Process Colors ────────────────────────────────────────────────────────

export const PROCESS_COLORS: ProcessColor[] = [
  { bg: 'rgba(124,111,255,0.22)', border: '#7c6fff', text: '#b39dff' },
  { bg: 'rgba(14,207,142,0.18)',  border: '#0ecf8e', text: '#34d399' },
  { bg: 'rgba(245,166,35,0.18)',  border: '#f5a623', text: '#fbbf24' },
  { bg: 'rgba(255,107,107,0.18)', border: '#ff6b6b', text: '#f87171' },
  { bg: 'rgba(91,164,245,0.18)',  border: '#5ba4f5', text: '#93c5fd' },
  { bg: 'rgba(240,98,146,0.18)',  border: '#f06292', text: '#f9a8d4' },
  { bg: 'rgba(34,211,238,0.18)',  border: '#22d3ee', text: '#67e8f9' },
  { bg: 'rgba(45,212,191,0.18)',  border: '#2dd4bf', text: '#5eead4' },
];

export function getProcessColor(pid: string, processes: Process[]): ProcessColor {
  const idx = processes.findIndex((p) => p.id === pid);
  return PROCESS_COLORS[idx >= 0 ? idx % PROCESS_COLORS.length : 0];
}

// ─── Math Helpers ──────────────────────────────────────────────────────────

export function avg(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function stdDev(values: number[]): number {
  if (!values.length) return 0;
  const mean = avg(values);
  return Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ─── Format ───────────────────────────────────────────────────────────────

export function fmtMs(ms: number, decimals = 1): string {
  return `${ms.toFixed(decimals)}ms`;
}

export function fmtPct(pct: number): string {
  return `${pct.toFixed(1)}%`;
}

export function generatePID(n: number): string {
  return `P${n}`;
}

// ─── Process Helpers ──────────────────────────────────────────────────────

export function randomProcesses(count: number): Process[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `P${i + 1}`,
    arrivalTime: Math.floor(Math.random() * 6),
    burstTime: 1 + Math.floor(Math.random() * 10),
    priority: 1 + Math.floor(Math.random() * 4),
  }));
}

export function cloneProcesses(processes: Process[]): Process[] {
  return processes.map((p) => ({ ...p }));
}

// ─── Time Tick Generator ──────────────────────────────────────────────────

export function generateTicks(totalTime: number, maxTicks = 14): number[] {
  const step = Math.ceil(totalTime / Math.min(maxTicks, totalTime));
  const ticks: number[] = [];
  for (let t = 0; t <= totalTime; t += step) ticks.push(t);
  if (ticks[ticks.length - 1] !== totalTime) ticks.push(totalTime);
  return ticks;
}
