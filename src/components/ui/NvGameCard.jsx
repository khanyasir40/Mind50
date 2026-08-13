import React from 'react';
import { Play, Star, Trophy, Zap } from 'lucide-react';
import { NvCard } from './NvCard';

export const NvGameCard = ({
  id,
  name,
  category = "Memory",
  description,
  difficulty = 1,
  bestScore = null,
  iconName = "Brain",
  color = "#6C4DFF",
  onPlay,
  onFavoriteToggle,
  isFavorite = false,
}) => {
  return (
    <NvCard
      hoverable
      padding="18px"
      onClick={() => onPlay(id)}
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minHeight: '190px' }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-pill)',
              color: color,
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {category}
          </span>
          {onFavoriteToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(id);
              }}
              style={{ padding: '4px', color: isFavorite ? '#F59E0B' : 'var(--text-tertiary)' }}
            >
              <Star size={18} fill={isFavorite ? '#F59E0B' : 'none'} />
            </button>
          )}
        </div>

        <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px', lineHeight: 1.3 }}>
          {name}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {description}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Zap size={13} color="var(--text-tertiary)" />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Lvl {difficulty}
          </span>
        </div>

        {bestScore !== null ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', color: 'var(--accent-primary)' }}>
            <Trophy size={13} />
            {bestScore} pts
          </div>
        ) : (
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Unplayed</span>
        )}
      </div>
    </NvCard>
  );
};
