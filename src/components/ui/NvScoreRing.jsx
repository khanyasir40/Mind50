import React from 'react';

export const NvScoreRing = ({
  score = 820,
  maxScore = 1000,
  size = 140,
  strokeWidth = 10,
  label = "BRAIN SCORE",
  color = "var(--accent-primary)",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--bg-pill)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <span style={{ fontSize: `${size * 0.24}px`, fontWeight: '800', color: 'var(--text-primary)', display: 'block', lineHeight: 1 }}>
          {score}
        </span>
        {label && (
          <span style={{ fontSize: `${size * 0.08}px`, fontWeight: '700', color: 'var(--text-tertiary)', letterSpacing: '0.5px', marginTop: '4px', display: 'block' }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
