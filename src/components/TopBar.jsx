import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Search, Bell } from 'lucide-react';

const TopBar = ({ onMenuClick }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full h-16 flex items-center justify-between px-4 lg:px-6 border-b border-white/10"
    >
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>

        {/* Greeting */}
        <h2 className="text-sm sm:text-base text-white">
          Welcome back,{' '}
          <span
            className="font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
          >
            Senior Mentor
          </span>
        </h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus-within:border-cyan-500/50 transition-colors">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search team members..."
            className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-44 lg:w-56"
          />
        </div>

        {/* Notification bell */}
        <button
          className="relative p-2.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0a0a1a]" />
        </button>

        {/* User avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
          }}
        >
          SM
        </div>
      </div>
    </motion.header>
  );
};

export default TopBar;
