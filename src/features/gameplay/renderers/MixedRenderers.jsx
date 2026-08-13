import React, { useState } from 'react';
import { NvButton } from '../../../components/ui/NvButton';
import { Check, AlertCircle } from 'lucide-react';
import { StroopRenderer } from './AttentionRenderers';
import { SimpleReactionRenderer, ChoiceReactionRenderer, NumberReactionRenderer } from './SpeedRenderers';
import { RavenMatrixRenderer } from './ReasoningRenderers';

// GAME 49: HIDDEN OBJECT SEARCH (Rich Interactive Vector Clutter Scene)
export const HiddenObjectRenderer = ({ challenge, onRespond }) => {
  const [foundIds, setFoundIds] = useState(new Set());
  const [wrongFeedback, setWrongFeedback] = useState(false);

  const sceneItems = challenge.payload.sceneItems || [
    { id: 'key', name: 'Brass Key', icon: '🔑', x: 20, y: 30 },
    { id: 'book', name: 'Ancient Book', icon: '📖', x: 75, y: 25 },
    { id: 'star', name: 'Gold Star', icon: '⭐', x: 45, y: 65 },
    { id: 'cup', name: 'Coffee Cup', icon: '☕', x: 82, y: 78 },
    { id: 'compass', name: 'Navy Compass', icon: '🧩', x: 15, y: 82 },
    { id: 'plant', name: 'Green Plant', icon: '🪴', x: 88, y: 40 },
    { id: 'clock', name: 'Retro Clock', icon: '⏰', x: 50, y: 25 },
    { id: 'lamp', name: 'Desk Lamp', icon: '💡', x: 30, y: 85 },
    { id: 'camera', name: 'Mini Camera', icon: '📷', x: 65, y: 85 },
    { id: 'trophy', name: 'Gold Trophy', icon: '🏆', x: 38, y: 45 },
  ];

  const targetItem = challenge.payload.targetItem || sceneItems[0];

  const handleItemTap = (item) => {
    if (item.id === targetItem.id) {
      const nextFound = new Set(foundIds);
      nextFound.add(item.id);
      setFoundIds(nextFound);
      onRespond({ selectedItemId: item.id, isCorrect: true });
    } else {
      setWrongFeedback(true);
      setTimeout(() => setWrongFeedback(false), 600);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          padding: '12px 20px',
          background: wrongFeedback ? 'var(--color-error-bg)' : 'var(--accent-primary-light)',
          color: wrongFeedback ? 'var(--color-error)' : 'var(--accent-primary)',
          borderRadius: 'var(--radius-full)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '15px',
          fontWeight: '800',
          marginBottom: '20px',
          transition: 'all 0.2s ease',
        }}
      >
        {wrongFeedback ? (
          <>
            <AlertCircle size={18} /> Incorrect item! Try again...
          </>
        ) : (
          <>
            Target: {targetItem.name} <span style={{ fontSize: '20px' }}>{targetItem.icon}</span>
          </>
        )}
      </div>

      {/* Cluttered Vector Scene Canvas */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '320px',
          margin: '0 auto',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '2px solid var(--border-light)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        {sceneItems.map((item) => {
          const isFound = foundIds.has(item.id);
          const itemSize = item.size || 28; // Dynamic size from engine

          return (
            <button
              key={item.id}
              onClick={() => handleItemTap(item)}
              style={{
                position: 'absolute',
                left: `${item.x}%`,
                top: `${item.y}%`,
                background: isFound ? 'rgba(57,185,130,0.3)' : 'transparent',
                border: isFound ? '2px solid var(--color-success)' : 'none',
                borderRadius: '50%',
                padding: '4px',
                fontSize: `${itemSize}px`,
                cursor: 'pointer',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.15s ease',
                boxShadow: isFound ? '0 0 16px var(--color-success)' : 'none',
                lineHeight: 1,
              }}
            >
              {item.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// GAME 50: CHALLENGE FUSION WORKOUT — Dynamic multi-domain sub-challenge renderer
export const ChallengeFusionRenderer = ({ challenge, onRespond }) => {
  const { subGameId, subGameName, subPayload } = challenge.payload;

  // Build a dummy challenge object to delegate rendering to sub-renderers
  const subChallenge = { payload: subPayload };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ padding: '6px 16px', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '14px', display: 'inline-block' }}>
        🔥 FUSION WORKOUT • {subGameName || 'Sub Challenge'}
      </div>

      {subGameId === 'stroop_sprint' && (
        <StroopRenderer challenge={subChallenge} onRespond={onRespond} />
      )}
      {subGameId === 'simple_reaction' && (
        <SimpleReactionRenderer challenge={subChallenge} onRespond={onRespond} />
      )}
      {subGameId === 'number_reaction' && (
        <NumberReactionRenderer challenge={subChallenge} onRespond={onRespond} />
      )}
      {subGameId === 'choice_reaction' && (
        <ChoiceReactionRenderer challenge={subChallenge} onRespond={onRespond} />
      )}
      {subGameId === 'raven_matrix' && (
        <RavenMatrixRenderer challenge={subChallenge} onRespond={onRespond} />
      )}
    </div>
  );
};
