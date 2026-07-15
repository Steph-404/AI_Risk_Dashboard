import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, TrendingUp, DollarSign, Briefcase, 
  Target, Share2, BookmarkPlus 
} from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  },
  exit: { opacity: 0, scale: 0.95, y: 20 }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const categoryColors = {
  'AI & Machine Learning': { bg: 'rgba(0, 212, 170, 0.12)', text: '#00D4AA', border: 'rgba(0, 212, 170, 0.25)' },
  'Data Engineering': { bg: 'rgba(124, 58, 237, 0.12)', text: '#7C3AED', border: 'rgba(124, 58, 237, 0.25)' },
  'Product Management': { bg: 'rgba(245, 158, 11, 0.12)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.25)' },
  'Strategy & Consulting': { bg: 'rgba(59, 130, 246, 0.12)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.25)' },
  'AI Ethics & Governance': { bg: 'rgba(236, 72, 153, 0.12)', text: '#EC4899', border: 'rgba(236, 72, 153, 0.25)' },
};

const fallbackColor = { bg: 'rgba(255,255,255,0.06)', text: '#94A3B8', border: 'rgba(255,255,255,0.1)' };

export default function OpportunityDetailsModal({ opportunity, onClose }) {
  if (!opportunity) return null;

  const color = categoryColors[opportunity.category] || fallbackColor;

  return (
    <AnimatePresence>
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
        onClick={onClose}
      >
        <motion.div
          className="glass-strong relative w-full max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col rounded-2xl bg-[#0F0F1A] shadow-2xl ring-1 ring-white/10"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative border-b border-white/10 bg-[#1A1A2E]/80 backdrop-blur-md px-6 py-6 shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full
                         bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            
            <div className="pr-12">
              <span
                className="inline-block text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full mb-3"
                style={{
                  background: color.bg,
                  color: color.text,
                  border: `1px solid ${color.border}`,
                }}
              >
                {opportunity.category}
              </span>
              <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                {opportunity.title}
              </h2>
              <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                {opportunity.description}
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AnimatedCard variant="cyan" delay={0.1} hoverable={false} className="!p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-cyan-400 mb-1">
                    <Target size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Match Score</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{opportunity.matchScore}%</span>
                </div>
              </AnimatedCard>

              <AnimatedCard variant="amber" delay={0.2} hoverable={false} className="!p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-amber-400 mb-1">
                    <TrendingUp size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Growth</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{opportunity.growthTrend}</span>
                </div>
              </AnimatedCard>

              <AnimatedCard variant="purple" delay={0.3} hoverable={false} className="!p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-purple-400 mb-1">
                    <DollarSign size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Salary</span>
                  </div>
                  <span className="text-sm font-bold text-white break-words">{opportunity.salary}</span>
                </div>
              </AnimatedCard>

              <AnimatedCard variant="cyan" delay={0.4} hoverable={false} className="!p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-blue-400 mb-1">
                    <MapPin size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Location</span>
                  </div>
                  <span className="text-sm font-bold text-white">{opportunity.location}</span>
                </div>
              </AnimatedCard>
            </div>

            {/* Required Skills */}
            <section>
              <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase mb-4 flex items-center gap-2">
                <Briefcase size={18} className="text-slate-400" />
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.requiredSkills.map((skill, idx) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-200
                               border border-white/[0.08]"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </section>
            
            {/* Deep Dive Description Block */}
            <section className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
              <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase mb-3">
                Why this role matters
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                As a {opportunity.title}, you will be at the forefront of the AI transition. 
                This role involves leveraging {opportunity.requiredSkills[0]} and {opportunity.requiredSkills[1] || 'advanced tools'} to drive significant value. 
                With a {opportunity.growthTrend} market growth trend and a competitive salary of {opportunity.salary}, 
                this presents an exceptional pathway for mentees showing a high match score.
              </p>
            </section>

          </div>
          
          {/* Footer CTA */}
          <div className="p-5 border-t border-white/10 bg-[#1A1A2E]/80 backdrop-blur-md shrink-0 flex items-center justify-between">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition text-sm font-medium">
              <Share2 size={16} /> Share Opportunity
            </button>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 text-white font-semibold text-sm hover:bg-white/5 transition">
                <BookmarkPlus size={16} /> Save
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-sm hover:opacity-90 transition hover:shadow-lg hover:shadow-cyan-500/25">
                Suggest to Mentees
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
