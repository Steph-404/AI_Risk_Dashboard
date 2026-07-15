import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  AlertTriangle,
  Route,
  TrendingUp,
  Eye,
  ArrowRight,
  ChevronRight,
  BarChart3,
  Shield,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { juniors, summaryStats } from '../data/mockData';
import AnimatedCard from '../components/AnimatedCard';
import RiskBadge from '../components/RiskBadge';

/* ─── Static Data ───────────────────────────────────────────────── */

const riskTrendDataMap = {
  '1W': [
    { month: 'Mon', avgRisk: 55, highRisk: 2, lowRisk: 1 },
    { month: 'Tue', avgRisk: 57, highRisk: 2, lowRisk: 1 },
    { month: 'Wed', avgRisk: 54, highRisk: 1, lowRisk: 2 },
    { month: 'Thu', avgRisk: 51, highRisk: 1, lowRisk: 2 },
    { month: 'Fri', avgRisk: 53, highRisk: 1, lowRisk: 2 },
    { month: 'Sat', avgRisk: 58, highRisk: 2, lowRisk: 1 },
    { month: 'Sun', avgRisk: 59, highRisk: 2, lowRisk: 1 },
  ],
  '1M': [
    { month: 'Week 1', avgRisk: 52, highRisk: 1, lowRisk: 2 },
    { month: 'Week 2', avgRisk: 50, highRisk: 1, lowRisk: 2 },
    { month: 'Week 3', avgRisk: 55, highRisk: 2, lowRisk: 1 },
    { month: 'Week 4', avgRisk: 59, highRisk: 2, lowRisk: 1 },
  ],
  '3M': [
    { month: 'Apr', avgRisk: 48, highRisk: 1, lowRisk: 2 },
    { month: 'May', avgRisk: 52, highRisk: 2, lowRisk: 1 },
    { month: 'Jun', avgRisk: 59, highRisk: 2, lowRisk: 1 },
  ],
  '6M': [
    { month: 'Jan', avgRisk: 45, highRisk: 1, lowRisk: 2 },
    { month: 'Feb', avgRisk: 48, highRisk: 1, lowRisk: 2 },
    { month: 'Mar', avgRisk: 52, highRisk: 2, lowRisk: 1 },
    { month: 'Apr', avgRisk: 55, highRisk: 2, lowRisk: 1 },
    { month: 'May', avgRisk: 58, highRisk: 2, lowRisk: 1 },
    { month: 'Jun', avgRisk: 59, highRisk: 2, lowRisk: 1 },
  ],
};

const FILTER_OPTIONS = ['1W', '1M', '3M', '6M'];

/* ─── Helpers ───────────────────────────────────────────────────── */

/** Return a Tailwind-friendly colour token based on risk score. */
const riskColor = (score) => {
  if (score <= 40) return '#00D4AA'; // cyan / low
  if (score <= 65) return '#F59E0B'; // amber / medium
  return '#EF4444'; // red / high
};

/** Extract initials from a full name. */
const getInitials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

/* ─── Custom Recharts Tooltip ───────────────────────────────────── */

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-[#1A1A2E]/90 px-4 py-3 shadow-xl backdrop-blur-xl">
      <p className="mb-1 text-xs font-semibold text-white/60">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ─── Stagger Animation Variants ────────────────────────────────── */

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.06 * i, duration: 0.4, ease: 'easeOut' },
  }),
};

/* ═══════════════════════════════════════════════════════════════════
   MentorDashboard
   ═══════════════════════════════════════════════════════════════════ */

export default function MentorDashboard({ onSelectJunior }) {
  const [activeFilter, setActiveFilter] = useState('3M');

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ────────────────────────────────────────────────────────────
          0. Profile Overview Banner
          ──────────────────────────────────────────────────────────── */}
      <div className="animated-border-card animated-border-card-amber relative flex flex-col gap-4 overflow-hidden bg-[#1A1A2E] px-6 py-5 shadow-xl xl:flex-row xl:items-center xl:justify-between mb-2 z-10">
        {/* Left Section: Profile Info */}
        <div className="flex items-center gap-4 z-10 relative">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F59E0B]/10 overflow-hidden ring-2 ring-amber-500 shadow-lg shadow-amber-500/20">
            <img 
              src="https://api.dicebear.com/7.x/bottts/svg?seed=SeniorMentor&backgroundColor=transparent" 
              alt="Senior Mentor Mascot"
              className="h-full w-full object-cover scale-110"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white sm:text-2xl">Senior Mentor</h1>
            <p className="mt-1 truncate text-xs font-medium text-slate-400">
              Team Lead · Verified Mentor · Nairobi HQ · 24 Mentees
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500 border border-amber-500/20">
                Verified Mentor
              </span>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                Active
              </span>
              <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 border border-blue-500/20">
                AI Partner
              </span>
              <span className="rounded bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-400 border border-purple-500/20">
                Tier 1 Lead
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Key Stats */}
        <div className="flex flex-nowrap items-center justify-between gap-6 xl:justify-end xl:gap-10 xl:text-center mt-1 xl:mt-0 overflow-x-auto pb-1 xl:pb-0 hide-scrollbar">
          <div className="shrink-0">
            <p className="text-xl font-bold text-[#F59E0B] sm:text-2xl">24</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Mentees</p>
          </div>
          <div className="shrink-0">
            <p className="text-xl font-bold text-[#F59E0B] sm:text-2xl">12</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Pathways</p>
          </div>
          <div className="shrink-0">
            <p className="text-xl font-bold text-[#F59E0B] sm:text-2xl">34</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Interventions</p>
          </div>
          <div className="shrink-0">
            <p className="text-xl font-bold text-[#F59E0B] sm:text-2xl">94%</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">Success Rate</p>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          1. Summary Cards Row
          ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Juniors */}
        <AnimatedCard delay={0}>
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-500/10">
              <Users className="h-5 w-5 text-[#00D4AA]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {summaryStats.totalJuniors}
              </p>
              <p className="text-sm text-slate-400">Total Juniors</p>
              <p className="mt-1 text-xs font-medium text-emerald-400">
                +2 this month
              </p>
            </div>
          </div>
        </AnimatedCard>

        {/* At-Risk Count */}
        <AnimatedCard delay={0.1} variant="amber">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {summaryStats.atRiskCount}
              </p>
              <p className="text-sm text-slate-400">At-Risk</p>
              <p className="mt-1 text-xs font-medium text-amber-400">
                Needs attention
              </p>
            </div>
          </div>
        </AnimatedCard>

        {/* Pathways Assigned */}
        <AnimatedCard delay={0.2} variant="purple">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
              <Route className="h-5 w-5 text-[#7C3AED]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {summaryStats.pathwaysAssigned}
              </p>
              <p className="text-sm text-slate-400">Pathways Assigned</p>
              <p className="mt-1 text-xs font-medium text-emerald-400">
                +5 new
              </p>
            </div>
          </div>
        </AnimatedCard>

        {/* Avg Risk Score */}
        <AnimatedCard delay={0.3} variant="amber">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
              <TrendingUp className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-white">
                {summaryStats.avgRiskScore}%
              </p>
              <p className="text-sm text-slate-400">Avg Risk Score</p>
              {/* Mini progress bar */}
              <div className="progress-bar mt-2 w-full">
                <div
                  className="progress-fill"
                  style={{
                    width: `${summaryStats.avgRiskScore}%`,
                    backgroundColor: riskColor(summaryStats.avgRiskScore),
                  }}
                />
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* ────────────────────────────────────────────────────────────
          2. Risk Trend Chart
          ──────────────────────────────────────────────────────────── */}
      <AnimatedCard delay={0.35} hoverable={false}>
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#00D4AA]" />
            <h2 className="text-lg font-semibold text-white">
              Risk Trend Overview
            </h2>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-1 rounded-lg border border-white/5 bg-white/[0.03] p-1">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  activeFilter === opt
                    ? 'bg-[#00D4AA]/15 text-[#00D4AA] shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={riskTrendDataMap[activeFilter]}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748B', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="avgRisk"
              name="Avg Risk"
              stroke="#00D4AA"
              strokeWidth={2.5}
              fill="url(#riskGradient)"
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                fill: '#1A1A2E',
                stroke: '#00D4AA',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </AnimatedCard>

      {/* ────────────────────────────────────────────────────────────
          3. Team Table
          ──────────────────────────────────────────────────────────── */}
      <AnimatedCard delay={0.45} hoverable={false}>
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#7C3AED]" />
            <h2 className="text-lg font-semibold text-white">Team Overview</h2>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-[#00D4AA] transition-colors hover:text-[#00D4AA]/80">
            View All <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Responsive table wrapper */}
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Risk Level</th>
                <th>Flagged Tasks</th>
                <th>Top Pathway</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {juniors.map((junior, index) => {
                  const flaggedTasks = junior.tasks.filter(
                    (t) => t.automationRisk > 60,
                  );
                  const topPathway = junior.pathways[0];

                  return (
                    <motion.tr
                      key={junior.id}
                      custom={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="group"
                    >
                      {/* Name + Avatar */}
                      <td>
                        <div 
                          className="flex items-center gap-3 cursor-pointer group/profile"
                          onClick={() => onSelectJunior(junior)}
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 overflow-hidden ring-1 ring-white/10 transition-colors group-hover/profile:ring-[#00D4AA]/50">
                            <img 
                              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${junior.name}&backgroundColor=transparent`} 
                              alt={`${junior.name} mascot`}
                              className="h-full w-full object-cover scale-110"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-white transition-colors group-hover/profile:text-[#00D4AA]">
                              {junior.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {junior.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td>{junior.role}</td>

                      {/* Risk Level */}
                      <td>
                        <RiskBadge level={junior.riskLevel} />
                      </td>

                      {/* Flagged Tasks */}
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-white">
                            {flaggedTasks.length}
                          </span>
                          {/* Mini inline bar chart */}
                          <div className="flex items-end gap-[3px]">
                            {junior.tasks.map((task, tIdx) => (
                              <div
                                key={tIdx}
                                title={`${task.name}: ${task.automationRisk}%`}
                                className="w-[6px] rounded-sm"
                                style={{
                                  height: `${Math.max(task.automationRisk * 0.3, 4)}px`,
                                  backgroundColor:
                                    task.automationRisk > 60
                                      ? '#EF4444'
                                      : task.automationRisk > 40
                                        ? '#F59E0B'
                                        : '#00D4AA',
                                  opacity: 0.85,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Top Pathway */}
                      <td>
                        {topPathway ? (
                          <div>
                            <p className="text-sm font-medium text-white">
                              {topPathway.title}
                            </p>
                            <p className="text-xs text-[#00D4AA]">
                              {topPathway.match}% match
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">—</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="text-right">
                        <button
                          onClick={() => onSelectJunior?.(junior)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-[#00D4AA]/30 hover:bg-[#00D4AA]/10 hover:text-[#00D4AA]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Profile
                          <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </AnimatedCard>
    </motion.div>
  );
}
