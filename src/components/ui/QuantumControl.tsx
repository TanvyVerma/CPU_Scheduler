import { useSimulationStore } from '@/store/useSimulationStore';
import { analyzeQuantum } from '@/engine/quantumEngine';

export default function QuantumControl() {
  const { quantum, setQuantum, processes, algorithm } = useSimulationStore();

  if (algorithm !== 'rr') return null;

  const qa = analyzeQuantum(processes, quantum);

  return (
    <div>
      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-2">
        Round Robin Quantum
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[#7e85a0] text-[11px]">q =</span>
        <input
          type="number"
          min={1}
          max={50}
          value={quantum}
          onChange={(e) => setQuantum(parseInt(e.target.value) || 1)}
          className="w-[46px] bg-[#151720] border border-white/[0.07] rounded-[5px] text-[#dde1f0] font-mono text-[11px] px-1.5 py-1 outline-none focus:border-[#7c6fff] text-center transition-colors"
        />
        <span className="text-[#454a60] text-[10px]">ms</span>
        <span className="text-[#454a60] text-[10px]">
          · suggested:{' '}
          <button
            onClick={() => setQuantum(qa.suggestedQuantum)}
            className="text-[#b39dff] font-semibold hover:underline"
          >
            {qa.suggestedQuantum}ms ↗
          </button>
        </span>
      </div>

      {qa.assessment === 'too-small' && (
        <div className="flex items-start gap-1.5 px-2 py-1.5 rounded-md text-[10px] bg-[rgba(245,166,35,0.1)] text-[#f5a623] border border-[rgba(245,166,35,0.25)] mt-1.5">
          ⚠ Quantum too small — excessive context switching
        </div>
      )}
      {qa.assessment === 'too-large' && (
        <div className="flex items-start gap-1.5 px-2 py-1.5 rounded-md text-[10px] bg-[rgba(91,164,245,0.1)] text-[#5ba4f5] border border-[rgba(91,164,245,0.25)] mt-1.5">
          ℹ Large quantum — RR behaves like FCFS
        </div>
      )}
      {qa.assessment === 'optimal' && (
        <div className="flex items-start gap-1.5 px-2 py-1.5 rounded-md text-[10px] bg-[rgba(14,207,142,0.1)] text-[#0ecf8e] border border-[rgba(14,207,142,0.25)] mt-1.5">
          ✓ Quantum looks optimal for this workload
        </div>
      )}
    </div>
  );
}
