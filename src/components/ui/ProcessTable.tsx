import { useSimulationStore } from '@/store/useSimulationStore';
import { PROCESS_COLORS } from '@/utils/helpers';
import { Trash2, Plus } from 'lucide-react';
import Button from '@/components/common/Button';

export default function ProcessTable() {
  const { processes, addProcess, removeProcess, updateProcess } = useSimulationStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#454a60]">
          Processes ({processes.length})
        </span>
        <Button variant="primary" size="xs" onClick={addProcess}>
          <Plus size={10} /> Add
        </Button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['PID', 'AT', 'BT', 'Pri', ''].map((h) => (
              <th
                key={h}
                className="text-[9px] font-semibold tracking-[0.07em] uppercase text-[#454a60] pb-1.5 text-left px-1"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processes.map((p, i) => {
            const col = PROCESS_COLORS[i % PROCESS_COLORS.length];
            return (
              <tr key={p.id} className="group">
                <td className="py-[2px] px-1">
                  <span
                    className="inline-flex items-center justify-center w-[28px] h-[20px] rounded text-[10px] font-semibold font-mono"
                    style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.text }}
                  >
                    {p.id}
                  </span>
                </td>
                {(['arrivalTime', 'burstTime', 'priority'] as const).map((field) => (
                  <td key={field} className="py-[2px] px-1">
                    <input
                      type="number"
                      min={field === 'arrivalTime' ? 0 : 1}
                      max={field === 'priority' ? 9 : 999}
                      value={p[field]}
                      onChange={(e) => updateProcess(p.id, field, e.target.value)}
                      className="w-[38px] bg-[#151720] border border-white/[0.07] rounded-[4px] text-[#dde1f0] font-mono text-[11px] px-1.5 py-1 outline-none focus:border-[#7c6fff] transition-colors"
                    />
                  </td>
                ))}
                <td className="py-[2px] px-1">
                  <button
                    onClick={() => removeProcess(p.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#454a60] hover:text-[#ff6b6b] transition-all p-1 rounded"
                  >
                    <Trash2 size={11} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {!processes.length && (
        <div className="text-center py-4 text-[#454a60] text-[11px]">
          No processes. Click Add to start.
        </div>
      )}
    </div>
  );
}
