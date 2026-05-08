import { useSimulation } from '@/hooks/useSimulation';

export default function CPUDisplay() {
  const { runningPID, currentTime, progress, isSimulated, mode, simResult } = useSimulation();

  if (!isSimulated) return null;

  const multiInfo = mode === 'multi' && simResult?.metrics.coreMetrics;
  const coreLabel = multiInfo ? `Cores ${multiInfo.length}` : 'Single CPU';
  const runningLabel = mode === 'multi' ? 'MULTI' : runningPID ?? 'IDLE';

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-[#151720] border border-white/[0.07] rounded-lg">
      {/* CPU icon */}
      <div
        className={`w-[28px] h-[28px] rounded-[6px] flex items-center justify-center text-[13px] flex-shrink-0
          ${runningLabel !== 'IDLE'
            ? 'bg-[rgba(14,207,142,0.15)] border border-[#0ecf8e] animate-pulse-green'
            : 'bg-[#1d2030] border border-white/[0.07]'}`}
      >
        💻
      </div>

      {/* Clock */}
      <div>
        <div className="text-[10px] text-[#cbd5ff] uppercase tracking-[0.08em]">Clock</div>
        <div className="font-mono text-[18px] font-semibold tracking-tight leading-tight">
          {currentTime}
          <span className="text-[11px] text-[#cbd5ff] ml-0.5">ms</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-7 bg-white/[0.07]" />

      {/* Mode */}
      <div>
        <div className="text-[10px] text-[#cbd5ff] uppercase tracking-[0.08em]">Mode</div>
        <div className="font-mono text-[14px] font-semibold text-[#b39dff]">{coreLabel}</div>
      </div>

      {/* Divider */}
      <div className="w-px h-7 bg-white/[0.07]" />

      {/* Running */}
      <div>
        <div className="text-[10px] text-[#cbd5ff] uppercase tracking-[0.08em]">Running</div>
        <div
          className="font-mono text-[14px] font-semibold"
          style={{ color: runningLabel !== 'IDLE' ? '#0ecf8e' : '#cbd5ff' }}
        >
          {runningLabel}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-7 bg-white/[0.07]" />

      {/* Progress */}
      <div className="text-center">
        <div className="text-[10px] text-[#cbd5ff] uppercase tracking-[0.08em]">Done</div>
        <div className="font-mono text-[14px] font-semibold text-[#b39dff]">{progress}%</div>
      </div>
    </div>
  );
}
