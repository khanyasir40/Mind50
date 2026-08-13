import React, { useState } from 'react';
import { Eye, HelpCircle, Activity, RotateCcw, ShieldAlert, CheckCircle2, Play, Info } from 'lucide-react';
import { NvCard } from '../../components/ui/NvCard';
import { NvPill } from '../../components/ui/NvPill';
import { NvButton } from '../../components/ui/NvButton';
import { NvBottomSheet } from '../../components/ui/NvBottomSheet';

export const PerceptionLabScreen = () => {
  const [activeExperimentId, setActiveExperimentId] = useState('impossible_objects');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const experiments = [
    {
      id: 'impossible_objects',
      name: 'Impossible Trident & Triangle',
      category: 'Visual Paradox',
      summary: '3D shapes that exist visually in 2D perspective but are physically impossible in 3D space.',
      explanation: 'Your visual cortex attempts to stitch together 2D line projections into a coherent 3D volumetric model. When local depth cues conflict (e.g. 3 prongs merging into 2 bases), your brain continuously cycles through interpretations.',
    },
    {
      id: 'color_contrast',
      name: 'Checker Context & Shadow',
      category: 'Color Illusion',
      summary: 'Two squares of identical RGB hex values appear vastly different due to surrounding shadows.',
      explanation: 'The visual system is engineered for color constancy. Instead of measuring raw physical luminance, your brain subtracts estimated ambient lighting and shadow gradients before inferring surface brightness.',
    },
    {
      id: 'necker_cube',
      name: 'Necker Ambiguous Cube',
      category: 'Multistable Perception',
      summary: 'A wireframe cube that spontaneously flips its orientation as you observe it.',
      explanation: 'Because parallel 2D projections lack explicit depth depth cues, the visual cortex maintains two equally probable 3D perceptual hypotheses, resulting in bistable neural switching every few seconds.',
    },
    {
      id: 'ebbinghaus',
      name: 'Ebbinghaus Size Illusion',
      category: 'Size & Context',
      summary: 'Two central circles of identical diameter look different based on surrounding outer circles.',
      explanation: 'Relative size processing occurs early in the ventral stream (V1/V4). Surrounding large objects expand the comparison frame, making the target appear smaller.',
    },
    {
      id: 'motion_snakes',
      name: 'Peripheral Motion Drift',
      category: 'Motion Perception',
      summary: 'Static repeating patterns appear to rotate in your peripheral vision.',
      explanation: 'Asymmetric luminance gradients trigger micro-saccadic eye movements that activate motion-sensitive V5/MT neurons unequally in high-contrast transitions.',
    },
  ];

  const activeExp = experiments.find((e) => e.id === activeExperimentId) || experiments[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Perception Lab
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Explore visual illusions, depth paradoxes, and sensory processing mechanics.
          </p>
        </div>

        {/* Accessibility Toggle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(e) => setReducedMotion(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
          />
          Reduced Motion
        </label>
      </div>

      {/* Experiment Selection Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {experiments.map((exp) => (
          <NvPill
            key={exp.id}
            active={activeExperimentId === exp.id}
            onClick={() => setActiveExperimentId(exp.id)}
          >
            {exp.name}
          </NvPill>
        ))}
      </div>

      {/* Interactive Experiment Arena */}
      <NvCard padding="28px" variant="hero" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <NvButton variant="pill" size="sm" icon={HelpCircle} onClick={() => setShowExplanation(true)}>
            How it works
          </NvButton>
        </div>

        {/* Dynamic Interactive Visual Canvas according to active experiment */}
        {activeExperimentId === 'impossible_objects' && (
          <div style={{ textAlign: 'center' }}>
            <svg width="220" height="200" viewBox="0 0 220 200" style={{ margin: '0 auto', display: 'block' }}>
              {/* Penrose-style Impossible Triangle SVG */}
              <polygon points="110,20 180,150 40,150" fill="none" stroke="var(--accent-primary)" strokeWidth="12" strokeLinejoin="round" />
              <path d="M110,20 L130,55 L75,130 L160,130 L180,150 L40,150 Z" fill="rgba(108, 77, 255, 0.25)" />
              <path d="M110,20 L180,150 L140,150 L95,65 Z" fill="rgba(168, 85, 247, 0.4)" />
            </svg>
            <p style={{ marginTop: '16px', fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
              The Penrose Impossible Triangle
            </p>
          </div>
        )}

        {activeExperimentId === 'color_contrast' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              <div style={{ width: '90px', height: '90px', background: '#888888', border: '12px solid #111111', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: '800' }}>
                Square A
              </div>
              <div style={{ width: '90px', height: '90px', background: '#888888', border: '12px solid #FFFFFF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: '800' }}>
                Square B
              </div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '340px' }}>
              Both central squares share the exact same RGB (#888888) value, yet Square A appears lighter due to contrast framing!
            </p>
          </div>
        )}

        {activeExperimentId === 'necker_cube' && (
          <div style={{ textAlign: 'center' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <rect x="30" y="30" width="90" height="90" fill="none" stroke="var(--accent-primary)" strokeWidth="4" />
              <rect x="60" y="60" width="90" height="90" fill="none" stroke="var(--accent-secondary)" strokeWidth="4" />
              <line x1="30" y1="30" x2="60" y2="60" stroke="var(--text-primary)" strokeWidth="3" />
              <line x1="120" y1="30" x2="150" y2="60" stroke="var(--text-primary)" strokeWidth="3" />
              <line x1="30" y1="120" x2="60" y2="150" stroke="var(--text-primary)" strokeWidth="3" />
              <line x1="120" y1="120" x2="150" y2="150" stroke="var(--text-primary)" strokeWidth="3" />
            </svg>
            <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Stare at the central box: Notice how the front and back faces periodically switch depth!
            </p>
          </div>
        )}

        {activeExperimentId === 'ebbinghaus' && (
          <div style={{ display: 'flex', gap: '60px', alignItems: 'center', justifyContent: 'center' }}>
            {/* Surrounded by small dots */}
            <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <div
                  key={deg}
                  style={{
                    position: 'absolute',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'var(--text-tertiary)',
                    transform: `rotate(${deg}deg) translate(36px)`,
                  }}
                />
              ))}
            </div>

            {/* Surrounded by huge dots */}
            <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
              {[0, 72, 144, 216, 288].map((deg) => (
                <div
                  key={deg}
                  style={{
                    position: 'absolute',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--text-tertiary)',
                    transform: `rotate(${deg}deg) translate(46px)`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {activeExperimentId === 'motion_snakes' && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'conic-gradient(#111 0deg 30deg, #FFF 30deg 60deg, #6C4DFF 60deg 90deg, #EEE 90deg 120deg, #111 120deg 150deg, #FFF 150deg 180deg)',
                margin: '0 auto',
                animation: reducedMotion ? 'none' : 'floatSlow 4s ease-in-out infinite',
              }}
            />
            <p style={{ marginTop: '14px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Look slightly to the side of the wheel: Asymmetric contrast tricks your motion system.
            </p>
          </div>
        )}
      </NvCard>

      {/* Explanation Sheet */}
      <NvBottomSheet
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        title={activeExp.name}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <NvPill active>{activeExp.category}</NvPill>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
              What You Are Experiencing
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {activeExp.summary}
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--bg-pill)', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '6px' }}>
              Neural Mechanics ("How It Works")
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {activeExp.explanation}
            </p>
          </div>

          <div style={{ padding: '12px', background: 'var(--color-warning-bg)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="var(--color-warning)" />
            <span style={{ fontSize: '12px', color: 'var(--color-warning)', fontWeight: '600' }}>
              NeuroVault perception demonstrations are educational games and not diagnostic tests.
            </span>
          </div>
        </div>
      </NvBottomSheet>
    </div>
  );
};
