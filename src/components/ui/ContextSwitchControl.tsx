import { useSimulationStore } from '@/store/useSimulationStore';

export default function ContextSwitchControl() {
  const { contextSwitchCost, setContextSwitchCost, simResult } = useSimulationStore();
  const ctx = simResult?.metrics.contextSwitches ?? 0;
  const totalTime = simResult?.metrics.totalTime ?? 1;
  const waste = ctx * contextSwitchCost;
  const loss = totalTime > 0 ? ((waste / totalTime) * 100).toFixed(1) : '0.0';

  return (
    <div>
      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-2">
        Context Switch Cost
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={20}
          value={contextSwitchCost}
          onChange={(e) => setContextSwitchCost(parseInt(e.target.value) || 0)}
          className="w-[46px] bg-[#151720] border border-white/[0.07] rounded-[5px] text-[#dde1f0] font-mono text-[11px] px-1.5 py-1 outline-none focus:border-[#7c6fff] text-center transition-colors"
        />
        <span className="text-[#7e85a0] text-[11px]">ms / switch</span>
      </div>
      {simResult && (
        <div className="mt-1.5 text-[10px] text-[#454a60] leading-relaxed">
          {ctx} switches ·{' '}
          <span className="text-[#ff6b6b]">{waste}ms wasted</span> ·{' '}
          <span className="text-[#f5a623]">{loss}% efficiency loss</span>
        </div>
      )}
    </div>
  );
}
