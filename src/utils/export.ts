import type { SchedulingMetrics, GanttBlock, Process, AlgorithmId } from '@/types';
import { PROCESS_COLORS } from './helpers';

// ─── CSV Export ────────────────────────────────────────────────────────────

export function exportResultsCSV(metrics: SchedulingMetrics, algo: AlgorithmId): void {
  const header = 'PID,ArrivalTime,BurstTime,Priority,FinishTime,TurnaroundTime,WaitingTime,ResponseTime';
  const rows = metrics.results.map(
    (p) => `${p.id},${p.arrivalTime},${p.burstTime},${p.priority},${p.completionTime},${p.turnaroundTime},${p.waitingTime},${p.responseTime}`
  );
  const csv = [header, ...rows].join('\n');
  download(`cpu_${algo}_${Date.now()}.csv`, 'text/csv', csv);
}

// ─── JSON Export ───────────────────────────────────────────────────────────

export function exportScenarioJSON(processes: Process[], algo: AlgorithmId, quantum: number, metrics?: SchedulingMetrics, gantt?: GanttBlock[]): void {
  const data = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    algorithm: algo,
    quantum,
    processes,
    metrics: metrics ?? null,
    gantt: gantt ?? null,
  };
  download(`scenario_${algo}_${Date.now()}.json`, 'application/json', JSON.stringify(data, null, 2));
}

// ─── SVG Gantt Export ─────────────────────────────────────────────────────

export function exportGanttSVG(gantt: GanttBlock[], processes: Process[], algo: string): void {
  const totalTime = gantt.reduce((s, b) => Math.max(s, b.end), 0);
  const W = Math.max(900, totalTime * 30);
  const H = 130;
  const trackW = W - 90;
  const trackX = 70;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="background:#07080d;font-family:'IBM Plex Mono',monospace">`;

  // Background
  svg += `<rect width="${W}" height="${H}" fill="#07080d"/>`;

  // Title
  svg += `<text x="${trackX}" y="18" fill="#7e85a0" font-size="11" font-weight="600">${algo.toUpperCase()} — Gantt Chart · ${totalTime}ms</text>`;

  // Track background
  svg += `<rect x="${trackX}" y="26" width="${trackW}" height="50" rx="6" fill="#1d2030"/>`;

  // Blocks
  gantt.forEach((b) => {
    const idx = processes.findIndex((p) => p.id === b.pid);
    const col = PROCESS_COLORS[idx >= 0 ? idx % PROCESS_COLORS.length : 0];
    const x = trackX + (b.start / totalTime) * trackW;
    const w = Math.max(18, ((b.end - b.start) / totalTime) * trackW);
    svg += `<rect x="${x}" y="26" width="${w}" height="50" fill="${col.bg}" stroke="${col.border}" stroke-width="1.5" rx="3"/>`;
    svg += `<text x="${x + w / 2}" y="55" fill="${col.text}" font-size="11" text-anchor="middle" font-weight="600">${b.pid}</text>`;
    svg += `<text x="${x}" y="95" fill="#454a60" font-size="9" text-anchor="middle">${b.start}</text>`;
  });

  // Last tick
  svg += `<text x="${trackX + trackW}" y="95" fill="#454a60" font-size="9" text-anchor="middle">${totalTime}</text>`;

  svg += '</svg>';
  download(`gantt_${algo}_${Date.now()}.svg`, 'image/svg+xml', svg);
}

// ─── Import JSON ──────────────────────────────────────────────────────────

export function importScenarioJSON(json: string): { processes: Process[]; algo: AlgorithmId; quantum: number } | null {
  try {
    const data = JSON.parse(json);
    return {
      processes: data.processes,
      algo: data.algorithm,
      quantum: data.quantum ?? 3,
    };
  } catch {
    return null;
  }
}

// ─── Helper ───────────────────────────────────────────────────────────────

function download(filename: string, mime: string, content: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
