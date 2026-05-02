import { useSimulation } from '@/hooks/useSimulation';
import { generateTicks } from '@/utils/helpers';
import { ALGORITHM_INFO } from '@/data/algorithms';
import { useState } from 'react';

export default function GanttChart() {
  const { visibleGantt, simResult, algorithm, playbackIndex, totalGanttBlocks, progress } = useSimulation();
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const totalTime = simResult?.metrics.totalTime ?? 20;
  const minWidth = Math.max(560, totalTime * 26);
  const algoInfo = ALGORITHM_INFO.find((a) => a.id === algorithm);
  const ticks = simResult ? generateTicks(totalTime) : [];

  return (
    <div className="bg-[#0e1018] border-b border-white/[0.07] px-4 py-3 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold tracking-[0.09em] uppercase text-[#454a60]">
            Gantt Chart
          </span>
          {algoInfo && (
            <span className="text-[11px] font-medium text-[#b39dff]">
              — {algoInfo.fullName}
            </span>
          )}
        </div>
        <span className="font-mono text-[10px] text-[#454a60]">
          {simResult
            ? `${playbackIndex}/${totalGanttBlocks} blocks · ${totalTime}ms`
            : 'ready'}
        </span>
      </div>

      {/* Track */}
      <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
        <div style={{ width: minWidth }}>
          {/* Gantt blocks */}
          <div
            className="h-10 flex rounded-lg overflow-hidden"
            style={{ background: '#1d2030', minWidth: '100%' }}
          >
            {!visibleGantt.length && (
              <div className="flex-1 flex items-center justify-center text-[#454a60] text-[11px]">
                ▶ Press Play to start simulation
              </div>
            )}
            {visibleGantt.map((block, i) => {
              const dur = block.end - block.start;
              const w = Math.max(22, (dur / totalTime) * minWidth);
              return (
                <div
                  key={i}
                  className="gantt-block flex items-center justify-center font-mono text-[10px] font-semibold flex-shrink-0 cursor-default transition-all border-r border-black/25"
                  style={{
                    width: w,
                    background: block.color.bg,
                    borderLeft: `2px solid ${block.color.border}`,
                    color: block.color.text,
                  }}
                  onMouseEnter={(e) =>
                    setTooltip({
                      text: `${block.pid} · ${block.start}→${block.end}ms (${dur}ms)`,
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                >
                  {block.pid}
                </div>
              );
            })}
          </div>

          {/* Timeline ticks */}
          <div className="relative h-4 mt-1" style={{ minWidth: '100%' }}>
            {ticks.map((t) => (
              <span
                key={t}
                className="absolute bottom-0 font-mono text-[9px] text-[#454a60]"
                style={{ left: `${(t / totalTime) * 100}%` }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] bg-[#1d2030] rounded-full mt-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #7c6fff, #b39dff)',
          }}
        />
      </div>

      {/* Floating tooltip */}
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
