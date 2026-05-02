import type { Process, QuantumAnalysis } from '@/types';
import { avg, median, stdDev } from '@/utils/helpers';

export function analyzeQuantum(processes: Process[], currentQuantum: number): QuantumAnalysis {
  const bursts = processes.map((p) => p.burstTime);
  const avgBurst = avg(bursts);
  const medBurst = median(bursts);
  const std = stdDev(bursts);
  const minBurst = Math.min(...bursts);
  const maxBurst = Math.max(...bursts);

  // Suggested quantum: average of avg and median × 0.45
  const suggestedQuantum = Math.max(1, Math.ceil(((avgBurst + medBurst) / 2) * 0.45));
  const tooSmall = Math.max(1, Math.ceil(avgBurst * 0.15));
  const tooLarge = Math.ceil(avgBurst * 1.8);

  let assessment: QuantumAnalysis['assessment'];
  if (currentQuantum < tooSmall) assessment = 'too-small';
  else if (currentQuantum > tooLarge) assessment = 'too-large';
  else if (Math.abs(currentQuantum - suggestedQuantum) <= 1) assessment = 'optimal';
  else assessment = 'ok';

  return {
    avgBurst,
    medianBurst: medBurst,
    stdDev: std,
    minBurst,
    maxBurst,
    suggestedQuantum,
    tooSmall,
    tooLarge,
    assessment,
  };
}
