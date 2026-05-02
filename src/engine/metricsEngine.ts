import type { SchedulingMetrics, GanttBlock, Process } from '@/types';

/** Derive what's visible up to a given playback index */
export function getVisibleGantt(gantt: GanttBlock[], index: number): GanttBlock[] {
  return gantt.slice(0, index);
}

/** Get the current time from visible gantt */
export function getCurrentTime(visible: GanttBlock[]): number {
  return visible.length ? visible[visible.length - 1].end : 0;
}

/** Get the currently running process PID */
export function getRunningPID(visible: GanttBlock[]): string | null {
  if (!visible.length) return null;
  const last = visible[visible.length - 1];
  return last.pid === 'IDLE' ? null : last.pid;
}

/** Derive queue states from visible gantt */
export function deriveQueues(
  visible: GanttBlock[],
  processes: Process[],
  metrics: SchedulingMetrics
): {
  ready: Process[];
  running: string | null;
  completed: string[];
} {
  if (!visible.length) return { ready: [], running: null, completed: [] };

  const time = getCurrentTime(visible);
  const running = getRunningPID(visible);
  const completedSet = new Set(
    metrics.results.filter((r) => r.completionTime <= time).map((r) => r.id)
  );

  const ready = processes.filter(
    (p) => p.arrivalTime <= time && !completedSet.has(p.id) && p.id !== running
  );

  return {
    ready,
    running,
    completed: [...completedSet],
  };
}

/** Progress percentage 0–100 */
export function getProgress(index: number, total: number): number {
  if (!total) return 0;
  return Math.round((index / total) * 100);
}

/** Context switch waste in ms */
export function getContextSwitchWaste(contextSwitches: number, costPerSwitch: number): number {
  return contextSwitches * costPerSwitch;
}

/** Efficiency loss percentage */
export function getEfficiencyLoss(waste: number, totalTime: number): number {
  if (!totalTime) return 0;
  return (waste / totalTime) * 100;
}
