import { useSimulationStore } from '@/store/useSimulationStore';
import { PROCESS_COLORS } from '@/utils/helpers';
import { Trash2, Plus } from 'lucide-react';
import Button from '@/components/common/Button';
import Tooltip from '@/components/common/Tooltip';

export default function ProcessTable() {
  const { processes, addProcess, removeProcess, updateProcess } = useSimulationStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold tracking-wide uppercase text-[#cbd5ff]">
          Processes ({processes.length})
        </span>
        <Button variant="primary" size="sm" onClick={addProcess} className="hover:bg-[#7c6fff]/80">
          <Plus size={14} /> Add
        </Button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {[
              { key: 'PID', label: 'Process ID' },
              { key: 'AT', label: 'Arrival Time' },
              { key: 'BT', label: 'Burst Time' },
              { key: 'PRI', label: 'Priority' },
              { key: '', label: '' }
            ].map(({ key, label }) => (
              <th
                key={key}
                className="text-xs font-semibold tracking-wide uppercase text-[#cbd5ff] pb-3 text-left px-2"
              >
                {key && (
                  <Tooltip content={label}>
                    <span className="cursor-help">{key}</span>
                  </Tooltip>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {processes.map((p, i) => {
            const col = PROCESS_COLORS[i % PROCESS_COLORS.length];
            return (
              <tr key={p.id} className="group hover:bg-white/[0.05] transition-colors rounded-lg">
                <td className="py-3 px-2">
                  <span
                    className="inline-flex items-center justify-center w-[36px] h-[28px] rounded-md text-sm font-semibold font-mono shadow-sm"
                    style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.text }}
                  >
                    {p.id}
                  </span>
                </td>
                {([
                  { field: 'arrivalTime' as const, label: 'Arrival Time (ms)' },
                  { field: 'burstTime' as const, label: 'Burst Time (ms)' },
                  { field: 'priority' as const, label: 'Priority (1-9, lower = higher)' }
                ] as const).map(({ field, label }) => (
                  <td key={field} className="py-3 px-2">
                    <Tooltip content={label}>
                      <input
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min={field === 'arrivalTime' ? 0 : 1}
                        max={field === 'priority' ? 9 : 999}
                        value={p[field]}
                        placeholder="0"
                        onChange={(e) => updateProcess(p.id, field, e.target.value)}
                        className="w-full min-w-[60px] bg-[#1a1d2e] border border-white/[0.15] rounded-lg text-[#dde1f0] font-mono text-sm font-semibold px-3 py-2 outline-none focus:border-[#7c6fff] focus:ring-2 focus:ring-[#7c6fff]/20 transition-all hover:border-white/[0.2] appearance-none"
                      />
                    </Tooltip>
                  </td>
                ))}
                <td className="py-3 px-2">
                  <button
                    onClick={() => removeProcess(p.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#454a60] hover:text-[#ff6b6b] transition-all p-2 rounded-md hover:bg-white/[0.05]"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {!processes.length && (
        <div className="text-center py-8 text-[#454a60] text-sm">
          No processes. Click Add to start.
        </div>
      )}
    </div>
  );
}
