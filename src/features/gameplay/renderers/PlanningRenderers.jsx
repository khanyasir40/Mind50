import React, { useState, useEffect, useRef } from 'react';
import { NvButton } from '../../../components/ui/NvButton';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Volume2 } from 'lucide-react';

// GAME 21: WISCONSIN CARD SORTING (Adaptive Rule Sorting)
export const WisconsinCardRenderer = ({ challenge, onRespond }) => {
  const card = challenge.payload.card;
  const bins = challenge.payload.bins || [];
  const [feedback, setFeedback] = useState(null);
  const [lastSelectedId, setLastSelectedId] = useState(null);

  const handleSelectBin = (bin) => {
    if (feedback) return;
    const activeRule = challenge.payload.activeRule;
    let isCorrect = false;

    if (activeRule === 'COLOR') isCorrect = bin.color === card.color;
    if (activeRule === 'SHAPE') isCorrect = bin.shape === card.shape;
    if (activeRule === 'COUNT') isCorrect = bin.count === card.count;

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setLastSelectedId(bin.id);
    setTimeout(() => {
      onRespond({ selectedBinId: bin.id, isCorrect });
    }, 400);
  };

  const shapeIcon = (shape) => {
    const icons = { Circle: '◯', Square: '■', Triangle: '▲', Star: '★' };
    return icons[shape] || shape;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Deduce the hidden rule (Color / Shape / Count) by sorting the card:
      </div>

      {/* Active Card */}
      <div
        style={{
          width: '140px',
          height: '160px',
          margin: '0 auto 24px',
          background: 'var(--bg-surface)',
          border: '2px solid var(--accent-primary)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(108,77,255,0.2)',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '8px' }}>{card.color}</span>
        <div style={{ display: 'flex', gap: '4px', margin: '4px 0' }}>
          {Array.from({ length: card.count }).map((_, i) => (
            <span key={i} style={{ fontSize: '24px' }}>{shapeIcon(card.shape)}</span>
          ))}
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '6px' }}>×{card.count}</span>
      </div>

      {/* 4 Pile Bins */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', maxWidth: '440px', margin: '0 auto' }}>
        {bins.map((bin) => {
          const isSelected = lastSelectedId === bin.id;
          return (
            <button
              key={bin.id}
              onClick={() => handleSelectBin(bin)}
              style={{
                padding: '12px 6px',
                borderRadius: 'var(--radius-lg)',
                border: isSelected
                  ? `2px solid ${feedback === 'correct' ? 'var(--color-success)' : 'var(--color-error)'}`
                  : '2px solid var(--border-light)',
                background: isSelected
                  ? feedback === 'correct' ? 'rgba(57,185,130,0.1)' : 'rgba(232,93,117,0.1)'
                  : 'var(--bg-surface)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-primary)' }}>Pile {bin.id}</span>
              <div style={{ display: 'flex', gap: '2px', margin: '6px 0' }}>
                {Array.from({ length: bin.count }).map((_, i) => (
                  <span key={i} style={{ fontSize: '14px' }}>{shapeIcon(bin.shape)}</span>
                ))}
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{bin.color}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// GAME 22 & 23: TOWER OF HANOI & TOWER OF LONDON (Pure Move-Based, No Timer)
export const TowerRenderer = ({ challenge, onRespond }) => {
  const diskCount = challenge.payload.diskCount || 3;
  const minMoves = challenge.payload.minMoves || 7;
  const initialPegs = challenge.payload.initialPegs;

  const [pegs, setPegs] = useState(() => {
    if (initialPegs) {
      return initialPegs.map(peg => [...peg]);
    }
    const initialDisks = Array.from({ length: diskCount }, (_, i) => diskCount - i);
    return [initialDisks, [], []];
  });

  const [selectedPeg, setSelectedPeg] = useState(null);
  const [moves, setMoves] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialPegs) {
      setPegs(initialPegs.map(peg => [...peg]));
    } else {
      const initialDisks = Array.from({ length: diskCount }, (_, i) => diskCount - i);
      setPegs([initialDisks, [], []]);
    }
    setMoves(0);
    setSelectedPeg(null);
    setErrorMsg('');
  }, [challenge]);

  const diskColors = ['#E85D75', '#F0A83A', '#39B982', '#6C4DFF', '#06B6D4'];

  const handlePegClick = (pegIdx) => {
    setErrorMsg('');

    if (selectedPeg === null) {
      if (pegs[pegIdx].length === 0) {
        setErrorMsg('Empty peg — select a peg with disks!');
        return;
      }
      setSelectedPeg(pegIdx);
    } else {
      if (selectedPeg === pegIdx) {
        setSelectedPeg(null);
        return;
      }

      const sourceDisks = [...pegs[selectedPeg]];
      const destDisks = [...pegs[pegIdx]];
      const movingDisk = sourceDisks[sourceDisks.length - 1];
      const topDestDisk = destDisks.length > 0 ? destDisks[destDisks.length - 1] : Infinity;

      if (movingDisk > topDestDisk) {
        setErrorMsg('Cannot place larger disk on smaller disk!');
        setSelectedPeg(null);
        return;
      }

      sourceDisks.pop();
      destDisks.push(movingDisk);

      const nextPegs = [...pegs];
      nextPegs[selectedPeg] = sourceDisks;
      nextPegs[pegIdx] = destDisks;
      const nextMoves = moves + 1;

      setPegs(nextPegs);
      setMoves(nextMoves);
      setSelectedPeg(null);

      // Check solved: all disks on Peg 3 (or target pegs match)
      const allOnLast = nextPegs[2].length === diskCount;
      if (allOnLast) {
        setTimeout(() => onRespond({ isSolved: true, movesCount: nextMoves }), 500);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        Move all disks to <strong style={{ color: 'var(--accent-primary)' }}>Peg 3</strong> — larger disks never on smaller.
        Moves: <strong style={{ color: moves > minMoves ? 'var(--color-error)' : 'var(--accent-primary)' }}>{moves}</strong> / Optimal: <strong>{minMoves}</strong>
      </div>

      {errorMsg && (
        <div style={{ fontSize: '12px', color: 'var(--color-error)', fontWeight: '700', marginBottom: '8px' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          height: '200px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          padding: '20px 12px 10px',
          marginBottom: '16px',
          alignItems: 'end',
        }}
      >
        {pegs.map((diskStack, pegIdx) => {
          const isSelected = selectedPeg === pegIdx;

          return (
            <button
              key={pegIdx}
              onClick={() => handlePegClick(pegIdx)}
              style={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column-reverse',
                alignItems: 'center',
                background: isSelected ? 'var(--accent-primary-light)' : 'transparent',
                border: isSelected ? '2px dashed var(--accent-primary)' : '1px solid transparent',
                borderRadius: 'var(--radius-lg)',
                padding: '4px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {/* Peg pole */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '28px',
                  width: '6px',
                  height: '120px',
                  background: 'var(--border-light)',
                  borderRadius: '3px',
                  zIndex: 1,
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', marginTop: '6px', zIndex: 2 }}>
                Peg {pegIdx + 1}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: '3px', width: '100%', zIndex: 2, marginBottom: '22px' }}>
                {diskStack.map((diskSize) => {
                  const widthPct = 28 + diskSize * 14;
                  const color = diskColors[(diskSize - 1) % diskColors.length];
                  return (
                    <div
                      key={diskSize}
                      style={{
                        width: `${widthPct}%`,
                        height: '20px',
                        borderRadius: '5px',
                        background: color,
                        boxShadow: `0 2px 6px ${color}66`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFF',
                        fontSize: '10px',
                        fontWeight: '800',
                      }}
                    >
                      {diskSize}
                    </div>
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
        Tap source peg → then tap destination peg to move top disk. (Move-Based, No Time Limit)
      </p>
    </div>
  );
};

// GAME 24: RULE SWITCHING — 4 Dynamic Cognitive Dimensions (Multi-Color)
export const RuleSwitchingRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  const colorHex = challenge.payload.colorHex || '#6C4DFF';
  const isTop = challenge.payload.isTop;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ padding: '8px 24px', background: 'var(--accent-primary)', color: '#FFF', borderRadius: 'var(--radius-full)', display: 'inline-block', fontSize: '14px', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', boxShadow: '0 4px 15px rgba(108,77,255,0.4)' }}>
        ⚡ CUE: {challenge.payload.cue}
      </div>
      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        {challenge.payload.instruction}
      </div>

      {/* Spatial arena container for TOP/BOTTOM/COLOR location cues */}
      <div style={{ height: '140px', display: 'flex', flexDirection: 'column', justifyContent: isTop ? 'flex-start' : 'flex-end', alignItems: 'center', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', padding: '16px', marginBottom: '24px' }}>
        <div style={{ fontSize: '64px', fontWeight: '900', color: colorHex, textShadow: `0 0 25px ${colorHex}88`, transition: 'all 0.2s ease' }}>
          {challenge.payload.number}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '340px', margin: '0 auto' }}>
        <NvButton variant="secondary" size="lg" onClick={() => onRespond({ selectedSide: 'LEFT', reactionTimeMs: Date.now() - startRef.current })}>
          <ArrowLeft size={20} /> {challenge.payload.leftLabel}
        </NvButton>
        <NvButton variant="secondary" size="lg" onClick={() => onRespond({ selectedSide: 'RIGHT', reactionTimeMs: Date.now() - startRef.current })}>
          {challenge.payload.rightLabel} <ArrowRight size={20} />
        </NvButton>
      </div>
    </div>
  );
};

// GAME 25: DUAL TASK MULTITASKING — Web Audio Pitch Synthesizer (No Text Answers)
export const DualTaskRenderer = ({ challenge, onRespond }) => {
  const [dotPosX, setDotPosX] = useState(50);
  const targetZoneMin = challenge.payload.trackingTargetX - 15;
  const targetZoneMax = challenge.payload.trackingTargetX + 15;
  const driftInterval = useRef(null);
  const audioCtxRef = useRef(null);

  // Play synthesized Web Audio pitch tone
  const playPitchTone = (freq) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq || challenge.payload.frequencyHz || 440, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setDotPosX(50);
    playPitchTone(challenge.payload.frequencyHz);

    const drift = challenge.payload.driftSpeedPct || 3;
    let dir = 1;
    driftInterval.current = setInterval(() => {
      setDotPosX(prev => {
        let next = prev + dir * drift * 0.3;
        if (next > 88) { dir = -1; next = 88; }
        if (next < 12) { dir = 1; next = 12; }
        return next;
      });
    }, 150);

    return () => clearInterval(driftInterval.current);
  }, [challenge]);

  const moveDot = (delta) => setDotPosX((prev) => Math.max(10, Math.min(90, prev + delta)));
  const isCentered = dotPosX >= targetZoneMin && dotPosX <= targetZoneMax;

  const handleToneResponse = (tone) => {
    clearInterval(driftInterval.current);
    onRespond({
      trackingAccuracy: isCentered ? 100 : Math.max(0, 100 - Math.abs(dotPosX - challenge.payload.trackingTargetX) * 3),
      selectedTone: tone,
    });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Task A: Keep the dot <strong style={{ color: 'var(--accent-primary)' }}>inside the green portal</strong> while listening!
      </div>

      {/* Visual Tracking Arena */}
      <div style={{ position: 'relative', height: '110px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', overflow: 'hidden', marginBottom: '12px' }}>
        <div style={{ position: 'absolute', left: `${targetZoneMin}%`, width: '30%', height: '100%', background: 'rgba(57,185,130,0.15)', borderLeft: '2px solid var(--color-success)', borderRight: '2px solid var(--color-success)' }} />
        <div
          style={{
            position: 'absolute',
            left: `${dotPosX}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: isCentered ? 'var(--color-success)' : 'var(--color-error)',
            boxShadow: `0 0 20px ${isCentered ? 'rgba(57,185,130,0.6)' : 'rgba(232,93,117,0.6)'}`,
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
        <NvButton variant="secondary" size="sm" onClick={() => moveDot(-18)}>◀ Move Left</NvButton>
        <NvButton variant="secondary" size="sm" onClick={() => moveDot(18)}>Move Right ▶</NvButton>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>Task B: Auditory Pitch Listening</span>
        <button
          onClick={() => playPitchTone(challenge.payload.frequencyHz)}
          style={{ padding: '6px 14px', background: 'var(--accent-primary-light)', border: 'none', borderRadius: 'var(--radius-full)', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: '700', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Volume2 size={16} /> Replay Tone
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
        <NvButton variant="primary" size="lg" onClick={() => handleToneResponse('HIGH')}>HIGH Pitch (880Hz) 🔊</NvButton>
        <NvButton variant="primary" size="lg" onClick={() => handleToneResponse('LOW')}>LOW Pitch (220Hz) 🔈</NvButton>
      </div>
    </div>
  );
};

// GAME 26: CATEGORY SEMANTIC SORTING
export const CategorySortingRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Sort the word into the correct category:</div>
      <div style={{ fontSize: '48px', fontWeight: '900', color: 'var(--accent-primary)', margin: '16px 0 32px', textShadow: '0 0 20px rgba(108,77,255,0.3)' }}>
        {challenge.payload.item}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(challenge.payload.options.length, 3)}, 1fr)`, gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
        {challenge.payload.options.map((cat) => (
          <NvButton
            key={cat}
            variant="secondary"
            size="lg"
            onClick={() => onRespond({ selectedCategory: cat, reactionTimeMs: Date.now() - startRef.current })}
          >
            {cat}
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// GAME 27: LABYRINTH ROUTE PLANNING
export const MazePlanningRenderer = ({ challenge, onRespond }) => {
  const gridDim = challenge.payload.gridDim || 5;
  const walls = new Set(challenge.payload.walls || []);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [steps, setSteps] = useState(0);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    setPlayerPos({ x: 0, y: 0 });
    setSteps(0);
    setBlocked(false);
  }, [challenge]);

  const movePlayer = (dx, dy) => {
    const nextX = Math.max(0, Math.min(gridDim - 1, playerPos.x + dx));
    const nextY = Math.max(0, Math.min(gridDim - 1, playerPos.y + dy));
    const wallKey = `${nextX},${nextY}`;

    if (walls.has(wallKey)) {
      setBlocked(true);
      setTimeout(() => setBlocked(false), 400);
      return;
    }

    setPlayerPos({ x: nextX, y: nextY });
    const nextSteps = steps + 1;
    setSteps(nextSteps);

    if (nextX === gridDim - 1 && nextY === gridDim - 1) {
      setTimeout(() => onRespond({ reachedExit: true, stepsCount: nextSteps }), 350);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        Navigate 🟢 to the Exit 🏁 — avoid walls! Steps: <strong style={{ color: 'var(--accent-primary)' }}>{steps}</strong>
        {blocked && <span style={{ color: 'var(--color-error)', marginLeft: '8px' }}>⚠️ Blocked!</span>}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridDim}, 1fr)`,
          gap: '3px',
          maxWidth: '280px',
          margin: '0 auto 20px',
          background: 'var(--bg-surface)',
          padding: '8px',
          borderRadius: 'var(--radius-xl)',
          border: '2px solid var(--border-light)',
        }}
      >
        {Array.from({ length: gridDim * gridDim }).map((_, idx) => {
          const x = idx % gridDim;
          const y = Math.floor(idx / gridDim);
          const isPlayer = playerPos.x === x && playerPos.y === y;
          const isExit = x === gridDim - 1 && y === gridDim - 1;
          const isWall = walls.has(`${x},${y}`);

          return (
            <div
              key={idx}
              style={{
                aspectRatio: '1',
                borderRadius: '5px',
                background: isWall
                  ? 'var(--text-primary)'
                  : isPlayer
                  ? 'var(--accent-primary-light)'
                  : isExit
                  ? 'rgba(57,185,130,0.2)'
                  : 'var(--bg-base)',
                border: isExit ? '2px solid var(--color-success)' : '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              {isPlayer ? '🟢' : isExit ? '🏁' : isWall ? '' : ''}
            </div>
          );
        })}
      </div>

      {/* D-Pad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', maxWidth: '180px', margin: '0 auto' }}>
        <div />
        <NvButton variant="secondary" size="lg" onClick={() => movePlayer(0, -1)}><ArrowUp size={20} /></NvButton>
        <div />
        <NvButton variant="secondary" size="lg" onClick={() => movePlayer(-1, 0)}><ArrowLeft size={20} /></NvButton>
        <NvButton variant="secondary" size="lg" onClick={() => movePlayer(0, 1)}><ArrowDown size={20} /></NvButton>
        <NvButton variant="secondary" size="lg" onClick={() => movePlayer(1, 0)}><ArrowRight size={20} /></NvButton>
      </div>
    </div>
  );
};

// GAME 28: RESOURCE PLANNING
export const PlanningChallengeRenderer = ({ challenge, onRespond }) => {
  const [userSeq, setUserSeq] = useState([]);
  const tasks = challenge.payload.tasks || [];

  useEffect(() => {
    setUserSeq([]);
  }, [challenge]);

  const isAvailable = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;
    return task.req.every(r => userSeq.includes(r));
  };

  const addTask = (taskId) => {
    if (userSeq.includes(taskId)) return;
    if (!isAvailable(taskId)) return;
    const next = [...userSeq, taskId];
    setUserSeq(next);
    if (next.length === tasks.length) {
      onRespond({ userSequence: next });
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Arrange tasks in valid dependency order ({userSeq.join(' → ') || 'None yet'}):
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginBottom: '16px', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: 'var(--radius-md)', maxWidth: '380px', margin: '0 auto 16px', border: '1px solid var(--border-light)', textAlign: 'left' }}>
        {tasks.map(t => (
          <div key={t.id}>
            <strong style={{ color: 'var(--accent-primary)' }}>{t.name}</strong>
            {t.req.length > 0 ? ` → requires: ${t.req.join(', ')}` : ' → no prerequisites'}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '380px', margin: '0 auto' }}>
        {tasks.map((task) => {
          const isSelected = userSeq.includes(task.id);
          const canSelect = isAvailable(task.id) && !isSelected;
          return (
            <NvButton
              key={task.id}
              variant={isSelected ? 'primary' : canSelect ? 'secondary' : 'secondary'}
              size="lg"
              onClick={() => addTask(task.id)}
              style={{ opacity: isSelected ? 0.6 : canSelect ? 1 : 0.4 }}
            >
              {isSelected ? '✓ ' : canSelect ? '' : '🔒 '}
              {task.name}
            </NvButton>
          );
        })}
      </div>
    </div>
  );
};

// GAME 29 & 30: SERIAL SUBTRACTION & BACKWARD COUNTING
export const MathSequenceRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  const isSerialSub = challenge.payload.expected !== undefined && !challenge.payload.expectedSeq;
  const correctValue = isSerialSub ? challenge.payload.expected : challenge.payload.nextValue;

  const displayOptions = challenge.payload.options
    ? challenge.payload.options
    : [correctValue, correctValue + 3, correctValue - 5, correctValue + 8];

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        {isSerialSub
          ? `Calculate: ${challenge.payload.displayValue || `${challenge.payload.startValue} − ${challenge.payload.step}`} = ?`
          : 'What comes next in the sequence?'}
      </div>
      <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '28px', padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
        {challenge.payload.expectedSeq
          ? `${challenge.payload.expectedSeq.join(' , ')} , ?`
          : `${challenge.payload.displayValue || `${challenge.payload.startValue} − ${challenge.payload.step}`} = ?`}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '300px', margin: '0 auto' }}>
        {displayOptions.map((ans, idx) => (
          <NvButton
            key={idx}
            variant="secondary"
            size="lg"
            onClick={() => onRespond({ userAnswer: ans, reactionTimeMs: Date.now() - startRef.current })}
          >
            {ans}
          </NvButton>
        ))}
      </div>
    </div>
  );
};
