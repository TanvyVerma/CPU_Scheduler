import { useState } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';
import { parseCSV } from '@/utils/validators';
import Button from '@/components/common/Button';

export default function CSVImport({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const setProcesses = useSimulationStore((s) => s.setProcesses);

  function handleImport() {
    if (!text.trim()) { setError('Paste CSV data first'); return; }
    try {
      const ps = parseCSV(text);
      if (!ps.length) { setError('No valid rows found'); return; }
      setProcesses(ps);
      onClose();
    } catch {
      setError('Invalid format. Use: PID,ArrivalTime,BurstTime,Priority');
    }
  }

  const example = `P1,0,5,2\nP2,1,3,1\nP3,2,8,3\nP4,4,2,2`;

  return (
    <div>
      <p className="text-[11px] text-[#7e85a0] mb-2">
        Format: <span className="font-mono text-[#b39dff]">PID, ArrivalTime, BurstTime, Priority</span> — one per line
      </p>
      <textarea
        rows={6}
        placeholder={example}
        value={text}
        onChange={(e) => { setText(e.target.value); setError(''); }}
        className="w-full bg-[#151720] border border-white/[0.07] rounded-lg text-[#dde1f0] font-mono text-[11px] p-3 outline-none focus:border-[#7c6fff] resize-none transition-colors"
      />
      {error && <p className="text-[#ff6b6b] text-[10px] mt-1">{error}</p>}
      <div className="flex gap-2 mt-3">
        <Button variant="primary" onClick={handleImport} fullWidth>Import Processes</Button>
        <Button variant="default" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}
