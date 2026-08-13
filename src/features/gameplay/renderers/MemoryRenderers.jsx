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

      // Start flashing after a brief 200ms setup
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

        {/* Progress dots for digits */}
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

      {/* 3×4 Full Keypad with 0, Clear, Backspace */}
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

        {/* Bottom row: Clear, 0, Backspace */}
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
