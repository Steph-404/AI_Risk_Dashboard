import { motion } from 'framer-motion';

const VARIANT_GRADIENTS = {
  cyan: 'conic-gradient(from 0deg, transparent 0%, transparent 60%, #00D4AA 75%, #7C3AED 90%, transparent 100%)',
  purple:
    'conic-gradient(from 0deg, transparent 0%, transparent 60%, #7C3AED 75%, #a855f7 90%, transparent 100%)',
  amber:
    'conic-gradient(from 0deg, transparent 0%, transparent 60%, #F59E0B 75%, #EF4444 90%, transparent 100%)',
};

export default function AnimatedCard({
  children,
  className = '',
  variant = 'cyan',
  delay = 0,
  hoverable = true,
}) {
  const gradient = VARIANT_GRADIENTS[variant] ?? VARIANT_GRADIENTS.cyan;

  return (
    <motion.div
      className={`relative rounded-2xl p-[1px] overflow-hidden ${className}`}
      style={{ transform: 'translateZ(0)', isolation: 'isolate' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={
        hoverable
          ? { scale: 1.015, y: -4, transition: { duration: 0.25, ease: 'easeOut' } }
          : undefined
      }
    >
      {/* Rotating gradient border */}
      <motion.div
        className="absolute inset-[-50%]"
        style={{ background: gradient }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Card content */}
      <div className="relative z-10 rounded-2xl bg-[#1A1A2E] p-5">
        {children}
      </div>
    </motion.div>
  );
}
