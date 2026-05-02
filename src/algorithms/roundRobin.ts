import type { Process, SimulationResult } from '@/types';
import { getProcessColor } from '@/utils/helpers';
import { toInternal, computeMetrics } from './shared';

/**
 * Round Robin (RR)
 * Each process gets a fixed time quantum q.
 * Processes that don't finish in q are re-queued.
 * Fair: no starvation; bounded response time.
 */
export function runRoundRobin(processes: Process[], quantum: number): SimulationResult {
  const gantt = [];
  const internal = toInternal(processes);
  const queue: typeof internal = [];
  const added = new Set<string>();
  let time = 0;
  let contextSwitches = 0;
  let safetyCounter = 0;
  const MAX = processes.reduce((s, p) => s + p.burstTime, 0) * 3 + 100;

  // Enqueue all processes that arrive at time 0
  internal
    .filter((p) => p.arrivalTime === 0)
    .sort((a, b) => a.arrivalTime - b.arrivalTime)
    .forEach((p) => { queue.push(p); added.add(p.id); });

  while ((queue.length > 0 || internal.some((p) => p.remaining > 0)) && safetyCounter < MAX) {
    safetyCounter++;

    if (!queue.length) {
      // Jump to next process arrival
      const next = internal
        .filter((p) => p.remaining > 0 && !added.has(p.id))
        .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      if (!next) break;
      time = next.arrivalTime;
      queue.push(next);
      added.add(next.id);
    }

    const p = queue.shift()!;
    if (!p || p.remaining <= 0) continue;

    if (p.firstRunTime < 0) p.firstRunTime = time;

    const exec = Math.min(quantum, p.remaining);
    if (gantt.length > 0) contextSwitches++;

    gantt.push({
      pid: p.id,
      start: time,
      end: time + exec,
      color: getProcessColor(p.id, processes),
    });

    time += exec;
    p.remaining -= exec;

    // Enqueue any newly arrived processes (before re-enqueuing current)
    internal
      .filter((x) => x.remaining > 0 && !added.has(x.id) && x.arrivalTime <= time)
      .sort((a, b) => a.arrivalTime - b.arrivalTime)
      .forEach((x) => { queue.push(x); added.add(x.id); });

    if (p.remaining > 0) {
      queue.push(p);
    } else {
      p.completionTime = time;
      p.done = true;
    }
  }

  return { gantt, metrics: computeMetrics(internal, processes, gantt, contextSwitches) };
}
