import type { Recommendation } from '@/types';
import { useSimulationStore } from '@/store/useSimulationStore';
import Button from '@/components/common/Button';

export default function RecommendationCard({ rec }: { rec: Recommendation }) {
  const setAlgorithm = useSimulationStore((s) => s.setAlgorithm);

  return (
    <div className="bg-[#151720] border border-[rgba(124,111,255,0.3)] rounded-xl p-3 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[14px] font-bold text-[#b39dff]">→ {rec.algorithmName}</div>
        <div className="flex items-center gap-1">
          <div
            className="h-1 w-16 rounded-full bg-[#1d2030] overflow-hidden"
          >
            <div
              className="h-full rounded-full bg-[#7c6fff]"
              style={{ width: `${rec.confidence}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[#7e85a0]">{rec.confidence}%</span>
        </div>
      </div>
      <p className="text-[10px] text-[#7e85a0] leading-relaxed mb-1">{rec.reason}</p>
      {rec.tradeoffs && (
        <p className="text-[10px] text-[#454a60] leading-relaxed mb-2.5">
          ⚖ {rec.tradeoffs}
        </p>
      )}
      <Button
        variant="primary"
        size="xs"
        fullWidth
        onClick={() => setAlgorithm(rec.algorithm)}
      >
        Switch to {rec.algorithmName} ↗
      </Button>
    </div>
  );
}
