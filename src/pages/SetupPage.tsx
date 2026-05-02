import { PRESETS } from '@/data/presets';
import { ALGORITHM_INFO } from '@/data/algorithms';
import { useSimulationStore } from '@/store/useSimulationStore';
import { PROCESS_COLORS } from '@/utils/helpers';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';

export default function SetupPage() {
  const { setProcesses, setAlgorithm, setActiveTab } = useSimulationStore();

  function loadPreset(idx: number) {
    const p = PRESETS[idx];
    setProcesses(p.processes);
    setAlgorithm(p.recommendedAlgo);
    setActiveTab('simulate');
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: presets */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h2 className="text-[18px] font-bold mb-1">Edge Case Presets</h2>
            <p className="text-[12px] text-[#7e85a0]">
              Load a preset to explore classic CPU scheduling pitfalls. Each demonstrates a specific failure
              mode — compare algorithms to see how they handle each scenario differently.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {PRESETS.map((preset, idx) => {
              const algoInfo = ALGORITHM_INFO.find((a) => a.id === preset.recommendedAlgo);
              return (
                <div
                  key={preset.name}
                  className="bg-[#0e1018] border border-white/[0.07] rounded-2xl p-5 hover:border-[rgba(124,111,255,0.3)] transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-[13px] group-hover:text-[#b39dff] transition-colors">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-[#454a60] mt-0.5">{preset.tag}</div>
                    </div>
                    <Badge color="accent">{algoInfo?.name ?? preset.recommendedAlgo}</Badge>
                  </div>

                  <p className="text-[11px] text-[#7e85a0] leading-relaxed mb-4">
                    {preset.description}
                  </p>

                  {/* Process preview */}
                  <div className="mb-4">
                    <div className="text-[9px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-2">
                      Processes
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {preset.processes.map((p, i) => {
                        const col = PROCESS_COLORS[i % PROCESS_COLORS.length];
                        return (
                          <div
                            key={p.id}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono"
                            style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.text }}
                          >
                            <span className="font-bold">{p.id}</span>
                            <span className="opacity-60">AT:{p.arrivalTime} BT:{p.burstTime} P:{p.priority}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => loadPreset(idx)}
                      className="flex-1"
                    >
                      Load & Simulate ↗
                    </Button>
                    <Button
                      size="xs"
                      onClick={() => {
                        setProcesses(preset.processes);
                        setAlgorithm(preset.recommendedAlgo);
                        setActiveTab('compare');
                      }}
                    >
                      Compare All
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tips section */}
          <div className="mt-8 bg-[#0e1018] border border-white/[0.07] rounded-2xl p-5">
            <div className="text-[12px] font-semibold mb-3">💡 How to use presets</div>
            <ol className="space-y-2 text-[11px] text-[#7e85a0] leading-relaxed">
              <li><span className="text-[#b39dff] font-semibold">1.</span> Load a preset — it configures processes that expose a specific scheduling weakness.</li>
              <li><span className="text-[#b39dff] font-semibold">2.</span> Go to <strong className="text-[#dde1f0]">Simulate</strong> and press Play with the recommended algorithm to see the problem.</li>
              <li><span className="text-[#b39dff] font-semibold">3.</span> Check the <strong className="text-[#dde1f0]">Issues</strong> panel — anomalies will be detected automatically.</li>
              <li><span className="text-[#b39dff] font-semibold">4.</span> Switch to a better algorithm using the AI recommendation and re-simulate to compare.</li>
              <li><span className="text-[#b39dff] font-semibold">5.</span> Use <strong className="text-[#dde1f0]">Compare All</strong> to benchmark all 7 algorithms on the same input.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Right: algorithm reference */}
      <aside className="w-[260px] flex-shrink-0 bg-[#0e1018] border-l border-white/[0.07] overflow-y-auto px-4 py-4">
        <div className="text-[10px] font-semibold tracking-[0.09em] uppercase text-[#454a60] mb-3">
          Algorithm Reference
        </div>
        <div className="space-y-3">
          {ALGORITHM_INFO.map((algo) => (
            <div
              key={algo.id}
              className="bg-[#151720] border border-white/[0.07] rounded-xl p-3 hover:border-white/[0.13] transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono font-bold text-[12px] text-[#dde1f0]">{algo.name}</span>
                <Badge color={algo.preemptive ? 'amber' : 'blue'}>
                  {algo.preemptive ? 'Preemptive' : 'Non-pre'}
                </Badge>
              </div>
              <p className="text-[10px] text-[#7e85a0] leading-relaxed mb-2">{algo.description}</p>
              <div className="space-y-1">
                {algo.pros.slice(0, 2).map((p) => (
                  <div key={p} className="text-[9px] text-[#0ecf8e]">✓ {p}</div>
                ))}
                {algo.cons.slice(0, 1).map((c) => (
                  <div key={c} className="text-[9px] text-[#ff6b6b]">✗ {c}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
