import React, { useState, useEffect } from 'react';
import {
  Lock, Mail, User, ShieldCheck, Key, AlertTriangle, Eye, EyeOff,
  Brain, ArrowRight, CheckCircle, ChevronLeft, Zap, Trophy, Star,
} from 'lucide-react';
import { AuthService, USER_ROLES } from '../../core/auth/AuthService';
import { NvButton } from '../../components/ui/NvButton';

// ─── Tiny reusable floating label input ─────────────────────────────────────
const Field = ({ label, type, value, onChange, placeholder, icon: Icon, required, minLength, rightAddon }) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      {Icon && (
        <Icon size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        style={{
          width: '100%',
          padding: `13px ${rightAddon ? '48px' : '14px'} 13px ${Icon ? '40px' : '14px'}`,
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid var(--border-light)',
          background: 'var(--bg-base)',
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontWeight: '500',
          outline: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxSizing: 'border-box',
        }}
        onFocus={e => {
          e.target.style.borderColor = 'var(--accent-primary)';
          e.target.style.boxShadow = '0 0 0 3px var(--accent-primary-light)';
        }}
        onBlur={e => {
          e.target.style.borderColor = 'var(--border-light)';
          e.target.style.boxShadow = 'none';
        }}
      />
      {rightAddon}
    </div>
  </div>
);

// ─── Stats strip shown on the left panel ────────────────────────────────────
const stats = [
  { icon: Brain, value: '50', label: 'Cognitive Games' },
  { icon: Trophy, value: '10K+', label: 'Players Trained' },
  { icon: Zap, value: '95%', label: 'Accuracy Boost' },
  { icon: Star, value: '#1', label: 'Brain Training' },
];

// ─── Left hero panel component ──────────────────────────────────────────────
const HeroPanel = ({ isMobile }) => (
  <div style={{
    flex: 1,
    background: 'linear-gradient(145deg, #0D0B1E 0%, #1a1035 50%, #0d1a2e 100%)',
    padding: isMobile ? '32px 24px' : '48px 40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    minHeight: isMobile ? 'auto' : '100vh',
  }}>
    {/* Glow blobs */}
    <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,77,255,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
    <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(57,185,130,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isMobile ? '24px' : '48px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #6C4DFF, #39B982)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 8px 24px rgba(108,77,255,0.4)' }}>🧠</div>
        <span style={{ fontSize: '22px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.5px' }}>Mind<span style={{ color: '#6C4DFF' }}>40</span></span>
      </div>

      <h1 style={{ fontSize: isMobile ? '28px' : '38px', fontWeight: '900', color: '#FFFFFF', lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-1px' }}>
        Train Your<br />
        <span style={{ background: 'linear-gradient(135deg, #6C4DFF, #39B982)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Cognitive Edge</span>
      </h1>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: '320px', marginBottom: isMobile ? '24px' : '40px' }}>
        50 science-backed brain games that sharpen memory, speed, attention, and reasoning.
      </p>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} style={{ padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Icon size={18} color="#6C4DFF" style={{ marginBottom: '6px' }} />
            <div style={{ fontSize: '20px', fontWeight: '900', color: '#FFFFFF' }}>{value}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontWeight: '600' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom quote */}
    {!isMobile && (
      <div style={{ position: 'relative', zIndex: 1, marginTop: '32px' }}>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', fontStyle: 'italic', borderLeft: '2px solid rgba(108,77,255,0.6)', paddingLeft: '14px' }}>
          "The mind is not a vessel to be filled, but a fire to be kindled."
        </p>
      </div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// FULL-SCREEN SPLIT LOGIN / REGISTER PAGE
// ─────────────────────────────────────────────────────────────────────────────
export const AuthFullPage = ({ onAuthSuccess, onSkip }) => {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(USER_ROLES.PLAYER);
  const [avatar, setAvatar] = useState('🧩');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await AuthService.login(email, password);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMsg('Welcome back! Redirecting...');
      setTimeout(() => onAuthSuccess(res.session), 800);
    } else {
      setErrorMsg(res.error || 'Invalid email or password.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await AuthService.register({ name, email, password, role, avatar });
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMsg('Account created! Redirecting...');
      setTimeout(() => onAuthSuccess(res.session), 800);
    } else {
      setErrorMsg(res.error || 'Could not create account.');
    }
  };

  const avatars = ['🧩', '👑', '🛡️', '⚡', '🧠', '🚀', '🎯', '🔮', '🦾', '🌟', '🎪', '🦁'];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1300, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'auto', background: 'var(--bg-base)' }} className="animate-fade-in">
      {!isMobile && <HeroPanel isMobile={isMobile} />}

      {/* Right Form Container - inline JSX so input focus is never lost on typing */}
      <div style={{
        flex: isMobile ? '1' : '0 0 460px',
        background: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isMobile ? '28px 20px' : '48px 40px',
        overflowY: 'auto',
        maxHeight: '100vh',
        boxSizing: 'border-box',
        width: '100%',
      }}>
        {/* Tab switcher */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-surface)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '24px' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setEmail(''); setPassword(''); setName(''); setErrorMsg(''); setSuccessMsg(''); }}
              style={{ padding: '11px', borderRadius: '9px', border: 'none', background: tab === t ? 'var(--accent-primary)' : 'transparent', color: tab === t ? '#FFF' : 'var(--text-secondary)', fontWeight: '800', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              {t === 'login' ? '🔑 Sign In' : '✨ Register'}
            </button>
          ))}
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px', letterSpacing: '-0.5px' }}>
          {tab === 'login' ? 'Welcome back!' : 'Join Mind 50'}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {tab === 'login' ? 'Sign in to continue your cognitive journey' : 'Create your free account and start training'}
        </p>

        {/* Error / Success banners */}
        {errorMsg && (
          <div style={{ padding: '12px 14px', background: 'var(--color-error-bg, #2d1018)', color: 'var(--color-error, #E85D75)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(232,93,117,0.3)' }}>
            <AlertTriangle size={16} /> {errorMsg}
          </div>
        )}
        {successMsg && (
          <div style={{ padding: '12px 14px', background: '#0d1f16', color: '#39B982', borderRadius: '10px', fontSize: '13px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(57,185,130,0.3)' }}>
            <CheckCircle size={16} /> {successMsg}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <Field label="Username or Email Address" type="text" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="e.g. Yasir or yasir@mind40.com" icon={User} required />
            <div style={{ position: 'relative' }}>
              <Field label="Password" type={showPass ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••" icon={Lock} required
                rightAddon={
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '4px' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                } />
            </div>

            <button type="submit" disabled={isSubmitting}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #6C4DFF, #5038d4)', color: '#FFF', fontWeight: '800', fontSize: '15px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(108,77,255,0.35)', transition: 'all 0.2s ease', opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={18} /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <Field label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Your Name" icon={User} required />
            <Field label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" icon={Mail} required />
            <div style={{ position: 'relative' }}>
              <Field label="Password (min 6 chars)" type={showPass ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••" icon={Lock} required minLength={6}
                rightAddon={
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '4px' }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                } />
            </div>

            {/* Avatar picker */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>Choose Avatar</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {avatars.map(av => (
                  <button key={av} type="button" onClick={() => setAvatar(av)}
                    style={{ width: '40px', height: '40px', borderRadius: '10px', fontSize: '20px', border: avatar === av ? '2px solid var(--accent-primary)' : '1.5px solid var(--border-light)', background: avatar === av ? 'var(--accent-primary-light)' : 'var(--bg-surface)', cursor: 'pointer', transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #39B982, #2a9568)', color: '#FFF', fontWeight: '800', fontSize: '15px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(57,185,130,0.3)', transition: 'all 0.2s ease', opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Creating...' : <><span>Create Player Account</span><ArrowRight size={18} /></>}
            </button>
          </form>
        )}

        {/* Skip link / Guest Mode */}
        <button onClick={onSkip}
          style={{ marginTop: '20px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '700', borderRadius: '12px', padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', transition: 'all 0.2s ease' }}>
          <span>🚀 Play as Guest (Starts Fresh at Lvl 1 &amp; 0 Scores)</span>
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY MODAL (kept for backward compatibility, e.g. in-app profile button)
// ─────────────────────────────────────────────────────────────────────────────
export const AuthModalScreen = ({ isOpen, onClose, onAuthSuccess }) => {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(USER_ROLES.PLAYER);
  const [avatar, setAvatar] = useState('🧩');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await AuthService.login(email, password);
    setIsSubmitting(false);
    if (res.success) { onAuthSuccess(res.session); onClose(); }
    else setErrorMsg(res.error || 'Failed to sign in.');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await AuthService.register({ name, email, password, role, avatar });
    setIsSubmitting(false);
    if (res.success) { onAuthSuccess(res.session); onClose(); }
    else setErrorMsg(res.error || 'Failed to create account.');
  };

  const avatars = ['🧩', '👑', '🛡️', '⚡', '🧠', '🚀', '🎯', '🔮', '🦾', '🌟'];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} className="animate-fade-in">
      <div style={{ maxWidth: '440px', width: '100%', background: 'var(--bg-base)', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', padding: '32px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--accent-primary-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '10px' }}>🧠</div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Mind 50 Account</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--bg-surface)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setErrorMsg(''); }}
              style={{ padding: '10px', borderRadius: '7px', border: 'none', background: tab === t ? 'var(--accent-primary)' : 'transparent', color: tab === t ? '#FFF' : 'var(--text-secondary)', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: 'var(--color-error-bg, #2d1018)', color: 'var(--color-error, #E85D75)', borderRadius: '10px', fontSize: '13px', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={15} /> {errorMsg}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <Field label="Username or Email" type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Yasir or yasir@mind50.com" icon={User} required />
            <div style={{ position: 'relative' }}>
              <Field label="Password" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" icon={Lock} required
                rightAddon={<button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>} />
            </div>
            <NvButton variant="primary" size="lg" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </NvButton>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <Field label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" icon={User} required />
            <Field label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" icon={Mail} required />
            <div style={{ position: 'relative' }}>
              <Field label="Password (min 6 chars)" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" icon={Lock} required minLength={6}
                rightAddon={<button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>Avatar</label>
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                {avatars.map(av => (
                  <button key={av} type="button" onClick={() => setAvatar(av)}
                    style={{ width: '36px', height: '36px', borderRadius: '8px', fontSize: '18px', border: avatar === av ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)', background: avatar === av ? 'var(--accent-primary-light)' : 'var(--bg-surface)', cursor: 'pointer' }}>
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
      </div>
    </div>
  );
};
