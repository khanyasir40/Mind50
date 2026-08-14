import React, { useState, useEffect, useRef } from 'react';
import { NvButton } from '../../../components/ui/NvButton';

// 3D Voxel Isometric Polycube Renderer (Shepard-Metzler Polyomino Engine)
const rotateVoxel = (cubes, rotX, rotY, rotZ, mirrorX = false) => {
  return cubes.map(([x, y, z]) => {
    let nx = mirrorX ? -x : x;
    let ny = y;
    let nz = z;
    for (let r = 0; r < rotX; r++) { const tmp = ny; ny = -nz; nz = tmp; }
    for (let r = 0; r < rotY; r++) { const tmp = nx; nx = nz; nz = -tmp; }
    for (let r = 0; r < rotZ; r++) { const tmp = nx; nx = -ny; ny = tmp; }
    return [nx, ny, nz];
  });
};

const IsometricPolycubeSVG = ({ voxelList, rotX = 0, rotY = 0, rotZ = 0, mirrorX = false, size = 110 }) => {
  const poly = voxelList || [[0,0,0], [0,0,1], [0,0,2], [1,0,0]];
  const rotated = rotateVoxel(poly, rotX, rotY, rotZ, mirrorX);
  
  const sortedCubes = [...rotated].sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));

  const r = 14;
  const cos30 = 0.866025;
  const sin30 = 0.5;

  const width = size;
  const height = size;
  const cx = width / 2;
  const cy = height / 2 + 10;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {sortedCubes.map(([x, y, z], idx) => {
        const px = cx + (x - y) * (r * cos30 * 1.8);
        const py = cy + (x + y) * (r * sin30 * 1.8) - z * (r * 1.6);

        const dx = r * cos30;
        const dy = r * sin30;

        const topPts = `${px},${py - r} ${px + dx},${py - r + dy} ${px},${py} ${px - dx},${py - r + dy}`;
        const leftPts = `${px - dx},${py - r + dy} ${px},${py} ${px},${py + r} ${px - dx},${py + dy}`;
        const rightPts = `${px},${py} ${px + dx},${py - r + dy} ${px + dx},${py + dy} ${px},${py + r}`;

        return (
          <g key={idx}>
            <polygon points={topPts} fill="#A855F7" stroke="#3B0764" strokeWidth="1.5" />
            <polygon points={leftPts} fill="#6C4DFF" stroke="#3B0764" strokeWidth="1.5" />
            <polygon points={rightPts} fill="#3B0764" stroke="#1E1B4B" strokeWidth="1.5" />
          </g>
        );
      })}
    </svg>
  );
};

// Helper: Render 2D Shapes for Mirror Image game
const ShapeSVG = ({ type, rotation, mirrorX, size = 80, color = 'var(--accent-primary)' }) => {
  const transform = `rotate(${rotation || 0}, 50, 50) ${mirrorX ? 'scale(-1, 1) translate(-100, 0)' : ''}`;

  const paths = {
    F_SHAPE: 'M25 15 L25 85 M25 15 L70 15 M25 45 L60 45',
    L_SHAPE: 'M25 15 L25 85 L70 85',
    P_SHAPE: 'M25 15 L25 85 M25 15 L65 15 Q80 30 65 50 L25 50',
    L_BLOCK: 'M30 20 L30 75 L55 75 L55 65 L40 65 L40 20 Z',
    Z_BLOCK: 'M20 20 L60 20 L60 45 L80 45 L80 70 L40 70 L40 45 L20 45 Z',
    T_BLOCK: 'M10 20 L90 20 L90 40 L60 40 L60 80 L40 80 L40 40 L10 40 Z',
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

// GAME 37: 3D MENTAL ROTATION — 3D Isometric Polycube Block Figures
export const MentalRotationRenderer = ({ challenge, onRespond }) => {
  const baseVoxel = challenge.payload.baseVoxel || [[0,0,0], [0,0,1], [0,0,2], [1,0,0]];
  const targetRotX = challenge.payload.targetRotX || 0;
  const targetRotY = challenge.payload.targetRotY || 0;
  const targetRotZ = challenge.payload.targetRotZ || 0;

  const polycubes = {
    L_BLOCK: [[0,0,0], [0,0,1], [0,0,2], [1,0,0]],
    Z_BLOCK: [[0,0,0], [1,0,0], [1,0,1], [2,0,1]],
    T_BLOCK: [[0,0,0], [1,0,0], [2,0,0], [1,0,1]],
    CORNER:  [[0,0,0], [1,0,0], [0,1,0], [0,0,1]],
    SNAKE:   [[0,0,0], [1,0,0], [1,1,0], [1,1,1]],
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Which 3D figure matches the target when rotated in 3D space (not mirrored)?
      </div>

      {/* Target 3D Polycube Figure */}
      <div style={{ width: '140px', height: '140px', margin: '0 auto 24px', background: 'var(--bg-surface)', border: '2px solid var(--accent-primary)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(108,77,255,0.3)' }}>
        <IsometricPolycubeSVG voxelList={baseVoxel} rotX={targetRotX} rotY={targetRotY} rotZ={targetRotZ} size={110} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', maxWidth: '380px', margin: '0 auto' }}>
        {challenge.payload.options.map((opt) => {
          const optVoxel = opt.otherShapeKey ? polycubes[opt.otherShapeKey] : baseVoxel;
          return (
            <button
              key={opt.id}
              onClick={() => onRespond({ selectedId: opt.id })}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--border-light)',
                background: 'var(--bg-surface)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease',
              }}
            >
              <IsometricPolycubeSVG voxelList={optVoxel} rotX={opt.rotX} rotY={opt.rotY} rotZ={opt.rotZ} mirrorX={opt.isMirror} size={90} />
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                Figure {opt.id}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// GAME 38: BLOCK DESIGN RECONSTRUCTION
export const BlockDesignRenderer = ({ challenge, trialPhase, onRespond }) => {
  const gridSize = challenge.payload.gridSize || 2;
  const targetGrid = challenge.payload.targetGrid || [];
  const [userGrid, setUserGrid] = useState(() => Array(gridSize * gridSize).fill('SOLID_WHITE'));

  useEffect(() => {
    setUserGrid(Array(gridSize * gridSize).fill('SOLID_WHITE'));
  }, [challenge]);

  const cycleBlock = (idx) => {
    if (trialPhase !== 'input') return;
    const styles = ['SOLID_RED', 'SOLID_WHITE', 'SPLIT_DIAG_1', 'SPLIT_DIAG_2'];
    const next = [...userGrid];
    const currIdx = styles.indexOf(next[idx]);
    next[idx] = styles[(currIdx + 1) % styles.length];
    setUserGrid(next);
  };

  const renderBlock = (style) => {
    if (style === 'SOLID_RED') return <div style={{ width: '100%', height: '100%', background: '#E85D75' }} />;
    if (style === 'SOLID_WHITE') return <div style={{ width: '100%', height: '100%', background: '#FFFFFF' }} />;
    if (style === 'SPLIT_DIAG_1') return <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #E85D75 50%, #FFFFFF 50%)' }} />;
    return <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #E85D75 50%, #FFFFFF 50%)' }} />;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        {trialPhase === 'show' ? '🎯 Memorize the target block design pattern!' : '🧩 Tap blocks to reconstruct the design from memory!'}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '20px' }}>
        {trialPhase === 'show' && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: '4px', width: '160px', height: '160px', border: '3px solid var(--accent-primary)', padding: '6px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)' }}>
            {targetGrid.map((st, i) => (
              <div key={i} style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
                {renderBlock(st)}
              </div>
            ))}
          </div>
        )}

        {trialPhase === 'input' && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: '4px', width: '180px', height: '180px', border: '3px solid var(--accent-primary)', padding: '6px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)' }}>
            {userGrid.map((st, i) => (
              <div key={i} onClick={() => cycleBlock(i)} style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd', cursor: 'pointer' }}>
                {renderBlock(st)}
              </div>
            ))}
          </div>
        )}
      </div>

      {trialPhase === 'input' && (
        <NvButton variant="primary" size="lg" onClick={() => onRespond({ userGrid })} style={{ width: '100%', maxWidth: '240px' }}>
          Submit Reconstruction
        </NvButton>
      )}
    </div>
  );
};

// GAME 39: MIRROR IMAGE IDENTIFICATION
export const MirrorImageRenderer = ({ challenge, onRespond }) => {
  const targetShape = challenge.payload.targetShape || 'F_SHAPE';

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Select the true <strong style={{ color: 'var(--accent-primary)' }}>MIRROR REFLECTION</strong> of the target shape:
      </div>

      <div style={{ width: '110px', height: '110px', margin: '0 auto 24px', background: 'var(--bg-surface)', border: '2px solid var(--accent-primary)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ShapeSVG type={targetShape} size={80} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '340px', margin: '0 auto' }}>
        {challenge.payload.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onRespond({ selectedId: opt.id })}
            style={{ padding: '12px', borderRadius: 'var(--radius-lg)', border: '2px solid var(--border-light)', background: 'var(--bg-surface)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <ShapeSVG type={targetShape} rotation={opt.rotation} mirrorX={opt.isMirror} size={65} />
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', marginTop: '4px' }}>Option {opt.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// GAME 40: SPATIAL GRID ALIGNMENT
export const SpatialMatchingRenderer = ({ challenge, onRespond }) => {
  const targetDots = challenge.payload.targetDots || [];
  const [userDots, setUserDots] = useState([]);

  useEffect(() => {
    setUserDots([]);
  }, [challenge]);

  const toggleDot = (x, y) => {
    const next = [...userDots];
    const idx = next.findIndex(d => d.x === x && d.y === y);
    if (idx >= 0) next.splice(idx, 1);
    else next.push({ x, y });
    setUserDots(next);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Recreate the target dot alignment on the interactive grid:
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '360px', margin: '0 auto 20px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '4px' }}>TARGET</div>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '2px solid var(--accent-primary)', padding: '6px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
              {Array.from({ length: 25 }).map((_, i) => {
                const x = (i % 5) + 1;
                const y = Math.floor(i / 5) + 1;
                const hasDot = targetDots.some(d => d.x === x && d.y === y);
                return <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: hasDot ? 'var(--accent-primary)' : 'var(--border-light)', margin: 'auto' }} />;
              })}
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-success)', marginBottom: '4px' }}>YOUR GRID</div>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '2px solid var(--color-success)', padding: '6px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
              {Array.from({ length: 25 }).map((_, i) => {
                const x = (i % 5) + 1;
                const y = Math.floor(i / 5) + 1;
                const hasDot = userDots.some(d => d.x === x && d.y === y);
                return <div key={i} onClick={() => toggleDot(x, y)} style={{ width: '12px', height: '12px', borderRadius: '50%', background: hasDot ? 'var(--color-success)' : 'var(--border-light)', margin: 'auto', cursor: 'pointer' }} />;
              })}
            </div>
          </div>
        </div>
      </div>

      <NvButton variant="primary" size="lg" onClick={() => onRespond({ userDots })} style={{ width: '100%', maxWidth: '240px' }}>
        Submit Grid Alignment
      </NvButton>
    </div>
  );
};

// GAME 41: MAP ROUTE NAVIGATION
export const MapNavigationRenderer = ({ challenge, trialPhase, onRespond }) => {
  const route = challenge.payload.route || [];
  const [userSteps, setUserSteps] = useState([]);

  useEffect(() => {
    setUserSteps([]);
  }, [challenge]);

  const addStep = (turn) => {
    if (trialPhase !== 'input') return;
    const next = [...userSteps, turn];
    setUserSteps(next);
    if (next.length === route.length) {
      onRespond({ userSteps: next });
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        {trialPhase === 'show' ? '🗺️ Memorize route turns!' : `🧭 Enter route turns (${userSteps.length}/${route.length}):`}
      </div>

      {trialPhase === 'show' && (
        <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--accent-primary)', padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '2px solid var(--accent-primary)', maxWidth: '340px', margin: '0 auto 20px' }}>
          {route.join(' → ')}
        </div>
      )}

      {trialPhase === 'input' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
          <NvButton variant="secondary" size="lg" onClick={() => addStep('LEFT')}>◀ LEFT</NvButton>
          <NvButton variant="secondary" size="lg" onClick={() => addStep('STRAIGHT')}>▲ STRAIGHT</NvButton>
          <NvButton variant="secondary" size="lg" onClick={() => addStep('RIGHT')}>RIGHT ▶</NvButton>
        </div>
      )}
    </div>
  );
};

// GAME 42: CHANGE BLINDNESS SCENE
export const ChangeBlindnessRenderer = ({ challenge, onRespond }) => {
  const items = challenge.payload.items || [];
  const modifiedItems = challenge.payload.modifiedItems || [];
  const [showModified, setShowModified] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowModified(prev => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, [challenge]);

  const activeItems = showModified ? modifiedItems : items;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Tap the item that is <strong style={{ color: 'var(--accent-primary)' }}>CHANGING COLOR</strong> between flashes!
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', maxWidth: '340px', margin: '0 auto' }}>
        {activeItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onRespond({ selectedItemId: item.id })}
            style={{ aspectRatio: '1', borderRadius: 'var(--radius-lg)', border: `3px solid ${item.color}`, background: 'var(--bg-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', transition: 'all 0.1s' }}
          >
            {item.shape === 'Circle' ? '●' : item.shape === 'Square' ? '■' : item.shape === 'Triangle' ? '▲' : '★'}
          </button>
        ))}
      </div>
    </div>
  );
};
