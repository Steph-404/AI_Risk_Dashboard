import React, { useCallback } from 'react';
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
              <section className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  {/* Left – Avatar + Info */}
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full
                                 text-xl font-bold text-white"
                      style={{
                        background: 'linear-gradient(135deg, #00D4AA, #7C3AED)',
                      }}
                    >
                      {junior.avatar}
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-white leading-tight">
                        {junior.name}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {junior.role}
                        <span className="mx-2 text-gray-600">•</span>
                        {junior.tenure}
                      </p>
                      <p className="text-sm italic text-gray-500">{junior.feeling}</p>
                    </div>
                  </div>

                  {/* Right – Risk Gauge */}
                  <div className="flex-shrink-0 self-center sm:self-start">
                    <RiskGauge score={junior.riskScore} size={130} />
                  </div>
                </div>

                {/* Sentiment Quote */}
                <div className="border-l-2 border-cyan-500/40 pl-4 py-1">
                  <p className="text-sm italic text-gray-400 leading-relaxed">
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
                        className="rounded-xl bg-white/[0.03] p-4 border border-white/[0.04]"
                        variants={fadeUp}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">
                            {task.name}
                          </span>
                          <span className={`text-sm font-bold ${color.text}`}>
                            {task.automationRisk}%
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: color.bar }}
                            initial={{ width: 0 }}
                            animate={{ width: `${task.automationRisk}%` }}
                            transition={{
                              duration: 0.9,
                              delay: 0.2 + idx * 0.1,
                              ease: 'easeOut',
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
                          className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg
                                     py-2 text-xs font-semibold text-white transition
                                     hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5"
                          style={{
                            background: 'linear-gradient(135deg, #00D4AA, #7C3AED)',
                          }}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
