import { useSimulationStore } from '@/store/useSimulationStore';
import { runAlgorithm } from '@/algorithms';
import { ALGORITHM_INFO } from '@/data/algorithms';
import CompareTable from '@/components/tables/CompareTable';
import WaitTimeChart from '@/components/charts/WaitTimeChart';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Divider from '@/components/common/Divider';
import { useMemo } from 'react';
import type { SchedulingMetrics } from '@/types';

export default function ComparePage() {
  const { processes, quantum, algorithm: currentAlgo } = useSimulationStore();

  // Run all 7 algorithms on current processes
  const compareResults = useMemo(() => {
    if (!processes.length) return null;
    const out: Record<string, SchedulingMetrics> = {};
    ALGORITHM_INFO.forEach((a) => {
      try {
        const r = runAlgorithm(a.id, processes, quantum);
        if (r) out[a.id] = r.metrics;
      } catch {}
    });
    return Object.keys(out).length ? out : null;
  }, [processes, quantum]);

  if (!processes.length) {
    return (
      <div className="flex items-center justify-center h-full text-[#454a60]">
        <div className="text-center">
          <div className="text-4xl mb-3">📊</div>
          <div className="text-[13px] text-[#7e85a0]">Add processes to compare algorithms</div>
          <div className="text-[11px] mt-1">Go to Simulate tab and set up your workload</div>
        </div>
      </div>
    );
  }

  if (!compareResults) return null;

  const entries = Object.entries(compareResults) as [string, SchedulingMetrics][];

  // Find winners per metric
  const bestWT  = entries.reduce((b, [id, m]) => (!b || m.avgWaitingTime < compareResults[b].avgWaitingTime) ? id : b, '' as string);
  const bestTAT = entries.reduce((b, [id, m]) => (!b || m.avgTurnaroundTime < compareResults[b].avgTurnaroundTime) ? id : b, '' as string);
  const bestRT  = entries.reduce((b, [id, m]) => (!b || m.avgResponseTime < compareResults[b].avgResponseTime) ? id : b, '' as string);
  const bestUtil = entries.reduce((b, [id, m]) => (!b || m.cpuUtilization > compareResults[b].cpuUtilization) ? id : b, '' as string);
  const fewestCtx = entries.reduce((b, [id, m]) => (!b || m.contextSwitches < compareResults[b].contextSwitches) ? id : b, '' as string);

  const setAlgorithm = useSimulationStore.getState().setAlgorithm;
  const setActiveTab = useSimulationStore.getState().setActiveTab;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left summary panel */}
      <aside className="w-[220px] flex-shrink-0 bg-[#0e1018] border-r border-white/[0.07] flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.07]">
          <div className="text-[10px] font-semibold tracking-[0.09em] uppercase text-[#454a60]">
            Winners
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {[
            { label: 'Best Avg Wait',     winner: bestWT,    color: 'green' as const, value: compareResults[bestWT]?.avgWaitingTime.toFixed(1) + 'ms' },
            { label: 'Best Turnaround',   winner: bestTAT,   color: 'blue'  as const, value: compareResults[bestTAT]?.avgTurnaroundTime.toFixed(1) + 'ms' },
            { label: 'Best Response',     winner: bestRT,    color: 'cyan'  as const, value: compareResults[bestRT]?.avgResponseTime.toFixed(1) + 'ms' },
            { label: 'Best CPU Util',     winner: bestUtil,  color: 'green' as const, value: compareResults[bestUtil]?.cpuUtilization.toFixed(1) + '%' },
            { label: 'Fewest Ctx Sw',     winner: fewestCtx, color: 'amber' as const, value: compareResults[fewestCtx]?.contextSwitches + ' sw' },
          ].map(({ label, winner, color, value }) => (
            <div key={label} className="bg-[#151720] border border-white/[0.07] rounded-lg px-3 py-2">
              <div className="text-[9px] text-[#454a60] uppercase tracking-[0.07em] mb-1">{label}</div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[13px]" style={{
                  color: color === 'green' ? '#0ecf8e' : color === 'blue' ? '#5ba4f5' :
                    color === 'cyan' ? '#22d3ee' : '#f5a623'
                }}>
                  {winner.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] text-[#7e85a0]">{value}</span>
              </div>
              <button
                onClick={() => { setAlgorithm(winner as never); setActiveTab('simulate'); }}
                className="text-[9px] text-[#7c6fff] hover:text-[#b39dff] mt-1 transition-colors"
              >
                Use this ↗
              </button>
            </div>
          ))}

          <Divider />

          <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-2">
            Current Setup
          </div>
          <div className="text-[11px] text-[#7e85a0] space-y-1">
            <div>{processes.length} processes</div>
            <div>Quantum: {quantum}ms</div>
            <div>Active: <span className="text-[#b39dff] font-semibold">{currentAlgo.toUpperCase()}</span></div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-white/[0.07] bg-[#0e1018] flex items-center justify-between flex-shrink-0">
          <div>
            <div className="font-semibold text-[14px]">Algorithm Comparison</div>
            <div className="text-[11px] text-[#7e85a0] mt-0.5">
              {processes.length} processes · quantum={quantum}ms · all 7 algorithms
            </div>
          </div>
          <div className="flex gap-2">
            <Badge color="green">Best WT: {bestWT.toUpperCase()}</Badge>
            <Badge color="cyan">Best TAT: {bestTAT.toUpperCase()}</Badge>
            <Badge color="blue">Best RT: {bestRT.toUpperCase()}</Badge>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Comparison table */}
          <div className="mb-6">
            <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-3">
              Full Metrics Table
            </div>
            <div className="bg-[#0e1018] border border-white/[0.07] rounded-xl overflow-hidden">
              <CompareTable
                results={compareResults as never}
                processCount={processes.length}
              />
            </div>
          </div>

          {/* Bar charts grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-[#0e1018] border border-white/[0.07] rounded-xl p-4">
              <WaitTimeChart
                results={compareResults as never}
                metric="avgWaitingTime"
                label="Avg Waiting Time (ms)"
                colorFn={(id) => id === bestWT ? '#0ecf8e' : '#7c6fff'}
              />
            </div>
            <div className="bg-[#0e1018] border border-white/[0.07] rounded-xl p-4">
              <WaitTimeChart
                results={compareResults as never}
                metric="avgTurnaroundTime"
                label="Avg Turnaround Time (ms)"
                colorFn={(id) => id === bestTAT ? '#22d3ee' : '#5ba4f5'}
              />
            </div>
            <div className="bg-[#0e1018] border border-white/[0.07] rounded-xl p-4">
              <WaitTimeChart
                results={compareResults as never}
                metric="contextSwitches"
                label="Context Switches"
                colorFn={(_, val, max) => val / max > 0.7 ? '#ff6b6b' : val / max > 0.4 ? '#f5a623' : '#0ecf8e'}
              />
            </div>
            <div className="bg-[#0e1018] border border-white/[0.07] rounded-xl p-4">
              <WaitTimeChart
                results={compareResults as never}
                metric="cpuUtilization"
                label="CPU Utilization %"
                colorFn={(id) => id === bestUtil ? '#0ecf8e' : '#f5a623'}
              />
            </div>
          </div>

          {/* Algorithm descriptions */}
          <div className="bg-[#0e1018] border border-white/[0.07] rounded-xl p-4">
            <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-3">
              Algorithm Guide
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ALGORITHM_INFO.map((algo) => {
                const m = compareResults[algo.id];
                const isBest = algo.id === bestWT;
                return (
                  <div
                    key={algo.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      isBest
                        ? 'bg-[rgba(14,207,142,0.05)] border-[rgba(14,207,142,0.25)]'
                        : 'bg-[#151720] border-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-mono font-bold text-[11px] ${isBest ? 'text-[#0ecf8e]' : 'text-[#dde1f0]'}`}>
                        {algo.name}
                      </span>
                      {isBest && <Badge color="green">BEST WT</Badge>}
                      {!isBest && <Badge color="default">{algo.tag}</Badge>}
                    </div>
                    <div className="text-[10px] text-[#454a60] mb-2">{algo.description}</div>
                    {m && (
                      <div className="grid grid-cols-3 gap-1 text-[9px] font-mono">
                        <div><span className="text-[#454a60]">WT:</span> <span className="text-[#f5a623]">{m.avgWaitingTime.toFixed(1)}</span></div>
                        <div><span className="text-[#454a60]">TAT:</span> <span className="text-[#5ba4f5]">{m.avgTurnaroundTime.toFixed(1)}</span></div>
                        <div><span className="text-[#454a60]">Util:</span> <span className="text-[#0ecf8e]">{m.cpuUtilization.toFixed(0)}%</span></div>
                      </div>
                    )}
                    <Button
                      size="xs"
                      variant={isBest ? 'success' : 'default'}
                      className="mt-2 w-full"
                      onClick={() => { setAlgorithm(algo.id); setActiveTab('simulate'); }}
                    >
                      Simulate with {algo.name} ↗
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
