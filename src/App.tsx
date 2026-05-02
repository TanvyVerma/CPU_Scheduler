import { useSimulationStore } from '@/store/useSimulationStore';
import LandingPage from '@/pages/LandingPage';
import SimulationPage from '@/pages/SimulationPage';
import ComparePage from '@/pages/ComparePage';
import ReportsPage from '@/pages/ReportsPage';
import PresetsPage from '@/pages/SetupPage';

type AppView = 'landing' | 'simulate' | 'compare' | 'presets' | 'reports';

export default function App() {
  const activeTab = useSimulationStore((s) => s.activeTab);
  const setActiveTab = useSimulationStore((s) => s.setActiveTab);

  // Map store tabs → views
  const view: AppView =
    activeTab === 'simulate' ? 'simulate' :
    activeTab === 'compare'  ? 'compare'  :
    activeTab === 'presets'  ? 'presets'  :
    activeTab === 'reports'  ? 'reports'  : 'landing';

  if (view === 'landing') return <LandingPage onStart={() => setActiveTab('simulate')} />;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#07080d]">
      {/* ── Top Nav ── */}
      <header className="flex items-center gap-3 px-4 py-2 bg-[#0e1018] border-b border-white/[0.07] flex-shrink-0 z-10">
        {/* Logo */}
        <button
          onClick={() => setActiveTab('simulate')}
          className="flex items-center gap-2 font-bold text-[14px] tracking-tight"
        >
          <span className="w-[26px] h-[26px] rounded-[6px] bg-gradient-to-br from-[#7c6fff] to-[#a78bfa] flex items-center justify-center text-[13px]">
            ⚡
          </span>
          CPU<span className="text-[#b39dff]">Sched</span>
          <span className="text-[10px] font-normal text-[#454a60] ml-0.5">v2.0</span>
        </button>

        {/* Nav tabs */}
        <nav className="flex gap-px ml-4 bg-[#151720] rounded-lg p-[3px] border border-white/[0.07]">
          {([
            ['simulate', 'Simulate'],
            ['compare',  'Compare All'],
            ['presets',  'Presets'],
            ['reports',  'Reports'],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-3 py-1 rounded-[5px] text-[11px] font-medium transition-all ${
                activeTab === id
                  ? 'bg-[#1d2030] text-[#dde1f0] border border-white/[0.13]'
                  : 'text-[#7e85a0] hover:text-[#dde1f0]'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1 overflow-hidden">
        {view === 'simulate' && <SimulationPage />}
        {view === 'compare'  && <ComparePage />}
        {view === 'presets'  && <PresetsPage />}
        {view === 'reports'  && <ReportsPage />}
      </main>
    </div>
  );
}
