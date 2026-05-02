import { useSimulation } from '@/hooks/useSimulation';
import AnomalyCard from '@/components/cards/AnomalyCard';
import { CheckCircle } from 'lucide-react';

export default function AnomalyPanel() {
  const { anomalies, isSimulated } = useSimulation();

  if (!isSimulated) {
    return (
      <div className="text-center py-8 text-[#454a60] text-[11px]">
        Run a simulation to detect scheduling anomalies
      </div>
    );
  }

  if (!anomalies.length) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <CheckCircle size={24} className="text-[#0ecf8e] mx-auto mb-2" />
        <div className="text-[12px] font-semibold text-[#0ecf8e]">No issues detected</div>
        <div className="text-[10px] text-[#454a60] mt-1">
          This configuration looks healthy
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-3">
        Detected Issues ({anomalies.length})
      </div>
      {anomalies.map((anomaly, i) => (
        <AnomalyCard key={i} anomaly={anomaly} />
      ))}
    </div>
  );
}
