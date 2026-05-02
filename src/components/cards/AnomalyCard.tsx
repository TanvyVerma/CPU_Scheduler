import type { Anomaly } from '@/types';

const styles = {
  error:   { dot: '#ff6b6b', bg: 'rgba(255,107,107,0.08)',   border: 'rgba(255,107,107,0.25)' },
  warning: { dot: '#f5a623', bg: 'rgba(245,166,35,0.08)',    border: 'rgba(245,166,35,0.25)' },
  info:    { dot: '#5ba4f5', bg: 'rgba(91,164,245,0.08)',    border: 'rgba(91,164,245,0.25)' },
};

export default function AnomalyCard({ anomaly }: { anomaly: Anomaly }) {
  const s = styles[anomaly.type];
  return (
    <div
      className="flex gap-2.5 p-2.5 rounded-lg border mb-2 animate-fade-in"
      style={{ background: s.bg, borderColor: s.border }}
    >
      <div
        className="w-[7px] h-[7px] rounded-full flex-shrink-0 mt-1"
        style={{ background: s.dot }}
      />
      <div>
        <div className="text-[11px] font-semibold text-[#dde1f0]">{anomaly.title}</div>
        <div className="text-[10px] text-[#7e85a0] mt-1 leading-relaxed">{anomaly.description}</div>
        <div className="text-[9px] font-semibold mt-1.5" style={{ color: s.dot }}>
          ↳ {anomaly.fix}
        </div>
      </div>
    </div>
  );
}
