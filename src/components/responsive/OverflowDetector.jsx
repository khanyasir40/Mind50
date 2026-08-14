import React, { useEffect, useState } from 'react';

/**
 * OverflowDetector - PART 32 Development Utility
 * Automatically scans the document for horizontal/vertical overflow and logs violations.
 */
export const OverflowDetector = () => {
  const [overflows, setOverflows] = useState([]);

  useEffect(() => {
    const scan = () => {
      const docW = document.documentElement.clientWidth;
      const bodyW = document.body.clientWidth;
      const issues = [];

      const allElements = document.querySelectorAll('*');
      allElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > docW + 1) {
          issues.push({
            tagName: el.tagName.toLowerCase(),
            className: el.className,
            id: el.id,
            width: Math.round(rect.width),
            right: Math.round(rect.right),
            docWidth: docW,
            overflow: Math.round(rect.right - docW),
          });
        }
      });

      if (issues.length > 0) {
        console.warn(`[RESPONSIVE OVERFLOW DETECTOR] Found ${issues.length} horizontal overflow elements:`, issues);
      }
      setOverflows(issues);
    };

    scan();
    window.addEventListener('resize', scan);
    return () => window.removeEventListener('resize', scan);
  }, []);

  if (process.env.NODE_ENV === 'production' || overflows.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '10px',
        zIndex: 9999,
        background: 'rgba(232, 93, 117, 0.95)',
        color: '#FFF',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: '800',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        pointerEvents: 'none',
      }}
    >
      ⚠️ {overflows.length} Overflow Elements Detected
    </div>
  );
};
