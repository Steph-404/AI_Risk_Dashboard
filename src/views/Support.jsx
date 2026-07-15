import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, MessageSquare, BookOpen, Send, 
  ChevronDown, ArrowRight, ExternalLink, Mail,
  CheckCircle2
} from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';

/* =============================================
   FAQ Data
   ============================================= */
const faqs = [
  {
    question: "How is the Automation Risk Score calculated?",
    answer: "The risk score aggregates data from the mentee's current daily tasks, comparing them against industry automation trends (e.g., LLM capabilities). Tasks highly susceptible to AI automation increase the overall risk score."
  },
  {
    question: "How do I enroll a mentee in a new pathway?",
    answer: "Navigate to the mentee's profile from the Dashboard, select a recommended pathway under 'Growth Pathways', and click 'Enroll Mentee in Pathway' in the details modal. This will notify the mentee and update their action timeline."
  },
  {
    question: "Can I customize the recommended pathways?",
    answer: "Currently, pathways are automatically generated based on the mentee's transferable skills and skill gaps. However, you can use the 'Suggest Alternative' button in the pathway details to request a custom track from the admin team."
  },
  {
    question: "What does the 'Sentiment' metric indicate?",
    answer: "Sentiment is gathered through weekly check-in pulse surveys. It helps you gauge the mentee's morale and engagement level, allowing you to intervene early if they feel overwhelmed or disconnected."
  }
];

/* =============================================
   Support Component
   ============================================= */
export default function Support() {
  const [openFaq, setOpenFaq] = useState(0);
  const [ticketSent, setTicketSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTicketSent(true);
    setTimeout(() => setTicketSent(false), 3000);
    e.target.reset();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1
            className="text-3xl font-extrabold text-white mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Help & Support
          </motion.h1>
          <motion.p
            className="text-slate-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            Find answers, read documentation, or contact the platform admin team.
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ─── Left Column (FAQ & Resources) ─── */}
        <div className="space-y-6">
          
          {/* FAQ Section */}
          <AnimatedCard variant="cyan" delay={0.1} hoverable={false}>
            <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
              </div>
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <HelpCircle size={18} />
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className={`border rounded-xl transition-colors duration-200 overflow-hidden ${
                    openFaq === idx ? 'border-cyan-500/30 bg-white/[0.03]' : 'border-white/5 bg-black/20 hover:border-white/10'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <span className="text-sm font-semibold text-white pr-4">{faq.question}</span>
                    <ChevronDown 
                      size={16} 
                      className={`text-slate-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-4 pb-4 pt-1 text-sm text-slate-400 leading-relaxed border-t border-white/5 mt-2">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </AnimatedCard>

          {/* Resources */}
          <div className="grid grid-cols-2 gap-4">
            <a href="#" className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-black/20 hover:bg-white/5 hover:border-purple-500/30 transition-all text-center">
              <div className="h-12 w-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="font-semibold text-white text-sm">Documentation</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 group-hover:text-purple-400 transition-colors">
                Read guides <ArrowRight size={12} />
              </p>
            </a>

            <a href="#" className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-black/20 hover:bg-white/5 hover:border-amber-500/30 transition-all text-center">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ExternalLink size={24} />
              </div>
              <h3 className="font-semibold text-white text-sm">Community Forum</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 group-hover:text-amber-400 transition-colors">
                Join discussion <ArrowRight size={12} />
              </p>
            </a>
          </div>
        </div>

        {/* ─── Right Column (Contact Form) ─── */}
        <div>
          <AnimatedCard variant="purple" delay={0.2} hoverable={false} className="h-full">
            <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Contact Admin Support</h2>
                <p className="text-sm text-slate-400">Need help? Send us a ticket directly.</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <MessageSquare size={18} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-[calc(100%-80px)]">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g., Issue with Mentee Pathway" 
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                <select className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-purple-500/50 appearance-none">
                  <option>Technical Issue</option>
                  <option>Mentorship Guidance</option>
                  <option>Platform Feedback</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-1.5 flex-1 flex flex-col">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Message</label>
                <textarea 
                  required
                  placeholder="Describe your issue in detail..." 
                  className="w-full flex-1 bg-black/20 border border-white/10 rounded-lg py-3 px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 resize-none min-h-[120px]" 
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={ticketSent}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    ticketSent 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90 hover:shadow-purple-500/25'
                  }`}
                >
                  {ticketSent ? (
                    <><CheckCircle2 size={18} /> Ticket Submitted successfully!</>
                  ) : (
                    <><Send size={18} /> Submit Support Ticket</>
                  )}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
                  <Mail size={12} /> Prefer email? <a href="mailto:support@thebridge.org" className="text-cyan-400 hover:underline">support@thebridge.org</a>
                </p>
              </div>
            </form>
          </AnimatedCard>
        </div>

      </div>
    </div>
  );
}
