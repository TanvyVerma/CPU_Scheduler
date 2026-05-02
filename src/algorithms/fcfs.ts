import type { Process, SimulationResult } from '@/types';
import { getProcessColor } from '@/utils/helpers';
import { toInternal, computeMetrics } from './shared';

/**
 * First Come First Served (FCFS)
 * Non-preemptive. Processes run in arrival order.
 * Time complexity: O(n log n) for sort + O(n) execution
 */
export function runFCFS(processes: Process[]): SimulationResult {
  const gantt = [];
  const internal = toInternal(processes).sort((a, b) => a.arrivalTime - b.arrivalTime);
  let time = 0;
  let contextSwitches = 0;
  let lastPID: string | null = null;

  for (const p of internal) {
    if (!p.remaining) continue;

    // CPU idle gap
    if (p.arrivalTime > time) {
      time = p.arrivalTime;
    }

    if (p.firstRunTime < 0) p.firstRunTime = time;
    if (lastPID !== null && lastPID !== 'IDLE' && lastPID !== p.id) contextSwitches++;

    gantt.push({
      pid: p.id,
      start: time,
      end: time + p.remaining,
      color: getProcessColor(p.id, processes),
    });

    time += p.remaining;
    p.completionTime = time;
    p.remaining = 0;
    lastPID = p.id;
  }

  return { gantt, metrics: computeMetrics(internal, processes, gantt, contextSwitches) };
}
