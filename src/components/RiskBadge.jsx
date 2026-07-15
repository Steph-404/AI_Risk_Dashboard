import React from 'react';

const levelConfig = {
  LOW: {
    className: 'badge badge-low',
    dotColor: '#00D4AA',
  },
  MEDIUM: {
    className: 'badge badge-medium',
    dotColor: '#F59E0B',
  },
  HIGH: {
    className: 'badge badge-high',
    dotColor: '#EF4444',
  },
};

const RiskBadge = ({ level = 'LOW' }) => {
  const normalizedLevel = level.toUpperCase();
  const config = levelConfig[normalizedLevel] || levelConfig.LOW;

  return (
    <span className={config.className}>
      <span
        className="inline-block w-2 h-2 rounded-full animate-pulse mr-1.5"
        style={{ backgroundColor: config.dotColor }}
      />
      {normalizedLevel}
    </span>
  );
};

export default RiskBadge;
