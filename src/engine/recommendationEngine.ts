import type { Process, Recommendation, AlgorithmId } from '@/types';
import { avg, stdDev } from '@/utils/helpers';

export function generateRecommendation(processes: Process[]): Recommendation {
  if (!processes.length) {
    return { algorithm: 'fcfs', algorithmName: 'FCFS', confidence: 50, reason: 'No processes to analyze.', tradeoffs: '' };
  }

  const bursts = processes.map((p) => p.burstTime);
  const avgBurst = avg(bursts);
  const stdBurst = stdDev(bursts);
  const priorities = new Set(processes.map((p) => p.priority));
  const hasDiversePriority = priorities.size > 2;
  const allShort = avgBurst < 4;
  const highVariance = stdBurst > avgBurst * 0.6;
  const manyProcesses = processes.length > 4;
  const interactive = manyProcesses && avgBurst < 7;

  let algorithm: AlgorithmId;
  let algorithmName: string;
  let confidence: number;
  let reason: string;
  let tradeoffs: string;

  if (allShort && !hasDiversePriority) {
    algorithm = 'sjf';
    algorithmName = 'SJF';
    confidence = 90;
    reason = `All processes have short burst times (avg: ${avgBurst.toFixed(1)}ms). SJF minimizes average waiting time provably.`;
    tradeoffs = 'No starvation risk here. Non-preemptive so zero preemption overhead.';
  } else if (hasDiversePriority && highVariance) {
    algorithm = 'mlfq';
    algorithmName = 'MLFQ';
    confidence = 85;
    reason = `Mixed priorities (${priorities.size} levels) and high burst variance (σ=${stdBurst.toFixed(1)}ms). MLFQ adapts dynamically.`;
    tradeoffs = 'Higher implementation complexity. Favors I/O-bound over CPU-bound — ideal for mixed workloads.';
  } else if (interactive) {
    algorithm = 'rr';
    algorithmName = 'Round Robin';
    confidence = 80;
    reason = `${processes.length} processes with moderate burst times. RR provides fair time-sharing with bounded response time for all.`;
    tradeoffs = 'Context switch overhead increases with more processes. Tune quantum to ~45% of avg burst.';
  } else if (!hasDiversePriority && processes.length <= 3) {
    algorithm = 'fcfs';
    algorithmName = 'FCFS';
    confidence = 75;
    reason = 'Small, uniform workload with no priority differences. FCFS has zero scheduling overhead.';
    tradeoffs = 'Can suffer convoy effect if one long job arrives first. Acceptable for small, predictable batches.';
  } else if (hasDiversePriority) {
    algorithm = 'priority';
    algorithmName = 'Priority';
    confidence = 78;
    reason = `Processes span ${priorities.size} priority levels. Priority scheduling ensures urgent tasks get CPU first.`;
    tradeoffs = 'Monitor for starvation of low-priority processes. Consider HRRN if starvation appears.';
  } else {
    algorithm = 'hrrn';
    algorithmName = 'HRRN';
    confidence = 72;
    reason = `Mixed workload (avg burst: ${avgBurst.toFixed(1)}ms, σ=${stdBurst.toFixed(1)}ms). HRRN balances wait time via aging without preemption.`;
    tradeoffs = 'Non-preemptive — long jobs block once started. Best for batch systems where responsiveness isn\'t critical.';
  }

  return { algorithm, algorithmName, confidence, reason, tradeoffs };
}
