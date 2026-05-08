import { useSimulationStore } from '@/store/useSimulationStore';
import { ALGORITHM_INFO } from '@/data/algorithms';
import type { AlgorithmId } from '@/types';

export default function AlgorithmSelector() {
  const { algorithm, setAlgorithm } = useSimulationStore();

  return (
    <div>
      <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#cbd5ff] mb-3">
        Algorithm
      </div>
      <div className="grid grid-cols-2 gap-2">
        {ALGORITHM_INFO.map((algo) => (
          <button
            key={algo.id}
            title={algo.description}
            onClick={() => setAlgorithm(algo.id as AlgorithmId)}
            className={`
              px-3 py-3 rounded-lg text-left border transition-all duration-200 hover:shadow-md
              ${algorithm === algo.id
                ? 'bg-[rgba(124,111,255,0.15)] border-[#7c6fff] text-[#b39dff] shadow-lg shadow-[#7c6fff]/10'
                : 'bg-[#151720] border-white/[0.07] text-[#7e85a0] hover:border-white/[0.13] hover:text-[#dde1f0] hover:bg-[#1d2030]'}
            `}
          >
            <div className="font-semibold text-[12px] mb-1">{algo.name}</div>
            <div className="text-[11px] opacity-80 leading-tight text-[#cbd5ff]">{algo.tag}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
