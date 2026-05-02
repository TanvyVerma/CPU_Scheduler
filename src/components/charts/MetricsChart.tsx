import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { SchedulingMetrics } from '@/types';
import { PROCESS_COLORS } from '@/utils/helpers';

interface MetricsChartProps {
  metrics: SchedulingMetrics;
}

export default function MetricsChart({ metrics }: MetricsChartProps) {
  const data = metrics.results.map((p, i) => ({
    name: p.id,
    'Wait': p.waitingTime,
    'TAT': p.turnaroundTime,
    'Response': p.responseTime,
    fill: PROCESS_COLORS[i % PROCESS_COLORS.length].border,
  }));

  return (
    <div className="h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#7e85a0', fontFamily: 'IBM Plex Mono' }} />
          <YAxis tick={{ fontSize: 9, fill: '#7e85a0', fontFamily: 'IBM Plex Mono' }} />
          <Tooltip
            contentStyle={{
              background: '#1d2030', border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: 8, fontSize: 11, fontFamily: 'IBM Plex Mono',
            }}
            labelStyle={{ color: '#dde1f0' }}
          />
          <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: '#7e85a0' }} />
          <Bar dataKey="Wait"     fill="#f5a623" radius={[3,3,0,0]} maxBarSize={18} />
          <Bar dataKey="TAT"      fill="#5ba4f5" radius={[3,3,0,0]} maxBarSize={18} />
          <Bar dataKey="Response" fill="#22d3ee" radius={[3,3,0,0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
