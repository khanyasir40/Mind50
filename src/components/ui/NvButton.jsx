import React from 'react';

export const NvButton = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon = null,
  iconPosition = 'left',
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    borderRadius: variant === 'pill' ? 'var(--radius-full)' : 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    border: 'none',
    userSelect: 'none',
  };

  const sizeStyles = {
    sm: { padding: '8px 14px', fontSize: '13px', height: '36px' },
    md: { padding: '12px 20px', fontSize: '15px', height: '48px' },
    lg: { padding: '16px 28px', fontSize: '17px', height: '56px' },
  };

  const variantStyles = {
    primary: {
      background: 'var(--accent-gradient)',
      color: '#FFFFFF',
      boxShadow: '0 4px 14px rgba(108, 77, 255, 0.3)',
    },
    secondary: {
      background: 'var(--accent-primary-light)',
      color: 'var(--accent-primary)',
    },
    pill: {
      background: 'var(--bg-pill)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-light)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
    },
    danger: {
      background: 'var(--color-error)',
      color: '#FFFFFF',
      boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--accent-primary)',
      border: '1.5px solid var(--accent-primary)',
    },
  };

  return (
    <button
      onClick={disabled || loading ? undefined : onClick}
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      className={`nv-button ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>
          ⏳
        </span>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
        </>
      )}
    </button>
  );
};
