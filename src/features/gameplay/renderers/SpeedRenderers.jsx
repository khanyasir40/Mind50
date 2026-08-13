import React, { useState, useEffect, useRef } from 'react';
import { NvButton } from '../../../components/ui/NvButton';

// GAME 31: SIMPLE REACTION TIME — FIXED: track internal start time
export const SimpleReactionRenderer = ({ challenge, onRespond }) => {
  const startTimeRef = useRef(null);
  const [tooEarly, setTooEarly] = useState(false);
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    setTooEarly(false);
    setWaiting(true);
    startTimeRef.current = null;

    const delay = challenge?.payload?.waitDelayMs || 2000;
    const timer = setTimeout(() => {
      setWaiting(false);
      startTimeRef.current = Date.now();
    }, delay);

    return () => clearTimeout(timer);
  }, [challenge]);

  const handleTap = () => {
    if (waiting) {
      // Too early — false start
      setTooEarly(true);
      onRespond({ tooEarly: true, reactionTimeMs: 0 });
      return;
    }
    const rtMs = startTimeRef.current ? Date.now() - startTimeRef.current : 999;
    onRespond({ reactionTimeMs: rtMs, tooEarly: false });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        onClick={handleTap}
        style={{
          height: '260px',
          borderRadius: 'var(--radius-xl)',
          background: waiting
            ? (tooEarly ? 'var(--color-error)' : 'var(--bg-surface)')
            : 'var(--color-success)',
          border: waiting && !tooEarly ? '2px dashed var(--border-light)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: waiting && !tooEarly ? 'var(--text-secondary)' : '#FFFFFF',
          fontSize: '32px',
          fontWeight: '800',
          cursor: 'pointer',
          boxShadow: waiting ? 'none' : '0 12px 40px rgba(57,185,130,0.4)',
          transition: 'background 0.08s ease, box-shadow 0.1s ease',
          userSelect: 'none',
        }}
      >
        {tooEarly ? '⚡ TOO EARLY!' : waiting ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '48px' }}>⏳</span>
            <span style={{ fontSize: '18px' }}>Wait for green...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '64px' }}>⚡</span>
            <span>TAP NOW!</span>
          </div>
        )}
      </div>
    </div>
  );
};

// GAME 32: CHOICE REACTION TIME
export const ChoiceReactionRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '96px', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '36px', textShadow: '0 0 40px rgba(108,77,255,0.4)' }}>
        {challenge.payload.targetSymbol}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(challenge.payload.options.length, 4)}, 1fr)`, gap: '12px', maxWidth: '360px', margin: '0 auto' }}>
        {challenge.payload.options.map((sym) => (
          <NvButton
            key={sym}
            variant="secondary"
            size="lg"
            onClick={() => onRespond({ selectedSymbol: sym, reactionTimeMs: Date.now() - startRef.current })}
          >
            {sym}
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// GAME 33: RAPID SYMBOL RECOGNITION — FIXED: show all legend items as buttons
export const RapidSymbolRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  const legend = challenge.payload.legend || [];

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Symbol → Digit key legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {legend.map((item) => (
          <div
            key={item.digit}
            style={{
              padding: '8px 14px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.symbol}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>=</span>
            <span style={{ color: 'var(--accent-primary)' }}>{item.digit}</span>
          </div>
        ))}
      </div>

      {/* Target symbol */}
      <div
        style={{
          fontSize: '80px',
          fontWeight: '800',
          color: 'var(--accent-primary)',
          marginBottom: '24px',
          textShadow: '0 0 30px rgba(108,77,255,0.3)',
        }}
      >
        {challenge.payload.targetSymbol}
      </div>

      {/* FIXED: dynamically render ALL legend digit buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(legend.length, 4)}, 1fr)`,
          gap: '12px',
          maxWidth: '360px',
          margin: '0 auto',
        }}
      >
        {legend.map((item) => (
          <NvButton
            key={item.digit}
            variant="secondary"
            size="lg"
            onClick={() => onRespond({ selectedDigit: item.digit, reactionTimeMs: Date.now() - startRef.current })}
          >
            {item.digit}
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// GAME 34: NUMBER PARITY REACTION
export const NumberReactionRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: '88px',
          fontWeight: '900',
          color: 'var(--accent-primary)',
          marginBottom: '36px',
          letterSpacing: '-2px',
          textShadow: '0 0 30px rgba(108,77,255,0.25)',
        }}
      >
        {challenge.payload.number}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '320px', margin: '0 auto' }}>
        {['ODD', 'EVEN'].map((parity) => (
          <NvButton
            key={parity}
            variant="secondary"
            size="lg"
            onClick={() => onRespond({ selectedParity: parity, reactionTimeMs: Date.now() - startRef.current })}
          >
            {parity}
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// GAME 35: SHAPE MATCHING REACTION
export const ShapeReactionRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  const shapeIcons = {
    Circle: '●',
    Square: '■',
    Triangle: '▲',
    Star: '★',
    Hexagon: '⬡',
    Diamond: '◆',
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', alignItems: 'center', marginBottom: '36px' }}>
        {/* Previous shape */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>Previous</div>
          <div style={{ fontSize: '56px', color: 'var(--text-secondary)' }}>
            {shapeIcons[challenge.payload.prevShape] || challenge.payload.prevShape}
          </div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginTop: '4px' }}>{challenge.payload.prevShape}</div>
        </div>

        <div style={{ fontSize: '24px', color: 'var(--border-light)' }}>→</div>

        {/* Current shape */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>Current</div>
          <div style={{ fontSize: '72px', color: 'var(--accent-primary)', textShadow: '0 0 20px rgba(108,77,255,0.3)' }}>
            {shapeIcons[challenge.payload.currentShape] || challenge.payload.currentShape}
          </div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-primary)', marginTop: '4px' }}>{challenge.payload.currentShape}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '320px', margin: '0 auto' }}>
        {['MATCH', 'DIFFERENT'].map((opt) => (
          <NvButton
            key={opt}
            variant="secondary"
            size="lg"
            onClick={() => onRespond({ selectedOption: opt, reactionTimeMs: Date.now() - startRef.current })}
          >
            {opt === 'MATCH' ? '✓ MATCH' : '✗ DIFFERENT'}
          </NvButton>
        ))}
      </div>
    </div>
  );
};

// GAME 36: COLOR BURST REACTION
export const ColorReactionRenderer = ({ challenge, onRespond }) => {
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
  }, [challenge]);

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: challenge.payload.targetColor.hex,
          margin: '0 auto 32px',
          boxShadow: `0 0 60px ${challenge.payload.targetColor.hex}88, 0 0 20px ${challenge.payload.targetColor.hex}`,
          animation: 'pulse 0.8s infinite alternate',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '360px', margin: '0 auto' }}>
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
