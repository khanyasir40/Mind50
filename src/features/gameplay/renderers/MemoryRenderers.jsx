import React, { useState, useEffect, useRef } from 'react';
import { NvButton } from '../../../components/ui/NvButton';
import { Eye, Keyboard } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// GAME 01 & 02: DIGIT SPAN FORWARD / BACKWARD (Step-by-Step Flashing Digits)
// ─────────────────────────────────────────────────────────────────────────────
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
  }, [challenge, trialPhase]);

  const handleNumPress = (numStr) => {
    const targetLength = challenge.payload.expected ? challenge.payload.expected.length : digits.length;
    if (typed.length >= targetLength) return;
    const next = typed + numStr;
    setTyped(next);
    if (next.length === targetLength) {
      setTimeout(() => onRespond({ userInput: next }), 250);
    }
  };

  const handleBackspace = () => setTyped(prev => prev.slice(0, -1));

  if (trialPhase === 'show') {
    const currentDigit = flashIndex >= 0 && digits[flashIndex] !== undefined ? digits[flashIndex] : null;
    const currentColor = currentDigit !== null ? digitColors[currentDigit % digitColors.length] : 'var(--accent-primary)';

    return (
      <div style={{ textAlign: 'center', padding: '20px 0' }} className="animate-fade-in">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '20px' }}>
          <Eye size={16} /> {flashIndex >= 0 ? `Digit ${flashIndex + 1} of ${digits.length}` : 'Get Ready...'}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '24px' }}>
          {digits.map((_, i) => (
            <div key={i} style={{ width: i === flashIndex ? '20px' : '10px', height: '10px', borderRadius: '5px', background: i <= flashIndex ? currentColor : 'var(--border-light)', boxShadow: i === flashIndex ? `0 0 10px ${currentColor}` : 'none', transition: 'all 0.2s ease' }} />
          ))}
        </div>

        <div key={flashIndex} style={{ width: '150px', height: '160px', margin: '0 auto', background: 'var(--bg-surface)', border: `4px solid ${currentDigit !== null ? currentColor : 'var(--border-light)'}`, borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '84px', fontWeight: '900', color: currentDigit !== null ? currentColor : 'var(--text-tertiary)', boxShadow: currentDigit !== null ? `0 12px 40px ${currentColor}55` : 'none', transform: currentDigit !== null ? 'scale(1.08)' : 'scale(0.95)', transition: 'all 0.12s cubic-bezier(0.175,0.885,0.32,1.275)' }}>
          {currentDigit !== null ? currentDigit : '•'}
        </div>

        <div style={{ marginTop: '20px', padding: '8px 16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', display: 'inline-block', border: '1px solid var(--border-light)' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700', margin: 0 }}>
            {isBackward ? '🔄 Enter digits in REVERSE order' : '➡️ Enter digits in FORWARD order'}
          </p>
        </div>
      </div>
    );
  }

  const targetLength = challenge.payload.expected ? challenge.payload.expected.length : digits.length;

  return (
    <div style={{ textAlign: 'center' }} className="animate-fade-in">
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'var(--bg-pill)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '800', marginBottom: '16px' }}>
        <Keyboard size={16} /> {isBackward ? `Type ${targetLength} digits REVERSED:` : `Type ${targetLength} digits in order:`}
      </div>

      <div style={{ height: '64px', maxWidth: '320px', margin: '0 auto 20px', background: 'var(--bg-surface)', border: '2px solid var(--accent-primary)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '8px' }}>
        {typed || <span style={{ color: 'var(--text-tertiary)', fontSize: '18px', letterSpacing: 'normal' }}>Tap numbers below...</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <NvButton key={num} variant="secondary" size="lg" onClick={() => handleNumPress(String(num))}>{num}</NvButton>
        ))}
        <NvButton variant="secondary" size="lg" onClick={() => setTyped('')} style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-error)' }}>Clear</NvButton>
        <NvButton variant="secondary" size="lg" onClick={() => handleNumPress('0')}>0</NvButton>
        <NvButton variant="secondary" size="lg" onClick={handleBackspace} style={{ fontSize: '16px', fontWeight: '700' }}>⌫</NvButton>
      </div>

      {typed.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <NvButton variant="primary" size="md" onClick={() => onRespond({ userInput: typed })} style={{ minWidth: '180px' }}>
            Submit ({typed.length}/{targetLength})
          </NvButton>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GAME 03 & 04: CORSI BLOCKS / SPATIAL SPAN RENDERER
// ─────────────────────────────────────────────────────────────────────────────
export const CorsiBlocksRenderer = ({ challenge, trialPhase, onRespond }) => {
  const sequence = challenge.payload.sequence || [];
  const gridSize = challenge.payload.gridSize || 9;
  const gridDim = Math.round(Math.sqrt(gridSize)); // e.g. 3 for 9 cells
  const [activeStep, setActiveStep] = useState(null);
  const [userSeq, setUserSeq] = useState([]);

  useEffect(() => {
    setUserSeq([]);
    setActiveStep(null);
    if (trialPhase === 'show') {
      let step = 0;
      // Read stepMs (fixed alias), then fall back to displayStepMs or 650
      const delay = challenge.payload.stepMs || challenge.payload.displayStepMs || 650;
      const interval = setInterval(() => {
        if (step < sequence.length) {
          setActiveStep(sequence[step]);
          step++;
        } else {
          clearInterval(interval);
          setActiveStep(null);
        }
      }, delay);
      return () => clearInterval(interval);
    }
  }, [challenge, trialPhase]);

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
        <Eye size={16} /> {trialPhase === 'show' ? 'Watch the flashing sequence...' : `Repeat (${userSeq.length}/${sequence.length}):`}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridDim}, 1fr)`, gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
        {Array.from({ length: gridSize }).map((_, idx) => {
          const isFlashing = activeStep === idx;
          const isSelected = userSeq.includes(idx);
          return (
            <button
              key={idx}
              disabled={trialPhase === 'show'}
              onClick={() => handleBlockClick(idx)}
              style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)', border: isFlashing ? '3px solid #FFF' : '2px solid var(--border-light)', background: isFlashing ? 'var(--accent-primary)' : isSelected ? 'var(--color-success)' : 'var(--bg-surface)', boxShadow: isFlashing ? '0 0 24px var(--accent-primary)' : 'none', cursor: trialPhase === 'input' ? 'pointer' : 'default', transition: 'all 0.15s ease' }}
            />
          );
        })}
      </div>
    </div>
  );
};

// GAME 04: SPATIAL SPAN (reuses Corsi renderer — same engine format)
export const SpatialSpanRenderer = ({ challenge, trialPhase, onRespond }) => (
  <CorsiBlocksRenderer challenge={challenge} trialPhase={trialPhase} onRespond={onRespond} />
);

// ─────────────────────────────────────────────────────────────────────────────
// GAME 05: PICTURE SCENE RECALL
// FIX: reads .items[] (scene objects) and .options[] (position choices)
// ─────────────────────────────────────────────────────────────────────────────
export const PictureRecallRenderer = ({ challenge, trialPhase, onRespond }) => {
  const items = challenge.payload.items || [];
  const options = challenge.payload.options || challenge.payload.choices || [];
  const question = challenge.payload.question || 'Where was the target?';
  const targetIcon = challenge.payload.targetIcon || '❓';

  if (trialPhase === 'show') {
    return (
      <div style={{ textAlign: 'center' }} className="animate-fade-in">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '800', marginBottom: '16px' }}>
          <Eye size={16} /> Memorize positions of {items.length} objects
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', maxWidth: '440px', margin: '0 auto' }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ padding: '12px 16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: '2px solid var(--border-light)', minWidth: '100px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '4px' }}>{item.icon}</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>{item.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--accent-primary)', marginTop: '2px', fontWeight: '800' }}>{item.position}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }} className="animate-fade-in">
      <div style={{ fontSize: '48px', marginBottom: '8px' }}>{targetIcon}</div>
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px' }}>{question}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
        {options.map((pos, idx) => (
          <NvButton key={idx} variant="secondary" size="lg" onClick={() => onRespond({ userAnswer: pos })}>
            {pos}
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GAME 06: FACE-NAME MEMORY RENDERER
// FIX: reads .targetAvatar and .nameOptions (now provided by engine)
// ─────────────────────────────────────────────────────────────────────────────
export const FaceNameMemoryRenderer = ({ challenge, trialPhase, onRespond }) => {
  const pairs = challenge.payload.pairs || [];
  // Support both new fields (.targetAvatar/.nameOptions) and old legacy fields
  const targetAvatar = challenge.payload.targetAvatar || challenge.payload.targetPair?.avatar || '🧩';
  const nameOptions = challenge.payload.nameOptions || challenge.payload.options || [];
  const targetPairName = challenge.payload.targetPair?.name || '';

  if (trialPhase === 'show') {
    return (
      <div style={{ textAlign: 'center' }} className="animate-fade-in">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '800', marginBottom: '16px' }}>
          <Eye size={16} /> Memorize {pairs.length} avatar names
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', maxWidth: '420px', margin: '0 auto' }}>
          {pairs.map((p, idx) => (
            <div key={idx} style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: '2px solid var(--border-light)', minWidth: '110px', textAlign: 'center' }}>
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
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px' }}>
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

// ─────────────────────────────────────────────────────────────────────────────
// GAME 07: PAIRED ASSOCIATES RENDERER
// FIX: dedicated renderer — shows symbol pairs in study, asks correct partner
// ─────────────────────────────────────────────────────────────────────────────
export const PairedAssociatesRenderer = ({ challenge, trialPhase, onRespond }) => {
  const pairs = challenge.payload.pairs || [];
  const promptSymbol = challenge.payload.targetAvatar || challenge.payload.promptSymbol || '?';
  const options = challenge.payload.nameOptions || challenge.payload.options || [];

  if (trialPhase === 'show') {
    return (
      <div style={{ textAlign: 'center' }} className="animate-fade-in">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '800', marginBottom: '16px' }}>
          <Eye size={16} /> Memorize {pairs.length} symbol pairs
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', maxWidth: '420px', margin: '0 auto' }}>
          {pairs.map((p, idx) => (
            <div key={idx} style={{ padding: '16px 20px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: '2px solid var(--border-light)', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--accent-primary)' }}>
                {p.avatar || p.symbolA}
                <span style={{ margin: '0 8px', color: 'var(--text-tertiary)', fontSize: '16px' }}>→</span>
                {p.name || p.symbolB}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }} className="animate-fade-in">
      <div style={{ fontSize: '52px', fontWeight: '900', color: 'var(--accent-primary)', marginBottom: '8px' }}>{promptSymbol}</div>
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px' }}>
        What was paired with this symbol?
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
        {options.map((opt, idx) => (
          <NvButton key={idx} variant="secondary" size="lg"
            onClick={() => onRespond({ selectedPartner: opt, selectedName: opt })}
            style={{ fontSize: '24px', fontWeight: '900' }}>
            {opt}
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GAME 08: OBJECT LOCATION RENDERER
// FIX: shows all items on a gridDim×gridDim grid; asks user to click correct cell
// ─────────────────────────────────────────────────────────────────────────────
export const ObjectLocationRenderer = ({ challenge, trialPhase, onRespond }) => {
  const items = challenge.payload.items || [];
  const targetItem = challenge.payload.targetItem || {};
  const gridDim = challenge.payload.gridDim || 3;
  const totalCells = gridDim * gridDim;
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => setSelectedCell(null), [challenge]);

  if (trialPhase === 'show') {
    // Build cell→item map
    const cellMap = {};
    items.forEach(it => { cellMap[it.cellIdx] = it; });

    return (
      <div style={{ textAlign: 'center' }} className="animate-fade-in">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '800', marginBottom: '16px' }}>
          <Eye size={16} /> Memorize object positions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridDim}, 1fr)`, gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
          {Array.from({ length: totalCells }, (_, i) => {
            const item = cellMap[i];
            return (
              <div key={i} style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)', background: item ? 'var(--bg-surface)' : 'var(--bg-base)', border: item ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>
                {item ? item.symbol : null}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Input phase: show target object, user taps the correct cell
  const handleCellClick = (cellIdx) => {
    setSelectedCell(cellIdx);
    setTimeout(() => onRespond({ selectedCellIdx: cellIdx }), 300);
  };

  return (
    <div style={{ textAlign: 'center' }} className="animate-fade-in">
      <div style={{ fontSize: '48px', marginBottom: '8px' }}>{targetItem.symbol || '❓'}</div>
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '20px' }}>
        Where was the <span style={{ color: 'var(--accent-primary)' }}>{targetItem.name || 'object'}</span>?
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridDim}, 1fr)`, gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        {Array.from({ length: totalCells }, (_, i) => (
          <button key={i} onClick={() => handleCellClick(i)} style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)', background: selectedCell === i ? 'var(--accent-primary)' : 'var(--bg-surface)', border: selectedCell === i ? '2px solid var(--accent-primary)' : '2px solid var(--border-light)', cursor: 'pointer', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color: selectedCell === i ? '#fff' : 'var(--text-tertiary)' }}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GAME 09: VISUAL SEQUENCE REPRODUCTION (Simon-Says)
// Uses CorsiBlocksRenderer — sequence and stepMs now properly set by engine
// ─────────────────────────────────────────────────────────────────────────────
export const SequenceReproductionRenderer = ({ challenge, trialPhase, onRespond }) => {
  const items = challenge.payload.items || [];
  const sequence = challenge.payload.sequence || [];
  const [flashIdx, setFlashIdx] = useState(null);
  const [userSeq, setUserSeq] = useState([]);

  useEffect(() => {
    setUserSeq([]);
    setFlashIdx(null);
    if (trialPhase === 'show') {
      const stepMs = challenge.payload.stepMs || challenge.payload.displayStepMs || 600;
      let step = 0;
      const interval = setInterval(() => {
        if (step < sequence.length) {
          setFlashIdx(sequence[step]);
          step++;
        } else {
          clearInterval(interval);
          setFlashIdx(null);
        }
      }, stepMs);
      return () => clearInterval(interval);
    }
  }, [challenge, trialPhase]);

  const handleTap = (idx) => {
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
        <Eye size={16} /> {trialPhase === 'show' ? 'Watch the color sequence...' : `Repeat (${userSeq.length}/${sequence.length})`}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', maxWidth: '300px', margin: '0 auto' }}>
        {items.map((item, idx) => {
          const isFlashing = flashIdx === idx;
          return (
            <button
              key={item.id}
              disabled={trialPhase === 'show'}
              onClick={() => handleTap(idx)}
              style={{ height: '100px', borderRadius: 'var(--radius-xl)', background: isFlashing ? item.color : `${item.color}44`, border: isFlashing ? `4px solid ${item.color}` : `2px solid ${item.color}66`, boxShadow: isFlashing ? `0 0 30px ${item.color}99` : 'none', cursor: trialPhase === 'input' ? 'pointer' : 'default', transition: 'all 0.12s ease', transform: isFlashing ? 'scale(1.08)' : 'scale(1)' }}
            />
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// GAME 10: VISUAL PATTERN MEMORY RENDERER
// FIX: reads .targetGrid (was .shadedIndices), submits .shadedIndices
// ─────────────────────────────────────────────────────────────────────────────
export const VisualPatternMemoryRenderer = ({ challenge, trialPhase, onRespond }) => {
  // Support both field names — engine now produces .targetGrid but keep shadedIndices as fallback
  const targetGrid = challenge.payload.targetGrid || challenge.payload.shadedIndices || [];
  const dimension = challenge.payload.dimension || 4;
  const [userGrid, setUserGrid] = useState([]);

  useEffect(() => setUserGrid([]), [challenge]);

  const toggleCell = (idx) => {
    if (trialPhase !== 'input') return;
    setUserGrid(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  if (trialPhase === 'show') {
    return (
      <div style={{ textAlign: 'center' }} className="animate-fade-in">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '800', marginBottom: '16px' }}>
          <Eye size={16} /> Memorize the shaded pattern ({targetGrid.length} cells)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${dimension}, 1fr)`, gap: '8px', maxWidth: '280px', margin: '0 auto' }}>
          {Array.from({ length: dimension * dimension }).map((_, idx) => (
            <div key={idx} style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)', background: targetGrid.includes(idx) ? 'var(--accent-primary)' : 'var(--bg-surface)', border: '2px solid var(--border-light)', boxShadow: targetGrid.includes(idx) ? '0 0 12px var(--accent-primary)55' : 'none' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }} className="animate-fade-in">
      <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px' }}>
        Recreate the shaded pattern — tap cells to shade them:
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${dimension}, 1fr)`, gap: '8px', maxWidth: '280px', margin: '0 auto 20px' }}>
        {Array.from({ length: dimension * dimension }).map((_, idx) => (
          <button key={idx} onClick={() => toggleCell(idx)} style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)', background: userGrid.includes(idx) ? 'var(--accent-primary)' : 'var(--bg-surface)', border: userGrid.includes(idx) ? '2px solid var(--accent-primary)' : '2px solid var(--border-light)', cursor: 'pointer', transition: 'all 0.12s ease', boxShadow: userGrid.includes(idx) ? '0 0 10px var(--accent-primary)55' : 'none' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <NvButton variant="secondary" size="sm" onClick={() => setUserGrid([])}>Clear All</NvButton>
        <NvButton variant="primary" size="md" onClick={() => onRespond({ shadedIndices: userGrid })}>
          Submit Pattern ({userGrid.length} selected)
        </NvButton>
      </div>
    </div>
  );
};
