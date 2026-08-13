import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Key, CheckCircle, AlertTriangle } from 'lucide-react';
import { AuthService, USER_ROLES } from '../../core/auth/AuthService';
import { NvCard } from '../../components/ui/NvCard';
import { NvButton } from '../../components/ui/NvButton';

export const AuthModalScreen = ({ isOpen, onClose, onAuthSuccess }) => {
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(USER_ROLES.PLAYER);
  const [avatar, setAvatar] = useState('🧩');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await AuthService.login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      onAuthSuccess(res.session);
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to sign in.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await AuthService.register({ name, email, password, role, avatar });
    setIsSubmitting(false);

    if (res.success) {
      onAuthSuccess(res.session);
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to create account.');
    }
  };

  const fillQuickAccount = (eMail, pass) => {
    setEmail(eMail);
    setPassword(pass);
  };

  const avatars = ['🧩', '👑', '🛡️', '⚡', '🧠', '🚀', '🎯', '🔮'];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      className="animate-fade-in"
    >
      <NvCard padding="28px" variant="hero" style={{ maxWidth: '440px', width: '100%', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          <X size={22} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            {tab === 'login' ? 'Sign In to Mind 50' : 'Create Account'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {tab === 'login' ? 'Access your cognitive profile & rank' : 'Join the cognitive training platform'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-lg)', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: tab === 'login' ? 'var(--accent-primary)' : 'transparent',
              color: tab === 'login' ? '#FFF' : 'var(--text-secondary)',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: tab === 'register' ? 'var(--accent-primary)' : 'transparent',
              color: tab === 'register' ? '#FFF' : 'var(--text-secondary)',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: 'var(--color-error-bg)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> {errorMsg}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="player@mind50.com"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '14px' }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '14px' }}
              />
            </div>

            <NvButton variant="primary" size="lg" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </NvButton>

            {/* Quick Credentials Presets for Evaluation */}
            <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', textAlign: 'left' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>⚡ Demo Accounts (Click to Fill):</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button type="button" onClick={() => fillQuickAccount('superadmin@mind50.com', 'SuperAdmin123!')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}>
                  👑 <strong>Super Admin:</strong> superadmin@mind50.com
                </button>
                <button type="button" onClick={() => fillQuickAccount('admin@mind50.com', 'Admin123!')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}>
                  🛡️ <strong>Platform Admin:</strong> admin@mind50.com
                </button>
                <button type="button" onClick={() => fillQuickAccount('player@mind50.com', 'Player123!')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}>
                  🧩 <strong>Player Account:</strong> player@mind50.com
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Morgan"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '14px' }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@example.com"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '14px' }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>Password (min 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '14px' }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>Choose Avatar</label>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {avatars.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      fontSize: '20px',
                      border: avatar === av ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                      background: avatar === av ? 'var(--accent-primary-light)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <NvButton variant="primary" size="lg" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </NvButton>
          </form>
        )}
      </NvCard>
    </div>
  );
};
