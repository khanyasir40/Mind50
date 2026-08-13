import React from 'react';
import { NvCard } from './NvCard';

export const NvSkillCard = ({
  name = "Memory",
  score = 750,
  maxScore = 1000,
  color = "#6C4DFF",
  icon: Icon = null,
  trend = "+12%",
}) => {
  const percent = Math.min(100, Math.max(0, (score / maxScore) * 100));

  return (
    <NvCard padding="16px" style={{ minWidth: '150px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {Icon && (
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                background: `${color}15`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={18} />
            </div>
          )}
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {name}
          </span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-success)' }}>
          {trend}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
        <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>/ {maxScore}</span>
      </div>

      <div style={{ height: '6px', background: 'var(--bg-pill)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: color,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </NvCard>
  );
};
