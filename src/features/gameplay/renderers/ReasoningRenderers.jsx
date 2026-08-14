import React, { useState, useRef, useEffect } from 'react';
import { NvButton } from '../../../components/ui/NvButton';
import { Check, X } from 'lucide-react';

// Shape icon helper for matrix cells
const cellIcon = (label) => {
  const icons = {
    '○': '○', '○○': '○○', '○○○': '○○○',
    '□': '□', '□□': '□□', '□□□': '□□□',
    '★': '★', '★★': '★★', '★★★': '★★★',
    '●○○': '●○○', '○●○': '○●○', '○○●': '○○●',
    '?': '?',
  };
  return icons[label] || label;
};

// GAME 43: MATRIX PATTERN REASONING — ENHANCED with randomized matrices
export const RavenMatrixRenderer = ({ challenge, onRespond }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
      Which option completes the pattern? (Rule: <em style={{ color: 'var(--accent-primary)' }}>{challenge.payload.rule}</em>)
    </div>

    {/* 3×3 Matrix Grid */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        maxWidth: '340px',
        margin: '0 auto 24px',
        background: 'var(--bg-surface)',
        padding: '12px',
        borderRadius: 'var(--radius-xl)',
        border: '2px solid var(--border-light)',
      }}
    >
      {challenge.payload.matrixGrid.flat().map((cell, idx) => (
        <div
          key={idx}
          style={{
            padding: '16px 4px',
            background: cell === '?' ? 'var(--accent-primary-light)' : 'var(--bg-base)',
            borderRadius: 'var(--radius-md)',
            fontSize: cell === '?' ? '22px' : '13px',
            fontWeight: '800',
            color: cell === '?' ? 'var(--accent-primary)' : 'var(--text-primary)',
            border: cell === '?' ? '2px dashed var(--accent-primary)' : '1px solid var(--border-subtle)',
            minHeight: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            letterSpacing: '2px',
          }}
        >
          {cellIcon(cell)}
        </div>
      ))}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '340px', margin: '0 auto' }}>
      {challenge.payload.options.map((opt) => (
        <NvButton key={opt} variant="secondary" size="lg" onClick={() => onRespond({ selectedAnswer: opt })}>
          {cellIcon(opt)}
        </NvButton>
      ))}
    </div>
  </div>
);

// GAME 44: VISUAL PATTERN COMPLETION — ENHANCED with pattern descriptions
export const PatternCompletionRenderer = ({ challenge, onRespond }) => {
  const patternIdx = challenge.payload.patternIndex || 0;

  // Different SVG patterns
  const patterns = [
    // Pinwheel
    <svg key="0" width="120" height="120" viewBox="0 0 100 100">
      <path d="M50 10 Q70 30 50 50 Q30 30 50 10 Z" fill="rgba(108,77,255,0.3)" stroke="var(--accent-primary)" strokeWidth="2" />
      <path d="M90 50 Q70 70 50 50 Q70 30 90 50 Z" fill="rgba(108,77,255,0.3)" stroke="var(--accent-primary)" strokeWidth="2" />
      <path d="M50 90 Q30 70 50 50 Q70 70 50 90 Z" fill="rgba(108,77,255,0.3)" stroke="var(--accent-primary)" strokeWidth="2" />
      <rect x="60" y="60" width="36" height="36" fill="var(--bg-base)" stroke="var(--accent-primary)" strokeWidth="2" strokeDasharray="4 2" />
      <text x="78" y="82" fontSize="14" fill="var(--accent-primary)" fontWeight="900" textAnchor="middle">?</text>
    </svg>,
    // Checkerboard
    <svg key="1" width="120" height="120" viewBox="0 0 100 100">
      {[0,1,2,3].map(row => [0,1,2,3].map(col => {
        const dark = (row + col) % 2 === 0;
        const isQuestion = row >= 2 && col >= 2;
        return (
          <rect key={`${row}-${col}`} x={col*25} y={row*25} width="25" height="25"
            fill={isQuestion ? 'var(--bg-base)' : dark ? 'var(--accent-primary)' : 'var(--bg-base)'}
            stroke="var(--border-light)" strokeWidth="1"
          />
        );
      }))}
      <rect x="50" y="50" width="50" height="50" fill="transparent" stroke="var(--accent-primary)" strokeWidth="2" strokeDasharray="4 2" />
      <text x="75" y="80" fontSize="14" fill="var(--accent-primary)" fontWeight="900" textAnchor="middle">?</text>
    </svg>,
    // Concentric rings
    <svg key="2" width="120" height="120" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent-primary)" strokeWidth="3" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="var(--accent-primary)" strokeWidth="3" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="var(--accent-primary)" strokeWidth="3" />
      <rect x="50" y="50" width="50" height="50" fill="var(--bg-base)" />
      <rect x="52" y="52" width="46" height="46" fill="transparent" stroke="var(--accent-primary)" strokeWidth="2" strokeDasharray="4 2" />
      <text x="75" y="80" fontSize="14" fill="var(--accent-primary)" fontWeight="900" textAnchor="middle">?</text>
    </svg>,
    // Star burst
    <svg key="3" width="120" height="120" viewBox="0 0 100 100">
      {[0,1,2,3,4,5,6,7].map(i => {
        const angle = (i * 45 - 90) * Math.PI / 180;
        const x1 = 50 + 15 * Math.cos(angle);
        const y1 = 50 + 15 * Math.sin(angle);
        const x2 = 50 + 45 * Math.cos(angle);
        const y2 = 50 + 45 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--accent-primary)" strokeWidth="6" strokeLinecap="round" />;
      })}
      <rect x="50" y="0" width="50" height="50" fill="var(--bg-base)" />
      <rect x="52" y="2" width="46" height="46" fill="transparent" stroke="var(--accent-primary)" strokeWidth="2" strokeDasharray="4 2" />
      <text x="75" y="30" fontSize="14" fill="var(--accent-primary)" fontWeight="900" textAnchor="middle">?</text>
    </svg>,
  ];

  const patternSVG = patterns[patternIdx % patterns.length];

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        Select the fragment that completes the <strong style={{ color: 'var(--accent-primary)' }}>{challenge.payload.patternName}</strong> pattern:
      </div>

      {/* Pattern with missing piece */}
      <div style={{ margin: '0 auto 20px', display: 'inline-block', padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
        {patternSVG}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '340px', margin: '0 auto' }}>
        {challenge.payload.options.map((opt) => (
          <NvButton key={opt.id} variant="secondary" size="lg" onClick={() => onRespond({ selectedFragmentId: opt.id })}>
            {opt.label}
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// GAME 45: ODD ONE OUT DEDUCTION — Enhanced with visual grid & color variation
export const OddOneOutRenderer = ({ challenge, onRespond }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', padding: '8px 16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', display: 'inline-block', border: '1px solid var(--border-light)' }}>
      🔍 Identify the item that does <strong style={{ color: 'var(--accent-primary)' }}>NOT belong</strong> with the others:
    </div>
    <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '380px', margin: '16px auto 0' }}>
      {challenge.payload.items.map((item) => {
        const isSymbol = item.label.length <= 2;
        return (
          <button
            key={item.id}
            onClick={() => onRespond({ selectedIndex: item.id })}
            style={{
              padding: '14px 8px',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${item.color || 'var(--border-light)'}44`,
              background: 'var(--bg-surface)',
              fontSize: isSymbol ? '32px' : '14px',
              fontWeight: '800',
              color: item.color || 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              minHeight: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${item.color || 'rgba(0,0,0,0.1)'}22`,
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  </div>
);

// GAME 46: LOGIC GRID PUZZLE — FIXED: uses new payload (options-based answer)
export const LogicGridRenderer = ({ challenge, onRespond }) => {
  const people = challenge.payload.people || [];
  const drinks = challenge.payload.drinks || [];
  const clues = challenge.payload.clues || [];

  // Table state for deduction (optional visual aid)
  const [gridState, setGridState] = useState(() =>
    Array(people.length).fill(null).map(() => Array(drinks.length).fill(''))
  );

  useEffect(() => {
    setGridState(Array(people.length).fill(null).map(() => Array(drinks.length).fill('')));
  }, [challenge]);

  const toggleCell = (pIdx, dIdx) => {
    const next = gridState.map((row) => [...row]);
    const curr = next[pIdx][dIdx];
    next[pIdx][dIdx] = curr === '' ? '✗' : curr === '✗' ? '✓' : '';
    setGridState(next);
  };

  const options = challenge.payload.options || drinks;
  const question = challenge.payload.question || `What does ${challenge.payload.targetPerson} drink?`;

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Clues */}
      <div style={{ padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', maxWidth: '380px', margin: '0 auto 14px', fontSize: '12px', color: 'var(--text-primary)', textAlign: 'left' }}>
        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Clues:</span>
        {clues.map((c, i) => <div key={i} style={{ marginTop: '2px' }}>• {c}</div>)}
      </div>

      {/* Optional deduction grid */}
      <div style={{ maxWidth: '380px', margin: '0 auto 16px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr>
              <th style={{ padding: '5px', border: '1px solid var(--border-light)' }} />
              {drinks.map((d) => (
                <th key={d} style={{ padding: '5px', border: '1px solid var(--border-light)', color: 'var(--accent-primary)', fontWeight: '800' }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {people.map((p, pIdx) => (
              <tr key={p}>
                <td style={{ padding: '5px', border: '1px solid var(--border-light)', fontWeight: '800', color: 'var(--text-primary)' }}>{p}</td>
                {drinks.map((d, dIdx) => (
                  <td
                    key={d}
                    onClick={() => toggleCell(pIdx, dIdx)}
                    style={{
                      padding: '6px',
                      border: '1px solid var(--border-light)',
                      background: 'var(--bg-surface)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '800',
                      color: gridState[pIdx][dIdx] === '✓' ? 'var(--color-success)' : 'var(--color-error)',
                    }}
                  >
                    {gridState[pIdx][dIdx] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Direct answer question */}
      <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
        {question}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', maxWidth: '380px', margin: '0 auto' }}>
        {options.map((opt) => (
          <NvButton key={opt} variant="secondary" size="lg" onClick={() => onRespond({ selectedAnswer: opt })}>
            {opt}
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// GAME 47: SEQUENCE PREDICTION — dedicated number-sequence renderer
// FIX: was sharing AbstractReasoningRenderer causing text/number display mismatch
export const SequencePredictionRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  const sequence = challenge.payload.sequence || [];
  const options = challenge.payload.options || [];
  const rule = challenge.payload.rule || '';

  return (
    <div style={{ textAlign: 'center' }} className="animate-fade-in">
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', padding: '6px 14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', display: 'inline-block', border: '1px solid var(--border-light)' }}>
        🔢 Find the next number in the pattern:
      </div>

      {/* Sequence display */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap', padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '2px solid var(--border-light)', maxWidth: '400px', margin: '0 auto 24px' }}>
        {sequence.map((num, i) => (
          <span key={i} style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)' }}>
            {num}
            {i < sequence.length - 1 && <span style={{ color: 'var(--text-tertiary)', fontSize: '20px', margin: '0 4px' }}>,</span>}
          </span>
        ))}
        <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-tertiary)' }}>,</span>
        <span style={{ fontSize: '32px', fontWeight: '900', color: 'var(--accent-primary)', borderBottom: '3px solid var(--accent-primary)', minWidth: '48px', display: 'inline-block' }}>?</span>
      </div>

      {/* Number option buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
        {options.map((opt, i) => (
          <NvButton
            key={i}
            variant="secondary"
            size="lg"
            onClick={() => onRespond({ selectedOption: opt, reactionTimeMs: Date.now() - startRef.current })}
            style={{ fontSize: '22px', fontWeight: '900' }}
          >
            {opt}
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// GAME 48: ABSTRACT RULE SOLVER
export const AbstractReasoningRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  const rule = challenge.payload.transformationRule || challenge.payload.rule || '';
  const prompt = challenge.payload.promptShape || '';
  const options = challenge.payload.options || [];

  return (
    <div style={{ textAlign: 'center' }} className="animate-fade-in">
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', padding: '8px 16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', display: 'inline-block', border: '1px solid var(--border-light)' }}>
        🔄 Transformation: <strong style={{ color: 'var(--accent-primary)' }}>{rule}</strong>
      </div>

      <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-primary)', padding: '16px 20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', maxWidth: '380px', margin: '12px auto 24px' }}>
        {prompt}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '380px', margin: '0 auto' }}>
        {options.map((opt, i) => (
          <NvButton
            key={i}
            variant="secondary"
            size="lg"
            onClick={() => onRespond({ selectedOption: opt, reactionTimeMs: Date.now() - startRef.current })}
          >
            {opt}
          </NvButton>
        ))}
      </div>
    </div>
  );
};
