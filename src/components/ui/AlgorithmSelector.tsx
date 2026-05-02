import { useSimulationStore } from '@/store/useSimulationStore';
import { ALGORITHM_INFO } from '@/data/algorithms';
import type { AlgorithmId } from '@/types';

export default function AlgorithmSelector() {
  const { algorithm, setAlgorithm } = useSimulationStore();

  return (
    <div>
      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-2">
        Algorithm
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {ALGORITHM_INFO.map((algo) => (
          <button
            key={algo.id}
            title={algo.description}
            onClick={() => setAlgorithm(algo.id as AlgorithmId)}
            className={`
              px-2.5 py-2 rounded-lg text-left border transition-all text-[11px]
              ${algorithm === algo.id
                ? 'bg-[rgba(124,111,255,0.12)] border-[#7c6fff] text-[#b39dff]'
                : 'bg-[#151720] border-white/[0.07] text-[#7e85a0] hover:border-white/[0.13] hover:text-[#dde1f0]'}
            `}
          >
            <div className="font-semibold">{algo.name}</div>
            <div className="text-[9px] opacity-55 mt-0.5">{algo.tag}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
