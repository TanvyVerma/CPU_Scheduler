import { useState } from 'react';
import { Upload, FileDown } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import { useSimulationStore } from '@/store/useSimulationStore';

// Left panel components
import ProcessTable from '@/components/ui/ProcessTable';
import AlgorithmSelector from '@/components/ui/AlgorithmSelector';
import QuantumControl from '@/components/ui/QuantumControl';
import ContextSwitchControl from '@/components/ui/ContextSwitchControl';
import PlaybackControls from '@/components/simulator/PlaybackControls';

// Center components
import GanttChart from '@/components/simulator/GanttChart';
import QueueDisplay from '@/components/simulator/QueueDisplay';
import ProcessResultTable from '@/components/tables/ProcessResultTable';
import MetricsChart from '@/components/charts/MetricsChart';
import TimelineChart from '@/components/charts/TimelineChart';
import MetricCard from '@/components/cards/MetricCard';
import CPUDisplay from '@/components/simulator/CPUDisplay';

// Right panel components
import AIPanel from '@/components/simulator/AIPanel';
import AnomalyPanel from '@/components/simulator/AnomalyPanel';
import QuantumOptimizerPanel from '@/components/simulator/QuantumOptimizerPanel';

// Common
import Divider from '@/components/common/Divider';
import Modal from '@/components/common/Modal';
import CSVImport from '@/components/ui/CSVImport';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';

import { exportResultsCSV, exportScenarioJSON, exportGanttSVG } from '@/utils/export';

type RightTab = 'ai' | 'anomalies' | 'optimizer';
type CenterTab = 'results' | 'charts' | 'timeline';

export default function SimulationPage() {
  const [rightTab, setRightTab] = useState<RightTab>('ai');
  const [centerTab, setCenterTab] = useState<CenterTab>('results');
  const [showCSV, setShowCSV] = useState(false);

  const { anomalies, metrics, isSimulated } = useSimulation();
  const { algorithm, processes, quantum, simResult } = useSimulationStore();

  function handleExportCSV() {
    if (metrics) exportResultsCSV(metrics, algorithm);
  }
  function handleExportJSON() {
    exportScenarioJSON(processes, algorithm, quantum, metrics ?? undefined, simResult?.gantt);
  }
  function handleExportSVG() {
    if (simResult) exportGanttSVG(simResult.gantt, processes, algorithm);
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── LEFT PANEL ── */}
      <aside className="w-[282px] flex-shrink-0 bg-[#0e1018] border-r border-white/[0.07] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.07] flex-shrink-0">
          <span className="text-[10px] font-semibold tracking-[0.09em] uppercase text-[#454a60]">
            Setup
          </span>
          <div className="flex gap-1.5">
            <Button size="xs" onClick={() => setShowCSV(true)}>
              <Upload size={9} /> CSV
            </Button>
            <Button size="xs" onClick={handleExportJSON}>
              <FileDown size={9} /> Save
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          <ProcessTable />
          <Divider className="my-0" />
          <AlgorithmSelector />
          <Divider className="my-0" />
          <QuantumControl />
          <Divider className="my-0" />
          <ContextSwitchControl />
          <Divider className="my-0" />
          <PlaybackControls />
        </div>
      </aside>

      {/* ── CENTER PANEL ── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Gantt Chart */}
        <GanttChart />

        {/* Queue Display */}
        <QueueDisplay />

        {/* Metrics row */}
        <div className="grid grid-cols-6 gap-1.5 px-4 py-2 bg-[#0e1018] border-b border-white/[0.07] flex-shrink-0">
          {metrics ? (
            <>
              <MetricCard label="Avg Wait"   value={metrics.avgWaitingTime.toFixed(1)}   unit="ms" />
              <MetricCard label="Avg TAT"    value={metrics.avgTurnaroundTime.toFixed(1)} unit="ms" />
              <MetricCard label="Avg RT"     value={metrics.avgResponseTime.toFixed(1)}   unit="ms" />
              <MetricCard
                label="CPU Util"
                value={metrics.cpuUtilization.toFixed(1)}
                unit="%"
                color={metrics.cpuUtilization > 80 ? '#0ecf8e' : metrics.cpuUtilization > 60 ? '#f5a623' : '#ff6b6b'}
              />
              <MetricCard label="Throughput" value={metrics.throughput.toFixed(3)} unit="p/ms" />
              <MetricCard
                label="Ctx Sw"
                value={metrics.contextSwitches}
                color={metrics.contextSwitches > processes.length * 3 ? '#ff6b6b' : undefined}
              />
            </>
          ) : (
            ['Avg Wait', 'Avg TAT', 'Avg RT', 'CPU Util', 'Throughput', 'Ctx Sw'].map((l) => (
              <MetricCard key={l} label={l} value="--" />
            ))
          )}
        </div>

        {/* Sub tabs */}
        <div className="flex gap-1 px-4 py-2 border-b border-white/[0.07] flex-shrink-0 bg-[#07080d]">
          {([['results', 'Results Table'], ['charts', 'Metric Charts'], ['timeline', 'Timeline']] as const).map(
            ([id, label]) => (
              <button
                key={id}
                onClick={() => setCenterTab(id)}
                className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
                  centerTab === id
                    ? 'bg-[#151720] text-[#dde1f0] border border-white/[0.07]'
                    : 'text-[#7e85a0] hover:text-[#dde1f0]'
                }`}
              >
                {label}
              </button>
            )
          )}
          {isSimulated && (
            <div className="ml-auto flex gap-1.5">
              <Button size="xs" onClick={handleExportCSV}>📊 CSV</Button>
              <Button size="xs" onClick={handleExportSVG}>🖼 SVG</Button>
            </div>
          )}
        </div>

        {/* Center content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!isSimulated && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[#454a60]">
              <div className="text-4xl">⚡</div>
              <div className="text-[13px] text-[#7e85a0]">
                Configure processes and algorithm, then press Play
              </div>
              <div className="text-[11px]">Or load a Preset from the Presets tab</div>
            </div>
          )}

          {isSimulated && metrics && (
            <>
              {centerTab === 'results' && (
                <div className="animate-fade-in">
                  <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60] mb-2">
                    Per-Process Results
                  </div>
                  <ProcessResultTable metrics={metrics} />
                </div>
              )}
              {centerTab === 'charts' && (
                <div className="animate-fade-in space-y-4">
                  <div className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60]">
                    Metric Charts
                  </div>
                  <MetricsChart metrics={metrics} />
                </div>
              )}
              {centerTab === 'timeline' && simResult && (
                <div className="animate-fade-in">
                  <TimelineChart gantt={simResult.gantt} metrics={metrics} />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── RIGHT PANEL ── */}
      <aside className="w-[264px] flex-shrink-0 bg-[#0e1018] border-l border-white/[0.07] flex flex-col overflow-hidden">
        {/* Right tabs */}
        <div className="flex gap-1 p-2 border-b border-white/[0.07] flex-shrink-0">
          <button
            onClick={() => setRightTab('ai')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              rightTab === 'ai' ? 'bg-[#151720] text-[#dde1f0] border border-white/[0.07]' : 'text-[#7e85a0] hover:text-[#dde1f0]'
            }`}
          >
            🤖 AI
          </button>
          <button
            onClick={() => setRightTab('anomalies')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
              rightTab === 'anomalies' ? 'bg-[#151720] text-[#dde1f0] border border-white/[0.07]' : 'text-[#7e85a0] hover:text-[#dde1f0]'
            }`}
          >
            🚨 Issues
            {anomalies.length > 0 && (
              <Badge color="red">{anomalies.length}</Badge>
            )}
          </button>
          <button
            onClick={() => setRightTab('optimizer')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
              rightTab === 'optimizer' ? 'bg-[#151720] text-[#dde1f0] border border-white/[0.07]' : 'text-[#7e85a0] hover:text-[#dde1f0]'
            }`}
          >
            ⚡ Opt
          </button>
        </div>

        {/* CPU display strip */}
        <div className="px-3 py-2 border-b border-white/[0.07] flex-shrink-0">
          <CPUDisplay />
        </div>

        {/* Right panel content */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {rightTab === 'ai'        && <AIPanel />}
          {rightTab === 'anomalies' && <AnomalyPanel />}
          {rightTab === 'optimizer' && <QuantumOptimizerPanel />}
        </div>
      </aside>

      {/* CSV Import Modal */}
      <Modal open={showCSV} onClose={() => setShowCSV(false)} title="Import Processes from CSV">
        <CSVImport onClose={() => setShowCSV(false)} />
      </Modal>
    </div>
  );
}
