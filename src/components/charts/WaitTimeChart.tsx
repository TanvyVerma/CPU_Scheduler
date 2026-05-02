import type { CompareResults } from '@/types';
import { ALGORITHM_INFO } from '@/data/algorithms';

interface WaitTimeChartProps {
  results: CompareResults;
  metric: 'avgWaitingTime' | 'avgTurnaroundTime' | 'contextSwitches' | 'cpuUtilization';
  label: string;
  colorFn?: (id: string, val: number, max: number) => string;
}

export default function WaitTimeChart({ results, metric, label, colorFn }: WaitTimeChartProps) {
  const entries = Object.entries(results) as [string, CompareResults[keyof CompareResults]][];
  const values = entries.map(([, m]) => Number(m[metric as keyof typeof m]));
  const maxVal = Math.max(...values, 1);
  const bestId = entries.reduce(
    (b, [id, m]) => {
      const v = Number(m[metric as keyof typeof m]);
      if (!b) return id;
      const bv = Number(results[b as keyof CompareResults][metric as keyof CompareResults[keyof CompareResults]]);
      return metric === 'cpuUtilization' ? (v > bv ? id : b) : (v < bv ? id : b);
    },
    null as string | null
  );

  return (
    <div>
      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-2">
        {label}
      </div>
      {entries.map(([id, m]) => {
        const val = Number(m[metric as keyof typeof m]);
        const pct = metric === 'cpuUtilization' ? val : (val / maxVal) * 100;
        const isBest = id === bestId;
        const defaultColor = isBest ? '#0ecf8e' : '#7c6fff';
        const barColor = colorFn ? colorFn(id, val, maxVal) : defaultColor;
        const info = ALGORITHM_INFO.find((a) => a.id === id);

        return (
          <div key={id} className="flex items-center gap-2 mb-1.5">
            <div className="font-mono text-[10px] text-[#7e85a0] w-[38px] text-right flex-shrink-0">
              {(info?.name ?? id).toUpperCase()}
            </div>
            <div className="flex-1 h-2 bg-[#1d2030] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, pct)}%`, background: barColor }}
              />
            </div>
            <div className="font-mono text-[10px] text-[#454a60] w-10 flex-shrink-0">
              {typeof val === 'number' && !Number.isInteger(val) ? val.toFixed(1) : val}
              {metric === 'cpuUtilization' ? '%' : ''}
            </div>
          </div>
        );
      })}
    </div>
  );
}
