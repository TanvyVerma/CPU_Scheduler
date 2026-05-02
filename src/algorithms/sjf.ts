import type { Process, SimulationResult } from '@/types';
import { getProcessColor } from '@/utils/helpers';
import { toInternal, computeMetrics } from './shared';

/**
 * Shortest Job First (SJF) — Non-preemptive
 * At each dispatch point, choose the arrived process with minimum burst time.
 * Provably optimal average waiting time among non-preemptive algorithms.
 */
export function runSJF(processes: Process[]): SimulationResult {
  const gantt = [];
  const internal = toInternal(processes);
  let time = 0;
  let contextSwitches = 0;
  let lastPID: string | null = null;
  const MAX_ITER = processes.reduce((s, p) => s + p.burstTime, 0) + 50;

  while (internal.some((p) => !p.done) && time < MAX_ITER) {
    const ready = internal
      .filter((p) => p.arrivalTime <= time && !p.done)
      .sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime);

    if (!ready.length) {
      // Jump to next arrival
      const next = internal.filter((p) => !p.done).sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      if (next) time = next.arrivalTime;
      continue;
    }

    const p = ready[0];
    if (p.firstRunTime < 0) p.firstRunTime = time;
    if (lastPID !== null && lastPID !== p.id) contextSwitches++;
    lastPID = p.id;

    gantt.push({
      pid: p.id,
      start: time,
      end: time + p.burstTime,
      color: getProcessColor(p.id, processes),
    });

    time += p.burstTime;
    p.completionTime = time;
    p.done = true;
  }

  return { gantt, metrics: computeMetrics(internal, processes, gantt, contextSwitches) };
}
