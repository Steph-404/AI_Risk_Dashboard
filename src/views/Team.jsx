import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Eye,
  ArrowRight,
  Filter,
  KanbanSquare,
  List,
  AlertTriangle,
  Calendar,
  Wallet,
  Users,
  Grid
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

import { 
  juniors, 
  mentorshipBandwidth, 
  peerPairings, 
  upcomingMilestones 
} from '../data/mockData';
import AnimatedCard from '../components/AnimatedCard';
import RiskBadge from '../components/RiskBadge';

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.3, ease: 'easeOut' },
  }),
};

/* ─── Kanban Columns ─── */
const KANBAN_STAGES = ['At Risk', 'Exploring Pathways', 'Actively Upskilling', 'Transition Ready'];

/* ─── Heatmap Data Generation ─── */
const SKILLS = ['Python', 'SQL', 'Prompt Eng.', 'Ethics', 'Data Mod.'];
const heatmapData = juniors.map(junior => {
  return {
    name: junior.name.split(' ')[0],
    scores: SKILLS.map(skill => ({
      skill,
      score: Math.floor(Math.random() * 60) + 40 // random score 40-100 for mock
    }))
  };
});

const getHeatmapColor = (score) => {
  if (score < 50) return '#EF4444'; // Red (Gap)
  if (score < 75) return '#F59E0B'; // Amber (Developing)
  return '#00D4AA'; // Cyan (Proficient)
};

export default function Team({ onSelectJunior }) {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [riskFilter, setRiskFilter] = useState('ALL');

  const filteredJuniors = juniors.filter(j => 
    riskFilter === 'ALL' || j.riskLevel === riskFilter
  );

  return (
    <motion.div
      className="space-y-6 max-w-7xl mx-auto pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ────────────────────────────────────────────────────────────
          1. Header & Filters
          ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 z-10 relative">
        <div>
          <motion.h1
            className="text-3xl font-extrabold text-white mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Team Roster & Development
          </motion.h1>
          <motion.p
            className="text-slate-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            Manage individual transitions, track upskilling budgets, and monitor milestones.
          </motion.p>
        </div>

        <motion.div 
          className="flex flex-wrap items-center gap-3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        >
          {/* Risk Filter */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5">
            <Filter size={14} className="text-slate-400 ml-2" />
            <select 
              className="bg-transparent text-sm font-medium text-white outline-none cursor-pointer pr-2"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#00D4AA]/20 text-[#00D4AA]' : 'text-slate-400 hover:text-white'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'kanban' ? 'bg-[#00D4AA]/20 text-[#00D4AA]' : 'text-slate-400 hover:text-white'}`}
            >
              <KanbanSquare size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          2. Flight Risk Monitor (Alert Card)
          ──────────────────────────────────────────────────────────── */}
      {filteredJuniors.some(j => j.riskLevel === 'HIGH' && j.sentiment.includes('abandoned')) && (
        <AnimatedCard delay={0.1} variant="amber" hoverable={false}>
          <div className="flex items-start sm:items-center gap-4 bg-red-500/5 -m-5 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-red-400 font-bold">High Flight Risk Detected</h3>
              <p className="text-sm text-slate-300 mt-1">
                Fatima Al-Rashid has a High automation risk (82%) combined with declining sentiment ("Overwhelmed, abandoned"). Immediate 1-on-1 intervention is highly recommended.
              </p>
            </div>
            <button className="hidden sm:block shrink-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-red-500/20">
              Schedule Check-in
            </button>
          </div>
        </AnimatedCard>
      )}

      {/* ────────────────────────────────────────────────────────────
          3. Team View (List OR Kanban)
          ──────────────────────────────────────────────────────────── */}
      <AnimatedCard delay={0.2} hoverable={false}>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#7C3AED]" />
            <h2 className="text-lg font-semibold text-white">
              {viewMode === 'list' ? 'Team Roster' : 'Transition Pipeline'}
            </h2>
          </div>
        </div>

        {viewMode === 'list' ? (
          /* List View (Table) */
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="data-table min-w-[800px]">
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
                  {filteredJuniors.map((junior, index) => {
                    const flaggedTasks = junior.tasks.filter((t) => t.automationRisk > 60);
                    const topPathway = junior.pathways[0];
                    return (
                      <motion.tr
                        key={junior.id} custom={index} variants={rowVariants}
                        initial="hidden" animate="visible" exit="hidden" className="group"
                      >
                        <td>
                          <div className="flex items-center gap-3 cursor-pointer group/profile" onClick={() => onSelectJunior(junior)}>
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 overflow-hidden ring-1 ring-white/10 group-hover/profile:ring-[#00D4AA]/50 transition-colors">
                              <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${junior.name}&backgroundColor=transparent`} alt="mascot" className="h-full w-full object-cover scale-110" />
                            </div>
                            <div>
                              <p className="font-medium text-white group-hover/profile:text-[#00D4AA] transition-colors">{junior.name}</p>
                              <p className="text-xs text-slate-500">{junior.role}</p>
                            </div>
                          </div>
                        </td>
                        <td>{junior.role}</td>
                        <td><RiskBadge level={junior.riskLevel} /></td>
                        <td>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-white">{flaggedTasks.length}</span>
                            <div className="flex items-end gap-[3px]">
                              {junior.tasks.map((task, tIdx) => (
                                <div key={tIdx} className="w-[6px] rounded-sm opacity-85"
                                  style={{
                                    height: `${Math.max(task.automationRisk * 0.3, 4)}px`,
                                    backgroundColor: task.automationRisk > 60 ? '#EF4444' : task.automationRisk > 40 ? '#F59E0B' : '#00D4AA'
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                        <td>
                          {topPathway ? (
                            <div>
                              <p className="text-sm font-medium text-white">{topPathway.title}</p>
                              <p className="text-xs text-[#00D4AA]">{topPathway.match}% match</p>
                            </div>
                          ) : <span className="text-xs text-slate-500">—</span>}
                        </td>
                        <td className="text-right">
                          <button onClick={() => onSelectJunior(junior)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-[#00D4AA]/30 hover:bg-[#00D4AA]/10 hover:text-[#00D4AA] transition-all">
                            <Eye className="h-3.5 w-3.5" /> View Profile
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          /* Kanban View */
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x custom-scrollbar">
            {KANBAN_STAGES.map((stage) => {
              const stageJuniors = filteredJuniors.filter(j => j.stage === stage);
              return (
                <div key={stage} className="min-w-[280px] flex-1 solid-mask rounded-xl p-4 snap-start">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{stage}</h3>
                    <span className="bg-white/10 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stageJuniors.length}</span>
                  </div>
                  <div className="space-y-3">
                    {stageJuniors.map(junior => (
                      <div 
                        key={junior.id} 
                        onClick={() => onSelectJunior(junior)}
                        className="solid-mask rounded-xl p-3 cursor-pointer hover:border-[#00D4AA]/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-8 w-8 rounded-full bg-white/5 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${junior.name}&backgroundColor=transparent`} alt="mascot" className="h-full w-full object-cover scale-110" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-[#00D4AA] transition-colors">{junior.name}</p>
                            <RiskBadge level={junior.riskLevel} />
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">{junior.pathways[0]?.title || 'No pathway'}</p>
                      </div>
                    ))}
                    {stageJuniors.length === 0 && (
                      <div className="p-4 border-2 border-dashed border-white/5 rounded-xl text-center text-xs text-slate-500 font-medium">
                        Empty
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AnimatedCard>

      {/* ────────────────────────────────────────────────────────────
          4. Data Grid (Heatmap & Budgets & Milestones)
          ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heatmap Card */}
        <div className="lg:col-span-2">
          <AnimatedCard delay={0.3} variant="cyan" hoverable={false} className="h-full">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Grid className="h-5 w-5 text-[#00D4AA]" />
                <h2 className="text-lg font-semibold text-white">Skill-Gap Matrix</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-xs font-semibold text-slate-400 border-b border-white/10">Mentee</th>
                    {SKILLS.map(skill => (
                      <th key={skill} className="p-2 text-xs font-semibold text-slate-400 border-b border-white/10 text-center">{skill}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((data, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="p-2 text-sm font-medium text-white">{data.name}</td>
                      {data.scores.map((s, j) => (
                        <td key={j} className="p-2 text-center">
                          <div 
                            className="w-full h-8 rounded border border-black/20 shadow-inner flex items-center justify-center text-[10px] font-bold text-black/60"
                            style={{ backgroundColor: getHeatmapColor(s.score) }}
                            title={`${s.skill}: ${s.score}%`}
                          >
                            {s.score}%
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-end gap-4 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#EF4444]" /> Gap</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#F59E0B]" /> Developing</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#00D4AA]" /> Proficient</div>
            </div>
          </AnimatedCard>
        </div>

        {/* Bandwidth & Budget */}
        <AnimatedCard delay={0.4} hoverable={false}>
          <div className="mb-5 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Resources & Bandwidth</h2>
          </div>
          
          <div className="space-y-6">
            {/* Bandwidth */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Mentor Capacity</span>
                <span className={`font-bold ${mentorshipBandwidth.capacity > 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {mentorshipBandwidth.capacity}%
                </span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-amber-400" style={{ width: `${mentorshipBandwidth.capacity}%` }} />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>{mentorshipBandwidth.activeInterventions} Active Interventions</span>
                <span>{mentorshipBandwidth.upcoming1on1s} Upcoming 1-on-1s</span>
              </div>
            </div>

            <div className="h-px w-full bg-white/10" />

            {/* Budget */}
            <div>
              <p className="text-sm font-semibold text-white mb-4">Training Budget Utilization</p>
              <div className="space-y-3">
                {filteredJuniors.slice(0,3).map(junior => (
                  <div key={junior.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300 truncate pr-2">{junior.name}</span>
                      <span className="text-emerald-400 shrink-0 font-medium">KES {(junior.budgetUsed/1000).toFixed(0)}k</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${junior.budgetUsed / junior.budgetTotal > 0.75 ? 'bg-amber-400' : 'bg-emerald-400'}`} 
                        style={{ width: `${(junior.budgetUsed / junior.budgetTotal) * 100}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* ────────────────────────────────────────────────────────────
          5. Pairings & Milestones
          ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Peer Pairings Engine */}
        <AnimatedCard delay={0.5} variant="purple" hoverable={false}>
          <div className="mb-5 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#7C3AED]" />
            <h2 className="text-lg font-semibold text-white">Peer Pairing Suggestions</h2>
          </div>
          <div className="space-y-4">
            {peerPairings.map(pairing => (
              <div key={pairing.id} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-between group">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{pairing.mentor}</span>
                    <ArrowRight size={14} className="text-slate-500" />
                    <span className="text-sm font-bold text-white">{pairing.mentee}</span>
                  </div>
                  <p className="text-xs text-[#7C3AED] font-medium">Skill: {pairing.skill}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="bg-purple-500/20 text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/30">
                    {pairing.matchScore}% Match
                  </span>
                  <button className="text-xs font-semibold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    Suggest Sync
                  </button>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>

        {/* Upcoming Milestones */}
        <AnimatedCard delay={0.6} variant="amber" hoverable={false}>
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#F59E0B]" />
              <h2 className="text-lg font-semibold text-white">Upcoming Milestones</h2>
            </div>
          </div>
          <div className="space-y-3">
            {upcomingMilestones.map(milestone => (
              <div key={milestone.id} className="flex gap-4 items-start p-3 rounded-xl solid-mask">
                <div className={`shrink-0 w-12 text-center py-1 rounded bg-white/5 border ${milestone.type === 'urgent' ? 'border-amber-500/50 text-amber-400' : 'border-white/10 text-slate-400'}`}>
                  <p className="text-[10px] font-bold uppercase">{milestone.date === 'Today' ? 'TDY' : milestone.date.substring(0,3)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white leading-tight">{milestone.task}</p>
                  <p className="text-xs text-slate-500 mt-1">{milestone.mentee}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>

      </div>
    </motion.div>
  );
}
