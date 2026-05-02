import { motion } from 'framer-motion';
import { Zap, BarChart2, GitCompare, Brain, AlertTriangle, RefreshCw } from 'lucide-react';
import { ALGORITHM_INFO } from '@/data/algorithms';

interface LandingPageProps {
  onStart: () => void;
}

const features = [
  { icon: Zap,           title: 'Real-Time Simulation',       desc: 'Step-by-step Gantt chart animation with live queue states' },
  { icon: GitCompare,    title: 'Algorithm Comparison',        desc: 'Run all 7 algorithms on the same input and compare metrics' },
  { icon: Brain,         title: 'AI-Powered Analysis',         desc: 'Claude AI analyzes your workload and recommends the best algorithm' },
  { icon: AlertTriangle, title: 'Anomaly Detection',           desc: 'Detects convoy effect, starvation, high switching, low utilization' },
  { icon: RefreshCw,     title: 'Quantum Optimizer',           desc: 'Mathematically computes the ideal Round Robin time quantum' },
  { icon: BarChart2,     title: 'Full Metrics Dashboard',      desc: 'TAT, WT, RT, CPU utilization, throughput, context switch cost' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#07080d] overflow-y-auto">
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124,111,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,111,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7c6fff] to-[#a78bfa] flex items-center justify-center text-2xl shadow-lg shadow-[rgba(124,111,255,0.3)]">
              ⚡
            </div>
            <div className="text-left">
              <div className="font-bold text-3xl tracking-tight">
                CPU<span className="text-[#b39dff]">Sched</span>
              </div>
              <div className="text-[12px] text-[#454a60]">Advanced Scheduling Visualizer v2.0</div>
            </div>
          </div>

          <h1 className="text-5xl font-bold tracking-tight mb-5 leading-tight">
            Visualize, Analyze &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c6fff] to-[#22d3ee]">
              Optimize
            </span>{' '}
            CPU Scheduling
          </h1>

          <p className="text-[15px] text-[#7e85a0] max-w-2xl mx-auto mb-8 leading-relaxed">
            A production-grade educational platform for simulating all major CPU scheduling algorithms
            in real time — with AI-powered recommendations, anomaly detection, and comprehensive metrics.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onStart}
              className="px-8 py-3.5 bg-gradient-to-r from-[#7c6fff] to-[#5ba4f5] text-white font-semibold rounded-xl text-[14px] shadow-lg shadow-[rgba(124,111,255,0.25)] hover:shadow-[rgba(124,111,255,0.4)] transition-shadow"
            >
              Launch Simulator →
            </motion.button>
            <button
              onClick={onStart}
              className="px-6 py-3.5 bg-[#0e1018] border border-white/[0.13] text-[#dde1f0] font-medium rounded-xl text-[14px] hover:border-white/[0.25] transition-colors"
            >
              View Documentation
            </button>
          </div>
        </motion.div>

        {/* Algorithm cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-14"
        >
          <div className="text-center mb-6">
            <div className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#454a60] mb-1">
              Supported Algorithms
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {ALGORITHM_INFO.map((algo, i) => (
              <motion.div
                key={algo.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="bg-[#0e1018] border border-white/[0.07] rounded-xl p-3 text-center hover:border-[rgba(124,111,255,0.4)] transition-colors cursor-default group"
              >
                <div className="font-bold text-[13px] text-[#dde1f0] group-hover:text-[#b39dff] transition-colors">
                  {algo.name}
                </div>
                <div className="text-[9px] text-[#454a60] mt-0.5">{algo.tag}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="bg-[#0e1018] border border-white/[0.07] rounded-2xl p-5 hover:border-[rgba(124,111,255,0.3)] transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-[rgba(124,111,255,0.12)] flex items-center justify-center mb-3 group-hover:bg-[rgba(124,111,255,0.2)] transition-colors">
                <f.icon size={16} className="text-[#7c6fff]" />
              </div>
              <div className="font-semibold text-[13px] mb-1">{f.title}</div>
              <div className="text-[11px] text-[#7e85a0] leading-relaxed">{f.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(124,111,255,0.08)] border border-[rgba(124,111,255,0.2)] rounded-full text-[11px] text-[#b39dff] mb-4">
            <span className="w-1.5 h-1.5 bg-[#0ecf8e] rounded-full animate-pulse" />
            Ready to simulate — no installation required
          </div>
          <div className="block">
            <button
              onClick={onStart}
              className="text-[#7c6fff] hover:text-[#b39dff] text-[13px] font-medium transition-colors underline underline-offset-4"
            >
              Get started now →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
