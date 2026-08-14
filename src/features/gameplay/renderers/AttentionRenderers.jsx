import React, { useState, useEffect, useRef } from 'react';
import { NvButton } from '../../../components/ui/NvButton';

// GAME 11: STROOP SPRINT — 12-Color + Dynamic INK vs WORD Prompting
export const StroopRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());
  const taskMode = challenge.payload.taskMode || 'INK';

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: '800' }}>
        {taskMode === 'INK' ? (
          <>Match the <strong style={{ color: 'var(--accent-primary)', fontSize: '17px', textDecoration: 'underline' }}>INK COLOR</strong> — ignore the text!</>
        ) : (
          <>Match the <strong style={{ color: 'var(--color-warning)', fontSize: '17px', textDecoration: 'underline' }}>WORD TEXT</strong> — ignore the ink!</>
        )}
      </div>
      <div
        style={{
          fontSize: '68px',
          fontWeight: '900',
          color: challenge.payload.inkColorHex,
          textTransform: 'uppercase',
          marginBottom: '32px',
          textShadow: `0 0 30px ${challenge.payload.inkColorHex}66`,
          letterSpacing: '2px',
        }}
      >
        {challenge.payload.wordText}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          maxWidth: '380px',
          margin: '0 auto',
        }}
      >
        {challenge.payload.options.map((colName) => (
          <NvButton
            key={colName}
            variant="pill"
            size="lg"
            onClick={() => onRespond({ selectedColor: colName, reactionTimeMs: Date.now() - startRef.current })}
          >
            {colName}
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// GAME 12 & 13: TRAIL MAKING A & B
export const TrailMakingRenderer = ({ challenge, onRespond }) => {
  const [userClicks, setUserClicks] = useState([]);
  const [errorCount, setErrorCount] = useState(0);
  const [lines, setLines] = useState([]);
  const [wrongLabel, setWrongLabel] = useState(null);
  const trialStartRef = useRef(Date.now());
  const points = challenge.payload.points || [];
  const expectedSeq = challenge.payload.expectedSequence || [];
  const isPartB = challenge.payload.isPartB;

  useEffect(() => {
    setUserClicks([]);
    setErrorCount(0);
    setLines([]);
    setWrongLabel(null);
    trialStartRef.current = Date.now();
  }, [challenge]);

  const handlePointClick = (pt) => {
    const nextExpected = expectedSeq[userClicks.length];
    if (pt.label === nextExpected) {
      const next = [...userClicks, pt.label];
      setWrongLabel(null);
      if (next.length > 1) {
        const prevLabel = next[next.length - 2];
        const prevPt = points.find(p => p.label === prevLabel);
        if (prevPt) {
          setLines(prev => [...prev, { x1: prevPt.x, y1: prevPt.y, x2: pt.x, y2: pt.y }]);
        }
      }
      setUserClicks(next);

      if (next.length === expectedSeq.length) {
        const trialTimeMs = Date.now() - trialStartRef.current;
        onRespond({ errorCount, trialTimeMs, totalTimeMs: trialTimeMs });
      }
    } else if (!userClicks.includes(pt.label)) {
      setErrorCount(prev => prev + 1);
      setWrongLabel(pt.label);
      setTimeout(() => setWrongLabel(null), 500);
    }
  };

  const nextTarget = expectedSeq[userClicks.length];

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: '700' }}>
        {isPartB ? '🔀 Alternate: 1 → A → 2 → B...' : '🔢 Ascending: 1 → 2 → 3...'}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '12px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <span>Progress: <strong style={{ color: 'var(--accent-primary)' }}>{userClicks.length}/{expectedSeq.length}</strong></span>
        <span>Errors: <strong style={{ color: errorCount > 0 ? 'var(--color-error)' : 'var(--text-tertiary)' }}>{errorCount}</strong></span>
        {nextTarget && <span>Next: <strong style={{ color: 'var(--accent-primary)', fontSize: '14px' }}>{nextTarget}</strong></span>}
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '360px',
          margin: '0 auto',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden',
        }}
      >
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {lines.map((line, i) => (
            <line
              key={i}
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke="var(--accent-primary)"
              strokeWidth="3"
              strokeOpacity="0.8"
              strokeDasharray="4 3"
            />
          ))}
        </svg>

        {points.map((pt) => {
          const isTapped = userClicks.includes(pt.label);
          const isWrong = wrongLabel === pt.label;

          return (
            <button
              key={pt.id}
              onClick={() => handlePointClick(pt)}
              style={{
                position: 'absolute',
                left: `${pt.x}%`,
                top: `${pt.y}%`,
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: isWrong ? 'var(--color-error)' : isTapped ? 'var(--accent-primary)' : 'var(--bg-base)',
                color: isWrong || isTapped ? '#FFFFFF' : 'var(--text-primary)',
                fontWeight: '900',
                fontSize: '16px',
                border: isWrong
                  ? '3px solid var(--color-error)'
                  : isTapped
                  ? '3px solid var(--accent-primary)'
                  : '2px solid var(--border-light)',
                cursor: isTapped ? 'default' : 'pointer',
                boxShadow: isWrong
                  ? '0 0 16px var(--color-error)'
                  : isTapped
                  ? '0 0 14px rgba(108,77,255,0.5)'
                  : '0 3px 8px rgba(0,0,0,0.12)',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.15s ease',
                zIndex: 2,
              }}
            >
              {pt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// GAME 14: GO / NO-GO RESPONSE
export const GoNoGoRenderer = ({ challenge, onRespond }) => {
  const hasResponded = useRef(false);
  const stimulus = challenge.payload.stimulus || { type: 'GO', color: '#39B982', icon: '🟢', label: 'TAP FAST!' };
  const durationMs = challenge.payload.autoSubmitAfterMs || 1600;
  const isGo = stimulus.type === 'GO';

  useEffect(() => {
    hasResponded.current = false;

    const timer = setTimeout(() => {
      if (!hasResponded.current) {
        hasResponded.current = true;
        onRespond({ userTapped: false });
      }
    }, durationMs);

    return () => clearTimeout(timer);
  }, [challenge]);

  const handleTap = () => {
    if (hasResponded.current) return;
    hasResponded.current = true;
    onRespond({ userTapped: true });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', fontWeight: '800' }}>
        {isGo ? '⚡ TARGET DETECTED — TAP INSTANTLY!' : '🛑 HAZARD WARNING — HOLD & DO NOT TAP!'}
      </div>
      <div
        onClick={handleTap}
        style={{
          width: '260px',
          height: '260px',
          margin: '0 auto 20px',
          borderRadius: '50%',
          background: isGo ? 'radial-gradient(circle, #39B982 0%, rgba(57,185,130,0.85) 100%)' : 'radial-gradient(circle, #E85D75 0%, rgba(232,93,117,0.85) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          cursor: isGo ? 'pointer' : 'not-allowed',
          boxShadow: isGo ? '0 0 40px rgba(57,185,130,0.6)' : '0 0 40px rgba(232,93,117,0.6)',
          border: isGo ? '4px solid #FFFFFF' : '4px solid #FFE5E5',
          userSelect: 'none',
          transition: 'all 0.15s ease',
        }}
      >
        <span style={{ fontSize: '64px', marginBottom: '4px' }}>{stimulus.icon || (isGo ? '🟢' : '🛑')}</span>
        <span style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '1px' }}>{stimulus.label || (isGo ? 'TAP!' : 'HOLD!')}</span>
        <span style={{ fontSize: '12px', opacity: 0.9, marginTop: '4px', fontWeight: '700' }}>
          {isGo ? '👆 TOUCH ANYWHERE!' : '🛡️ DO NOT TOUCH!'}
        </span>
      </div>
    </div>
  );
};

// GAME 15: ERIKSEN FLANKER
export const FlankerRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  const items = challenge.payload.items || [];
  const targetPos = challenge.payload.targetPosition || 'CENTER';

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: '800' }}>
        Which direction is the <strong style={{ color: 'var(--accent-primary)', fontSize: '18px', textDecoration: 'underline' }}>{targetPos}</strong> item pointing?
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '16px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          maxWidth: '420px',
          margin: '0 auto 36px',
        }}
      >
        {items.map((item, idx) => {
          const isTarget =
            (targetPos === 'LEFT' && idx === 0) ||
            (targetPos === 'CENTER' && idx === 2) ||
            (targetPos === 'RIGHT' && idx === 4);

          return (
            <div
              key={idx}
              style={{
                width: isTarget ? '64px' : '48px',
                height: isTarget ? '64px' : '48px',
                borderRadius: '14px',
                background: isTarget ? 'linear-gradient(135deg, var(--accent-primary), #A855F7)' : 'var(--bg-base)',
                color: isTarget ? '#FFFFFF' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isTarget ? '32px' : '22px',
                fontWeight: '900',
                boxShadow: isTarget ? '0 0 24px rgba(108,77,255,0.6)' : 'none',
                border: isTarget ? '3px solid #FFFFFF' : '1px solid var(--border-light)',
                transition: 'all 0.2s ease',
              }}
            >
              {item.symbol}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        <NvButton
          variant="primary"
          size="md"
          onClick={() => onRespond({ selectedDirection: 'up', reactionTimeMs: Date.now() - startRef.current })}
          style={{ width: '120px' }}
        >
          ▲ UP
        </NvButton>
        <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
          <NvButton
            variant="primary"
            size="md"
            onClick={() => onRespond({ selectedDirection: 'left', reactionTimeMs: Date.now() - startRef.current })}
            style={{ flex: 1 }}
          >
            ◀ LEFT
          </NvButton>
          <NvButton
            variant="primary"
            size="md"
            onClick={() => onRespond({ selectedDirection: 'right', reactionTimeMs: Date.now() - startRef.current })}
            style={{ flex: 1 }}
          >
            RIGHT ▶
          </NvButton>
        </div>
        <NvButton
          variant="primary"
          size="md"
          onClick={() => onRespond({ selectedDirection: 'down', reactionTimeMs: Date.now() - startRef.current })}
          style={{ width: '120px' }}
        >
          ▼ DOWN
        </NvButton>
      </div>
    </div>
  );
};

// GAME 16: SIMON INTERFERENCE TASK — Neon Color Buttons
export const SimonRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  const activeColors = challenge.payload.activeColors || [
    { name: 'Red', hex: '#E85D75', expectedButton: 'RED' },
    { name: 'Blue', hex: '#6C4DFF', expectedButton: 'BLUE' },
    { name: 'Green', hex: '#39B982', expectedButton: 'GREEN' },
    { name: 'Yellow', hex: '#F0A83A', expectedButton: 'YELLOW' },
  ];

  const positionMap = {
    TOP_LEFT: { left: '20%', top: '25%' },
    TOP_RIGHT: { left: '80%', top: '25%' },
    BOTTOM_LEFT: { left: '20%', top: '75%' },
    BOTTOM_RIGHT: { left: '80%', top: '75%' },
    CENTER: { left: '50%', top: '50%' },
  };
  const pos = positionMap[challenge.payload.screenSide] || { left: '50%', top: '50%' };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Press the button matching the <strong style={{ color: challenge.payload.colorHex, fontSize: '16px' }}>ORB COLOR</strong> — ignore position!
      </div>

      <div style={{ position: 'relative', height: '170px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', marginBottom: '20px', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            transform: 'translate(-50%, -50%)',
            width: '65px',
            height: '65px',
            borderRadius: '50%',
            background: challenge.payload.colorHex,
            boxShadow: `0 0 35px ${challenge.payload.colorHex}`,
            transition: 'none',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: activeColors.length > 2 ? '1fr 1fr' : '1fr 1fr', gap: '12px', maxWidth: '380px', margin: '0 auto' }}>
        {activeColors.map((c) => (
          <button
            key={c.name}
            onClick={() => onRespond({ selectedButton: c.expectedButton, selectedColor: c.expectedButton, reactionTimeMs: Date.now() - startRef.current })}
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-xl)',
              border: `2px solid ${c.hex}`,
              background: 'var(--bg-surface)',
              color: c.hex,
              fontWeight: '900',
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: `0 4px 15px ${c.hex}33`,
              transition: 'transform 0.1s',
            }}
          >
            ● {c.name.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

// GAME 17: VISUAL SEARCH MATRIX — Complete Rectangular Grid (NO missing tiles) & Uniform Color Palette
export const VisualSearchRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  const gridCols = challenge.payload.gridCols || 4;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: '800' }}>
        Find the unique target symbol: <strong style={{ color: 'var(--accent-primary)', fontSize: '26px', marginLeft: '6px' }}>{challenge.payload.targetSymbol}</strong>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gap: '10px',
          maxWidth: '380px',
          margin: '0 auto',
          background: 'var(--bg-surface)',
          padding: '12px',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
        }}
      >
        {challenge.payload.items.map((item, idx) => {
          const symbol = typeof item === 'string' ? item : item.symbol;
          const color = '#6C4DFF';

          return (
            <button
              key={idx}
              onClick={() => onRespond({ selectedIndex: idx, reactionTimeMs: Date.now() - startRef.current })}
              style={{
                aspectRatio: '1',
                borderRadius: '12px',
                border: `2px solid ${color}44`,
                background: 'var(--bg-base)',
                fontSize: '24px',
                fontWeight: '900',
                color: color,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 10px ${color}15`,
              }}
            >
              {symbol}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// GAME 18: TARGET CANCELLATION
export const CancellationRenderer = ({ challenge, onRespond }) => {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const items = challenge.payload.gridItems || [];
  const gridCols = challenge.payload.gridCols || 6;

  useEffect(() => {
    setSelectedIds(new Set());
  }, [challenge]);

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        Tap every <strong style={{ color: 'var(--accent-primary)', fontSize: '18px' }}>{challenge.payload.targetSymbol}</strong> — ignore others!
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
        Selected: {selectedIds.size} / {challenge.payload.targetCount} targets
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gap: '6px',
          maxWidth: '380px',
          margin: '0 auto',
        }}
      >
        {items.map((item) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              style={{
                aspectRatio: '1',
                borderRadius: '8px',
                border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-surface)',
                color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
              }}
            >
              {item.symbol}
            </button>
          );
        })}
      </div>
      <NvButton
        variant="primary"
        size="lg"
        onClick={() => onRespond({ selectedIds: Array.from(selectedIds) })}
        style={{ marginTop: '20px', width: '100%', maxWidth: '240px' }}
      >
        Submit Selection
      </NvButton>
    </div>
  );
};

// GAME 19: CONTINUOUS PERFORMANCE — Dynamic Target Pair Rules Prompt
export const ContinuousPerformanceRenderer = ({ challenge, onRespond }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [taps, setTaps] = useState([]);
  const [prevLetter, setPrevLetter] = useState('');
  const hasFinished = useRef(false);
  const stream = challenge.payload.stream || [];
  const leadLetter = challenge.payload.leadLetter || 'A';
  const triggerLetter = challenge.payload.triggerLetter || 'X';

  useEffect(() => {
    setCurrentIndex(0);
    setTaps([]);
    setPrevLetter('');
    hasFinished.current = false;

    const intervalMs = challenge.payload.intervalMs || 700;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1;
        if (next >= stream.length) {
          clearInterval(interval);
          return prev;
        }
        setPrevLetter(stream[prev]);
        return next;
      });
    }, intervalMs);

    const endTimer = setTimeout(() => {
      if (!hasFinished.current) {
        hasFinished.current = true;
        setTaps(currentTaps => onRespond({ tapIndices: currentTaps }) || currentTaps);
      }
    }, intervalMs * (stream.length + 2));

    return () => {
      clearInterval(interval);
      clearTimeout(endTimer);
    };
  }, [challenge]);

  const handleTap = () => {
    setTaps(prev => [...prev, currentIndex]);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '800' }}>
        Tap ONLY when <strong style={{ color: 'var(--accent-primary)', fontSize: '18px' }}>{triggerLetter}</strong> immediately follows <strong style={{ color: 'var(--color-warning)', fontSize: '18px' }}>{leadLetter}</strong>!
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '8px' }}>
        <div style={{ textAlign: 'center', opacity: 0.5 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>PREV</div>
          <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--text-secondary)', width: '60px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {prevLetter || '—'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase' }}>NOW</div>
          <div
            key={currentIndex}
            style={{
              fontSize: '88px',
              fontWeight: '900',
              color: 'var(--accent-primary)',
              width: '100px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textShadow: '0 0 20px rgba(108,77,255,0.3)',
            }}
          >
            {stream[currentIndex] || '—'}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
        Item {currentIndex + 1} of {stream.length} | Taps: {taps.length}
      </div>
      <NvButton variant="primary" size="lg" onClick={handleTap} style={{ width: '100%', maxWidth: '300px' }}>
        ⚡ TAP! ({leadLetter}→{triggerLetter})
      </NvButton>
    </div>
  );
};

// GAME 20: MULTIPLE OBJECT TRACKING — Smooth Animation & Gentle 1-Target Progression in Normal Mode
export const MultipleObjectTrackingRenderer = ({ challenge, onRespond }) => {
  const [phase, setPhase] = useState('highlight');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [positions, setPositions] = useState([]);
  const animRef = useRef(null);
  const posRef = useRef([]);
  const phaseRef = useRef('highlight');

  const objects = challenge.payload.objects || [];
  const targets = new Set(challenge.payload.targetIds || []);

  useEffect(() => {
    setPhase('highlight');
    phaseRef.current = 'highlight';
    setSelectedIds(new Set());

    const initPos = objects.map(obj => ({
      id: obj.id,
      x: obj.x,
      y: obj.y,
      vx: obj.vx,
      vy: obj.vy,
    }));
    posRef.current = initPos;
    setPositions(initPos);

    const t1 = setTimeout(() => {
      setPhase('moving');
      phaseRef.current = 'moving';

      const startTime = Date.now();
      const duration = challenge.payload.motionDurationMs || 4500;

      const animate = () => {
        if (phaseRef.current !== 'moving') return;

        posRef.current = posRef.current.map(obj => {
          let { x, y, vx, vy } = obj;
          x += vx * 0.35;
          y += vy * 0.35;

          if (x < 10 || x > 90) { vx = -vx; x = Math.max(10, Math.min(90, x)); }
          if (y < 10 || y > 90) { vy = -vy; y = Math.max(10, Math.min(90, y)); }

          return { ...obj, x, y, vx, vy };
        });

        setPositions([...posRef.current]);

        if (Date.now() - startTime < duration) {
          animRef.current = requestAnimationFrame(animate);
        }
      };

      animRef.current = requestAnimationFrame(animate);

      const t2 = setTimeout(() => {
        cancelAnimationFrame(animRef.current);
        setPhase('select');
        phaseRef.current = 'select';
      }, duration);

      return () => clearTimeout(t2);
    }, challenge.payload.highlightDurationMs || 3000);

    return () => {
      clearTimeout(t1);
      cancelAnimationFrame(animRef.current);
    };
  }, [challenge]);

  const toggleSelect = (id) => {
    if (phase !== 'select') return;
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: '800' }}>
        {phase === 'highlight' && '🎯 Memorize highlighted targets!'}
        {phase === 'moving' && '👀 Track the targets smoothly...'}
        {phase === 'select' && '✋ Tap to select the original target spheres!'}
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          height: '280px',
          margin: '0 auto 16px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: `2px solid ${phase === 'moving' ? 'var(--accent-primary)' : 'var(--border-light)'}`,
          overflow: 'hidden',
        }}
      >
        {positions.map((obj) => {
          const isTarget = targets.has(obj.id);
          const isSelected = selectedIds.has(obj.id);
          const isHighlighting = phase === 'highlight' && isTarget;

          return (
            <button
              key={obj.id}
              onClick={() => toggleSelect(obj.id)}
              style={{
                position: 'absolute',
                left: `${obj.x}%`,
                top: `${obj.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: isHighlighting
                  ? 'var(--color-success)'
                  : isSelected
                  ? 'var(--accent-primary)'
                  : phase === 'moving'
                  ? 'var(--accent-primary-light)'
                  : 'var(--bg-base)',
                border: isHighlighting
                  ? '3px solid #FFFFFF'
                  : isSelected
                  ? '3px solid var(--accent-primary)'
                  : '2px solid var(--border-light)',
                boxShadow: isHighlighting ? '0 0 20px rgba(57,185,130,0.8)' : 'none',
                cursor: phase === 'select' ? 'pointer' : 'default',
                transition: phase === 'moving' ? 'none' : 'all 0.15s ease',
                fontSize: '14px',
                fontWeight: '800',
                color: isHighlighting || isSelected ? '#FFF' : 'var(--text-tertiary)',
              }}
            >
              {phase !== 'moving' ? obj.id + 1 : ''}
            </button>
          );
        })}
      </div>

      {phase === 'select' && (
        <NvButton
          variant="primary"
          size="lg"
          onClick={() => onRespond({ selectedIds: Array.from(selectedIds) })}
          style={{ width: '100%', maxWidth: '260px' }}
        >
          Submit My Targets ({selectedIds.size} selected)
        </NvButton>
      )}
    </div>
  );
};
