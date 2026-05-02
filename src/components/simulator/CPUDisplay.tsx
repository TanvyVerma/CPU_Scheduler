import { useSimulation } from '@/hooks/useSimulation';

export default function CPUDisplay() {
  const { runningPID, currentTime, progress, isSimulated } = useSimulation();

  if (!isSimulated) return null;

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-[#151720] border border-white/[0.07] rounded-lg">
      {/* CPU icon */}
      <div
        className={`w-[28px] h-[28px] rounded-[6px] flex items-center justify-center text-[13px] flex-shrink-0
          ${runningPID
            ? 'bg-[rgba(14,207,142,0.15)] border border-[#0ecf8e] animate-pulse-green'
            : 'bg-[#1d2030] border border-white/[0.07]'}`}
      >
        💻
      </div>

      {/* Clock */}
      <div>
        <div className="text-[9px] text-[#454a60] uppercase tracking-[0.08em]">Clock</div>
        <div className="font-mono text-[17px] font-semibold tracking-tight leading-tight">
          {currentTime}
          <span className="text-[10px] text-[#454a60] ml-0.5">ms</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-7 bg-white/[0.07]" />

      {/* Running */}
      <div>
        <div className="text-[9px] text-[#454a60] uppercase tracking-[0.08em]">Running</div>
        <div
          className="font-mono text-[13px] font-semibold"
          style={{ color: runningPID ? '#0ecf8e' : '#454a60' }}
        >
          {runningPID ?? 'IDLE'}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-7 bg-white/[0.07]" />

      {/* Progress */}
      <div className="text-center">
        <div className="text-[9px] text-[#454a60] uppercase tracking-[0.08em]">Done</div>
        <div className="font-mono text-[13px] font-semibold text-[#b39dff]">{progress}%</div>
      </div>
    </div>
  );
}
