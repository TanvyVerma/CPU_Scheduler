import type { Process, SchedulingMetrics, AlgorithmId, Anomaly } from '@/types';

export function detectAnomalies(
  metrics: SchedulingMetrics,
  algorithm: AlgorithmId,
  processes: Process[],
  quantum: number
): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const { results, contextSwitches, cpuUtilization, avgWaitingTime } = metrics;

  // ── Convoy Effect ──────────────────────────────────────────────
  if (algorithm === 'fcfs' && processes.length > 1) {
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const firstBurst = sorted[0].burstTime;
    const restTotal = sorted.slice(1).reduce((s, p) => s + p.burstTime, 0);
    if (firstBurst > restTotal * 0.5 && firstBurst > 5) {
      anomalies.push({
        type: 'warning',
        title: 'Convoy Effect Detected',
        description: `${sorted[0].id} (BT=${firstBurst}) is blocking ${sorted.length - 1} shorter processes. Short jobs suffer excessive waiting.`,
        fix: 'Switch to SJF to reduce average waiting time by ~40–60%',
        affectedProcesses: sorted.slice(1).map((p) => p.id),
      });
    }
  }

  // ── Starvation Risk ────────────────────────────────────────────
  if (['priority', 'sjf', 'srtf'].includes(algorithm)) {
    const threshold = Math.max(avgWaitingTime * 2.5, 10);
    const starved = results.filter((p) => p.waitingTime > threshold);
    if (starved.length) {
      anomalies.push({
        type: 'error',
        title: `Starvation Risk — ${starved.map((p) => p.id).join(', ')}`,
        description: `These processes waited ${Math.max(...starved.map((p) => p.waitingTime))}+ ms. In heavier workloads, they may never execute.`,
        fix: 'Use HRRN (natural aging) or implement priority aging / boost',
        affectedProcesses: starved.map((p) => p.id),
      });
    }
  }

  // ── High Context Switching ─────────────────────────────────────
  const highCtxThreshold = processes.length * 3;
  if (contextSwitches > highCtxThreshold) {
    anomalies.push({
      type: 'warning',
      title: `High Context Switching (${contextSwitches} switches)`,
      description: `${contextSwitches} context switches detected. At 1ms cost each, this adds significant scheduling overhead and reduces throughput.`,
      fix: algorithm === 'rr'
        ? `Increase quantum (current: ${quantum}ms). Try q=${Math.ceil(processes.reduce((s, p) => s + p.burstTime, 0) / processes.length * 0.4)}ms`
        : 'Consider non-preemptive SJF or HRRN for this workload',
    });
  }

  // ── Low CPU Utilization ────────────────────────────────────────
  if (cpuUtilization < 65 && processes.length > 1) {
    anomalies.push({
      type: 'info',
      title: `Low CPU Utilization (${cpuUtilization.toFixed(1)}%)`,
      description: `CPU is idle ${(100 - cpuUtilization).toFixed(1)}% of the time. Likely due to large arrival time gaps between processes.`,
      fix: 'Stagger process arrivals, add more processes, or batch workloads',
    });
  }

  // ── Round Robin Quantum Warnings ───────────────────────────────
  if (algorithm === 'rr') {
    const avgBurst = processes.reduce((s, p) => s + p.burstTime, 0) / processes.length;
    if (quantum < Math.ceil(avgBurst * 0.15)) {
      anomalies.push({
        type: 'warning',
        title: 'Quantum Too Small',
        description: `q=${quantum}ms vs avg burst=${avgBurst.toFixed(1)}ms. Scheduling overhead dominates useful work time.`,
        fix: `Increase quantum to ~${Math.ceil(avgBurst * 0.4)}ms (45% of avg burst)`,
      });
    } else if (quantum > avgBurst * 1.8) {
      anomalies.push({
        type: 'info',
        title: 'FCFS-like Behavior (Large Quantum)',
        description: `q=${quantum}ms far exceeds avg burst=${avgBurst.toFixed(1)}ms. RR degrades to FCFS with unnecessary preemption overhead.`,
        fix: `Reduce quantum to ~${Math.ceil(avgBurst * 0.4)}ms for true time-sharing`,
      });
    }
  }

  // ── Poor Throughput ────────────────────────────────────────────
  const expectedThru = processes.length / metrics.totalTime;
  if (expectedThru < 0.1 && processes.length >= 3) {
    anomalies.push({
      type: 'info',
      title: 'Low Throughput',
      description: `Only ${metrics.throughput.toFixed(3)} processes/ms. Total time is disproportionate to workload.`,
      fix: 'Check for CPU idle gaps caused by non-overlapping arrival times',
    });
  }

  return anomalies;
}
