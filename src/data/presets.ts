import type { Process, AlgorithmId } from '@/types';

export interface Preset {
  name: string;
  tag: string;
  description: string;
  recommendedAlgo: AlgorithmId;
  processes: Process[];
}

export const PRESETS: Preset[] = [
  {
    name: 'Convoy Effect',
    tag: 'FCFS pitfall',
    description: 'A long CPU-bound job blocks short processes. Classic FCFS failure mode.',
    recommendedAlgo: 'fcfs',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 20, priority: 1 },
      { id: 'P2', arrivalTime: 1, burstTime: 2,  priority: 2 },
      { id: 'P3', arrivalTime: 2, burstTime: 2,  priority: 2 },
      { id: 'P4', arrivalTime: 3, burstTime: 2,  priority: 2 },
    ],
  },
  {
    name: 'Starvation',
    tag: 'Priority pitfall',
    description: 'Low-priority processes starve as high-priority ones keep arriving.',
    recommendedAlgo: 'priority',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 5 },
      { id: 'P2', arrivalTime: 0, burstTime: 3, priority: 1 },
      { id: 'P3', arrivalTime: 0, burstTime: 4, priority: 1 },
      { id: 'P4', arrivalTime: 0, burstTime: 6, priority: 2 },
      { id: 'P5', arrivalTime: 0, burstTime: 2, priority: 1 },
    ],
  },
  {
    name: 'Heavy Switching',
    tag: 'RR overhead demo',
    description: 'Equal burst processes with small quantum cause excessive context switches.',
    recommendedAlgo: 'rr',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 8, priority: 1 },
      { id: 'P2', arrivalTime: 0, burstTime: 8, priority: 2 },
      { id: 'P3', arrivalTime: 0, burstTime: 8, priority: 3 },
      { id: 'P4', arrivalTime: 0, burstTime: 8, priority: 4 },
    ],
  },
  {
    name: 'Equal Arrival',
    tag: 'Baseline comparison',
    description: 'All processes arrive at t=0. Clean comparison of non-preemptive algorithms.',
    recommendedAlgo: 'sjf',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
      { id: 'P2', arrivalTime: 0, burstTime: 3, priority: 3 },
      { id: 'P3', arrivalTime: 0, burstTime: 7, priority: 1 },
      { id: 'P4', arrivalTime: 0, burstTime: 2, priority: 4 },
    ],
  },
  {
    name: 'Mixed Workload',
    tag: 'MLFQ showcase',
    description: 'Mix of I/O-bound short jobs and CPU-bound long jobs. MLFQ shines here.',
    recommendedAlgo: 'mlfq',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 1,  priority: 1 },
      { id: 'P2', arrivalTime: 1, burstTime: 10, priority: 3 },
      { id: 'P3', arrivalTime: 2, burstTime: 3,  priority: 2 },
      { id: 'P4', arrivalTime: 4, burstTime: 15, priority: 4 },
      { id: 'P5', arrivalTime: 5, burstTime: 2,  priority: 1 },
    ],
  },
  {
    name: 'Priority Flooding',
    tag: 'Scheduling stress test',
    description: 'Many equal-priority processes arriving at close intervals.',
    recommendedAlgo: 'hrrn',
    processes: [
      { id: 'P1', arrivalTime: 0, burstTime: 6, priority: 1 },
      { id: 'P2', arrivalTime: 1, burstTime: 4, priority: 1 },
      { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 2 },
      { id: 'P4', arrivalTime: 3, burstTime: 2, priority: 1 },
      { id: 'P5', arrivalTime: 4, burstTime: 5, priority: 1 },
      { id: 'P6', arrivalTime: 5, burstTime: 3, priority: 1 },
    ],
  },
];
