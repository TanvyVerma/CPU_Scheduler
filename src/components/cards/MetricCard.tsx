import { Clock, TrendingUp, Zap, Cpu, BarChart3, ArrowRightLeft } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  subtext?: string;
}

const getIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case 'avg wait': return Clock;
    case 'avg tat': return TrendingUp;
    case 'avg rt': return Zap;
    case 'cpu util': return Cpu;
    case 'throughput': return BarChart3;
    case 'ctx sw': return ArrowRightLeft;
    default: return BarChart3;
  }
};

export default function MetricCard({ label, value, unit, color, subtext }: MetricCardProps) {
  const Icon = getIcon(label);

  return (
    <div className="bg-[#151720] border border-white/[0.07] rounded-lg px-3 py-3 hover:border-white/[0.13] hover:shadow-lg hover:shadow-[#7c6fff]/5 transition-all duration-200 group">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-[#7c6fff] opacity-80" />
        <span className="text-[10px] font-semibold tracking-[0.07em] uppercase text-[#cbd5ff]">{label}</span>
      </div>
      <div className="flex items-baseline gap-1 mt-1">
        <span
          className="font-mono text-[18px] font-bold"
          style={{ color: color ?? '#dde1f0' }}
        >
          {typeof value === 'number' ? value : value}
        </span>
        {unit && <span className="text-[11px] text-[#cbd5ff] font-medium">{unit}</span>}
      </div>
      {subtext && <div className="text-[10px] text-[#a9b4ff] mt-1">{subtext}</div>}
    </div>
  );
}
