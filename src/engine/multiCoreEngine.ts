import type { AlgorithmId, CoreTimeline, Process, SimulationResult, SchedulingMetrics } from '@/types';
import { runAlgorithm } from '@/algorithms';
import { dispatchProcesses } from './dispatcher';
import { getCoreBusyTime } from './core';

export function runMultiCoreSimulation(
  algorithm: AlgorithmId,
  processes: Process[],
  quantum: number,
  coreCount: number
): SimulationResult | null {
  if (!processes.length) return null;
  const assignments = dispatchProcesses(processes, coreCount);

  const coreResults = assignments.map((assignment) => {
    if (!assignment.queue.length) return null;
    return runAlgorithm(algorithm, assignment.queue, quantum);
  });

  const coreTimelines: CoreTimeline[] = assignments.map((assignment, index) => {
    const result = coreResults[index];
    if (!result) {
      return {
        coreId: assignment.coreId,
        gantt: [],
        busyTime: 0,
        idleTime: 0,
        utilization: 0,
        assignedCount: 0,
      };
    }

    const gantt = result.gantt.map((block) => ({ ...block, coreId: assignment.coreId }));
    const busyTime = getCoreBusyTime(gantt);

    return {
      coreId: assignment.coreId,
      gantt,
      busyTime,
      idleTime: 0,
      utilization: 0,
      assignedCount: assignment.queue.length,
    };
  });

  const allGantt = coreTimelines.flatMap((timeline) => timeline.gantt);
  const totalTime = allGantt.reduce((max, block) => Math.max(max, block.end), 0);

  const results = coreResults.flatMap((result) => (result?.metrics.results ?? []));
  const totalBusy = coreTimelines.reduce((sum, timeline) => sum + timeline.busyTime, 0);
  const totalContextSwitches = coreResults.reduce(
    (sum, result) => sum + (result?.metrics.contextSwitches ?? 0),
    0
  );

  const resultCount = Math.max(results.length, 1);
  const avgWaitingTime = results.reduce((sum, p) => sum + p.waitingTime, 0) / resultCount;
  const avgTurnaroundTime = results.reduce((sum, p) => sum + p.turnaroundTime, 0) / resultCount;
  const avgResponseTime = results.reduce((sum, p) => sum + p.responseTime, 0) / resultCount;

  const metrics: SchedulingMetrics = {
    results,
    avgWaitingTime,
    avgTurnaroundTime,
    avgResponseTime,
    cpuUtilization: totalTime ? (totalBusy / (totalTime * coreCount)) * 100 : 0,
    throughput: totalTime ? results.length / totalTime : 0,
    contextSwitches: totalContextSwitches,
    totalTime,
    coreMetrics: coreTimelines.map((timeline) => ({
      coreId: timeline.coreId,
      assignedCount: timeline.assignedCount,
      busyTime: timeline.busyTime,
      idleTime: totalTime - timeline.busyTime,
      utilization: totalTime ? (timeline.busyTime / totalTime) * 100 : 0,
    })),
    mode: 'multi',
  } as SchedulingMetrics;

  const sortedGantt = [...allGantt].sort(
    (a, b) => a.start - b.start || (a.coreId ?? 0) - (b.coreId ?? 0)
  );
  return {
    gantt: sortedGantt,
    metrics,
    coreTimelines,
  } as SimulationResult & { coreTimelines: CoreTimeline[] };
}
