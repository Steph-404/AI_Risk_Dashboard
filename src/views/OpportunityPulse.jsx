import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  TrendingUp,
  DollarSign,
  Briefcase,
  Sparkles,
  ChevronDown,
  ArrowRight,
  X,
  SearchX,
} from 'lucide-react';
import { opportunities } from '../data/mockData';
import AnimatedCard from '../components/AnimatedCard';

/* =============================================
   Category colour mapping
   ============================================= */
const categoryColors = {
  'AI & Machine Learning': {
    bg: 'rgba(0, 212, 170, 0.12)',
    text: '#00D4AA',
    border: 'rgba(0, 212, 170, 0.25)',
  },
  'Data Engineering': {
    bg: 'rgba(124, 58, 237, 0.12)',
    text: '#7C3AED',
    border: 'rgba(124, 58, 237, 0.25)',
  },
  'Product Management': {
    bg: 'rgba(245, 158, 11, 0.12)',
    text: '#F59E0B',
    border: 'rgba(245, 158, 11, 0.25)',
  },
  'Strategy & Consulting': {
    bg: 'rgba(59, 130, 246, 0.12)',
    text: '#3B82F6',
    border: 'rgba(59, 130, 246, 0.25)',
  },
  'AI Ethics & Governance': {
    bg: 'rgba(236, 72, 153, 0.12)',
    text: '#EC4899',
    border: 'rgba(236, 72, 153, 0.25)',
  },
};

const fallbackColor = {
  bg: 'rgba(255,255,255,0.06)',
  text: '#94A3B8',
  border: 'rgba(255,255,255,0.1)',
};

/* =============================================
   Card variant cycling helper
   ============================================= */
const cardVariants = ['cyan', 'purple', 'amber'];

/* =============================================
   Custom Dropdown component
   ============================================= */
function Dropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLabel = options.find((o) => o.value === value)?.label ?? label;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                   transition-all duration-200 cursor-pointer select-none
                   border border-white/[0.08] hover:border-white/[0.15]"
        style={{ background: 'rgba(26, 26, 46, 0.6)', backdropFilter: 'blur(20px)' }}
      >
        <Filter size={14} className="text-slate-400" />
        <span className="text-slate-300">{activeLabel}</span>
        <ChevronDown
          size={14}
          className={`text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-2 min-w-[180px] rounded-xl py-1.5 border border-white/[0.08] shadow-2xl"
            style={{ background: 'rgba(26, 26, 46, 0.95)', backdropFilter: 'blur(30px)' }}
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer
                    ${
                      value === opt.value
                        ? 'text-[#00D4AA] bg-[rgba(0,212,170,0.08)]'
                        : 'text-slate-300 hover:bg-white/[0.04] hover:text-slate-100'
                    }`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =============================================
   Filter option definitions
   ============================================= */
const locationOptions = [
  { value: 'All', label: 'All Locations' },
  { value: 'Remote', label: 'Remote' },
  { value: 'Nairobi', label: 'Nairobi' },
  { value: 'Hybrid', label: 'Hybrid' },
];

const skillMatchOptions = [
  { value: 'All', label: 'All Matches' },
  { value: '70', label: '70%+' },
  { value: '60', label: '60%+' },
  { value: '50', label: '50%+' },
];

const salaryOptions = [
  { value: 'All', label: 'All Salaries' },
  { value: '50', label: '$50K+' },
  { value: '70', label: '$70K+' },
  { value: '90', label: '$90K+' },
];

const categoryOptions = [
  { value: 'All', label: 'All Categories' },
  { value: 'AI & Machine Learning', label: 'AI & Machine Learning' },
  { value: 'Data Engineering', label: 'Data Engineering' },
  { value: 'Product Management', label: 'Product Management' },
  { value: 'Strategy & Consulting', label: 'Strategy & Consulting' },
  { value: 'AI Ethics & Governance', label: 'AI Ethics & Governance' },
];

/* =============================================
   Salary parser — extracts lower bound number
   from strings like "$50K - $80K"
   ============================================= */
function parseSalaryLower(salaryStr) {
  const match = salaryStr.match(/\$(\d+)K/);
  return match ? parseInt(match[1], 10) : 0;
}

/* =============================================
   Main View Component
   ============================================= */
export default function OpportunityPulse() {
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [skillMatchFilter, setSkillMatchFilter] = useState('All');
  const [salaryFilter, setSalaryFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Derive filtered opportunities
  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      // Search — match title, description, or skills
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = opp.title.toLowerCase().includes(q);
        const inDesc = opp.description.toLowerCase().includes(q);
        const inSkills = opp.requiredSkills.some((s) => s.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inSkills) return false;
      }

      // Location
      if (locationFilter !== 'All') {
        if (!opp.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      }

      // Skill match
      if (skillMatchFilter !== 'All') {
        if (opp.matchScore < parseInt(skillMatchFilter, 10)) return false;
      }

      // Salary lower bound
      if (salaryFilter !== 'All') {
        if (parseSalaryLower(opp.salary) < parseInt(salaryFilter, 10)) return false;
      }

      // Category
      if (categoryFilter !== 'All') {
        if (opp.category !== categoryFilter) return false;
      }

      return true;
    });
  }, [searchQuery, locationFilter, skillMatchFilter, salaryFilter, categoryFilter]);

  // Active filter pills for summary
  const activeFilters = useMemo(() => {
    const pills = [];
    if (locationFilter !== 'All')
      pills.push({ key: 'location', label: locationFilter, clear: () => setLocationFilter('All') });
    if (skillMatchFilter !== 'All')
      pills.push({ key: 'match', label: `${skillMatchFilter}%+ match`, clear: () => setSkillMatchFilter('All') });
    if (salaryFilter !== 'All')
      pills.push({ key: 'salary', label: `$${salaryFilter}K+`, clear: () => setSalaryFilter('All') });
    if (categoryFilter !== 'All')
      pills.push({ key: 'category', label: categoryFilter, clear: () => setCategoryFilter('All') });
    if (searchQuery.trim())
      pills.push({ key: 'search', label: `"${searchQuery}"`, clear: () => setSearchQuery('') });
    return pills;
  }, [locationFilter, skillMatchFilter, salaryFilter, categoryFilter, searchQuery]);

  return (
    <div className="space-y-8">
      {/* ─── Header ─── */}
      <div>
        <motion.div
          className="flex items-center gap-3 mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="p-2.5 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(124,58,237,0.15))',
              border: '1px solid rgba(0,212,170,0.2)',
            }}
          >
            <Sparkles size={22} className="text-[#00D4AA]" />
          </div>
          <h1
            className="text-3xl font-extrabold bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #00D4AA, #7C3AED)',
            }}
          >
            Opportunity Pulse
          </h1>
        </motion.div>
        <motion.p
          className="text-slate-400 text-sm ml-[52px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          Discover emerging AI-augmented roles matched to your team&apos;s skills
        </motion.p>
      </div>

      {/* ─── Filters Row ─── */}
      <motion.div
        className="flex flex-wrap items-center gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Search input */}
        <div
          className="relative flex items-center rounded-xl border border-white/[0.08] overflow-hidden flex-1 min-w-[220px] max-w-md"
          style={{ background: 'rgba(26, 26, 46, 0.6)', backdropFilter: 'blur(20px)' }}
        >
          <Search size={16} className="absolute left-3 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles..."
            className="w-full bg-transparent py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500
                       focus:outline-none focus:ring-1 focus:ring-[#00D4AA]/40 rounded-xl"
          />
        </div>

        {/* Filter dropdowns */}
        <Dropdown
          label="Location"
          value={locationFilter}
          options={locationOptions}
          onChange={setLocationFilter}
        />
        <Dropdown
          label="Skill Match"
          value={skillMatchFilter}
          options={skillMatchOptions}
          onChange={setSkillMatchFilter}
        />
        <Dropdown
          label="Salary Range"
          value={salaryFilter}
          options={salaryOptions}
          onChange={setSalaryFilter}
        />
        <Dropdown
          label="Category"
          value={categoryFilter}
          options={categoryOptions}
          onChange={setCategoryFilter}
        />
      </motion.div>

      {/* ─── Results Summary ─── */}
      <motion.div
        className="flex flex-wrap items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-slate-400">
          Showing{' '}
          <span className="text-slate-200 font-semibold">{filtered.length}</span> of{' '}
          <span className="text-slate-200 font-semibold">{opportunities.length}</span>{' '}
          opportunities
        </p>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.map((pill) => (
              <span
                key={pill.key}
                className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-medium
                           border border-white/[0.08] text-slate-300"
                style={{ background: 'rgba(26,26,46,0.6)' }}
              >
                {pill.label}
                <button
                  type="button"
                  onClick={pill.clear}
                  className="p-0.5 rounded-full hover:bg-white/[0.08] transition-colors cursor-pointer"
                  aria-label={`Remove ${pill.label} filter`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* ─── Opportunities Grid ─── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((opp, idx) => {
            const color = categoryColors[opp.category] || fallbackColor;
            const variant = cardVariants[idx % cardVariants.length];

            return (
              <AnimatedCard key={opp.id} variant={variant} delay={0.08 * idx}>
                {/* Category pill */}
                <span
                  className="inline-block text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full mb-3"
                  style={{
                    background: color.bg,
                    color: color.text,
                    border: `1px solid ${color.border}`,
                  }}
                >
                  {opp.category}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-1.5 leading-snug">{opp.title}</h3>

                {/* Description — 2 line clamp */}
                <p className="text-sm text-slate-400 line-clamp-2 mb-4">{opp.description}</p>

                {/* Meta details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <MapPin size={14} className="shrink-0 text-slate-500" />
                    <span>{opp.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <TrendingUp size={14} className="shrink-0" />
                    <span>Growth {opp.growthTrend}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <DollarSign size={14} className="shrink-0 text-slate-500" />
                    <span>{opp.salary}</span>
                  </div>
                </div>

                {/* Required skills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {opp.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium text-slate-300
                                 border border-white/[0.06]"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Match score bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-400">Match</span>
                    <span className="text-xs font-semibold text-slate-200">{opp.matchScore}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #00D4AA, #7C3AED)',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${opp.matchScore}%` }}
                      transition={{ duration: 0.8, delay: 0.08 * idx + 0.3, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* CTA */}
                <button type="button" className="btn-secondary w-full justify-center group">
                  <Briefcase size={14} />
                  Learn More
                  <ArrowRight
                    size={14}
                    className="ml-auto transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>
              </AnimatedCard>
            );
          })}
        </div>
      ) : (
        /* ─── Empty State ─── */
        <motion.div
          className="flex flex-col items-center justify-center py-24 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="p-5 rounded-2xl mb-5"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <SearchX size={40} className="text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">
            No matching opportunities found
          </h3>
          <p className="text-sm text-slate-500 max-w-sm">
            Try adjusting your filters or broadening your search to discover more roles.
          </p>
        </motion.div>
      )}
    </div>
  );
}
