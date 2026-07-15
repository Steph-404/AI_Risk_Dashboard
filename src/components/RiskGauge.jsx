import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const getScoreColor = (score) => {
  if (score <= 40) return '#00D4AA';
  if (score <= 65) return '#F59E0B';
  return '#EF4444';
};

const getGradientStops = (score) => {
  if (score <= 40) {
    return { start: '#00D4AA', end: '#00B894' };
  }
  if (score <= 65) {
    return { start: '#F59E0B', end: '#D97706' };
  }
  return { start: '#EF4444', end: '#DC2626' };
};

const RiskGauge = ({ score = 0, size = 160, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const clampedScore = Math.max(0, Math.min(100, score));

  const gradientId = useMemo(
    () => `gauge-gradient-${Math.random().toString(36).slice(2, 9)}`,
    []
  );

  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;
  const color = getScoreColor(clampedScore);
  const gradient = getGradientStops(clampedScore);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gradient.start} />
            <stop offset="100%" stopColor={gradient.end} />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl font-bold leading-none"
          style={{ color }}
        >
          {clampedScore}
        </span>
        <span className="text-xs text-gray-400 mt-1">Risk Score</span>
      </div>
    </div>
  );
};

export default RiskGauge;
