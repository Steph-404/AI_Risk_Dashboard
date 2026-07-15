import React from 'react';
import { motion } from 'framer-motion';
import { X, Target, Briefcase, Map, ArrowRight, CheckCircle, Flame } from 'lucide-react';
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

export default function PathwayDetailsModal({ pathway, junior, onClose }) {
  if (!pathway) return null;

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute inset-0 z-50 flex flex-col bg-[#0F0F1A] rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="relative border-b border-white/10 bg-[#1A1A2E]/80 backdrop-blur-md px-6 py-5 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="text-cyan-400" size={24} />
            {pathway.title}
          </h2>
          <div className="flex gap-4 mt-2">
            <span className="text-sm font-medium text-emerald-400 flex items-center gap-1">
              <Flame size={16} /> Growth: {pathway.growth}
            </span>
            <span className="text-sm font-medium text-amber-400 flex items-center gap-1">
              <Briefcase size={16} /> Salary: {pathway.salary}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        
        {/* Skills Breakdown */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatedCard variant="cyan" delay={0.1}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-cyan-400" size={20} />
              <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase">Transferable Skills</h3>
            </div>
            <ul className="space-y-3">
              {pathway.transferableSkills.map((skill, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-slate-300 bg-cyan-500/5 px-3 py-2 rounded border border-cyan-500/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  {skill}
                </li>
              ))}
            </ul>
          </AnimatedCard>

          <AnimatedCard variant="amber" delay={0.2}>
            <div className="flex items-center gap-2 mb-4">
              <Map className="text-amber-400" size={20} />
              <h3 className="text-sm font-bold tracking-wider text-slate-300 uppercase">Skill Gap to Bridge</h3>
            </div>
            <ul className="space-y-3">
              {pathway.skillGap.map((skill, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-slate-300 bg-amber-500/5 px-3 py-2 rounded border border-amber-500/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {skill}
                </li>
              ))}
            </ul>
          </AnimatedCard>
        </section>

        {/* Action Timeline */}
        <section>
          <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-4 pl-2">
            Action Timeline for {junior.name}
          </h3>
          <div className="relative space-y-4 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:to-purple-500 before:opacity-30">
            {junior.timeline.map((step, idx) => (
              <motion.div
                key={idx}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#0F0F1A] bg-cyan-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className="text-xs font-bold">{idx + 1}</span>
                </div>

                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm shadow-xl transition-all hover:bg-white/10 hover:border-cyan-500/30">
                  <span className="text-xs font-bold text-cyan-400 block mb-1 uppercase tracking-wider">
                    {step.week}
                  </span>
                  <p className="text-sm text-slate-200">{step.action}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
      
      {/* Footer CTA */}
      <div className="p-4 border-t border-white/10 bg-[#1A1A2E]/80 backdrop-blur-md shrink-0 flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold text-sm hover:opacity-90 transition hover:shadow-lg hover:shadow-cyan-500/25">
          Enroll Mentee in Pathway <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}
