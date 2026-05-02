import { Loader2, Brain } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import Button from '@/components/common/Button';
import RecommendationCard from '@/components/cards/RecommendationCard';
import Divider from '@/components/common/Divider';

export default function AIPanel() {
  const { aiAnalysis, aiLoading, runAIAnalysis, isSimulated, recommendation } = useSimulation();

  return (
    <div className="animate-fade-in">
      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-3">
        AI-Powered Analysis
      </div>

      <Button
        variant="primary"
        fullWidth
        onClick={runAIAnalysis}
        disabled={!isSimulated || aiLoading}
        className="mb-3"
      >
        {aiLoading ? (
          <>
            <Loader2 size={11} className="animate-spin" />
            Analyzing workload…
          </>
        ) : (
          <>
            <Brain size={11} />
            Analyze with Claude AI
          </>
        )}
      </Button>

      {aiAnalysis ? (
        <div className="bg-[#151720] border border-white/[0.07] rounded-xl p-3 mb-3 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[12px]">🤖</span>
            <span className="text-[9px] font-semibold tracking-[0.08em] uppercase text-[#b39dff]">
              Claude Analysis
            </span>
          </div>
          <div
            className="text-[11px] text-[#7e85a0] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: aiAnalysis }}
          />
        </div>
      ) : !aiLoading ? (
        <div className="bg-[#151720] border border-white/[0.07] rounded-xl p-3 mb-3 text-[10px] text-[#454a60] leading-relaxed">
          Run a simulation first, then click Analyze to receive AI-powered scheduling recommendations
          tailored to your exact workload.
        </div>
      ) : null}

      <Divider />

      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-2">
        Rule-Based Recommendation
      </div>
      <RecommendationCard rec={recommendation} />
    </div>
  );
}
