import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Waypoints,
  LayoutDashboard,
  Users,
  Compass,
  Settings,
  HelpCircle,
  X,
} from 'lucide-react';

const navSections = [
  {
    label: 'MAIN',
    items: [
      { name: 'Dashboard', to: '/', icon: LayoutDashboard },
      { name: 'Team', to: '/team', icon: Users, badge: 3 },
      { name: 'Opportunities', to: '/opportunities', icon: Compass },
    ],
  },
  {
    label: 'SETTINGS',
    items: [
      { name: 'Settings', to: '/settings', icon: Settings },
      { name: 'Support', to: '/support', icon: HelpCircle },
    ],
  },
];

function SidebarContent() {
  return (
    <div className="flex h-full w-full flex-col bg-[#0c0c18] border-r border-white/5">
      {/* Brand / Logo */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 ring-1 ring-cyan-400/20">
            <Waypoints className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1
              className="text-[15px] font-bold tracking-wide text-white"
              style={{ textShadow: '0 0 20px rgba(0,212,170,0.35)' }}
            >
              THE BRIDGE
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              AI Risk Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-3 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {section.label}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      [
                        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'border-l-2 border-cyan-400 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 text-cyan-400'
                          : 'border-l-2 border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white',
                      ].join(' ')
                    }
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" />
                    <span>{item.name}</span>

                    {item.badge != null && (
                      <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-amber-500 px-1.5 text-[10px] font-bold text-white shadow-lg shadow-red-500/25">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3 rounded-xl p-2 transition-colors duration-200 hover:bg-white/[0.04]">
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 text-sm font-bold text-white shadow-lg shadow-cyan-500/20">
              SM
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0c0c18] bg-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              Senior Mentor
            </p>
            <p className="truncate text-xs text-slate-500">Team Lead</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen = false, onClose }) {
  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar — slide-in drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="sidebar-backdrop"
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.aside
              key="sidebar-drawer"
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>

              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
