import type { GanttBlock, Process } from '@/types';

export interface CoreTimeline {
  coreId: number;
  gantt: GanttBlock[];
  busyTime: number;
  idleTime: number;
  utilization: number;
  assignedCount: number;
}

export interface CoreAssignment {
  coreId: number;
  queue: Process[];
  totalWork: number;
}

export function getCoreBusyTime(gantt: GanttBlock[]): number {
  return gantt.reduce((sum, block) => sum + (block.pid === 'IDLE' ? 0 : block.end - block.start), 0);
}

export function getCoreUtilization(gantt: GanttBlock[], totalTime: number): number {
  if (!totalTime || !gantt.length) return 0;
  const busyTime = getCoreBusyTime(gantt);
  return totalTime ? (busyTime / totalTime) * 100 : 0;
}

export function normalizeCoreGantt(gantt: GanttBlock[]): GanttBlock[] {
  return [...gantt].sort((a, b) => a.start - b.start || a.end - b.end);
}
