import { useSimulationStore } from '@/store/useSimulationStore';

export default function CoreCountControl() {
  const { mode, coreCount, setCoreCount } = useSimulationStore();
  if (mode !== 'multi') return null;

  return (
    <div>
      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-2">
        CPU Cores
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={2}
          max={16}
          value={coreCount}
          onChange={(e) => setCoreCount(Math.max(2, Number(e.target.value) || 2))}
          className="w-[56px] bg-[#151720] border border-white/[0.07] rounded-[5px] text-[#dde1f0] font-mono text-[11px] px-2 py-1 outline-none focus:border-[#7c6fff]"
        />
        <span className="text-[11px] text-[#7e85a0]">cores</span>
      </div>
    </div>
  );
}
