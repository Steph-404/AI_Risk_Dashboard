import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Target,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import AnimatedCard from '../components/AnimatedCard';
import PathwayDetailsModal from './PathwayDetailsModal';

/* ──────────────────────────────────────────
   Helpers
   ────────────────────────────────────────── */
const getRiskColor = (risk) => {
  if (risk > 70) return { text: 'text-red-400', bg: 'bg-red-500', bar: '#EF4444' };
  if (risk > 50) return { text: 'text-amber-400', bg: 'bg-amber-500', bar: '#F59E0B' };
  return { text: 'text-cyan-400', bg: 'bg-cyan-500', bar: '#00D4AA' };
};

const getMatchColor = (match) => {
  if (match >= 75) return 'text-emerald-400';
  if (match >= 60) return 'text-cyan-400';
  return 'text-amber-400';
};

const CARD_VARIANTS = ['cyan', 'purple', 'amber'];

/* ──────────────────────────────────────────
   Animation variants
   ────────────────────────────────────────── */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 28, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.92, y: 30, transition: { duration: 0.2 } },
};

const staggerContainer = {
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

/* ──────────────────────────────────────────
   Component
   ────────────────────────────────────────── */
export default function JuniorProfileModal({ junior, onClose }) {
  const [selectedPathway, setSelectedPathway] = useState(null);

  /* Guard – nothing to render */
  if (!junior) return null;

  /* Close only when clicking the overlay backdrop */
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <AnimatePresence>
      {junior && (
        /* ── Overlay ────────────────────────── */
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          style={{
            background: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleOverlayClick}
        >
          {/* ── Modal Content ────────────────── */}
          <motion.div
            className="glass-strong relative w-full max-w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full
                         bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="p-6 sm:p-8 space-y-8">
              {/* ============================
                  HEADER
                  ============================ */}
              <section className="space-y-6">
                <div className="animated-border-card animated-border-card-purple relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 overflow-hidden rounded-2xl bg-[#1A1A2E]/60 px-6 py-6 shadow-2xl z-10">
                  {/* Left – Avatar + Info */}
                  <div className="flex items-center gap-5 z-10 relative w-full sm:w-auto">
                    {/* Avatar */}
                    <div className="flex h-[72px] w-[72px] sm:h-[88px] sm:w-[88px] shrink-0 items-center justify-center rounded-full bg-white/5 overflow-hidden ring-2 ring-cyan-500/50 shadow-lg shadow-cyan-500/20">
                      <img 
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${junior.name}&backgroundColor=transparent`} 
                        alt={`${junior.name} Mascot`}
                        className="h-full w-full object-cover scale-110"
                      />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight truncate">
                        {junior.name}
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm font-medium text-cyan-400/90 truncate">
                        {junior.role} <span className="mx-2 text-white/20">•</span> {junior.tenure}
                      </p>
                      <p className="mt-2 text-xs italic text-slate-400 truncate">
                        Status: <span className="text-white/70">{junior.feeling}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right – Risk Gauge */}
                  <div className="flex-shrink-0 self-center z-10 relative">
                    <RiskGauge score={junior.riskScore} size={110} />
                  </div>
                </div>

                {/* Sentiment Quote */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500/10 to-transparent p-5 border-l-4 border-cyan-500">
                  <p className="text-sm italic text-gray-300 leading-relaxed font-medium">
                    &ldquo;{junior.sentiment}&rdquo;
                  </p>
                </div>
              </section>

              {/* ============================
                  FLAGGED AUTOMATABLE TASKS
                  ============================ */}
              <motion.section
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <AlertCircle size={20} className="text-amber-400" />
                  Flagged Automatable Tasks
                </h3>

                <div className="space-y-3">
                  {junior.tasks.map((task, idx) => {
                    const color = getRiskColor(task.automationRisk);
                    return (
                      <motion.div
                        key={task.name}
                        className="relative overflow-hidden rounded-xl bg-[#1A1A2E]/50 p-5 border border-white/[0.05] shadow-lg"
                        variants={fadeUp}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-white tracking-wide">
                            {task.name}
                          </span>
                          <span className={`text-lg font-extrabold ${color.text}`} style={{ textShadow: `0 0 15px ${color.bar}40` }}>
                            {task.automationRisk}%
                          </span>
                        </div>

                        {/* Glowing Progress bar */}
                        <div className="h-2 w-full rounded-full bg-[#0F0F1A] overflow-hidden ring-1 ring-white/5">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ 
                              backgroundColor: color.bar,
                              boxShadow: `0 0 12px ${color.bar}, 0 0 4px ${color.bar}`
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${task.automationRisk}%` }}
                            transition={{
                              duration: 1.2,
                              delay: 0.2 + idx * 0.1,
                              ease: [0.16, 1, 0.3, 1], // Custom spring-like ease out
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>

              {/* ============================
                  EMERGING ROLE PATHWAYS
                  ============================ */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Sparkles size={20} className="text-purple-400" />
                  Bridge Pathways — Emerging Roles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {junior.pathways.map((pathway, idx) => (
                    <AnimatedCard
                      key={pathway.title}
                      variant={CARD_VARIANTS[idx] || 'cyan'}
                      delay={0.1 + idx * 0.12}
                    >
                      <div className="space-y-4">
                        {/* Title */}
                        <h4 className="text-base font-bold text-white leading-snug">
                          {pathway.title}
                        </h4>

                        {/* Match indicator */}
                        <div className="flex items-center gap-3">
                          {/* Circular match ring */}
                          <div className="relative h-14 w-14 shrink-0">
                            <svg
                              width={56}
                              height={56}
                              viewBox="0 0 56 56"
                              className="transform -rotate-90"
                            >
                              <circle
                                cx={28}
                                cy={28}
                                r={24}
                                fill="none"
                                stroke="rgba(255,255,255,0.06)"
                                strokeWidth={4}
                              />
                              <motion.circle
                                cx={28}
                                cy={28}
                                r={24}
                                fill="none"
                                stroke={
                                  pathway.match >= 75
                                    ? '#00D4AA'
                                    : pathway.match >= 60
                                      ? '#06B6D4'
                                      : '#F59E0B'
                                }
                                strokeWidth={4}
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 24}
                                initial={{
                                  strokeDashoffset: 2 * Math.PI * 24,
                                }}
                                animate={{
                                  strokeDashoffset:
                                    2 * Math.PI * 24 -
                                    (pathway.match / 100) * 2 * Math.PI * 24,
                                }}
                                transition={{
                                  duration: 1,
                                  delay: 0.3 + idx * 0.15,
                                  ease: 'easeOut',
                                }}
                              />
                            </svg>
                            <span
                              className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${getMatchColor(pathway.match)}`}
                            >
                              {pathway.match}%
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <TrendingUp size={12} className="text-emerald-400" />
                              <span>Growth {pathway.growth}</span>
                            </div>
                            <p className="text-xs text-gray-500">{pathway.salary}</p>
                          </div>
                        </div>

                        {/* Transferable Skills */}
                        <div className="space-y-1.5">
                          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                            <CheckCircle size={12} className="text-cyan-500" />
                            Transferable Skills
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {pathway.transferableSkills.map((skill) => (
                              <span
                                key={skill}
                                className="inline-block rounded-full bg-cyan-500/10 px-2.5 py-0.5
                                           text-[11px] font-medium text-cyan-400 border border-cyan-500/20"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Skill Gap */}
                        <div className="space-y-1.5">
                          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                            <BookOpen size={12} className="text-amber-500" />
                            Skill Gap
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {pathway.skillGap.map((skill) => (
                              <span
                                key={skill}
                                className="inline-block rounded-full bg-amber-500/10 px-2.5 py-0.5
                                           text-[11px] font-medium text-amber-400 border border-amber-500/20"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* CTA */}
                        <button
                          onClick={() => setSelectedPathway(pathway)}
                          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg
                                     py-2 text-xs font-semibold text-cyan-400 transition border border-cyan-500/20 bg-cyan-500/5
                                     hover:bg-cyan-500/10 hover:border-cyan-500/40 hover:-translate-y-0.5"
                        >
                          Take First Step
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </section>

              {/* ============================
                  ACTION TIMELINE
                  ============================ */}
              <motion.section
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Clock size={20} className="text-cyan-400" />
                  Suggested Action Timeline
                </h3>

                <div className="relative pl-8">
                  {/* Vertical connector line */}
                  <div
                    className="absolute left-[11px] top-2 bottom-2 w-px"
                    style={{
                      background:
                        'linear-gradient(to bottom, #00D4AA 0%, rgba(0,212,170,0.15) 100%)',
                    }}
                  />

                  <div className="space-y-5">
                    {junior.timeline.map((item, idx) => (
                      <motion.div
                        key={item.week}
                        className="relative flex items-start gap-4"
                        variants={fadeUp}
                        custom={idx}
                        transition={{ delay: 0.25 + idx * 0.1 }}
                      >
                        {/* Dot */}
                        <div
                          className="absolute -left-8 top-1 flex h-[22px] w-[22px] items-center justify-center
                                     rounded-full border-2 border-cyan-500/60 bg-[#0F0F1A]"
                        >
                          <div className="h-2 w-2 rounded-full bg-cyan-400" />
                        </div>

                        {/* Content */}
                        <div
                          className={`rounded-xl border border-white/[0.04] bg-white/[0.03] p-3.5 w-full
                                      ${idx % 2 === 1 ? 'sm:ml-4' : ''}`}
                        >
                          <p className="text-sm font-semibold text-cyan-400 mb-0.5">
                            {item.week}
                          </p>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {item.action}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.section>
            </div>

        {/* Pathway Details Modal (Renders on top if selected) */}
        <AnimatePresence>
          {selectedPathway && (
            <PathwayDetailsModal
              pathway={selectedPathway}
              junior={junior}
              onClose={() => setSelectedPathway(null)}
            />
          )}
        </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
