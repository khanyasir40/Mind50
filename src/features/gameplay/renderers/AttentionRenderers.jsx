import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NvButton } from '../../../components/ui/NvButton';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// GAME 11: STROOP SPRINT
export const StroopRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        Select the <strong style={{ color: 'var(--accent-primary)' }}>INK COLOR</strong> — ignore the word!
      </div>
      <div
        style={{
          fontSize: '72px',
          fontWeight: '900',
          color: challenge.payload.inkColorHex,
          textTransform: 'uppercase',
          marginBottom: '36px',
          textShadow: `0 0 30px ${challenge.payload.inkColorHex}66`,
          letterSpacing: '2px',
        }}
      >
        {challenge.payload.wordText}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: challenge.payload.options.length > 4 ? '1fr 1fr 1fr' : '1fr 1fr',
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

// GAME 12 & 13: TRAIL MAKING A & B — with connection lines, wrong-tap red feedback, and trial timer
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
      // Correct tap
      const next = [...userClicks, pt.label];
      setWrongLabel(null);
      // Draw line from last to current
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
      // Wrong tap — flash red
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
        {/* Connection Lines SVG */}
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

// GAME 14: GO / NO-GO RESPONSE — FIXED: auto-timeout for NO_GO trials
export const GoNoGoRenderer = ({ challenge, onRespond }) => {
  const hasResponded = useRef(false);
  const stimulus = challenge.payload.stimulus;
  const durationMs = challenge.payload.autoSubmitAfterMs || (challenge.payload.durationMs + 200) || 1600;

  useEffect(() => {
    hasResponded.current = false;

    // Auto-submit NO_GO after duration (no tap = correct for NO_GO)
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
      <div
        onClick={handleTap}
        style={{
          height: '240px',
          borderRadius: 'var(--radius-xl)',
          background: stimulus.color,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          cursor: stimulus.type === 'GO' ? 'pointer' : 'not-allowed',
          boxShadow: `0 10px 30px ${stimulus.color}66`,
          animation: 'fadeInScale 0.15s ease-out',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: '56px', fontWeight: '900' }}>{stimulus.label}</span>
        <span style={{ fontSize: '15px', opacity: 0.9, marginTop: '10px', fontWeight: '600' }}>
          {stimulus.type === 'GO' ? '👆 Tap the screen!' : '🛑 Do NOT tap!'}
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

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Which direction is the <strong style={{ color: 'var(--accent-primary)' }}>CENTER</strong> arrow?
      </div>
      <div
        style={{
          fontSize: '54px',
          fontWeight: '900',
          color: 'var(--accent-primary)',
          letterSpacing: '14px',
          marginBottom: '44px',
          textShadow: '0 0 20px rgba(108,77,255,0.35)',
        }}
      >
        {challenge.payload.displayString}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '320px', margin: '0 auto' }}>
        <NvButton
          variant="primary"
          size="lg"
          onClick={() => onRespond({ selectedDirection: 'left', reactionTimeMs: Date.now() - startRef.current })}
        >
          <ArrowLeft size={24} /> Left
        </NvButton>
        <NvButton
          variant="primary"
          size="lg"
          onClick={() => onRespond({ selectedDirection: 'right', reactionTimeMs: Date.now() - startRef.current })}
        >
          Right <ArrowRight size={24} />
        </NvButton>
      </div>
    </div>
  );
};

// GAME 16: SIMON INTERFERENCE TASK — handles both 2-button and 4-button hard mode
export const SimonRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  const buttonOptions = challenge.payload.buttonOptions || ['LEFT', 'RIGHT'];
  const isHardMode = challenge.payload.isHardMode;

  // Position mapping for screen position
  const positionMap = {
    LEFT: '15%',
    RIGHT: '75%',
    CENTER: '45%',
    FAR_RIGHT: '88%',
  };
  const dotLeft = positionMap[challenge.payload.screenSide] || '50%';

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Press the button matching <strong style={{ color: 'var(--accent-primary)' }}>{challenge.payload.colorName}</strong> — ignore position!
      </div>

      {/* Screen area with dot */}
      <div style={{ position: 'relative', height: '160px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', marginBottom: '20px', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: dotLeft,
            transform: 'translate(-50%, -50%)',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: challenge.payload.colorHex,
            boxShadow: `0 0 30px ${challenge.payload.colorHex}99`,
            transition: 'none',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isHardMode ? '1fr 1fr' : '1fr 1fr', gap: '12px', maxWidth: '360px', margin: '0 auto' }}>
        {buttonOptions.map((btn) => (
          <NvButton
            key={btn}
            variant="secondary"
            size="lg"
            onClick={() => onRespond({ selectedButton: btn, reactionTimeMs: Date.now() - startRef.current })}
          >
            {btn} Button
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// GAME 17: VISUAL SEARCH MATRIX — ENHANCED with dynamic color & rotation
export const VisualSearchRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  const gridCols = challenge.payload.gridCols || 4;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        Find the unique target: <strong style={{ color: 'var(--accent-primary)', fontSize: '24px' }}>{challenge.payload.targetSymbol}</strong>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gap: '8px',
          maxWidth: '380px',
          margin: '0 auto',
        }}
      >
        {challenge.payload.items.map((item, idx) => {
          const symbol = typeof item === 'string' ? item : item.symbol;
          const color = typeof item === 'object' ? item.color : 'var(--text-primary)';
          const rotation = typeof item === 'object' ? item.rotation : 0;

          return (
            <button
              key={idx}
              onClick={() => onRespond({ selectedIndex: idx, reactionTimeMs: Date.now() - startRef.current })}
              style={{
                aspectRatio: '1',
                borderRadius: '12px',
                border: `2px solid ${color}33`,
                background: 'var(--bg-surface)',
                fontSize: '22px',
                fontWeight: '800',
                color: color,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${color}15`,
              }}
            >
              <span style={{ transform: `rotate(${rotation}deg)`, display: 'inline-block' }}>
                {symbol}
              </span>
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

// GAME 19: CONTINUOUS PERFORMANCE — FIXED: uses targetIndices for correct scoring
export const ContinuousPerformanceRenderer = ({ challenge, onRespond }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [taps, setTaps] = useState([]);
  const [prevLetter, setPrevLetter] = useState('');
  const hasFinished = useRef(false);
  const stream = challenge.payload.stream || [];

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
          if (!hasFinished.current) {
            hasFinished.current = true;
            // Submit on last letter shown
          }
          return prev;
        }
        setPrevLetter(stream[prev]);
        return next;
      });
    }, intervalMs);

    // Auto-submit after stream ends
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
    setTaps(prev => {
      const next = [...prev, currentIndex];
      return next;
    });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        Tap ONLY when <strong style={{ color: 'var(--accent-primary)' }}>X</strong> immediately follows <strong style={{ color: 'var(--accent-primary)' }}>A</strong>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '8px' }}>
        {/* Previous letter */}
        <div style={{ textAlign: 'center', opacity: 0.5 }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>PREV</div>
          <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--text-secondary)', width: '60px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {prevLetter || '—'}
          </div>
        </div>
        {/* Current letter */}
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
            className="animate-scale-up"
          >
            {stream[currentIndex] || '—'}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
        Letter {currentIndex + 1} of {stream.length} | Taps: {taps.length}
      </div>
      <NvButton variant="primary" size="lg" onClick={handleTap} style={{ width: '100%', maxWidth: '300px' }}>
        ⚡ TAP! (A→X)
      </NvButton>
    </div>
  );
};

// GAME 20: MULTIPLE OBJECT TRACKING — FIXED: actual animated moving objects
export const MultipleObjectTrackingRenderer = ({ challenge, onRespond }) => {
  const [phase, setPhase] = useState('highlight'); // 'highlight', 'moving', 'select'
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

    // Initialize positions
    const initPos = objects.map(obj => ({
      id: obj.id,
      x: obj.x,
      y: obj.y,
      vx: obj.vx,
      vy: obj.vy,
    }));
    posRef.current = initPos;
    setPositions(initPos);

    // Phase 1: Highlight targets for 2.5s
    const t1 = setTimeout(() => {
      setPhase('moving');
      phaseRef.current = 'moving';

      // Animate objects
      const startTime = Date.now();
      const duration = challenge.payload.motionDurationMs || 4000;

      const animate = () => {
        if (phaseRef.current !== 'moving') return;

        posRef.current = posRef.current.map(obj => {
          let { x, y, vx, vy } = obj;
          x += vx * 0.4;
          y += vy * 0.4;

          // Bounce off walls
          if (x < 8 || x > 92) { vx = -vx; x = Math.max(8, Math.min(92, x)); }
          if (y < 8 || y > 92) { vy = -vy; y = Math.max(8, Math.min(92, y)); }

          return { ...obj, x, y, vx, vy };
        });

        setPositions([...posRef.current]);

        if (Date.now() - startTime < duration) {
          animRef.current = requestAnimationFrame(animate);
        }
      };

      animRef.current = requestAnimationFrame(animate);

      // Phase 2: Select after motion
      const t2 = setTimeout(() => {
        cancelAnimationFrame(animRef.current);
        setPhase('select');
        phaseRef.current = 'select';
      }, duration);

      return () => clearTimeout(t2);
    }, challenge.payload.highlightDurationMs || 2500);

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
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: '700' }}>
        {phase === 'highlight' && '🎯 Memorize highlighted targets!'}
        {phase === 'moving' && '👀 Track the targets as they move...'}
        {phase === 'select' && '✋ Select the original target spheres!'}
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
