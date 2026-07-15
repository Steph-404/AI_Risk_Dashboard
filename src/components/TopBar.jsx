import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Bell, CheckCircle, AlertTriangle, Info, Check } from 'lucide-react';
import { notifications, juniors } from '../data/mockData';

const TopBar = ({ onMenuClick, onSelectJunior }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter juniors for search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return juniors.filter((junior) => 
      junior.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      junior.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectSearchResult = (junior) => {
    onSelectJunior(junior);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

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
        <div className="relative hidden md:block" ref={searchRef}>
          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus-within:border-cyan-500/50 transition-colors">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-44 lg:w-56"
            />
          </div>

          {/* Search Dropdown */}
          <AnimatePresence>
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 rounded-2xl solid-mask shadow-2xl overflow-hidden z-50"
              >
                {searchResults.length > 0 ? (
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {searchResults.map((junior) => (
                      <div
                        key={junior.id}
                        onClick={() => handleSelectSearchResult(junior)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 overflow-hidden ring-1 ring-white/10 group-hover:ring-[#00D4AA]/50 transition-colors">
                          <img 
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${junior.name}&backgroundColor=transparent`} 
                            alt={`${junior.name} mascot`}
                            className="h-full w-full object-cover scale-110"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm group-hover:text-[#00D4AA] transition-colors">{junior.name}</p>
                          <p className="text-xs text-slate-500">{junior.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-slate-400">
                    No team members found for "{searchQuery}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2.5 rounded-full backdrop-blur-sm border transition-colors ${
              isNotifOpen 
                ? 'bg-white/10 border-white/20 text-white' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0a0a1a]" />
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-80 sm:w-96 rounded-2xl solid-mask shadow-2xl overflow-hidden z-50 origin-top-right"
              >
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                  <h3 className="font-bold text-white text-sm">Notifications</h3>
                  <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1">
                    <Check size={14} /> Mark all as read
                  </button>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 group"
                    >
                      <div className="shrink-0 mt-0.5">
                        {notif.type === 'warning' && <AlertTriangle size={16} className="text-red-400" />}
                        {notif.type === 'success' && <CheckCircle size={16} className="text-emerald-400" />}
                        {notif.type === 'info' && <Info size={16} className="text-cyan-400" />}
                      </div>
                      <div>
                        <p className="text-sm text-slate-200 leading-snug group-hover:text-white transition-colors">{notif.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 bg-black/20 text-center">
                  <button className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 overflow-hidden ring-1 ring-white/10 cursor-pointer shadow-lg">
          <img 
            src="https://api.dicebear.com/7.x/bottts/svg?seed=SeniorMentor&backgroundColor=transparent" 
            alt="Senior Mentor Mascot"
            className="w-full h-full object-cover scale-110"
          />
        </div>
      </div>
    </motion.header>
  );
};

export default TopBar;
