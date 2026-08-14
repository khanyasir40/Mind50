import React, { useState } from 'react';
import { User, Award, Flame, Zap, Trophy, ShieldCheck, Clock, Settings, Brain, LogOut, Key, CheckCircle } from 'lucide-react';
import { AuthService } from '../../core/auth/AuthService';
import { NvCard } from '../../components/ui/NvCard';
import { NvProgressBar } from '../../components/ui/NvProgressBar';
import { NvButton } from '../../components/ui/NvButton';
import { CreatorPublicCard } from '../creator/CreatorProfile';

export const ProfileScreen = ({
  userState,
  onNavigateTab,
  onOpenAuthModal,
  onLogout,
}) => {
  const { user, scores, gameProgress } = userState;
  const session = AuthService.getActiveSession();
  const activeUser = session?.user || user;

  const nextLevelXp = user.level * 300;
  const currentLevelXp = user.xp % 300;
  const xpPercent = (currentLevelXp / 300) * 100;

  const achievementList = [
    { id: 'first_game', name: 'First Challenge', desc: 'Completed your 1st cognitive task', icon: '🎯', unlocked: true },
    { id: 'streak_3', name: '3-Day Focus', desc: 'Maintained a 3-day training streak', icon: '🔥', unlocked: user.streak >= 3 },
    { id: 'perfect_run', name: 'Perfect Accuracy', desc: 'Achieved 100% accuracy on a level', icon: '💎', unlocked: true },
    { id: 'speed_demon', name: 'Speed Demon', desc: 'Sub-250ms average reaction time', icon: '⚡', unlocked: user.level >= 3 },
    { id: 'memory_master', name: 'Memory Master', desc: 'Reached Level 5 in Digit Span', icon: '🧠', unlocked: user.level >= 5 },
  ];

  const attemptsTotal = Object.values(gameProgress || {}).reduce((sum, p) => sum + (p.attemptsCount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      {/* Profile Header Card */}
      <NvCard padding="28px" variant="hero" style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
          <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'var(--accent-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '42px', border: '3px solid var(--accent-primary)', margin: '0 auto' }}>
            {activeUser.avatar || user.avatar || '🧩'}
          </div>
          <span style={{ position: 'absolute', bottom: '0', right: '-4px', background: 'var(--color-warning)', color: '#FFF', borderRadius: 'var(--radius-full)', padding: '2px 8px', fontSize: '11px', fontWeight: '800' }}>
            Lvl {user.level}
          </span>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '2px' }}>
          {activeUser.name || user.name}
        </h2>
        <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: 'var(--radius-full)', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px', display: 'inline-block' }}>
          Role: {activeUser.role || 'PLAYER'}
        </span>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          {activeUser.email || 'player@mind40.com'} • Joined {new Date(user.joinedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
        </p>

        {/* Level XP Progress Bar */}
        <div style={{ maxWidth: '320px', margin: '0 auto 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span>Level {user.level}</span>
            <span>{currentLevelXp} / 300 XP</span>
          </div>
          <NvProgressBar progress={xpPercent} height={10} color="var(--accent-primary)" />
        </div>

        {/* Quick Stat Chips */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'var(--color-warning-bg)', color: 'var(--color-warning)', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={16} fill="var(--color-warning)" />
            {user.streak} Days Streak
          </div>
          <div style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Trophy size={16} />
            {user.xp} Total XP
          </div>
          <div style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Brain size={16} />
            {attemptsTotal} Trials Played
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {(activeUser.role === 'SUPER_ADMIN' || activeUser.role === 'ADMIN') && (
            <NvButton variant="primary" size="md" onClick={() => onNavigateTab('admin')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #6C4DFF, #e85d75)' }}>
              <ShieldCheck size={16} /> Open Admin Console
            </NvButton>
          )}

          {session ? (
            <NvButton variant="secondary" size="md" onClick={onLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={16} /> Sign Out
            </NvButton>
          ) : (
            <NvButton variant="primary" size="md" onClick={onOpenAuthModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Key size={16} /> Sign In / Register
            </NvButton>
          )}
        </div>
      </NvCard>

      {/* Cognitive Skills Breakdown */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
          Cognitive Domain Performance
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {Object.entries(scores || {}).map(([domain, scoreVal]) => (
            <NvCard key={domain} padding="16px">
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                {domain}
              </span>
              <h4 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-primary)', margin: '4px 0 8px' }}>
                {scoreVal} pts
              </h4>
              <NvProgressBar progress={(scoreVal / 1000) * 100} height={6} color="var(--accent-primary)" />
            </NvCard>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
          Achievements &amp; Badges
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
          {achievementList.map((ach) => (
            <NvCard
              key={ach.id}
              padding="16px"
              style={{
                opacity: ach.unlocked ? 1 : 0.5,
                background: ach.unlocked ? 'var(--bg-surface)' : 'var(--bg-surface-elevated)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>{ach.icon}</span>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{ach.name}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ach.desc}</p>
                </div>
              </div>
            </NvCard>
          ))}
        </div>
      </div>

      {/* Developer / Creator Section */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
          About the Developer
        </h3>
        <CreatorPublicCard />
      </div>
    </div>
  );
};
