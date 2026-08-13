import React from 'react';
import { Home, Gamepad2, Dumbbell, Award, User, Eye, Sun, Moon, Flame, Shield, Settings, Bot, Sparkles } from 'lucide-react';

export const AppShell = ({
  currentTab = 'home',
  onTabChange,
  children,
  userProfile = { name: 'Alex', level: 12, xp: 2450, streak: 5 },
  theme = 'light',
  onToggleTheme,
  onOpenAdmin,
  onOpenAiCoach,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'train', label: 'Train', icon: Dumbbell },
    { id: 'perception', label: 'Lab', icon: Eye },
    { id: 'rank', label: 'Rank', icon: Award },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Desktop Navigation Sidebar (Web / Desktop Breakpoint >= 768px) */}
      <aside
        style={{
          width: '240px',
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-light)',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
        className="desktop-nav-sidebar"
      >
        <div>
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 12px 28px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: '20px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              N
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                NEUROVAULT
              </h1>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '600', letterSpacing: '0.4px' }}>
                COGNITIVE PLATFORM
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '15px',
                    fontWeight: isActive ? '700' : '600',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--accent-primary-light)' : 'transparent',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Icon size={20} color={isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <button
            onClick={onOpenAiCoach}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '700',
              color: '#76B900',
              background: 'rgba(118, 185, 0, 0.12)',
              border: '1px solid rgba(118, 185, 0, 0.3)',
              cursor: 'pointer',
            }}
          >
            <Bot size={18} />
            <span>AI Brain Coach</span>
          </button>

          <button
            onClick={onOpenAdmin}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
            }}
          >
            <Shield size={18} />
            <span>Admin Console</span>
          </button>

          <button
            onClick={onToggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
            }}
          >
            {theme === 'dark' ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
        </div>
      </aside>

      {/* Main App Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header Bar */}
        <header
          style={{
            height: '64px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-light)',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
              {currentTab}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* AI Coach Header Pill Button */}
            <button
              onClick={onOpenAiCoach}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, rgba(118,185,0,0.2) 0%, rgba(108,77,255,0.2) 100%)',
                border: '1px solid rgba(118, 185, 0, 0.4)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={16} color="#76B900" />
              <span>AI Coach</span>
            </button>

            {/* Streak Counter */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-warning-bg)',
                color: 'var(--color-warning)',
                fontSize: '13px',
                fontWeight: '800',
              }}
            >
              <Flame size={16} fill="var(--color-warning)" />
              <span>{userProfile.streak}d</span>
            </div>

            {/* Level Chip */}
            <div
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-primary-light)',
                color: 'var(--accent-primary)',
                fontSize: '12px',
                fontWeight: '800',
              }}
            >
              Lvl {userProfile.level}
            </div>

            {/* Theme Toggle (Mobile Header) */}
            <button
              onClick={onToggleTheme}
              style={{
                padding: '8px',
                borderRadius: '50%',
                background: 'var(--bg-pill)',
                color: 'var(--text-secondary)',
              }}
              className="mobile-theme-btn"
            >
              {theme === 'dark' ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* View Content Body */}
        <main style={{ flex: 1, padding: '24px 20px 90px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {children}
        </main>
      </div>

      {/* Mobile Floating Bottom Navigation Bar (< 768px) */}
      <nav
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '440px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-full)',
          padding: '8px 12px',
          boxShadow: 'var(--shadow-elevated)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 900,
        }}
        className="mobile-bottom-nav"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-full)',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Icon size={20} color={isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)'} />
              <span style={{ fontSize: '10px', fontWeight: isActive ? '800' : '600' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Responsive media queries helper style */}
      <style>{`
        @media (min-width: 768px) {
          .mobile-bottom-nav { display: none !important; }
          .mobile-theme-btn { display: none !important; }
          main { padding-bottom: 32px !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
};
