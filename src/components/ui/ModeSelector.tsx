import { useSimulationStore } from '@/store/useSimulationStore';

export default function ModeSelector() {
  const { mode, setMode } = useSimulationStore();

  return (
    <div>
      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-2">
        Simulation Mode
      </div>
      <div className="flex items-center gap-2">
        {(['single', 'multi'] as const).map((item) => (
          <button
            key={item}
            onClick={() => setMode(item)}
            className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all border ${
              mode === item
                ? 'bg-[#151720] border-white/[0.15] text-[#dde1f0]'
                : 'border-white/[0.07] text-[#7e85a0] hover:text-[#dde1f0]'
            }`}
          >
            {item === 'single' ? 'Single-Core' : 'Multi-Core'}
          </button>
        ))}
      </div>
    </div>
  );
}
