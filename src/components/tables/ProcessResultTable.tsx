import type { SchedulingMetrics } from '@/types';
import { PROCESS_COLORS } from '@/utils/helpers';

export default function ProcessResultTable({ metrics }: { metrics: SchedulingMetrics }) {
  const { results, avgWaitingTime } = metrics;

  return (
    <table className="w-full border-collapse text-[11px]">
      <thead>
        <tr>
          {['PID', 'Arrival', 'Burst', 'Priority', 'Finish', 'TAT', 'Wait', 'Response'].map((h) => (
            <th
              key={h}
              className="text-[9px] font-semibold tracking-[0.07em] uppercase text-[#454a60] px-2 py-1.5 text-left border-b border-white/[0.07] sticky top-0 bg-[#07080d]"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {results.map((p, i) => {
          const col = PROCESS_COLORS[i % PROCESS_COLORS.length];
          const isHighWait = p.waitingTime > avgWaitingTime * 1.5;
          return (
            <tr key={p.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
              <td className="px-2 py-1.5">
                <span
                  className="inline-flex items-center justify-center w-[28px] h-[20px] rounded text-[10px] font-semibold font-mono"
                  style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.text }}
                >
                  {p.id}
                </span>
              </td>
              <td className="px-2 py-1.5 font-mono text-[#7e85a0]">{p.arrivalTime}</td>
              <td className="px-2 py-1.5 font-mono text-[#7e85a0]">{p.burstTime}</td>
              <td className="px-2 py-1.5 font-mono text-[#7e85a0]">{p.priority}</td>
              <td className="px-2 py-1.5 font-mono">{p.completionTime}</td>
              <td className="px-2 py-1.5 font-mono text-[#5ba4f5]">{p.turnaroundTime}</td>
              <td
                className="px-2 py-1.5 font-mono"
                style={{ color: isHighWait ? '#ff6b6b' : '#f5a623' }}
              >
                {p.waitingTime}
              </td>
              <td className="px-2 py-1.5 font-mono text-[#22d3ee]">{p.responseTime}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
