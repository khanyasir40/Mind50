import React from 'react';

export const NvPill = ({
  children,
  active = false,
  onClick,
  icon: Icon = null,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        borderRadius: 'var(--radius-full)',
        fontSize: '13px',
        fontWeight: '700',
        transition: 'all var(--transition-fast)',
        background: active ? 'var(--accent-gradient)' : 'var(--bg-surface)',
        color: active ? '#FFFFFF' : 'var(--text-secondary)',
        boxShadow: active ? '0 4px 12px rgba(108, 77, 255, 0.25)' : 'var(--shadow-sm)',
        border: active ? 'none' : '1px solid var(--border-light)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {Icon && <Icon size={14} color={active ? '#FFFFFF' : 'var(--text-secondary)'} />}
      {children}
    </button>
  );
};
