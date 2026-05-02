import type { Process } from '@/types';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateProcess(p: Partial<Process>): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!p.id || p.id.trim() === '') errors.push({ field: 'id', message: 'PID is required' });
  if (p.arrivalTime === undefined || p.arrivalTime < 0) errors.push({ field: 'arrivalTime', message: 'Arrival time must be ≥ 0' });
  if (!p.burstTime || p.burstTime < 1) errors.push({ field: 'burstTime', message: 'Burst time must be ≥ 1' });
  if (!p.priority || p.priority < 1) errors.push({ field: 'priority', message: 'Priority must be ≥ 1' });
  return errors;
}

export function validateProcessList(processes: Process[]): string[] {
  const errors: string[] = [];
  if (!processes.length) errors.push('Add at least one process');
  const ids = processes.map((p) => p.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) errors.push(`Duplicate PIDs: ${[...new Set(dupes)].join(', ')}`);
  return errors;
}

export function parseCSV(csv: string): Process[] {
  const lines = csv.trim().split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  return lines.map((line, i) => {
    const parts = line.split(',').map((p) => p.trim());
    return {
      id: parts[0] || `P${i + 1}`,
      arrivalTime: parseInt(parts[1]) || 0,
      burstTime: parseInt(parts[2]) || 1,
      priority: parseInt(parts[3]) || 1,
    };
  });
}

export function validateQuantum(q: number): string | null {
  if (q < 1) return 'Quantum must be at least 1ms';
  if (q > 100) return 'Quantum should not exceed 100ms';
  return null;
}
