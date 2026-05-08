import { Play, Pause, SkipForward, RotateCcw, Shuffle } from 'lucide-react';
import { usePlayback } from '@/hooks/usePlayback';
import { useSimulationStore } from '@/store/useSimulationStore';
import Button from '@/components/common/Button';
import SpeedControl from '@/components/ui/SpeedControl';

export default function PlaybackControls() {
  const { isPlaying, canStep, play, pause, reset, stepForward } = usePlayback();
  const randomizeProcesses = useSimulationStore((s) => s.randomizeProcesses);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 flex-wrap">
        <Button variant="success" onClick={play} disabled={isPlaying} size="lg" className="font-semibold px-6 py-3 hover:scale-105 transition-transform">
          <Play size={16} />
          {isPlaying ? 'Playing…' : 'Simulate'}
        </Button>
        <Button variant="default" onClick={pause} disabled={!isPlaying} size="md" className="hover:bg-[#151720]">
          <Pause size={14} /> Pause
        </Button>
        <Button variant="default" onClick={stepForward} disabled={!canStep && !isPlaying} size="md" className="hover:bg-[#151720]">
          <SkipForward size={14} /> Step
        </Button>
        <Button variant="danger" onClick={reset} size="md" className="hover:bg-red-600">
          <RotateCcw size={14} /> Reset
        </Button>
        <Button variant="default" onClick={randomizeProcesses} size="md" className="hover:bg-[#151720]">
          <Shuffle size={14} /> Random
        </Button>
      </div>
      <SpeedControl />
    </div>
  );
}
