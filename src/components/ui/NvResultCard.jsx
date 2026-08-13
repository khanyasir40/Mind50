import React, { useEffect } from 'react';
import { Trophy, Zap, Clock, Target, ArrowRight, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NvCard } from './NvCard';
import { NvButton } from './NvButton';

export const NvResultCard = ({
  gameName = "Digit Span Forward",
  score = 850,
  accuracy = 95,
  reactionMs = 320,
  isPersonalBest = true,
  xpGained = 80,
  onPlayAgain,
  onNext,
  onBackToHome,
}) => {
  useEffect(() => {
    if (isPersonalBest) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6C4DFF', '#A855F7', '#10B981', '#F59E0B'],
      });
    }
  }, [isPersonalBest]);

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', width: '100%' }} className="animate-fade-in">
      <NvCard padding="28px" variant="hero" style={{ textAlign: 'center' }}>
        {isPersonalBest && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-warning-bg)',
              color: 'var(--color-warning)',
              fontSize: '12px',
              fontWeight: '700',
              marginBottom: '16px',
            }}
          >
            <Trophy size={14} />
            NEW PERSONAL BEST!
          </div>
        )}

        <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {gameName}
        </h2>

        <div style={{ margin: '16px 0 24px' }}>
          <span style={{ fontSize: '56px', fontWeight: '800', color: 'var(--accent-primary)', lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-tertiary)', display: 'block', marginTop: '4px' }}>
            TOTAL SCORE
          </span>
        </div>

        {/* Key Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
          <div style={{ padding: '12px', background: 'var(--bg-pill)', borderRadius: 'var(--radius-md)' }}>
            <Target size={18} color="var(--accent-primary)" style={{ marginBottom: '4px' }} />
            <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', display: 'block' }}>
              {accuracy}%
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Accuracy</span>
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-pill)', borderRadius: 'var(--radius-md)' }}>
            <Clock size={18} color="var(--accent-secondary)" style={{ marginBottom: '4px' }} />
            <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', display: 'block' }}>
              {reactionMs}ms
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Avg Speed</span>
          </div>

          <div style={{ padding: '12px', background: 'var(--bg-pill)', borderRadius: 'var(--radius-md)' }}>
            <Award size={18} color="var(--color-warning)" style={{ marginBottom: '4px' }} />
            <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', display: 'block' }}>
              +{xpGained} XP
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Earned</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <NvButton variant="primary" size="lg" fullWidth icon={ArrowRight} iconPosition="right" onClick={onNext}>
            Next Challenge
          </NvButton>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <NvButton variant="secondary" size="md" icon={RotateCcw} onClick={onPlayAgain}>
              Replay
            </NvButton>
            <NvButton variant="pill" size="md" onClick={onBackToHome}>
              Dashboard
            </NvButton>
          </div>
        </div>
      </NvCard>
    </div>
  );
};
