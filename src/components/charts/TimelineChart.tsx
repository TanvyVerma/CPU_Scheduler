import type { GanttBlock, SchedulingMetrics } from '@/types';
import { PROCESS_COLORS } from '@/utils/helpers';
import { useState } from 'react';

interface TimelineChartProps {
  gantt: GanttBlock[];
  metrics: SchedulingMetrics;
}

export default function TimelineChart({ gantt, metrics }: TimelineChartProps) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const totalTime = metrics.totalTime;
  if (!gantt.length || !totalTime) return null;

  const pids = [...new Set(metrics.results.map((r) => r.id))];

  return (
    <div>
      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-3">
        Process Timeline ({totalTime}ms)
      </div>
      <div className="overflow-x-auto">
        {pids.map((pid, i) => {
          const col = PROCESS_COLORS[i % PROCESS_COLORS.length];
          const segs = gantt.filter((b) => b.pid === pid);
          return (
            <div key={pid} className="flex items-center gap-2 mb-2 h-[18px]">
              <div className="font-mono text-[10px] text-[#7e85a0] w-[28px] text-right flex-shrink-0">
                {pid}
              </div>
              <div className="relative flex-1 h-[14px] bg-[#1d2030] rounded-sm" style={{ minWidth: 460 }}>
                {segs.map((s, j) => {
                  const left = (s.start / totalTime) * 100;
                  const width = ((s.end - s.start) / totalTime) * 100;
                  return (
                    <div
                      key={j}
                      className="absolute h-full rounded-sm opacity-85 transition-opacity hover:opacity-100"
                      style={{
                        left: `${left}%`,
                        width: `${Math.max(0.5, width)}%`,
                        background: col.border,
                      }}
                      onMouseEnter={(e) =>
                        setTooltip({
                          text: `${pid}: ${s.start}→${s.end}ms (${s.end - s.start}ms)`,
                          x: e.clientX,
                          y: e.clientY,
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 bg-[#1d2030] border border-white/[0.13] rounded font-mono text-[10px] text-[#dde1f0] pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 30 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
