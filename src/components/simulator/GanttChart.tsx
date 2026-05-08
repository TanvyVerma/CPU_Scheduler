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
  const isMultiCore = simResult?.metrics.mode === 'multi';
  const coreOrder = isMultiCore
    ? simResult?.coreTimelines?.map((timeline) => timeline.coreId) ?? []
    : [];

  return (
    <div className="bg-[#0e1018] border-b border-white/[0.07] px-4 py-4 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold tracking-[0.09em] uppercase text-[#cbd5ff]">
            Gantt Chart
          </span>
          {algoInfo && (
            <span className="text-[12px] font-medium text-[#b39dff]">
              — {algoInfo.fullName}
            </span>
          )}
        </div>
        <span className="font-mono text-[11px] text-[#cbd5ff]">
          {simResult
            ? `${playbackIndex}/${totalGanttBlocks} blocks · ${totalTime}ms`
            : 'ready'}
        </span>
      </div>

      {/* Track */}
      <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
        <div style={{ width: minWidth }}>
          {isMultiCore ? (
            <div className="space-y-3">
              {coreOrder.map((coreId) => {
                const coreBlocks = visibleGantt.filter((block) => block.coreId === coreId);
                return (
                  <div key={coreId}>
                    <div className="text-[10px] text-[#7e85a0] uppercase tracking-[0.08em] mb-1">
                      Core {coreId}
                    </div>
                    <div
                      className="h-12 flex rounded-lg overflow-hidden shadow-inner"
                      style={{ background: '#1d2030', minWidth: '100%' }}
                    >
                      {!coreBlocks.length && (
                        <div className="flex-1 flex items-center justify-center text-[#454a60] text-[12px] font-medium">
                          idle
                        </div>
                      )}
                      {coreBlocks.map((block, i) => {
                        const dur = block.end - block.start;
                        const w = Math.max(24, (dur / totalTime) * minWidth);
                        return (
                          <div
                            key={`${coreId}-${i}`}
                            className="gantt-block flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0 cursor-default transition-all duration-200 hover:scale-105 hover:shadow-lg border-r border-black/20 relative"
                            style={{
                              width: w,
                              background: block.color.bg,
                              borderLeft: `3px solid ${block.color.border}`,
                              color: block.color.text,
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                            }}
                            onMouseEnter={(e) =>
                              setTooltip({
                                text: `Process ${block.pid}\nCore ${coreId}\nStart: ${block.start}ms\nEnd: ${block.end}ms\nDuration: ${dur}ms`,
                                x: e.clientX,
                                y: e.clientY,
                              })
                            }
                            onMouseLeave={() => setTooltip(null)}
                          >
                            <span className="drop-shadow-sm">{block.pid}</span>
                            {dur > 5 && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/20 rounded-b"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="h-12 flex rounded-lg overflow-hidden shadow-inner"
              style={{ background: '#1d2030', minWidth: '100%' }}
            >
              {!visibleGantt.length && (
                <div className="flex-1 flex items-center justify-center text-[#454a60] text-[12px] font-medium">
                  ▶ Press Play to start simulation
                </div>
              )}
              {visibleGantt.map((block, i) => {
                const dur = block.end - block.start;
                const w = Math.max(24, (dur / totalTime) * minWidth);
                return (
                  <div
                    key={i}
                    className="gantt-block flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0 cursor-default transition-all duration-200 hover:scale-105 hover:shadow-lg border-r border-black/20 relative"
                    style={{
                      width: w,
                      background: block.color.bg,
                      borderLeft: `3px solid ${block.color.border}`,
                      color: block.color.text,
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                    onMouseEnter={(e) =>
                      setTooltip({
                        text: `Process ${block.pid}\nStart: ${block.start}ms\nEnd: ${block.end}ms\nDuration: ${dur}ms`,
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <span className="drop-shadow-sm">{block.pid}</span>
                    {dur > 5 && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/20 rounded-b"></div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Timeline ticks */}
          <div className="relative h-5 mt-2" style={{ minWidth: '100%' }}>
            {ticks.map((t) => (
              <div
                key={t}
                className="absolute bottom-0 font-mono text-[10px] text-[#7e85a0] flex flex-col items-center"
                style={{ left: `${(t / totalTime) * 100}%` }}
              >
                <div className="w-px h-2 bg-[#454a60] mb-1"></div>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-[#1d2030] rounded-full mt-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #7c6fff, #b39dff)',
            boxShadow: '0 0 8px rgba(124,111,255,0.4)',
          }}
        />
      </div>

      {/* Floating tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 bg-[#1d2030] border border-white/[0.15] rounded-lg font-mono text-[11px] text-[#dde1f0] pointer-events-none shadow-xl backdrop-blur-sm"
          style={{ left: tooltip.x + 12, top: tooltip.y - 30 }}
        >
          {tooltip.text.split('\n').map((line, i) => (
            <div key={i} className={i === 0 ? 'font-bold text-[#b39dff]' : ''}>{line}</div>
          ))}
        </div>
      )}
    </div>
  );
}
