import React from 'react';

export const NvCard = ({
  children,
  variant = 'raised',
  padding = '20px',
  onClick,
  hoverable = false,
  className = '',
  style = {},
  ...props
}) => {
  const baseStyles = {
    background: 'var(--bg-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-light)',
    padding,
    transition: 'all var(--transition-fast)',
    cursor: onClick || hoverable ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
  };

  const variantStyles = {
    flat: {
      boxShadow: 'none',
      background: 'var(--bg-surface-elevated)',
    },
    raised: {
      boxShadow: 'var(--shadow-card)',
    },
    hero: {
      boxShadow: 'var(--shadow-elevated)',
      background: 'var(--bg-surface)',
    },
    accent: {
      background: 'var(--accent-primary-light)',
      border: '1px solid var(--accent-primary)',
    },
  };

  return (
    <div
      onClick={onClick}
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...style,
      }}
      className={`nv-card ${hoverable ? 'nv-card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
