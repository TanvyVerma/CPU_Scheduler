import { Play, Pause, SkipForward, RotateCcw, Shuffle } from 'lucide-react';
import { usePlayback } from '@/hooks/usePlayback';
import { useSimulationStore } from '@/store/useSimulationStore';
import Button from '@/components/common/Button';
import SpeedControl from '@/components/ui/SpeedControl';

export default function PlaybackControls() {
  const { isPlaying, canStep, play, pause, reset, stepForward } = usePlayback();
  const randomizeProcesses = useSimulationStore((s) => s.randomizeProcesses);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1.5 flex-wrap">
        <Button variant="primary" onClick={play} disabled={isPlaying}>
          <Play size={11} />
          {isPlaying ? 'Playing…' : 'Play'}
        </Button>
        <Button onClick={pause} disabled={!isPlaying}>
          <Pause size={11} /> Pause
        </Button>
        <Button onClick={stepForward} disabled={!canStep && !isPlaying}>
          <SkipForward size={11} /> Step
        </Button>
        <Button variant="danger" onClick={reset}>
          <RotateCcw size={11} /> Reset
        </Button>
        <Button onClick={randomizeProcesses}>
          <Shuffle size={11} /> Random
        </Button>
      </div>
      <SpeedControl />
    </div>
  );
}
