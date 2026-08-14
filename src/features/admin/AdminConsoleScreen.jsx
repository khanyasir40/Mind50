import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, ToggleLeft, ToggleRight, FileText, CheckCircle2, AlertTriangle, UserCheck, ShieldAlert, Award, Lock, Sparkles, Sliders, Clock, RotateCcw, Search } from 'lucide-react';
import { AuthService, USER_ROLES } from '../../core/auth/AuthService';
import { getLeaderboards, getDisabledGames, setGameDisabledStatus, getAdminGameConfigs, getSingleGameAdminConfig, updateSingleGameAdminConfig, resetAllGameAdminConfigs } from '../../data/storage';
import { NvCard } from '../../components/ui/NvCard';
import { NvPill } from '../../components/ui/NvPill';
import { NvButton } from '../../components/ui/NvButton';
import { CreatorProfileEditor } from '../creator/CreatorProfile';

export const AdminConsoleScreen = ({ gamesCatalog }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [session, setSession] = useState(() => AuthService.getActiveSession());
  const [accounts, setAccounts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [leaderboards, setLeaderboards] = useState([]);

  const [disabledMap, setDisabledMap] = useState(() => getDisabledGames());
  const [adminConfigs, setAdminConfigs] = useState(() => getAdminGameConfigs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const refreshData = () => {
    setAccounts(AuthService.getAccounts());
    setAuditLogs(AuthService.getAuditLogs());
    setLeaderboards(getLeaderboards());
    setDisabledMap(getDisabledGames());
    setAdminConfigs(getAdminGameConfigs());
  };

  useEffect(() => {
    AuthService.initializeDefaults().then(() => {
      refreshData();
    });

    const handleConfigChange = () => refreshData();
    window.addEventListener('mind50_admin_configs_changed', handleConfigChange);
    return () => window.removeEventListener('mind50_admin_configs_changed', handleConfigChange);
  }, []);

  const currentUser = session?.user;
  const isAdmin = currentUser?.role === USER_ROLES.ADMIN || currentUser?.role === USER_ROLES.SUPER_ADMIN;

  if (!session || !isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }} className="animate-fade-in">
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-error-bg)', color: 'var(--color-error)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <Lock size={32} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Access Denied
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 20px' }}>
          You must be logged in as an <strong>Admin</strong> or <strong>Super Admin</strong> to access the management console.
        </p>
      </div>
    );
  }

  const handleRoleChange = (userId, newRole) => {
    const res = AuthService.updateUserRole(userId, newRole, currentUser);
    if (res.success) {
      refreshData();
    } else {
      alert(res.error || 'Failed to update role');
    }
  };

  const handleToggleStatus = (userId) => {
    const res = AuthService.toggleUserStatus(userId, currentUser);
    if (res.success) {
      refreshData();
    } else {
      alert(res.error || 'Failed to change status');
    }
  };

  const handleUpdateGameConfig = (gameId, field, value) => {
    updateSingleGameAdminConfig(gameId, { [field]: value });
    refreshData();
    AuthService.logSecurityEvent('ADMIN_CONFIG_UPDATED', `Admin ${currentUser.name} updated ${gameId}: ${field} = ${value}`);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all game configurations to platform defaults?')) {
      resetAllGameAdminConfigs();
      refreshData();
    }
  };

  const filteredGames = gamesCatalog.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) || game.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || game.category.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={26} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>
            Admin Governance Console
          </h2>
          <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', fontWeight: '800', textTransform: 'uppercase' }}>
            {currentUser.role} ACCESS
          </span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Real-time game control center, user governance, anti-cheat validation & system audit logs.
        </p>
      </header>

      {/* Navigation Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <NvPill active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          Overview &amp; Metrics
        </NvPill>
        <NvPill active={activeTab === 'games'} onClick={() => setActiveTab('games')}>
          <Sliders size={14} style={{ display: 'inline', marginRight: '4px' }} />
          Game Engine Controls (50)
        </NvPill>
        <NvPill active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          User Accounts ({accounts.length})
        </NvPill>
        <NvPill active={activeTab === 'anti-cheat'} onClick={() => setActiveTab('anti-cheat')}>
          Anti-Cheat &amp; Leaderboard
        </NvPill>
        <NvPill active={activeTab === 'logs'} onClick={() => setActiveTab('logs')}>
          Audit Logs ({auditLogs.length})
        </NvPill>
        {currentUser?.role === USER_ROLES.SUPER_ADMIN && (
          <NvPill active={activeTab === 'creator'} onClick={() => setActiveTab('creator')}>
            <Sparkles size={13} style={{ display: 'inline', marginRight: '4px' }} />
            Creator Profile
          </NvPill>
        )}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <NvCard padding="20px">
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>REGISTERED ACCOUNTS</span>
              <h3 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', margin: '4px 0' }}>{accounts.length}</h3>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-success)' }}>Active DB persistence</span>
            </NvCard>

            <NvCard padding="20px">
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>CATALOG GAMES</span>
              <h3 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-primary)', margin: '4px 0' }}>50 / 50</h3>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-success)' }}>Full Admin Control</span>
            </NvCard>

            <NvCard padding="20px">
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>SECURITY LOGS</span>
              <h3 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', margin: '4px 0' }}>{auditLogs.length}</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>System audit active</span>
            </NvCard>
          </div>
        </div>
      )}

      {/* TAB 2: GAME ENGINE REAL-TIME CONTROLS (FULL ADMIN CONTROL) */}
      {activeTab === 'games' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Controls Bar & Filters */}
          <NvCard padding="16px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={20} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                    Real-Time Game Governance & Configuration Panel
                  </h3>
                </div>
                <NvButton variant="secondary" size="sm" onClick={handleResetDefaults}>
                  <RotateCcw size={14} /> Reset Defaults
                </NvButton>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Search Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-surface)', padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)', flex: 1, minWidth: '220px' }}>
                  <Search size={16} color="var(--text-tertiary)" />
                  <input
                    type="text"
                    placeholder="Search 50 games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '13px', width: '100%', outline: 'none' }}
                  />
                </div>

                {/* Category Filter Pills */}
                {['ALL', 'MEMORY', 'ATTENTION', 'EXECUTIVE', 'SPEED', 'SPATIAL', 'REASONING'].map((cat) => (
                  <NvPill key={cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(cat)}>
                    {cat}
                  </NvPill>
                ))}
              </div>
            </div>
          </NvCard>

          {/* 50 Games Admin Control Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredGames.map((game) => {
              const cfg = getSingleGameAdminConfig(game.id);

              return (
                <NvCard key={game.id} padding="16px">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {game.name}
                          {!cfg.isActive && (
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--color-error-bg)', color: 'var(--color-error)', fontWeight: '800' }}>
                              DISABLED FOR PLAYERS
                            </span>
                          )}
                        </h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{game.category} • Default Difficulty {game.difficulty}</span>
                      </div>

                      {/* Active Toggle Switch */}
                      <button
                        onClick={() => handleUpdateGameConfig(game.id, 'isActive', !cfg.isActive)}
                        style={{ fontSize: '13px', color: cfg.isActive ? 'var(--color-success)' : 'var(--color-error)', cursor: 'pointer', background: 'var(--bg-surface)', padding: '6px 14px', borderRadius: 'var(--radius-full)', border: `1px solid ${cfg.isActive ? 'var(--color-success)' : 'var(--color-error)'}`, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' }}
                      >
                        {cfg.isActive ? <ToggleRight size={22} color="var(--color-success)" /> : <ToggleLeft size={22} color="var(--color-error)" />}
                        {cfg.isActive ? 'ON FOR PLAYERS' : 'OFF FOR PLAYERS'}
                      </button>
                    </div>

                    {/* Admin Game Configuration Parameters Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                      {/* Control 1: Total Trials */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)' }}>TOTAL TRIALS</label>
                        <select
                          value={cfg.totalTrials}
                          onChange={(e) => handleUpdateGameConfig(game.id, 'totalTrials', Number(e.target.value))}
                          style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontWeight: '700', fontSize: '12px' }}
                        >
                          <option value={3}>3 Trials (Quick)</option>
                          <option value={5}>5 Trials</option>
                          <option value={10}>10 Trials (Standard)</option>
                          <option value={15}>15 Trials</option>
                          <option value={20}>20 Trials (Deep)</option>
                        </select>
                      </div>

                      {/* Control 2: Timer Mode */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)' }}>COUNTDOWN TIMER</label>
                        <select
                          value={cfg.hasTimer ? 'YES' : 'NO'}
                          onChange={(e) => handleUpdateGameConfig(game.id, 'hasTimer', e.target.value === 'YES')}
                          style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontWeight: '700', fontSize: '12px' }}
                        >
                          <option value="YES">⏱️ Timer ON</option>
                          <option value="NO">🚫 Timer OFF (Unlimited)</option>
                        </select>
                      </div>

                      {/* Control 3: Time Limit (Seconds) */}
                      {cfg.hasTimer && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)' }}>TRIAL TIME LIMIT</label>
                          <select
                            value={cfg.timeLimitSeconds}
                            onChange={(e) => handleUpdateGameConfig(game.id, 'timeLimitSeconds', Number(e.target.value))}
                            style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontWeight: '700', fontSize: '12px' }}
                          >
                            <option value={5}>5 Seconds (Strict Min)</option>
                            <option value={8}>8 Seconds</option>
                            <option value={10}>10 Seconds (Standard)</option>
                            <option value={15}>15 Seconds (Comfortable)</option>
                            <option value={20}>20 Seconds</option>
                            <option value={30}>30 Seconds (Generous)</option>
                          </select>
                        </div>
                      )}

                      {/* Control 4: Difficulty Complexity Level */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)' }}>COMPLEXITY / DIFFICULTY</label>
                        <select
                          value={cfg.difficultyMode}
                          onChange={(e) => handleUpdateGameConfig(game.id, 'difficultyMode', e.target.value)}
                          style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontWeight: '700', fontSize: '12px' }}
                        >
                          <option value="EASY">🟢 EASY (Slow &amp; Simple)</option>
                          <option value="NORMAL">🔵 NORMAL (Standard)</option>
                          <option value="HARD">🟠 HARD (Fast &amp; Complex)</option>
                          <option value="PRO">🔴 PRO (Extreme Arcade)</option>
                        </select>
                      </div>

                      {/* Control 5: Memorize Study Exposure Time */}
                      {['digit_span_forward', 'digit_span_backward', 'corsi_blocks', 'spatial_span', 'picture_recall', 'face_name_memory', 'paired_associates', 'object_location', 'visual_pattern_memory', 'map_navigation', 'block_design'].includes(game.id) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)' }}>MEMORIZE STUDY TIME</label>
                          <select
                            value={cfg.memorizeTimeSeconds}
                            onChange={(e) => handleUpdateGameConfig(game.id, 'memorizeTimeSeconds', Number(e.target.value))}
                            style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontWeight: '700', fontSize: '12px' }}
                          >
                            <option value={3}>3.0 Seconds (Fast)</option>
                            <option value={5}>5.0 Seconds (Comfortable)</option>
                            <option value={7}>7.0 Seconds (Generous)</option>
                            <option value={10}>10.0 Seconds (Easy Study)</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </NvCard>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <NvCard padding="0px">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>User Accounts Governance</span>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: '600' }}>Manage roles &amp; permissions</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontWeight: '800' }}>USER</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontWeight: '800' }}>EMAIL</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontWeight: '800' }}>ROLE</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontWeight: '800' }}>STATUS</th>
                  <th style={{ padding: '12px 16px', color: 'var(--text-tertiary)', fontWeight: '800' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      <span style={{ fontSize: '18px', marginRight: '8px' }}>{user.avatar}</span>
                      {user.name}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={currentUser.role !== USER_ROLES.SUPER_ADMIN && user.role === USER_ROLES.SUPER_ADMIN}
                        style={{ padding: '4px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontWeight: '700', fontSize: '12px' }}
                      >
                        <option value={USER_ROLES.PLAYER}>PLAYER</option>
                        <option value={USER_ROLES.ADMIN}>ADMIN</option>
                        <option value={USER_ROLES.SUPER_ADMIN}>SUPER_ADMIN</option>
                      </select>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: '800', background: user.status === 'ACTIVE' ? 'rgba(57,185,130,0.15)' : 'var(--color-error-bg)', color: user.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--color-error)' }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <NvButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                        disabled={user.id === currentUser.id}
                      >
                        {user.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                      </NvButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </NvCard>
      )}

      {/* TAB 4: ANTI-CHEAT & LEADERBOARDS */}
      {activeTab === 'anti-cheat' && (
        <NvCard padding="20px">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ShieldAlert size={20} color="var(--accent-primary)" />
            <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Anti-Cheat Score Audit & Leaderboard Verification
            </h4>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '10px' }}>PLAYER</th>
                  <th style={{ padding: '10px' }}>GAME</th>
                  <th style={{ padding: '10px' }}>SCORE</th>
                  <th style={{ padding: '10px' }}>ACCURACY</th>
                  <th style={{ padding: '10px' }}>TOKEN</th>
                </tr>
              </thead>
              <tbody>
                {leaderboards.map((entry) => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 10px', fontWeight: '700' }}>
                      <span style={{ marginRight: '6px' }}>{entry.userAvatar}</span>
                      {entry.userName}
                    </td>
                    <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{entry.gameId}</td>
                    <td style={{ padding: '12px 10px', fontWeight: '800', color: 'var(--accent-primary)' }}>{entry.score} pts</td>
                    <td style={{ padding: '12px 10px', color: 'var(--color-success)', fontWeight: '700' }}>{entry.accuracy}%</td>
                    <td style={{ padding: '12px 10px', fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                      {entry.token || 'nv_verified_v2'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </NvCard>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <NvCard padding="20px">
          <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '14px' }}>
            System Security & Governance Logs
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', fontFamily: 'monospace' }}>
            {auditLogs.length === 0 ? (
              <div style={{ color: 'var(--text-tertiary)' }}>No audit logs recorded yet.</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} style={{ padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: '800' }}>[{log.type}]</span>{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>{log.details}</span>{' '}
                  <span style={{ color: 'var(--text-tertiary)', float: 'right' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            )}
          </div>
        </NvCard>
      )}

      {/* TAB 6: CREATOR PROFILE (Super Admin only) */}
      {activeTab === 'creator' && currentUser?.role === USER_ROLES.SUPER_ADMIN && (
        <CreatorProfileEditor />
      )}
    </div>
  );
};
