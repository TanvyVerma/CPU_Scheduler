import type { SchedulingMetrics } from '@/types';
import { ALGORITHM_INFO } from '@/data/algorithms';
import Badge from '@/components/common/Badge';

interface CompareTableProps {
  results: Record<string, SchedulingMetrics>;
  processCount: number;
}

export default function CompareTable({ results, processCount }: CompareTableProps) {
  const entries = Object.entries(results);

  const bestWT   = entries.reduce((b, [id, m]) => (!b || m.avgWaitingTime < results[b].avgWaitingTime) ? id : b, '');
  const bestTAT  = entries.reduce((b, [id, m]) => (!b || m.avgTurnaroundTime < results[b].avgTurnaroundTime) ? id : b, '');
  const bestUtil = entries.reduce((b, [id, m]) => (!b || m.cpuUtilization > results[b].cpuUtilization) ? id : b, '');

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr>
            {['Algorithm', 'Avg WT', 'Avg TAT', 'Avg RT', 'CPU%', 'Ctx Sw', 'Throughput'].map((h) => (
              <th key={h} className="text-[9px] font-semibold tracking-[0.06em] uppercase text-[#454a60] px-2 py-2 text-right border-b border-white/[0.07] first:text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map(([id, m]) => {
            const isWTBest  = id === bestWT;
            const isTATBest = id === bestTAT;
            const isUtilBest = id === bestUtil;
            const info = ALGORITHM_INFO.find((a) => a.id === id);
            const highCtx = m.contextSwitches > processCount * 3;
            const lowUtil = m.cpuUtilization < 65;
            return (
              <tr key={id} className="border-b border-white/[0.04] hover:bg-white/[0.02]" style={isWTBest ? { background: 'rgba(14,207,142,0.04)' } : {}}>
                <td className="px-2 py-2 text-left">
                  <span className="font-mono font-semibold text-[10px]" style={{ color: isWTBest ? '#0ecf8e' : '#dde1f0' }}>
                    {id.toUpperCase()}
                  </span>
                  {isWTBest && <Badge color="green" className="ml-1.5">BEST WT</Badge>}
                  {info && <div className="text-[9px] text-[#454a60] mt-0.5">{info.tag}</div>}
                </td>
                <td className="px-2 py-2 text-right font-mono" style={{ color: isWTBest ? '#0ecf8e' : '#dde1f0' }}>
                  {m.avgWaitingTime.toFixed(2)}
                </td>
                <td className="px-2 py-2 text-right font-mono" style={{ color: isTATBest ? '#22d3ee' : '#dde1f0' }}>
                  {m.avgTurnaroundTime.toFixed(2)}
                </td>
                <td className="px-2 py-2 text-right font-mono text-[#7e85a0]">{m.avgResponseTime.toFixed(2)}</td>
                <td className="px-2 py-2 text-right font-mono" style={{ color: isUtilBest ? '#0ecf8e' : lowUtil ? '#ff6b6b' : m.cpuUtilization > 80 ? '#0ecf8e' : '#f5a623' }}>
                  {m.cpuUtilization.toFixed(1)}%
                </td>
                <td className="px-2 py-2 text-right font-mono" style={{ color: highCtx ? '#ff6b6b' : '#7e85a0' }}>
                  {m.contextSwitches}
                </td>
                <td className="px-2 py-2 text-right font-mono text-[#7e85a0]">{m.throughput.toFixed(3)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
