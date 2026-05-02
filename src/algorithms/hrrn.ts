import type { Process, SimulationResult } from '@/types';
import { getProcessColor } from '@/utils/helpers';
import { toInternal, computeMetrics } from './shared';

/**
 * Highest Response Ratio Next (HRRN)
 * Non-preemptive. Selects the process with the highest response ratio:
 *   RR = (WaitingTime + BurstTime) / BurstTime
 * This naturally implements aging — long-waiting jobs get priority over time.
 * No starvation possible.
 */
export function runHRRN(processes: Process[]): SimulationResult {
  const gantt = [];
  const internal = toInternal(processes);
  let time = 0;
  let contextSwitches = 0;
  let lastPID: string | null = null;
  const MAX = processes.reduce((s, p) => s + p.burstTime + p.arrivalTime, 0) + 10;

  while (internal.some((p) => !p.done) && time < MAX) {
    const ready = internal.filter((p) => p.arrivalTime <= time && !p.done);

    if (!ready.length) {
      // Jump ahead
      const next = internal.filter((p) => !p.done).sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
      if (next) time = next.arrivalTime;
      continue;
    }

    // Compute response ratios
    ready.forEach((p) => {
      const waitingTime = time - p.arrivalTime;
      (p as typeof p & { responseRatio: number }).responseRatio =
        (waitingTime + p.burstTime) / p.burstTime;
    });

    const p = ready.sort(
      (a, b) =>
        (b as typeof b & { responseRatio: number }).responseRatio -
        (a as typeof a & { responseRatio: number }).responseRatio ||
        a.arrivalTime - b.arrivalTime
    )[0];

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
