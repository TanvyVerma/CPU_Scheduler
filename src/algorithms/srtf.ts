import type { Process, SimulationResult } from '@/types';
import { getProcessColor } from '@/utils/helpers';
import { toInternal, computeMetrics } from './shared';

/**
 * Shortest Remaining Time First (SRTF) — Preemptive SJF
 * At each time unit, the process with the smallest remaining burst runs.
 * Produces optimal average waiting time overall.
 */
export function runSRTF(processes: Process[]): SimulationResult {
  const gantt = [];
  const internal = toInternal(processes);
  let time = 0;
  let contextSwitches = 0;
  let lastPID: string | null = null;
  const MAX = processes.reduce((s, p) => s + p.burstTime + p.arrivalTime, 0) + 10;

  while (internal.some((p) => p.remaining > 0) && time < MAX) {
    const ready = internal
      .filter((p) => p.arrivalTime <= time && p.remaining > 0)
      .sort((a, b) => a.remaining - b.remaining || a.arrivalTime - b.arrivalTime);

    if (!ready.length) {
      time++;
      continue;
    }

    const p = ready[0];
    if (p.firstRunTime < 0) p.firstRunTime = time;

    if (lastPID !== p.id) {
      if (lastPID !== null) contextSwitches++;
      lastPID = p.id;
    }

    // Merge adjacent same-process blocks
    if (gantt.length && gantt[gantt.length - 1].pid === p.id) {
      gantt[gantt.length - 1].end++;
    } else {
      gantt.push({
        pid: p.id,
        start: time,
        end: time + 1,
        color: getProcessColor(p.id, processes),
      });
    }

    p.remaining--;
    time++;

    if (p.remaining === 0) {
      p.completionTime = time;
      p.done = true;
    }
  }

  return { gantt, metrics: computeMetrics(internal, processes, gantt, contextSwitches) };
}
