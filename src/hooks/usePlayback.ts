import { useSimulationStore } from '@/store/useSimulationStore';

export function usePlayback() {
  const {
    playbackState,
    playbackSpeed,
    playbackIndex,
    simResult,
    play,
    pause,
    reset,
    stepForward,
    setPlaybackSpeed,
  } = useSimulationStore();

  const isPlaying = playbackState === 'playing';
  const isPaused  = playbackState === 'paused';
  const isDone    = playbackState === 'done';
  const isIdle    = playbackState === 'idle';
  const total     = simResult?.gantt.length ?? 0;
  const canStep   = playbackIndex < total;

  return {
    playbackState,
    playbackSpeed,
    playbackIndex,
    isPlaying,
    isPaused,
    isDone,
    isIdle,
    total,
    canStep,
    play,
    pause,
    reset,
    stepForward,
    setPlaybackSpeed,
  };
}
