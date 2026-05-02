import { useSimulation } from '@/hooks/useSimulation';
import { useSimulationStore } from '@/store/useSimulationStore';
import Button from '@/components/common/Button';
import Divider from '@/components/common/Divider';

export default function QuantumOptimizerPanel() {
  const { quantumAnalysis, processes } = useSimulation();
  const setAlgorithm = useSimulationStore((s) => s.setAlgorithm);
  const setQuantum   = useSimulationStore((s) => s.setQuantum);

  if (!processes.length) {
    return (
      <div className="text-center py-8 text-[#454a60] text-[11px]">
        Add processes to see quantum analysis
      </div>
    );
  }

  const { avgBurst, medianBurst, stdDev, minBurst, maxBurst, suggestedQuantum, tooSmall, tooLarge } = quantumAnalysis;

  const bursts = [...processes].map((p) => p.burstTime).sort((a, b) => a - b);
  const maxB = Math.max(...bursts, 1);

  const guide = [
    { q: tooSmall, label: 'Too Small', desc: 'Excessive switches, low throughput', color: '#ff6b6b' },
    { q: suggestedQuantum, label: 'Optimal ✓', desc: 'Balanced fairness and efficiency', color: '#0ecf8e' },
    { q: tooLarge, label: 'Too Large', desc: 'Degrades to FCFS behavior', color: '#f5a623' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-3">
        Round Robin Optimizer
      </div>

      {/* Stats */}
      <div className="bg-[#151720] border border-white/[0.07] rounded-xl p-3 mb-3">
        <div className="grid grid-cols-2 gap-3 text-[11px]">
          {[
            ['Avg Burst', `${avgBurst.toFixed(1)}ms`],
            ['Median',    `${medianBurst.toFixed(1)}ms`],
            ['Std Dev',   `${stdDev.toFixed(1)}ms`],
            ['Range',     `${minBurst}–${maxBurst}ms`],
          ].map(([l, v]) => (
            <div key={l}>
              <div className="text-[9px] text-[#454a60] uppercase tracking-[0.07em] mb-0.5">{l}</div>
              <div className="font-mono font-semibold text-[#dde1f0]">{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestion */}
      <div className="bg-[#151720] border border-[rgba(124,111,255,0.3)] rounded-xl p-3 mb-3">
        <div className="text-[11px] text-[#7e85a0] mb-1">Optimal quantum for this workload:</div>
        <div className="font-mono text-[24px] font-bold text-[#b39dff] leading-tight">{suggestedQuantum}ms</div>
        <div className="text-[9px] text-[#454a60] mt-0.5 mb-3">
          formula: ⌈(avg+median)/2 × 0.45⌉
        </div>
        <Button
          variant="primary"
          size="xs"
          fullWidth
          onClick={() => { setAlgorithm('rr'); setQuantum(suggestedQuantum); }}
        >
          Apply q={suggestedQuantum}ms to Round Robin ↗
        </Button>
      </div>

      {/* Guide */}
      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-2">
        Decision Guide
      </div>
      {guide.map(({ q, label, desc, color }) => (
        <div
          key={label}
          className="flex gap-2.5 items-start mb-2 px-3 py-2 bg-[#151720] border border-white/[0.07] rounded-lg"
        >
          <div className="font-mono text-[13px] font-bold min-w-[32px]" style={{ color }}>{q}</div>
          <div>
            <div className="text-[11px] font-semibold" style={{ color }}>{label}</div>
            <div className="text-[10px] text-[#454a60]">{desc}</div>
          </div>
        </div>
      ))}

      <Divider />

      {/* Burst distribution sparkline */}
      <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-2">
        Burst Distribution
      </div>
      <div className="flex items-end gap-1 h-9">
        {bursts.map((bt, i) => {
          const h = Math.max(4, (bt / maxB) * 32);
          const col = bt < avgBurst ? '#0ecf8e' : bt < avgBurst * 1.5 ? '#f5a623' : '#ff6b6b';
          return (
            <div
              key={i}
              className="rounded-sm opacity-80 hover:opacity-100 transition-opacity"
              style={{
                width: `${Math.max(6, 120 / bursts.length)}px`,
                height: `${h}px`,
                background: col,
                flexShrink: 0,
                alignSelf: 'flex-end',
              }}
              title={`BT=${bt}ms`}
            />
          );
        })}
      </div>
      <div className="text-[9px] text-[#454a60] mt-1">
        Sorted ascending · green=short, amber=medium, red=long
      </div>
    </div>
  );
}
