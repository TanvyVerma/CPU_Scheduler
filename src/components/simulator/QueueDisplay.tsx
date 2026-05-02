import { useSimulation } from '@/hooks/useSimulation';
import { PROCESS_COLORS } from '@/utils/helpers';
import { useSimulationStore } from '@/store/useSimulationStore';

function ProcessChip({ pid, style }: { pid: string; style?: React.CSSProperties }) {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold"
      style={style}
    >
      {pid}
    </span>
  );
}

function QueueBox({
  label,
  color,
  children,
  flex = '1',
}: {
  label: string;
  color: string;
  children: React.ReactNode;
  flex?: string;
}) {
  return (
    <div
      className="bg-[#151720] rounded-lg border border-white/[0.07] p-2"
      style={{ flex }}
    >
      <div className="text-[9px] font-semibold tracking-[0.08em] uppercase mb-1.5" style={{ color }}>
        {label}
      </div>
      <div className="flex flex-wrap gap-1 min-h-[18px]">{children}</div>
    </div>
  );
}

export default function QueueDisplay() {
  const { queues } = useSimulation();
  const processes = useSimulationStore((s) => s.processes);

  function getChipStyle(pid: string) {
    const idx = processes.findIndex((p) => p.id === pid);
    const col = PROCESS_COLORS[idx >= 0 ? idx % PROCESS_COLORS.length : 0];
    return { background: col.bg, border: `1px solid ${col.border}`, color: col.text };
  }

  const doneStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.07)',
    color: '#454a60',
    textDecoration: 'line-through' as const,
  };

  return (
    <div className="flex gap-2 px-4 py-2 bg-[#0e1018] border-b border-white/[0.07] flex-shrink-0">
      <QueueBox label="⏳ Ready" color="#f5a623">
        {queues.ready.length
          ? queues.ready.map((p) => (
              <ProcessChip key={p.id} pid={p.id} style={getChipStyle(p.id)} />
            ))
          : <span className="text-[10px] text-[#454a60]">empty</span>}
      </QueueBox>

      <QueueBox label="⚙ CPU" color="#0ecf8e" flex="0.5">
        {queues.running
          ? <ProcessChip pid={queues.running} style={getChipStyle(queues.running)} />
          : <span className="text-[10px] text-[#454a60]">idle</span>}
      </QueueBox>

      <QueueBox label="✓ Done" color="#454a60">
        {queues.completed.length
          ? queues.completed.map((pid) => (
              <ProcessChip key={pid} pid={pid} style={doneStyle} />
            ))
          : <span className="text-[10px] text-[#454a60]">none</span>}
      </QueueBox>
    </div>
  );
}
