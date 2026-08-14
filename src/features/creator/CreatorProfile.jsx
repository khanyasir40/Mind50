import React, { useState, useEffect } from 'react';
import {
  Save, Edit3, Link, Phone, Instagram, Twitter, Facebook, Youtube,
  Github, Globe, CheckCircle, User, Mail, MessageCircle, Linkedin,
  X, ExternalLink, Sparkles,
} from 'lucide-react';
import { NvButton } from '../../components/ui/NvButton';
import { NvCard } from '../../components/ui/NvCard';

// ── Storage helpers ──────────────────────────────────────────────────────────
const CREATOR_KEY = 'mind50_creator_profile';

const defaultCreator = {
  name: 'Yasir Khan',
  title: 'Developer & Founder of Mind 50',
  bio: 'Building the world\'s most engaging cognitive training platform. 50 science-backed brain games to sharpen your mind.',
  avatar: '👑',
  email: '',
  website: '',
  whatsapp: '',
  phone: '',
  instagram: '',
  twitter: '',
  facebook: '',
  youtube: '',
  github: '',
  linkedin: '',
  isPublic: true,
};

const loadCreator = () => {
  try {
    const stored = localStorage.getItem(CREATOR_KEY);
    return stored ? { ...defaultCreator, ...JSON.parse(stored) } : { ...defaultCreator };
  } catch { return { ...defaultCreator }; }
};

const saveCreator = (data) => {
  localStorage.setItem(CREATOR_KEY, JSON.stringify(data));
};

// ── Icon map for social links ────────────────────────────────────────────────
const socialConfig = [
  { key: 'whatsapp',  label: 'WhatsApp',  icon: MessageCircle,  color: '#25D366', prefix: 'wa.me/',       placeholder: '+923001234567 or wa.me/923001234567' },
  { key: 'instagram', label: 'Instagram', icon: Instagram,      color: '#E1306C', prefix: 'instagram.com/',placeholder: 'username' },
  { key: 'twitter',   label: 'Twitter/X', icon: Twitter,        color: '#1DA1F2', prefix: 'twitter.com/', placeholder: '@username' },
  { key: 'facebook',  label: 'Facebook',  icon: Facebook,       color: '#1877F2', prefix: 'facebook.com/',placeholder: 'username or page' },
  { key: 'youtube',   label: 'YouTube',   icon: Youtube,        color: '#FF0000', prefix: 'youtube.com/', placeholder: '@channel or /c/channel' },
  { key: 'linkedin',  label: 'LinkedIn',  icon: Linkedin,       color: '#0A66C2', prefix: 'linkedin.com/in/', placeholder: 'username' },
  { key: 'github',    label: 'GitHub',    icon: Github,         color: '#6e40c9', prefix: 'github.com/',  placeholder: 'username' },
  { key: 'website',   label: 'Website',   icon: Globe,          color: '#6C4DFF', prefix: '',             placeholder: 'https://yourwebsite.com' },
  { key: 'email',     label: 'Email',     icon: Mail,           color: '#39B982', prefix: 'mailto:',      placeholder: 'your@email.com' },
  { key: 'phone',     label: 'Phone',     icon: Phone,          color: '#F0A83A', prefix: 'tel:',         placeholder: '+92 300 123 4567' },
];

const buildUrl = (key, value) => {
  if (!value) return null;
  const cfg = socialConfig.find(s => s.key === key);
  if (!cfg) return null;
  if (value.startsWith('http') || value.startsWith('mailto:') || value.startsWith('tel:') || value.startsWith('wa.me') || cfg.prefix === '') {
    return value.startsWith('http') || value.startsWith('mailto:') || value.startsWith('tel:') ? value : `https://${value}`;
  }
  if (cfg.key === 'whatsapp') {
    const digits = value.replace(/\D/g, '');
    return `https://wa.me/${digits}`;
  }
  return `https://${cfg.prefix}${value}`;
};

// ────────────────────────────────────────────────────────────────────────────
// PUBLIC CARD — shown to all visitors at bottom of profile
// ────────────────────────────────────────────────────────────────────────────
export const CreatorPublicCard = () => {
  const creator = loadCreator();
  if (!creator.isPublic) return null;

  const activeLinks = socialConfig.filter(s => creator[s.key]);

  return (
    <NvCard padding="24px" variant="hero" style={{ background: 'linear-gradient(135deg, rgba(108,77,255,0.08) 0%, rgba(57,185,130,0.05) 100%)', border: '1px solid rgba(108,77,255,0.2)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, var(--accent-primary), #39B982)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0, boxShadow: '0 8px 20px rgba(108,77,255,0.3)' }}>
          {creator.avatar}
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            {creator.name} <Sparkles size={16} color="#F0A83A" />
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: '700', margin: '2px 0 0' }}>{creator.title}</p>
        </div>
      </div>

      {creator.bio && (
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '18px', borderLeft: '3px solid var(--accent-primary)', paddingLeft: '12px' }}>
          {creator.bio}
        </p>
      )}

      {/* Social links grid */}
      {activeLinks.length > 0 && (
        <div>
          <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Connect with the Developer</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {activeLinks.map(({ key, label, icon: Icon, color }) => {
              const url = buildUrl(key, creator[key]);
              if (!url) return null;
              return (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: `${color}18`, border: `1.5px solid ${color}44`, color, fontWeight: '700', fontSize: '13px', textDecoration: 'none', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${color}2e`; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 16px ${color}33`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <Icon size={15} />
                  {label}
                  <ExternalLink size={11} style={{ opacity: 0.6 }} />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </NvCard>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// ADMIN EDITOR — only shown to Super Admin in the Profile / Admin screen
// ────────────────────────────────────────────────────────────────────────────
export const CreatorProfileEditor = () => {
  const [profile, setProfile] = useState(loadCreator);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const avatarOptions = ['👑', '🧠', '🚀', '⚡', '🎯', '🔮', '🦾', '🌟', '🛡️', '🧩', '🦁', '🎪', '💡', '🏆'];

  const handleSave = () => {
    setProfile(draft);
    saveCreator(draft);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => { setDraft({ ...profile }); setIsEditing(false); };

  const fieldStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '10px',
    border: '1.5px solid var(--border-light)',
    background: 'var(--bg-base)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>Creator / Developer Profile</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Shown to all users at the bottom of the app. Add your social links &amp; contact details.</p>
        </div>
        {!isEditing ? (
          <NvButton variant="primary" size="md" onClick={() => { setDraft({ ...profile }); setIsEditing(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Edit3 size={15} /> Edit Profile
          </NvButton>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <NvButton variant="secondary" size="md" onClick={handleCancel}>Cancel</NvButton>
            <NvButton variant="primary" size="md" onClick={handleSave}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #6C4DFF, #39B982)' }}>
              <Save size={15} /> Save Changes
            </NvButton>
          </div>
        )}
      </div>

      {saved && (
        <div style={{ padding: '12px 16px', background: 'rgba(57,185,130,0.1)', color: '#39B982', borderRadius: '12px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(57,185,130,0.25)' }}>
          <CheckCircle size={16} /> Profile saved and visible to all users!
        </div>
      )}

      {/* Identity card */}
      <NvCard padding="24px">
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={17} color="var(--accent-primary)" /> Identity
        </h3>

        {/* Avatar picker */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>Avatar / Icon</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {avatarOptions.map(av => (
              <button key={av} onClick={() => isEditing && setDraft(d => ({ ...d, avatar: av }))} disabled={!isEditing}
                style={{ width: '42px', height: '42px', borderRadius: '10px', fontSize: '22px', border: draft.avatar === av ? '2px solid var(--accent-primary)' : '1.5px solid var(--border-light)', background: draft.avatar === av ? 'var(--accent-primary-light)' : 'var(--bg-surface)', cursor: isEditing ? 'pointer' : 'default', transition: 'all 0.15s' }}>
                {av}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>Full Name</label>
            <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} disabled={!isEditing}
              placeholder="Your Name" style={{ ...fieldStyle, cursor: !isEditing ? 'default' : 'text' }}
              onFocus={e => { if (isEditing) { e.target.style.borderColor = 'var(--accent-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-primary-light)'; } }}
              onBlur={e => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.boxShadow = 'none'; }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>Title / Role</label>
            <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} disabled={!isEditing}
              placeholder="Developer & Founder" style={{ ...fieldStyle, cursor: !isEditing ? 'default' : 'text' }}
              onFocus={e => { if (isEditing) { e.target.style.borderColor = 'var(--accent-primary)'; } }}
              onBlur={e => { e.target.style.borderColor = 'var(--border-light)'; }} />
          </div>
        </div>

        <div style={{ marginTop: '14px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>Bio / Description</label>
          <textarea value={draft.bio} onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))} disabled={!isEditing}
            placeholder="Write a short bio about yourself..." rows={3}
            style={{ ...fieldStyle, resize: 'vertical', cursor: !isEditing ? 'default' : 'text' }}
            onFocus={e => { if (isEditing) { e.target.style.borderColor = 'var(--accent-primary)'; } }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-light)'; }} />
        </div>

        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => isEditing && setDraft(d => ({ ...d, isPublic: !d.isPublic }))} disabled={!isEditing}
            style={{ width: '44px', height: '24px', borderRadius: '12px', background: draft.isPublic ? 'var(--accent-primary)' : 'var(--bg-surface)', border: '1.5px solid var(--border-light)', position: 'relative', cursor: isEditing ? 'pointer' : 'default', transition: 'all 0.2s', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: '3px', left: draft.isPublic ? '22px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: draft.isPublic ? '#FFF' : 'var(--text-tertiary)', transition: 'all 0.2s' }} />
          </button>
          <span style={{ fontSize: '13px', fontWeight: '700', color: draft.isPublic ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}>
            {draft.isPublic ? '✅ Profile visible to all users' : '🔒 Profile hidden'}
          </span>
        </div>
      </NvCard>

      {/* Social links card */}
      <NvCard padding="24px">
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link size={17} color="var(--accent-primary)" /> Social Media & Contact Links
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '20px' }}>
          Enter usernames, phone numbers, or full URLs. WhatsApp number should include country code (e.g. +923001234567).
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {socialConfig.map(({ key, label, icon: Icon, color, placeholder }) => (
            <div key={key}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                <Icon size={13} color={color} /> {label}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  value={draft[key]}
                  onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
                  disabled={!isEditing}
                  placeholder={placeholder}
                  style={{ ...fieldStyle, paddingRight: draft[key] ? '38px' : '14px', borderColor: draft[key] ? `${color}66` : 'var(--border-light)', cursor: !isEditing ? 'default' : 'text' }}
                  onFocus={e => { if (isEditing) { e.target.style.borderColor = color; e.target.style.boxShadow = `0 0 0 3px ${color}22`; } }}
                  onBlur={e => { e.target.style.borderColor = draft[key] ? `${color}66` : 'var(--border-light)'; e.target.style.boxShadow = 'none'; }}
                />
                {draft[key] && (
                  <a href={buildUrl(key, draft[key]) || '#'} target="_blank" rel="noopener noreferrer"
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color, textDecoration: 'none', opacity: 0.8 }}>
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </NvCard>

      {/* Live preview */}
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#F0A83A" /> Live Preview (as seen by users)
        </h3>
        <CreatorPublicCardPreview profile={draft} />
      </div>
    </div>
  );
};

// Mini preview using draft data (not localStorage)
const CreatorPublicCardPreview = ({ profile }) => {
  const activeLinks = socialConfig.filter(s => profile[s.key]);
  return (
    <div style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(108,77,255,0.08) 0%, rgba(57,185,130,0.05) 100%)', border: '1px solid rgba(108,77,255,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, var(--accent-primary), #39B982)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
          {profile.avatar || '👑'}
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>{profile.name || 'Developer Name'}</h3>
          <p style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: '700', margin: '2px 0 0' }}>{profile.title || 'Title here'}</p>
        </div>
      </div>
      {profile.bio && <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px', borderLeft: '3px solid var(--accent-primary)', paddingLeft: '10px' }}>{profile.bio}</p>}
      {activeLinks.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {activeLinks.map(({ key, label, icon: Icon, color }) => (
            <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '9px', background: `${color}18`, border: `1.5px solid ${color}44`, color, fontWeight: '700', fontSize: '12px' }}>
              <Icon size={13} /> {label}
            </span>
          ))}
        </div>
      )}
      {activeLinks.length === 0 && <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No links added yet — fill in the form above.</p>}
    </div>
  );
};
