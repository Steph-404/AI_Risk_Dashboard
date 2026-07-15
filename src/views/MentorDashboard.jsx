import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  AlertTriangle,
  Route,
  TrendingUp,
  BarChart3,
  Activity,
  Zap,
  Target,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

import { summaryStats, priorityActions, teamSkillsRadar, activityFeed } from '../data/mockData';
import AnimatedCard from '../components/AnimatedCard';

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

const riskColor = (score) => {
  if (score <= 40) return '#00D4AA'; // cyan / low
  if (score <= 65) return '#F59E0B'; // amber / medium
  return '#EF4444'; // red / high
};

/* ─── Custom Recharts Tooltip ───────────────────────────────────── */

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl solid-mask px-4 py-3 shadow-xl">
      <p className="mb-1 text-xs font-semibold text-white/60">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MentorDashboard (Macro Command Center)
   ═══════════════════════════════════════════════════════════════════ */

export default function MentorDashboard() {
  const [activeFilter, setActiveFilter] = useState('3M');

  return (
    <motion.div
      className="space-y-6 max-w-7xl mx-auto pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ────────────────────────────────────────────────────────────
          0. Profile Overview Banner
          ──────────────────────────────────────────────────────────── */}
      <div className="animated-border-card animated-border-card-amber relative flex flex-col gap-4 overflow-hidden solid-mask px-6 py-5 shadow-xl xl:flex-row xl:items-center xl:justify-between mb-2 z-10">
        <div className="flex items-center gap-4 z-10 relative">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F59E0B]/10 overflow-hidden ring-2 ring-amber-500 shadow-lg shadow-amber-500/20">
            <img 
              src="https://api.dicebear.com/7.x/bottts/svg?seed=SeniorMentor&backgroundColor=transparent" 
              alt="Senior Mentor Mascot"
              className="h-full w-full object-cover scale-110"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white sm:text-2xl">Macro Command Center</h1>
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
            </div>
          </div>
        </div>

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
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          1. Summary Cards Row
          ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <AnimatedCard delay={0}>
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cyan-500/10">
              <Users className="h-5 w-5 text-[#00D4AA]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{summaryStats.totalJuniors}</p>
              <p className="text-sm text-slate-400">Total Juniors</p>
              <p className="mt-1 text-xs font-medium text-emerald-400">+2 this month</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.1} variant="amber">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-[#EF4444]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{summaryStats.atRiskCount}</p>
              <p className="text-sm text-slate-400">At-Risk</p>
              <p className="mt-1 text-xs font-medium text-amber-400">Needs attention</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.2} variant="purple">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
              <Route className="h-5 w-5 text-[#7C3AED]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{summaryStats.pathwaysAssigned}</p>
              <p className="text-sm text-slate-400">Pathways Assigned</p>
              <p className="mt-1 text-xs font-medium text-emerald-400">+5 new</p>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.3} variant="amber">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
              <TrendingUp className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-white">{summaryStats.avgRiskScore}%</p>
              <p className="text-sm text-slate-400">Avg Risk Score</p>
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
          2. Analytics Row (Risk Trend + Radar Chart)
          ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Trend Chart */}
        <AnimatedCard delay={0.35} hoverable={false}>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#00D4AA]" />
              <h2 className="text-lg font-semibold text-white">Risk Trend Overview</h2>
            </div>
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
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={riskTrendDataMap[activeFilter]} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="avgRisk"
                name="Avg Risk"
                stroke="#00D4AA"
                strokeWidth={2.5}
                fill="url(#riskGradient)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, fill: '#1A1A2E', stroke: '#00D4AA' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </AnimatedCard>

        {/* Team Skills Radar */}
        <AnimatedCard delay={0.4} hoverable={false} variant="purple">
          <div className="mb-5 flex items-center gap-2">
            <Target className="h-5 w-5 text-[#7C3AED]" />
            <h2 className="text-lg font-semibold text-white">Team Skills vs Future Needs</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={teamSkillsRadar}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Current Skills"
                dataKey="current"
                stroke="#00D4AA"
                fill="#00D4AA"
                fillOpacity={0.4}
              />
              <Radar
                name="Required Skills"
                dataKey="required"
                stroke="#7C3AED"
                fill="#7C3AED"
                fillOpacity={0.4}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
              <RechartsTooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </AnimatedCard>
      </div>

      {/* ────────────────────────────────────────────────────────────
          3. Priority Actions & Activity Feed
          ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Priority Actions */}
        <AnimatedCard delay={0.45} hoverable={false} variant="amber">
          <div className="mb-5 flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#F59E0B]" />
            <h2 className="text-lg font-semibold text-white">Priority Action Center</h2>
          </div>
          <div className="space-y-4">
            {priorityActions.map(action => (
              <div 
                key={action.id}
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  action.type === 'danger' ? 'bg-red-500/5 border-red-500/20' :
                  action.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20' :
                  'bg-cyan-500/5 border-cyan-500/20'
                }`}
              >
                <div>
                  <h3 className={`font-bold text-sm ${
                    action.type === 'danger' ? 'text-red-400' :
                    action.type === 'warning' ? 'text-amber-400' :
                    'text-cyan-400'
                  }`}>{action.title}</h3>
                  <p className="text-xs text-slate-300 mt-1">{action.description}</p>
                </div>
                <button className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  action.type === 'danger' ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white' :
                  action.type === 'warning' ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white' :
                  'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white'
                }`}>
                  {action.actionText}
                </button>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Activity Feed */}
        <AnimatedCard delay={0.5} hoverable={false}>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#00D4AA]" />
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            </div>
            <button className="text-xs text-[#00D4AA] font-medium hover:underline">View All</button>
          </div>
          <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-white/10">
            {activityFeed.map((activity) => (
              <div key={activity.id} className="relative">
                <span className={`absolute -left-6 top-1 h-2.5 w-2.5 rounded-full ring-4 ring-[#1A1A2E] ${
                  activity.type === 'success' ? 'bg-[#00D4AA]' :
                  activity.type === 'danger' ? 'bg-red-500' :
                  activity.type === 'info' ? 'bg-[#7C3AED]' : 'bg-slate-500'
                }`} />
                <p className="text-sm text-slate-200">{activity.text}</p>
                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>

    </motion.div>
  );
}
