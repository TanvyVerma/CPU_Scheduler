import { useSimulationStore } from '@/store/useSimulationStore';

export default function SpeedControl() {
  const { playbackSpeed, setPlaybackSpeed } = useSimulationStore();
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-[#7e85a0] flex-shrink-0">Speed:</span>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={playbackSpeed}
        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
        className="flex-1 accent-[#7c6fff]"
      />
      <span className="font-mono text-[11px] text-[#b39dff] w-5 text-right">{playbackSpeed}x</span>
    </div>
  );
}
