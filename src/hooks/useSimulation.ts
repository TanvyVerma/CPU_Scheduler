import { useSimulationStore } from '@/store/useSimulationStore';
import { getVisibleGantt, getCurrentTime, getRunningPID, deriveQueues, getProgress } from '@/engine/simulationEngine';
import { detectAnomalies } from '@/engine/anomalyEngine';
import { generateRecommendation } from '@/engine/recommendationEngine';
import { analyzeQuantum } from '@/engine/quantumEngine';

/** Single hook that derives all computed simulation state */
export function useSimulation() {
  const store = useSimulationStore();
  const { simResult, playbackIndex, algorithm, processes, quantum, contextSwitchCost } = store;

  const gantt = simResult ? simResult.gantt : [];
  const metrics = simResult ? simResult.metrics : null;

  const visibleGantt = getVisibleGantt(gantt, playbackIndex);
  const currentTime = getCurrentTime(visibleGantt);
  const runningPID = getRunningPID(visibleGantt);
  const progress = getProgress(playbackIndex, gantt.length);

  const queues = metrics
    ? deriveQueues(visibleGantt, processes, metrics)
    : { ready: [], running: null, completed: [] };

  const anomalies = metrics
    ? detectAnomalies(metrics, algorithm, processes, quantum)
    : [];

  const recommendation = generateRecommendation(processes);
  const quantumAnalysis = analyzeQuantum(processes, quantum);

  const contextSwitchWaste = metrics ? metrics.contextSwitches * contextSwitchCost : 0;
  const efficiencyLoss = metrics && metrics.totalTime > 0
    ? (contextSwitchWaste / metrics.totalTime) * 100
    : 0;

  return {
    ...store,
    // derived
    visibleGantt,
    currentTime,
    runningPID,
    progress,
    queues,
    anomalies,
    recommendation,
    quantumAnalysis,
    metrics,
    contextSwitchWaste,
    efficiencyLoss,
    isSimulated: !!simResult,
    totalGanttBlocks: gantt.length,
  };
}
