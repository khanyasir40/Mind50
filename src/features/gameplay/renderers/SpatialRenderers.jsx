import React, { useState, useEffect, useRef } from 'react';
import { NvButton } from '../../../components/ui/NvButton';

// Helper: Draw different asymmetric shapes for mirror/rotation games
const ShapeSVG = ({ type, rotation, mirrorX, size = 80, color = 'var(--accent-primary)' }) => {
  const transform = `rotate(${rotation || 0}, 50, 50) ${mirrorX ? 'scale(-1, 1) translate(-100, 0)' : ''}`;

  const paths = {
    F_SHAPE: 'M25 15 L25 85 M25 15 L70 15 M25 45 L60 45',
    L_SHAPE: 'M25 15 L25 85 L70 85',
    P_SHAPE: 'M25 15 L25 85 M25 15 L65 15 Q80 30 65 50 L25 50',
    L_BLOCK: 'M30 20 L30 75 L55 75 L55 65 L40 65 L40 20 Z',
    Z_BLOCK: 'M20 20 L60 20 L60 45 L80 45 L80 70 L40 70 L40 45 L20 45 Z',
    T_BLOCK: 'M10 20 L90 20 L90 40 L60 40 L60 80 L40 80 L40 40 L10 40 Z',
    CORNER_BLOCK: 'M20 20 L20 80 L80 80 L80 55 L45 55 L45 20 Z',
  };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <g transform={transform}>
        <path
          d={paths[type] || paths.L_SHAPE}
          fill={`${color}22`}
          stroke={color}
          strokeWidth="5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

// Helper: Render a 6×6 dot grid
const DotGrid = ({ dots, gridMax = 6 }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridMax}, 1fr)`, gap: '6px', padding: '10px' }}>
    {Array.from({ length: gridMax * gridMax }).map((_, i) => {
      const x = (i % gridMax) + 1;
      const y = Math.floor(i / gridMax) + 1;
      const hasDot = dots.some(d => d.x === x && d.y === y);
      return (
        <div
          key={i}
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: hasDot ? 'var(--accent-primary)' : 'var(--border-light)',
            boxShadow: hasDot ? '0 0 8px rgba(108,77,255,0.5)' : 'none',
          }}
        />
      );
    })}
  </div>
);

// GAME 37: 3D MENTAL ROTATION — uses actual shape paths
export const MentalRotationRenderer = ({ challenge, onRespond }) => {
  const shapeType = challenge.payload.shapeType || 'L_BLOCK';

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Select the option that matches the target when rotated in 3D (not mirrored):
      </div>

      {/* Target Figure */}
      <div style={{ width: '130px', height: '130px', margin: '0 auto 28px', background: 'var(--bg-surface)', border: '2px solid var(--accent-primary)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(108,77,255,0.2)' }}>
        <ShapeSVG type={shapeType} rotation={challenge.payload.targetRotation} size={90} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', maxWidth: '360px', margin: '0 auto' }}>
        {challenge.payload.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onRespond({ selectedId: opt.id })}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--border-light)',
              background: 'var(--bg-surface)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
            }}
          >
            <ShapeSVG type={shapeType} rotation={opt.rotation} mirrorX={opt.isMirror} size={70} />
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
              Figure {opt.id}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// GAME 38: BLOCK DESIGN RECONSTRUCTION (Tile Matching Canvas)
export const BlockDesignRenderer = ({ challenge, trialPhase, onRespond }) => {
  const dim = challenge.payload.dimension || 2;
  const targetPattern = challenge.payload.targetPattern || [];
  const tileTypes = ['SOLID_RED', 'SOLID_WHITE', 'SPLIT_DIAGONAL', 'SPLIT_ANTI_DIAGONAL'];

  const [userPattern, setUserPattern] = useState(() => Array(dim * dim).fill('SOLID_WHITE'));

  useEffect(() => {
    setUserPattern(Array(dim * dim).fill('SOLID_WHITE'));
  }, [challenge]);

  const cycleTile = (idx) => {
    if (trialPhase !== 'input') return;
    const next = [...userPattern];
    const currentIdx = tileTypes.indexOf(next[idx]);
    next[idx] = tileTypes[(currentIdx + 1) % tileTypes.length];
    setUserPattern(next);
  };

  const renderTile = (tile, onClick, size = 50) => {
    const tileStyle = {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '4px',
      border: '1px solid var(--border-light)',
      cursor: onClick ? 'pointer' : 'default',
      overflow: 'hidden',
      position: 'relative',
    };

    if (tile === 'SOLID_RED') {
      return <div style={{ ...tileStyle, background: 'var(--accent-primary)' }} onClick={onClick} />;
    }
    if (tile === 'SOLID_WHITE') {
      return <div style={{ ...tileStyle, background: 'var(--bg-base)' }} onClick={onClick} />;
    }
    // Diagonal split tiles
    return (
      <div style={tileStyle} onClick={onClick}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {tile === 'SPLIT_DIAGONAL' ? (
            <>
              <polygon points={`0,0 ${size},0 0,${size}`} fill="var(--accent-primary)" />
              <polygon points={`${size},0 ${size},${size} 0,${size}`} fill="var(--bg-base)" />
            </>
          ) : (
            <>
              <polygon points={`0,0 ${size},0 ${size},${size}`} fill="var(--bg-base)" />
              <polygon points={`0,0 0,${size} ${size},${size}`} fill="var(--accent-primary)" />
            </>
          )}
        </svg>
      </div>
    );
  };

  const cellSize = dim <= 2 ? 60 : 45;

  if (trialPhase === 'show') {
    return (
      <div style={{ textAlign: 'center' }} className="animate-fade-in">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '16px' }}>
          Memorize the pattern (3 Seconds)
        </div>
        <div style={{ display: 'inline-block', padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '3px solid var(--accent-primary)', boxShadow: '0 0 30px rgba(108,77,255,0.25)' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>TARGET GOAL</span>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${dim}, 1fr)`, gap: '6px' }}>
            {targetPattern.map((tile, i) => (
              <div key={i}>{renderTile(tile, null, cellSize)}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }} className="animate-fade-in">
      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Recreate the pattern from memory on Your Board (Tap tiles to cycle):
      </div>

      <div style={{ display: 'inline-block', padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '2px solid var(--accent-primary)', marginBottom: '24px' }}>
        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>YOUR BOARD</span>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${dim}, 1fr)`, gap: '6px' }}>
          {userPattern.map((tile, i) => (
            <div key={i}>{renderTile(tile, () => cycleTile(i), cellSize)}</div>
          ))}
        </div>
      </div>

      <div>
        <NvButton variant="primary" size="lg" onClick={() => onRespond({ userPattern })} style={{ width: '100%', maxWidth: '240px' }}>
          Submit Design
        </NvButton>
      </div>
    </div>
  );
};

// GAME 39: MIRROR IMAGE IDENTIFICATION — FIXED: no spoiler labels, show actual SVG shapes
export const MirrorImageRenderer = ({ challenge, onRespond }) => {
  const shapeType = challenge.payload.baseSvgType || 'F_SHAPE';

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Which option is the TRUE mirror reflection of the target?
      </div>

      {/* Target Shape */}
      <div style={{ margin: '0 auto 24px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>Original</span>
        <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '2px solid var(--accent-primary)' }}>
          <ShapeSVG type={shapeType} rotation={0} size={80} />
        </div>
      </div>

      {/* Options — no spoiler! Just show figures */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', maxWidth: '360px', margin: '0 auto' }}>
        {challenge.payload.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onRespond({ selectedId: opt.id })}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--border-light)',
              background: 'var(--bg-surface)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
            }}
          >
            {/* Render mirrored or rotated variants without revealing which is correct */}
            <ShapeSVG
              type={shapeType}
              rotation={opt.angle || 0}
              mirrorX={opt.isTrueMirror}
              size={70}
            />
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-tertiary)' }}>
              Option {opt.id}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// GAME 40: SPATIAL GRID ALIGNMENT — FIXED: actually renders dots
export const SpatialMatchingRenderer = ({ challenge, onRespond }) => {
  const originalDots = challenge.payload.originalDots || [];
  const candidateDots = challenge.payload.candidateDots || [];

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Are these two dot grids identical?
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '28px' }}>
        {/* Frame A */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Frame A</span>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
            <DotGrid dots={originalDots} />
          </div>
        </div>

        {/* Frame B */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Frame B</span>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--accent-primary)' }}>
            <DotGrid dots={candidateDots} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', maxWidth: '300px', margin: '0 auto' }}>
        <NvButton variant="secondary" size="lg" onClick={() => onRespond({ selectedOption: 'SAME' })}>
          ✓ SAME
        </NvButton>
        <NvButton variant="secondary" size="lg" onClick={() => onRespond({ selectedOption: 'DIFFERENT' })}>
          ✗ DIFFERENT
        </NvButton>
      </div>
    </div>
  );
};

// GAME 41: MAP ROUTE NAVIGATION
export const MapNavigationRenderer = ({ challenge, trialPhase, onRespond }) => {
  const [userSteps, setUserSteps] = useState([]);
  const routeSteps = challenge.payload.routeSteps || [];

  useEffect(() => {
    setUserSteps([]);
  }, [challenge]);

  const addStep = (dir) => {
    const next = [...userSteps, dir];
    setUserSteps(next);
    if (next.length === routeSteps.length) {
      onRespond({ userSteps: next });
    }
  };

  if (trialPhase === 'show') {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          🗺️ Memorize route turns:
        </div>
        <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-primary)', padding: '20px 28px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', display: 'inline-block', lineHeight: 1.6 }}>
          {routeSteps.map((step, i) => (
            <span key={i}>
              {step === 'Left' ? '↰' : step === 'Right' ? '↱' : '↑'} {step}
              {i < routeSteps.length - 1 ? ' → ' : ''}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Navigate the route ({userSteps.length}/{routeSteps.length}):
      </div>
      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '20px' }}>
        {routeSteps.map((_, i) => (
          <div
            key={i}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: i < userSteps.length ? 'var(--accent-primary)' : 'var(--border-light)',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
        {['Left', 'Straight', 'Right'].map((dir) => (
          <NvButton key={dir} variant="secondary" size="lg" onClick={() => addStep(dir)}>
            {dir === 'Left' ? '↰ Left' : dir === 'Right' ? 'Right ↱' : '↑ Straight'}
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// GAME 42: CHANGE BLINDNESS SCENE — FIXED: alternates between sceneA and sceneB
export const ChangeBlindnessRenderer = ({ challenge, onRespond }) => {
  const [showSceneA, setShowSceneA] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);

  const sceneA = challenge.payload.sceneA || [];
  const sceneB = challenge.payload.sceneB || [];

  useEffect(() => {
    setShowSceneA(true);
    setHasAnswered(false);

    // Alternate between scenes every 600ms
    const interval = setInterval(() => {
      setShowSceneA(prev => !prev);
    }, 600);

    return () => clearInterval(interval);
  }, [challenge]);

  const handleSelect = (itemId) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    onRespond({ selectedItemId: itemId });
  };

  const currentScene = showSceneA ? sceneA : sceneB;
  const SHAPE_MAP = { 1: '★', 2: '●', 3: '■', 4: '◆' };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        👁️ Spot the object that <strong style={{ color: 'var(--accent-primary)' }}>changes</strong> between flickering scenes — tap it!
      </div>
      <div
        style={{
          fontSize: '11px',
          fontWeight: '800',
          color: showSceneA ? 'var(--text-tertiary)' : 'var(--accent-primary)',
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        Scene {showSceneA ? 'A' : 'B'}
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          height: '240px',
          margin: '0 auto 20px',
          background: showSceneA ? 'var(--bg-surface)' : 'var(--bg-base)',
          borderRadius: 'var(--radius-xl)',
          border: '2px solid var(--border-light)',
          transition: 'background 0.05s',
          overflow: 'hidden',
        }}
      >
        {currentScene.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            style={{
              position: 'absolute',
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
              background: 'none',
              border: 'none',
              fontSize: `${item.size || 32}px`,
              cursor: 'pointer',
              color: item.color || 'var(--accent-primary)',
              transition: 'all 0.08s ease',
              lineHeight: 1,
              textShadow: `0 0 12px ${item.color || 'var(--accent-primary)'}55`,
            }}
          >
            {item.shape || '★'}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
        The scenes are alternating — find what is different and tap it!
      </p>
    </div>
  );
};
