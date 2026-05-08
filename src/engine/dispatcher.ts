import type { CoreAssignment } from './core';
import type { Process } from '@/types';

export function createCores(count: number): CoreAssignment[] {
  return Array.from({ length: Math.max(1, count) }, (_, index) => ({
    coreId: index + 1,
    queue: [],
    totalWork: 0,
  }));
}

export function assignProcessToLeastLoadedCore(process: Process, cores: CoreAssignment[]) {
  const target = cores.reduce((best, core) => {
    if (core.totalWork < best.totalWork) return core;
    if (core.totalWork === best.totalWork && core.coreId < best.coreId) return core;
    return best;
  }, cores[0]);

  target.queue.push(process);
  target.totalWork += process.burstTime;
}

export function dispatchProcesses(processes: Process[], coreCount: number): CoreAssignment[] {
  const cores = createCores(coreCount);
  const sorted = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime;
    return a.id.localeCompare(b.id);
  });

  sorted.forEach((process) => assignProcessToLeastLoadedCore(process, cores));
  return cores;
}
