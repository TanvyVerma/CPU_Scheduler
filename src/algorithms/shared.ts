import type { Process, GanttBlock, SchedulingMetrics, ProcessResult } from '@/types';

interface InternalProcess extends Process {
  remaining: number;
  completionTime: number;
  firstRunTime: number;
  done: boolean;
}

export function toInternal(processes: Process[]): InternalProcess[] {
  return processes.map((p) => ({
    ...p,
    remaining: p.burstTime,
    completionTime: 0,
    firstRunTime: -1,
    done: false,
  }));
}

export function computeMetrics(
  internal: InternalProcess[],
  original: Process[],
  gantt: GanttBlock[],
  contextSwitches: number
): SchedulingMetrics {
  const results: ProcessResult[] = internal.map((p) => {
    const orig = original.find((o) => o.id === p.id)!;
    const tat = Math.max(0, p.completionTime - orig.arrivalTime);
    const wt = Math.max(0, tat - orig.burstTime);
    const rt = Math.max(0, (p.firstRunTime >= 0 ? p.firstRunTime : p.completionTime) - orig.arrivalTime);
    return {
      id: p.id,
      arrivalTime: orig.arrivalTime,
      burstTime: orig.burstTime,
      priority: orig.priority,
      completionTime: p.completionTime,
      turnaroundTime: tat,
      waitingTime: wt,
      responseTime: rt,
    };
  });

  const n = results.length || 1;
  const avgWaitingTime = results.reduce((s, r) => s + r.waitingTime, 0) / n;
  const avgTurnaroundTime = results.reduce((s, r) => s + r.turnaroundTime, 0) / n;
  const avgResponseTime = results.reduce((s, r) => s + r.responseTime, 0) / n;
  const totalTime = gantt.reduce((s, g) => Math.max(s, g.end), 0);
  const busyTime = gantt.filter((g) => g.pid !== 'IDLE').reduce((s, g) => s + (g.end - g.start), 0);
  const cpuUtilization = totalTime > 0 ? (busyTime / totalTime) * 100 : 0;
  const throughput = results.length / (totalTime || 1);

  return {
    results,
    avgWaitingTime,
    avgTurnaroundTime,
    avgResponseTime,
    cpuUtilization,
    throughput,
    contextSwitches,
    totalTime,
  };
}

export function idleBlock(start: number): GanttBlock {
  return {
    pid: 'IDLE',
    start,
    end: start + 1,
    color: { bg: 'rgba(255,255,255,0.04)', border: '#2a2d40', text: '#3a3d55' },
  };
}
