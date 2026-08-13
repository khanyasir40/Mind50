import React from 'react';

export const NvBadge = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon = null,
}) => {
  const variantStyles = {
    primary: { background: 'var(--accent-primary-light)', color: 'var(--accent-primary)' },
    success: { background: 'var(--color-success-bg)', color: 'var(--color-success)' },
    warning: { background: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
    error: { background: 'var(--color-error-bg)', color: 'var(--color-error)' },
    neutral: { background: 'var(--bg-pill)', color: 'var(--text-secondary)' },
  };

  const sizeStyles = {
    sm: { padding: '3px 8px', fontSize: '11px' },
    md: { padding: '4px 12px', fontSize: '12px' },
    lg: { padding: '6px 16px', fontSize: '13px' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        borderRadius: 'var(--radius-full)',
        fontWeight: '700',
        lineHeight: 1,
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : 14} />}
      {children}
    </span>
  );
};
