import React from 'react';

export const NvProgressBar = ({
  progress = 50,
  height = 8,
  color = "var(--accent-primary)",
  backgroundColor = "var(--bg-pill)",
  showPercent = false,
  className = "",
}) => {
  const percent = Math.min(100, Math.max(0, progress));

  return (
    <div style={{ width: '100%' }} className={className}>
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor,
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.4s ease-out',
          }}
        />
      </div>
      {showPercent && (
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '4px', display: 'block', textAlign: 'right' }}>
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
};
