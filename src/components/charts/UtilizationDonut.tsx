interface UtilizationDonutProps {
  utilization: number;
  size?: number;
}

export default function UtilizationDonut({ utilization, size = 120 }: UtilizationDonutProps) {
  const r = 44;
  const cx = size / 2;
  const cy = size / 2;
  const full = 2 * Math.PI * r;
  const used = full * (utilization / 100);
  const color =
    utilization > 80 ? '#0ecf8e' :
    utilization > 60 ? '#f5a623' : '#ff6b6b';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1d2030" strokeWidth={12} />
      <circle
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeDasharray={`${used} ${full - used}`}
        strokeDashoffset={full * 0.25}
        strokeLinecap="round"
      />
      <text
        x={cx} y={cy - 5}
        textAnchor="middle"
        fill="#dde1f0"
        fontSize={16}
        fontWeight={600}
        fontFamily="IBM Plex Mono"
      >
        {utilization.toFixed(0)}%
      </text>
      <text
        x={cx} y={cy + 12}
        textAnchor="middle"
        fill="#454a60"
        fontSize={9}
        fontFamily="Outfit"
      >
        CPU UTIL
      </text>
    </svg>
  );
}
