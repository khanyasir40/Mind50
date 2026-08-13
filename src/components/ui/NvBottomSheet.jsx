import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const NvBottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(15, 12, 27, 0.6)',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '85vh',
          background: 'var(--bg-surface)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-elevated)',
          overflowY: 'auto',
          animation: 'fadeIn 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div style={{ width: '40px', height: '4px', background: 'var(--bg-pill)', borderRadius: 'var(--radius-full)', margin: '0 auto 16px' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          {title && <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{title}</h3>}
          <button
            onClick={onClose}
            style={{ padding: '8px', borderRadius: '50%', background: 'var(--bg-pill)', color: 'var(--text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};
