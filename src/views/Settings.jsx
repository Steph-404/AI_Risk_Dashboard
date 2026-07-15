import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, MapPin, Briefcase, Bell, Shield, 
  Clock, Users, Trash2, Camera, ShieldCheck, 
  Smartphone, Save, CheckCircle2
} from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';

/* =============================================
   Toggle Component
   ============================================= */
function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? 'bg-[#00D4AA]' : 'bg-slate-700'
      }`}
    >
      <span className="sr-only">Toggle setting</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

/* =============================================
   Settings Component
   ============================================= */
export default function Settings() {
  // Mock State for toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  
  // Show save success banner
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            Settings & Preferences
          </motion.h1>
          <motion.p
            className="text-slate-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            Manage your mentor profile, availability, and security settings.
          </motion.p>
        </div>

        {/* Save Button */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        >
          {saved && (
            <span className="flex items-center gap-2 text-[#00D4AA] text-sm font-medium">
              <CheckCircle2 size={16} /> Saved successfully
            </span>
          )}
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all border border-white/5 shadow-lg"
          >
            <Save size={18} />
            Save Changes
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ─── Left Column (Profile & Availability) ─── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Settings */}
          <AnimatedCard variant="cyan" delay={0.1} hoverable={false}>
            <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Profile Information</h2>
                <p className="text-sm text-slate-400">Update your public mentor details.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <User size={20} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              {/* Avatar Upload */}
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div className="relative h-24 w-24 rounded-full bg-[#0c0c18] border-2 border-white/10 overflow-hidden group">
                  <img 
                    src="https://api.dicebear.com/7.x/bottts/svg?seed=SeniorMentor&backgroundColor=transparent" 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
                <button className="text-xs font-medium text-slate-400 hover:text-white transition">
                  Change Avatar
                </button>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="text" defaultValue="Senior Mentor" className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</label>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="text" defaultValue="Team Lead & AI Specialist" className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="email" defaultValue="mentor@thebridge.org" className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50" readOnly />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="text" defaultValue="Nairobi HQ (Hybrid)" className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Mentorship Preferences */}
          <AnimatedCard variant="purple" delay={0.2} hoverable={false}>
            <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Mentorship Preferences</h2>
                <p className="text-sm text-slate-400">Manage your capacity and availability.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                <Users size={20} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Max Mentees</label>
                <div className="flex items-center gap-3">
                  <input type="range" min="5" max="50" defaultValue="24" className="w-full accent-purple-500" />
                  <span className="text-sm font-bold text-white w-8 text-right">24</span>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Working Hours</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <select className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-purple-500/50 appearance-none">
                    <option>09:00 AM - 05:00 PM (EAT)</option>
                    <option>10:00 AM - 06:00 PM (EAT)</option>
                    <option>Flexible / Asynchronous</option>
                  </select>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* ─── Right Column (Notifications & Security) ─── */}
        <div className="space-y-6">
          
          {/* Notifications */}
          <AnimatedCard variant="amber" delay={0.3} hoverable={false}>
            <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Notifications</h2>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Bell size={18} />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Email Alerts</p>
                  <p className="text-xs text-slate-400">Mentee risk level changes.</p>
                </div>
                <Toggle enabled={emailNotifs} onChange={setEmailNotifs} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">In-App Notifications</p>
                  <p className="text-xs text-slate-400">Pathway completions & messages.</p>
                </div>
                <Toggle enabled={inAppNotifs} onChange={setInAppNotifs} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Weekly Digest</p>
                  <p className="text-xs text-slate-400">Summary of team performance.</p>
                </div>
                <Toggle enabled={weeklyDigest} onChange={setWeeklyDigest} />
              </div>
            </div>
          </AnimatedCard>

          {/* Security */}
          <AnimatedCard variant="cyan" delay={0.4} hoverable={false}>
            <div className="mb-5 flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Security</h2>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Shield size={18} />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black/20 rounded-lg border border-white/5"><Smartphone size={16} className="text-slate-300" /></div>
                  <div>
                    <p className="text-sm font-medium text-white">Two-Factor Auth</p>
                    <p className="text-xs text-slate-400">Secured via Authenticator App</p>
                  </div>
                </div>
                <Toggle enabled={twoFactor} onChange={setTwoFactor} />
              </div>

              <div className="pt-2">
                <button className="w-full py-2 rounded-lg bg-white/5 text-sm font-medium text-white hover:bg-white/10 transition border border-white/5">
                  Change Password
                </button>
              </div>
              
              <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck size={14} className="text-emerald-400" />
                Last login: Today at 08:42 AM from Nairobi
              </div>
            </div>
          </AnimatedCard>

          {/* Danger Zone */}
          <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5 relative overflow-hidden group mt-6">
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-red-400">
                <Trash2 size={18} />
                <h3 className="font-bold">Danger Zone</h3>
              </div>
              <p className="text-xs text-slate-400">
                Permanently delete your mentor account and remove access to all mentee data. This action cannot be undone.
              </p>
              <button className="self-start mt-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors shadow-lg shadow-red-500/10">
                Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
