import { useSimulationStore } from '@/store/useSimulationStore';
import { ALGORITHM_INFO } from '@/data/algorithms';
import { exportResultsCSV, exportScenarioJSON, exportGanttSVG } from '@/utils/export';
import { runAlgorithm } from '@/algorithms';
import UtilizationDonut from '@/components/charts/UtilizationDonut';
import ProcessResultTable from '@/components/tables/ProcessResultTable';
import MetricsChart from '@/components/charts/MetricsChart';
import Button from '@/components/common/Button';
import Divider from '@/components/common/Divider';
import { FileDown, BarChart2, Clock, Cpu, ArrowRightLeft } from 'lucide-react';
import { useMemo } from 'react';
import type { SchedulingMetrics } from '@/types';

export default function ReportsPage() {
  const { processes, quantum, algorithm, simResult, contextSwitchCost, setActiveTab } = useSimulationStore();

  // Use existing result or compute one
  const metrics: SchedulingMetrics | null = useMemo(() => {
    if (simResult) return simResult.metrics;
    if (!processes.length) return null;
    const r = runAlgorithm(algorithm, processes, quantum);
    return r ? r.metrics : null;
  }, [simResult, processes, quantum, algorithm]);

  const gantt = simResult?.gantt ?? (() => {
    if (!processes.length) return [];
    const r = runAlgorithm(algorithm, processes, quantum);
    return r ? r.gantt : [];
  })();

  const algoInfo = ALGORITHM_INFO.find((a) => a.id === algorithm);

  if (!processes.length) {
    return (
      <div className="flex items-center justify-center h-full text-[#454a60]">
        <div className="text-center">
          <div className="text-4xl mb-3">📈</div>
          <div className="text-[13px] text-[#7e85a0]">No data to report</div>
          <div className="text-[11px] mt-1">Add processes and run a simulation first</div>
          <Button className="mt-4" onClick={() => setActiveTab('simulate')}>Go to Simulator →</Button>
        </div>
      </div>
    );
  }

  const waste = metrics ? metrics.contextSwitches * contextSwitchCost : 0;
  const lossPercent = metrics && metrics.totalTime > 0
    ? ((waste / metrics.totalTime) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left export panel */}
      <aside className="w-[220px] flex-shrink-0 bg-[#0e1018] border-r border-white/[0.07] flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.07]">
          <div className="text-[10px] font-semibold tracking-[0.09em] uppercase text-[#454a60]">
            Export
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          <Button
            variant="default"
            fullWidth
            onClick={() => metrics && exportResultsCSV(metrics, algorithm)}
            disabled={!metrics}
          >
            <FileDown size={11} /> CSV Results
          </Button>
          <Button
            variant="default"
            fullWidth
            onClick={() => exportScenarioJSON(processes, algorithm, quantum, metrics ?? undefined, gantt)}
          >
            <FileDown size={11} /> JSON Scenario
          </Button>
          <Button
            variant="default"
            fullWidth
            onClick={() => gantt.length && exportGanttSVG(gantt, processes, algorithm)}
            disabled={!gantt.length}
          >
            <FileDown size={11} /> SVG Gantt Chart
          </Button>

          <Divider />

          <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-2">
            Current Config
          </div>
          <div className="space-y-1 text-[11px] text-[#7e85a0]">
            <div className="flex justify-between">
              <span>Algorithm</span>
              <span className="text-[#b39dff] font-semibold font-mono">{algorithm.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span>Processes</span>
              <span className="font-mono">{processes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantum</span>
              <span className="font-mono">{quantum}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Ctx Cost</span>
              <span className="font-mono">{contextSwitchCost}ms</span>
            </div>
          </div>

          <Divider />

          <Button
            variant="primary"
            fullWidth
            onClick={() => setActiveTab('simulate')}
          >
            ← Back to Simulator
          </Button>
          <Button
            variant="default"
            fullWidth
            onClick={() => setActiveTab('compare')}
          >
            Compare All Algos
          </Button>
        </div>
      </aside>

      {/* Main report */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[18px] font-bold">
              Simulation Report — <span className="text-[#b39dff]">{algoInfo?.fullName ?? algorithm}</span>
            </h2>
            <p className="text-[12px] text-[#7e85a0] mt-0.5">
              {processes.length} processes · quantum={quantum}ms · ctx switch cost={contextSwitchCost}ms
            </p>
          </div>
        </div>

        {metrics ? (
          <>
            {/* Top stats grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { icon: Clock,          label: 'Avg Waiting Time',   value: metrics.avgWaitingTime.toFixed(2),   unit: 'ms', color: '#f5a623' },
                { icon: BarChart2,      label: 'Avg Turnaround',     value: metrics.avgTurnaroundTime.toFixed(2), unit: 'ms', color: '#5ba4f5' },
                { icon: Clock,          label: 'Avg Response Time',  value: metrics.avgResponseTime.toFixed(2),   unit: 'ms', color: '#22d3ee' },
                { icon: Cpu,            label: 'Throughput',         value: metrics.throughput.toFixed(3),        unit: 'p/ms', color: '#b39dff' },
              ].map(({ icon: Icon, label, value, unit, color }) => (
                <div key={label} className="bg-[#0e1018] border border-white/[0.07] rounded-xl p-4 text-center">
                  <Icon size={16} className="mx-auto mb-2" style={{ color }} />
                  <div className="font-mono text-[22px] font-bold" style={{ color }}>
                    {value}
                    <span className="text-[11px] text-[#454a60] ml-1">{unit}</span>
                  </div>
                  <div className="text-[10px] text-[#454a60] mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* CPU Util + Context Switch Analysis */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Utilization donut */}
              <div className="bg-[#0e1018] border border-white/[0.07] rounded-xl p-5 flex items-center gap-6">
                <UtilizationDonut utilization={metrics.cpuUtilization} size={130} />
                <div className="flex-1">
                  <div className="text-[12px] font-semibold mb-3">CPU Utilization</div>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#7e85a0]">Total time</span>
                      <span className="font-mono">{metrics.totalTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7e85a0]">Busy time</span>
                      <span className="font-mono text-[#0ecf8e]">
                        {Math.round(metrics.totalTime * metrics.cpuUtilization / 100)}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7e85a0]">Idle time</span>
                      <span className="font-mono text-[#ff6b6b]">
                        {Math.round(metrics.totalTime * (1 - metrics.cpuUtilization / 100))}ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Context switch breakdown */}
              <div className="bg-[#0e1018] border border-white/[0.07] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRightLeft size={14} className="text-[#7c6fff]" />
                  <div className="text-[12px] font-semibold">Context Switch Analysis</div>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Total switches',    value: metrics.contextSwitches,              color: '#dde1f0', unit: '' },
                    { label: 'Cost per switch',   value: contextSwitchCost,                    color: '#dde1f0', unit: 'ms' },
                    { label: 'Total wasted time', value: waste,                                color: '#ff6b6b', unit: 'ms' },
                    { label: 'Efficiency loss',   value: `${lossPercent}%`,                    color: '#f5a623', unit: '' },
                  ].map(({ label, value, color, unit }) => (
                    <div key={label} className="flex justify-between items-center py-1.5 border-b border-white/[0.04] last:border-0">
                      <span className="text-[11px] text-[#7e85a0]">{label}</span>
                      <span className="font-mono font-semibold text-[12px]" style={{ color }}>
                        {value}{unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Metric chart */}
            <div className="bg-[#0e1018] border border-white/[0.07] rounded-xl p-5 mb-6">
              <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-3">
                Per-Process Metrics Chart
              </div>
              <MetricsChart metrics={metrics} />
            </div>

            {/* Process results table */}
            <div className="bg-[#0e1018] border border-white/[0.07] rounded-xl overflow-hidden mb-6">
              <div className="px-4 py-3 border-b border-white/[0.07]">
                <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60]">
                  Per-Process Results
                </div>
              </div>
              <ProcessResultTable metrics={metrics} />
            </div>

            {/* Algorithm description */}
            {algoInfo && (
              <div className="bg-[#0e1018] border border-white/[0.07] rounded-xl p-5">
                <div className="text-[12px] font-semibold mb-2">{algoInfo.fullName}</div>
                <p className="text-[11px] text-[#7e85a0] leading-relaxed mb-4">{algoInfo.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-semibold text-[#0ecf8e] mb-1.5">Advantages</div>
                    {algoInfo.pros.map((p) => (
                      <div key={p} className="text-[10px] text-[#7e85a0] mb-1">✓ {p}</div>
                    ))}
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-[#ff6b6b] mb-1.5">Disadvantages</div>
                    {algoInfo.cons.map((c) => (
                      <div key={c} className="text-[10px] text-[#7e85a0] mb-1">✗ {c}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-48 text-[#454a60]">
            <div className="text-center">
              <div className="text-3xl mb-3">📊</div>
              <div className="text-[12px] text-[#7e85a0]">Computing report…</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
