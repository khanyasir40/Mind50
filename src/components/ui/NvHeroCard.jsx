import React from 'react';
import { Play, Sparkles, Clock, Award } from 'lucide-react';
import { NvButton } from './NvButton';

export const NvHeroCard = ({
  badge = "DAILY CHALLENGE",
  title = "Visual Focus & Memory Matrix",
  subtitle = "Complete today's 4-game cognitive workout to extend your streak.",
  duration = "4 mins",
  xpReward = "+150 XP",
  onStart,
  accentColor = "var(--accent-gradient)",
}) => {
  return (
    <div
      style={{
        background: 'var(--hero-gradient)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 24px',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-elevated)',
      }}
      className="nv-hero-card animate-fade-in"
    >
      {/* Decorative backdrop shapes */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.12)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
            }}
          >
            <Sparkles size={14} />
            {badge}
          </span>

          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', opacity: 0.9 }}>
              <Clock size={14} />
              {duration}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '700', color: '#FDE047' }}>
              <Award size={14} />
              {xpReward}
            </span>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '800', lineHeight: 1.25, marginBottom: '8px' }}>
          {title}
        </h2>
        <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: 1.5, marginBottom: '20px', maxWidth: '90%' }}>
          {subtitle}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <NvButton
            variant="pill"
            size="md"
            icon={Play}
            onClick={onStart}
            style={{
              background: '#FFFFFF',
              color: 'var(--accent-primary)',
              fontWeight: '700',
              padding: '12px 24px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            }}
          >
            Start Session
          </NvButton>
        </div>
      </div>
    </div>
  );
};
