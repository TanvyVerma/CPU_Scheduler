import type { Process, SimulationResult, AlgorithmId } from '@/types';
import { runFCFS } from './fcfs';
import { runSJF } from './sjf';
import { runSRTF } from './srtf';
import { runPriority } from './priority';
import { runRoundRobin } from './roundRobin';
import { runHRRN } from './hrrn';
import { runMLFQ } from './mlfq';

export function runAlgorithm(
  id: AlgorithmId,
  processes: Process[],
  quantum: number
): SimulationResult | null {
  if (!processes.length) return null;
  try {
    switch (id) {
      case 'fcfs':     return runFCFS(processes);
      case 'sjf':      return runSJF(processes);
      case 'srtf':     return runSRTF(processes);
      case 'priority': return runPriority(processes);
      case 'rr':       return runRoundRobin(processes, quantum);
      case 'hrrn':     return runHRRN(processes);
      case 'mlfq':     return runMLFQ(processes);
      default:         return null;
    }
  } catch (err) {
    console.error(`Algorithm ${id} failed:`, err);
    return null;
  }
}

export { runFCFS, runSJF, runSRTF, runPriority, runRoundRobin, runHRRN, runMLFQ };
