import React, { useState, useEffect, useRef } from 'react';
import { NvButton } from '../../../components/ui/NvButton';
import { Eye, Keyboard, Check, RefreshCw, Delete } from 'lucide-react';

// GAME 01 & 02: DIGIT SPAN FORWARD / BACKWARD (Step-by-Step Flashing Digits)
export const DigitSpanRenderer = ({ challenge, trialPhase, onRespond, isBackward }) => {
  const digits = challenge.payload.digits || [];
  const [flashIndex, setFlashIndex] = useState(-1);
  const [typed, setTyped] = useState('');
  const timeoutRef = useRef(null);

  const digitColors = ['#6C4DFF', '#39B982', '#E85D75', '#F0A83A', '#06B6D4', '#A855F7', '#EC4899', '#10B981'];

  useEffect(() => {
    setTyped('');
    setFlashIndex(-1);

    if (trialPhase === 'show') {
      let idx = 0;
      const speed = challenge.payload.speedMs || (challenge.payload.isHardMode ? 550 : 800);

      const initialTimer = setTimeout(() => {
        setFlashIndex(0);
        idx = 1;

        const interval = setInterval(() => {
          if (idx < digits.length) {
            setFlashIndex(idx);
            idx++;
          } else {
            clearInterval(interval);
            setFlashIndex(-1);
          }
        }, speed);

        timeoutRef.current = interval;
      }, 200);

      return () => {
        clearTimeout(initialTimer);
        if (timeoutRef.current) clearInterval(timeoutRef.current);
      };
    }
  }, [challenge, trialPhase, digits]);

  const handleNumPress = (numStr) => {
    const targetLength = challenge.payload.expected ? challenge.payload.expected.length : digits.length;
    if (typed.length >= targetLength) return;

    const next = typed + numStr;
    setTyped(next);

    if (next.length === targetLength) {
      setTimeout(() => {
        onRespond({ userInput: next });
      }, 250);
    }
  };

  const handleBackspace = () => {
    setTyped((prev) => prev.slice(0, -1));
  };

  if (trialPhase === 'show') {
    const currentDigit = flashIndex >= 0 && digits[flashIndex] !== undefined ? digits[flashIndex] : null;
    const currentColor = currentDigit !== null ? digitColors[currentDigit % digitColors.length] : 'var(--accent-primary)';

    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }} className="animate-fade-in">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '20px' }}>
          <Eye size={16} /> {flashIndex >= 0 ? `Memorizing Digit ${flashIndex + 1} of ${digits.length}` : 'Get Ready...'}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '24px' }}>
          {digits.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === flashIndex ? '20px' : '10px',
                height: '10px',
                borderRadius: '5px',
                background: i <= flashIndex ? currentColor : 'var(--border-light)',
                boxShadow: i === flashIndex ? `0 0 10px ${currentColor}` : 'none',
                transition: 'all 0.2s ease',
              }}
            />
          ))}
        </div>

        <div
          key={flashIndex}
          style={{
            width: '150px',
            height: '160px',
            margin: '0 auto',
            background: 'var(--bg-surface)',
            border: `4px solid ${currentDigit !== null ? currentColor : 'var(--border-light)'}`,
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '84px',
            fontWeight: '900',
            color: currentDigit !== null ? currentColor : 'var(--text-tertiary)',
            boxShadow: currentDigit !== null ? `0 12px 40px ${currentColor}55, 0 0 20px ${currentColor}33` : 'none',
            transform: currentDigit !== null ? 'scale(1.08)' : 'scale(0.95)',
            transition: 'all 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
          className="animate-scale-up"
        >
          {currentDigit !== null ? currentDigit : '•'}
        </div>

        <div style={{ marginTop: '20px', padding: '8px 16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', display: 'inline-block', border: '1px solid var(--border-light)' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700', margin: 0 }}>
            {isBackward ? '🔄 Memory Mode: Enter digits in REVERSE order' : '➡️ Memory Mode: Enter digits in FORWARD order'}
          </p>
        </div>
      </div>
    );
  }

  const targetLength = challenge.payload.expected ? challenge.payload.expected.length : digits.length;

  return (
    <div style={{ textAlign: 'center' }} className="animate-fade-in">
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'var(--bg-pill)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '800', marginBottom: '16px' }}>
        <Keyboard size={16} /> {isBackward ? `Type ${targetLength} digits in REVERSE order:` : `Type ${targetLength} digits in FORWARD order:`}
      </div>

      <div
        style={{
          height: '64px',
          maxWidth: '320px',
          margin: '0 auto 20px',
          background: 'var(--bg-surface)',
          border: '2px solid var(--accent-primary)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          letterSpacing: '8px',
        }}
      >
        {typed || <span style={{ color: 'var(--text-tertiary)', fontSize: '18px', letterSpacing: 'normal' }}>Tap numbers below...</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <NvButton
            key={num}
            variant="secondary"
            size="lg"
            onClick={() => handleNumPress(String(num))}
          >
            {num}
          </NvButton>
        ))}

        <NvButton
          variant="secondary"
          size="lg"
          onClick={() => setTyped('')}
          style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-error)' }}
        >
          Clear
        </NvButton>

        <NvButton
          variant="secondary"
          size="lg"
          onClick={() => handleNumPress('0')}
        >
          0
        </NvButton>

        <NvButton
          variant="secondary"
          size="lg"
          onClick={handleBackspace}
          style={{ fontSize: '16px', fontWeight: '700' }}
        >
          ⌫
        </NvButton>
      </div>

      {typed.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <NvButton
            variant="primary"
            size="md"
            onClick={() => onRespond({ userInput: typed })}
            style={{ minWidth: '180px' }}
          >
            Submit ({typed.length}/{targetLength})
          </NvButton>
        </div>
      )}
    </div>
  );
};

// GAME 03: CORSI BLOCKS RENDERER
export const CorsiBlocksRenderer = ({ challenge, trialPhase, onRespond }) => {
  const sequence = challenge.payload.sequence || [];
  const gridSize = challenge.payload.gridSize || 3;
  const [activeStep, setActiveStep] = useState(null);
  const [userSeq, setUserSeq] = useState([]);

  useEffect(() => {
    setUserSeq([]);
    setActiveStep(null);
    if (trialPhase === 'show') {
      let step = 0;
      const interval = setInterval(() => {
        if (step < sequence.length) {
          setActiveStep(sequence[step]);
          step++;
        } else {
          clearInterval(interval);
          setActiveStep(null);
        }
      }, challenge.payload.stepMs || 650);
      return () => clearInterval(interval);
    }
  }, [challenge, trialPhase, sequence]);

  const handleBlockClick = (idx) => {
    if (trialPhase !== 'input') return;
    const next = [...userSeq, idx];
    setUserSeq(next);
    if (next.length === sequence.length) {
      onRespond({ userSequence: next });
    }
  };

  return (
    <div style={{ textAlign: 'center' }} className="animate-fade-in">
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'var(--bg-pill)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '800', marginBottom: '20px' }}>
        <Eye size={16} /> {trialPhase === 'show' ? 'Watch glowing blocks in sequence...' : `Repeat sequence (${userSeq.length}/${sequence.length}):`}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: '12px',
          maxWidth: '320px',
          margin: '0 auto',
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
          const isFlashing = activeStep === idx;
          const isSelected = userSeq.includes(idx);
          return (
            <button
              key={idx}
              disabled={trialPhase === 'show'}
              onClick={() => handleBlockClick(idx)}
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius-lg)',
                border: isFlashing ? '3px solid #FFF' : '2px solid var(--border-light)',
                background: isFlashing
                  ? 'var(--accent-primary)'
                  : isSelected
                  ? 'var(--color-success)'
                  : 'var(--bg-surface)',
                boxShadow: isFlashing ? '0 0 24px var(--accent-primary)' : 'none',
                cursor: trialPhase === 'input' ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// GAME 04: SPATIAL SPAN RENDERER
export const SpatialSpanRenderer = ({ challenge, trialPhase, onRespond }) => {
  return <CorsiBlocksRenderer challenge={challenge} trialPhase={trialPhase} onRespond={onRespond} />;
};

// GAME 05: PICTURE RECALL RENDERER
export const PictureRecallRenderer = ({ challenge, trialPhase, onRespond }) => {
  const items = challenge.payload.items || [];
  const options = challenge.payload.options || [];

  if (trialPhase === 'show') {
    return (
      <div style={{ textAlign: 'center' }} className="animate-fade-in">
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Memorize these pictures ({items.length} items):
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ padding: '20px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', fontSize: '42px', border: '2px solid var(--border-light)' }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }} className="animate-fade-in">
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Which item was in the scene?
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '300px', margin: '0 auto' }}>
        {options.map((opt, idx) => (
          <NvButton key={idx} variant="secondary" size="lg" onClick={() => onRespond({ selectedOption: opt })}>
            <span style={{ fontSize: '32px' }}>{opt}</span>
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// GAME 06: FACE NAME MEMORY RENDERER
export const FaceNameMemoryRenderer = ({ challenge, trialPhase, onRespond }) => {
  const pairs = challenge.payload.pairs || [];
  const targetAvatar = challenge.payload.targetAvatar || '🧩';
  const nameOptions = challenge.payload.nameOptions || [];

  if (trialPhase === 'show') {
    return (
      <div style={{ textAlign: 'center' }} className="animate-fade-in">
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Memorize Avatar Names:
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {pairs.map((p, idx) => (
            <div key={idx} style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: '2px solid var(--border-light)', minWidth: '110px' }}>
              <div style={{ fontSize: '36px', marginBottom: '4px' }}>{p.avatar}</div>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-primary)' }}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }} className="animate-fade-in">
      <div style={{ fontSize: '56px', marginBottom: '12px' }}>{targetAvatar}</div>
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
        What was this avatar's name?
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
        {nameOptions.map((name, idx) => (
          <NvButton key={idx} variant="secondary" size="lg" onClick={() => onRespond({ selectedName: name })}>
            {name}
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// GAME 07: PAIRED ASSOCIATES RENDERER
export const PairedAssociatesRenderer = ({ challenge, trialPhase, onRespond }) => {
  return <FaceNameMemoryRenderer challenge={challenge} trialPhase={trialPhase} onRespond={onRespond} />;
};

// GAME 08: OBJECT LOCATION RENDERER
export const ObjectLocationRenderer = ({ challenge, trialPhase, onRespond }) => {
  const items = challenge.payload.items || [];
  const targetItem = challenge.payload.targetItem || {};
  const gridOptions = challenge.payload.gridOptions || [];

  if (trialPhase === 'show') {
    return (
      <div style={{ textAlign: 'center' }} className="animate-fade-in">
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Memorize Object Locations:
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '280px', margin: '0 auto' }}>
          {items.map((it, idx) => (
            <div key={idx} style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: '2px solid var(--border-light)', fontSize: '32px' }}>
              {it.symbol}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }} className="animate-fade-in">
      <div style={{ fontSize: '48px', marginBottom: '8px' }}>{targetItem.symbol}</div>
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Where was this object located?
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '280px', margin: '0 auto' }}>
        {gridOptions.map((optIdx) => (
          <NvButton key={optIdx} variant="secondary" size="lg" onClick={() => onRespond({ selectedIndex: optIdx })}>
            Position {optIdx + 1}
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// GAME 09: VISUAL SEQUENCE REPRODUCTION RENDERER
export const SequenceReproductionRenderer = ({ challenge, trialPhase, onRespond }) => {
  return <CorsiBlocksRenderer challenge={challenge} trialPhase={trialPhase} onRespond={onRespond} />;
};

// GAME 10: VISUAL PATTERN MEMORY RENDERER
export const VisualPatternMemoryRenderer = ({ challenge, trialPhase, onRespond }) => {
  const targetGrid = challenge.payload.targetGrid || [];
  const gridSize = challenge.payload.gridSize || 3;
  const [userGrid, setUserGrid] = useState([]);

  useEffect(() => {
    setUserGrid([]);
  }, [challenge]);

  const toggleCell = (idx) => {
    if (trialPhase !== 'input') return;
    setUserGrid((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  if (trialPhase === 'show') {
    return (
      <div style={{ textAlign: 'center' }} className="animate-fade-in">
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Memorize Shaded Grid Pattern:
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: '10px', maxWidth: '260px', margin: '0 auto' }}>
          {Array.from({ length: gridSize * gridSize }).map((_, idx) => (
            <div
              key={idx}
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius-md)',
                background: targetGrid.includes(idx) ? 'var(--accent-primary)' : 'var(--bg-surface)',
                border: '2px solid var(--border-light)',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }} className="animate-fade-in">
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Recreate Shaded Grid Pattern:
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: '10px', maxWidth: '260px', margin: '0 auto 20px' }}>
        {Array.from({ length: gridSize * gridSize }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => toggleCell(idx)}
            style={{
              aspectRatio: '1',
              borderRadius: 'var(--radius-md)',
              background: userGrid.includes(idx) ? 'var(--accent-primary)' : 'var(--bg-surface)',
              border: '2px solid var(--border-light)',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
      <NvButton variant="primary" size="md" onClick={() => onRespond({ shadedIndices: userGrid })}>
        Submit Pattern
      </NvButton>
    </div>
  );
};
