import { useState } from 'react';
import { Upload, FileDown } from 'lucide-react';
import { useSimulation } from '@/hooks/useSimulation';
import { useSimulationStore } from '@/store/useSimulationStore';

// Left panel components
import ProcessTable from '@/components/ui/ProcessTable';
import AlgorithmSelector from '@/components/ui/AlgorithmSelector';
import QuantumControl from '@/components/ui/QuantumControl';
import ContextSwitchControl from '@/components/ui/ContextSwitchControl';
import ModeSelector from '@/components/ui/ModeSelector';
import CoreCountControl from '@/components/ui/CoreCountControl';
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
    <div className="flex h-full overflow-hidden bg-[#07080d] text-[#dde1f0] min-w-[1200px]">
      {/* ── LEFT PANEL ── */}
      <aside className="w-[320px] flex-shrink-0 bg-[#0e1018] border-r border-white/[0.07] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] flex-shrink-0">
          <span className="text-sm font-semibold tracking-wide uppercase text-[#454a60]">
            Setup
          </span>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setShowCSV(true)} variant="ghost" className="hover:bg-[#151720]">
              <Upload size={14} /> CSV
            </Button>
            <Button size="sm" onClick={handleExportJSON} variant="ghost" className="hover:bg-[#151720]">
              <FileDown size={14} /> Save
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="bg-[#151720] rounded-lg border border-white/[0.07] p-4">
            <ProcessTable />
          </div>
          <div className="bg-[#151720] rounded-lg border border-white/[0.07] p-4">
            <ModeSelector />
          </div>
          <div className="bg-[#151720] rounded-lg border border-white/[0.07] p-4">
            <AlgorithmSelector />
          </div>
          <div className="bg-[#151720] rounded-lg border border-white/[0.07] p-4">
            <CoreCountControl />
          </div>
          <div className="bg-[#151720] rounded-lg border border-white/[0.07] p-4">
            <QuantumControl />
          </div>
          <div className="bg-[#151720] rounded-lg border border-white/[0.07] p-4">
            <ContextSwitchControl />
          </div>
          <div className="bg-[#151720] rounded-lg border border-white/[0.07] p-4">
            <PlaybackControls />
          </div>
        </div>
      </aside>

      {/* ── CENTER PANEL ── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Gantt Chart */}
        <div className="bg-[#0e1018] border-b border-white/[0.07]">
          <GanttChart />
        </div>

        {/* Queue Display */}
        <div className="bg-[#0e1018] border-b border-white/[0.07] px-6 py-4">
          <QueueDisplay />
        </div>

        {/* Metrics row */}
        <div className="bg-[#151720] border-b border-white/[0.07] px-6 py-4">
          <div className="grid grid-cols-6 gap-4">
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
        </div>

        {/* Sub tabs */}
        <div className="flex gap-2 px-6 py-3 border-b border-white/[0.07] bg-[#07080d]">
          {([['results', 'Results Table'], ['charts', 'Metric Charts'], ['timeline', 'Timeline']] as const).map(
            ([id, label]) => (
              <button
                key={id}
                onClick={() => setCenterTab(id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[#151720] ${
                  centerTab === id
                    ? 'bg-[#1a1d2e] text-[#dde1f0] border border-white/[0.1]'
                    : 'text-[#7e85a0] hover:text-[#dde1f0]'
                }`}
              >
                {label}
              </button>
            )
          )}
          {isSimulated && (
            <div className="ml-auto flex gap-2">
              <Button size="sm" onClick={handleExportCSV} variant="ghost" className="hover:bg-[#151720]">
                📊 CSV
              </Button>
              <Button size="sm" onClick={handleExportSVG} variant="ghost" className="hover:bg-[#151720]">
                🖼 SVG
              </Button>
            </div>
          )}
        </div>

        {/* Center content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#07080d]">
          {!isSimulated && (
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7c6fff]/20 to-[#b39dff]/20 flex items-center justify-center border border-[#7c6fff]/30">
                  <div className="w-10 h-10 rounded-full bg-[#7c6fff] flex items-center justify-center animate-pulse">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#0ecf8e] rounded-full animate-ping"></div>
              </div>
              <div className="space-y-3 max-w-md">
                <div className="text-xl font-semibold text-[#dde1f0]">
                  Ready to Simulate
                </div>
                <div className="text-base text-[#7e85a0] leading-relaxed">
                  Configure your processes and select an algorithm, then press Play to see the CPU scheduling in action.
                </div>
                <div className="text-sm text-[#454a60] mt-4 p-4 bg-[#151720] rounded-lg border border-white/[0.07]">
                  💡 <strong>Tip:</strong> Try FCFS for simple scheduling or Priority for custom process ordering.
                </div>
              </div>
            </div>
          )}

          {isSimulated && metrics && (
            <>
              {centerTab === 'results' && (
                <div className="animate-fade-in bg-[#151720] rounded-lg border border-white/[0.07] p-6">
                  <div className="text-sm font-semibold tracking-wide uppercase text-[#454a60] mb-4">
                    Per-Process Results
                  </div>
                  <ProcessResultTable metrics={metrics} />
                </div>
              )}
              {centerTab === 'charts' && (
                <div className="animate-fade-in space-y-6">
                  <div className="text-sm font-semibold tracking-wide uppercase text-[#454a60]">
                    Metric Charts
                  </div>
                  <div className="bg-[#151720] rounded-lg border border-white/[0.07] p-6">
                    <MetricsChart metrics={metrics} />
                  </div>
                </div>
              )}
              {centerTab === 'timeline' && simResult && (
                <div className="animate-fade-in bg-[#151720] rounded-lg border border-white/[0.07] p-6">
                  <TimelineChart gantt={simResult.gantt} metrics={metrics} />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── RIGHT PANEL ── */}
      <aside className="w-[320px] flex-shrink-0 bg-[#0e1018] border-l border-white/[0.07] flex flex-col overflow-hidden">
        {/* Right tabs */}
        <div className="flex gap-2 p-4 border-b border-white/[0.07] flex-shrink-0">
          <button
            onClick={() => setRightTab('ai')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[#151720] ${
              rightTab === 'ai' ? 'bg-[#1a1d2e] text-[#dde1f0] border border-white/[0.1]' : 'text-[#7e85a0] hover:text-[#dde1f0]'
            }`}
          >
            🤖 AI
          </button>
          <button
            onClick={() => setRightTab('anomalies')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[#151720] flex items-center gap-2 ${
              rightTab === 'anomalies' ? 'bg-[#1a1d2e] text-[#dde1f0] border border-white/[0.1]' : 'text-[#7e85a0] hover:text-[#dde1f0]'
            }`}
          >
            🚨 Issues
            {anomalies.length > 0 && (
              <Badge color="red">{anomalies.length}</Badge>
            )}
          </button>
          <button
            onClick={() => setRightTab('optimizer')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[#151720] ${
              rightTab === 'optimizer' ? 'bg-[#1a1d2e] text-[#dde1f0] border border-white/[0.1]' : 'text-[#7e85a0] hover:text-[#dde1f0]'
            }`}
          >
            ⚡ Optimizer
          </button>
        </div>

        {/* CPU display strip */}
        <div className="px-6 py-4 border-b border-white/[0.07] flex-shrink-0 bg-[#151720] rounded-lg mx-4 my-2 border border-white/[0.07]">
          <CPUDisplay />
        </div>

        {/* Right panel content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="bg-[#151720] rounded-lg border border-white/[0.07] p-6 h-full">
            {rightTab === 'ai'        && <AIPanel />}
            {rightTab === 'anomalies' && <AnomalyPanel />}
            {rightTab === 'optimizer' && <QuantumOptimizerPanel />}
          </div>
        </div>
      </aside>

      {/* CSV Import Modal */}
      <Modal open={showCSV} onClose={() => setShowCSV(false)} title="Import Processes from CSV">
        <CSVImport onClose={() => setShowCSV(false)} />
      </Modal>
    </div>
  );
}
