interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  subtext?: string;
}

export default function MetricCard({ label, value, unit, color, subtext }: MetricCardProps) {
  return (
    <div className="bg-[#151720] border border-white/[0.07] rounded-lg px-3 py-2">
      <div className="text-[9px] font-semibold tracking-[0.07em] uppercase text-[#454a60]">{label}</div>
      <div className="flex items-baseline gap-0.5 mt-0.5">
        <span
          className="font-mono text-[16px] font-semibold"
          style={{ color: color ?? '#dde1f0' }}
        >
          {typeof value === 'number' ? value : value}
        </span>
        {unit && <span className="text-[9px] text-[#454a60]">{unit}</span>}
      </div>
      {subtext && <div className="text-[9px] text-[#454a60] mt-0.5">{subtext}</div>}
    </div>
  );
}
