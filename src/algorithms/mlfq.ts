import type { Process, SimulationResult } from '@/types';
import { getProcessColor } from '@/utils/helpers';
import { toInternal, computeMetrics } from './shared';

/**
 * Multi-Level Feedback Queue (MLFQ)
 * 3 queues: Q0 (q=2), Q1 (q=4), Q2 (FCFS/∞)
 * New processes enter Q0. If they exhaust their quantum, they drop to a lower queue.
 * Processes that yield CPU (I/O) stay in current queue.
 * Favors short/interactive processes over CPU-bound ones.
 */
const QUANTUM_LEVELS = [2, 4, Infinity];

export function runMLFQ(processes: Process[]): SimulationResult {
  const gantt = [];
  const internal = toInternal(processes) as Array<ReturnType<typeof toInternal>[0] & { level: number }>;
  internal.forEach((p) => { (p as typeof internal[0]).level = 0; });

  const queues: (typeof internal)[] = [[], [], []];
  const added = new Set<string>();
  let time = 0;
  let contextSwitches = 0;
  let lastPID: string | null = null;
  let safetyCounter = 0;
  const MAX = processes.reduce((s, p) => s + p.burstTime, 0) * 3 + 50;

  // Initial enqueue
  internal
    .filter((p) => p.arrivalTime === 0)
    .forEach((p) => { queues[0].push(p); added.add(p.id); });

  while (internal.some((p) => p.remaining > 0) && safetyCounter < MAX) {
    safetyCounter++;

    // Admit newly arrived processes to Q0
    internal
      .filter((p) => p.remaining > 0 && !added.has(p.id) && p.arrivalTime <= time)
      .forEach((p) => { queues[0].push(p); added.add(p.id); });

    // Pick from highest non-empty queue
    let dispatched = false;
    for (let level = 0; level < 3; level++) {
      if (!queues[level].length) continue;

      const p = queues[level].shift()!;
      if (!p || p.remaining <= 0) continue;

      if (p.firstRunTime < 0) p.firstRunTime = time;
      if (lastPID !== p.id) {
        if (lastPID !== null) contextSwitches++;
        lastPID = p.id;
      }

      const q = QUANTUM_LEVELS[level];
      const exec = Math.min(q === Infinity ? p.remaining : q, p.remaining);

      gantt.push({
        pid: p.id,
        start: time,
        end: time + exec,
        color: getProcessColor(p.id, processes),
        level,
      });

      time += exec;
      p.remaining -= exec;

      // Admit new arrivals during this slice
      internal
        .filter((x) => x.remaining > 0 && !added.has(x.id) && x.arrivalTime <= time)
        .forEach((x) => { queues[0].push(x); added.add(x.id); });

      if (p.remaining > 0) {
        // Demote to next level
        p.level = Math.min(2, level + 1);
        queues[p.level].push(p);
      } else {
        p.completionTime = time;
        p.done = true;
      }

      dispatched = true;
      break;
    }

    if (!dispatched) time++;
  }

  return { gantt, metrics: computeMetrics(internal, processes, gantt, contextSwitches) };
}
