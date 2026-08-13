import React, { useState, useEffect } from 'react';
import { Award, Trophy, Users, Swords, ShieldCheck, Flame, ArrowUpRight } from 'lucide-react';
import { getLeaderboards } from '../../data/storage';
import { NvCard } from '../../components/ui/NvCard';
import { NvPill } from '../../components/ui/NvPill';
import { NvButton } from '../../components/ui/NvButton';
import { NvBadge } from '../../components/ui/NvBadge';

export const LeaderboardsScreen = ({
  userState,
  onStartDuel,
}) => {
  const [activeTab, setActiveTab] = useState('global');
  const [boardData, setBoardData] = useState([]);

  useEffect(() => {
    const list = getLeaderboards();
    setBoardData(list);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Leaderboard & Brain Duel
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Server-validated competitive rankings and real-time 1v1 match play.
        </p>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <NvPill active={activeTab === 'global'} onClick={() => setActiveTab('global')}>
          Global Verified Season
        </NvPill>
        <NvPill active={activeTab === 'duel'} onClick={() => setActiveTab('duel')}>
          Brain Duel (1v1)
        </NvPill>
      </div>

      {activeTab === 'global' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top 3 Podium */}
          {boardData.length >= 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', alignItems: 'end', marginTop: '12px' }}>
              {/* Rank 2 */}
              <NvCard padding="16px" style={{ textAlign: 'center', background: 'var(--bg-surface-elevated)' }}>
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '4px' }}>{boardData[1].userAvatar}</span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-tertiary)' }}>#2</span>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: '2px 0' }}>{boardData[1].userName}</h4>
                <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--accent-primary)' }}>{boardData[1].score} pts</span>
              </NvCard>

              {/* Rank 1 */}
              <NvCard padding="20px" variant="hero" style={{ textAlign: 'center', background: 'var(--hero-gradient)', color: '#FFF' }}>
                <span style={{ fontSize: '36px', display: 'block', marginBottom: '4px' }}>👑</span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#FDE047' }}>#1 CHAMPION</span>
                <h4 style={{ fontSize: '16px', fontWeight: '800', margin: '4px 0' }}>{boardData[0].userName}</h4>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>{boardData[0].score} pts</span>
              </NvCard>

              {/* Rank 3 */}
              <NvCard padding="16px" style={{ textAlign: 'center', background: 'var(--bg-surface-elevated)' }}>
                <span style={{ fontSize: '28px', display: 'block', marginBottom: '4px' }}>{boardData[2].userAvatar}</span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-tertiary)' }}>#3</span>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', margin: '2px 0' }}>{boardData[2].userName}</h4>
                <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--accent-primary)' }}>{boardData[2].score} pts</span>
              </NvCard>
            </div>
          )}

          {/* Leaderboard List Rows */}
          <NvCard padding="0px">
            {boardData.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>No leaderboard entries yet. Play a game to record a score!</div>
            ) : (
              boardData.map((item, index) => {
                const isUser = item.userId === userState.user.id;
                return (
                  <div
                    key={item.id || index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      borderBottom: index < boardData.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      background: isUser ? 'var(--accent-primary-light)' : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800', color: isUser ? 'var(--accent-primary)' : 'var(--text-tertiary)', width: '28px' }}>
                        #{index + 1}
                      </span>
                      <span style={{ fontSize: '20px' }}>{item.userAvatar || '🧩'}</span>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: isUser ? '800' : '700', color: 'var(--text-primary)' }}>
                          {item.userName} {isUser && '(You)'}
                        </h4>
                        <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Game: {item.gameId} • {item.accuracy}% acc</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <NvBadge variant="success" size="sm" icon={ShieldCheck}>
                        Verified
                      </NvBadge>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {item.score} pts
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </NvCard>
        </div>
      ) : (
        /* Brain Duel Mode */
        <NvCard padding="28px" variant="hero" style={{ textAlign: 'center' }}>
          <Swords size={48} color="var(--accent-primary)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Brain Duel 1v1 Arena
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '420px', margin: '0 auto 24px' }}>
            Compete head-to-head on synchronous deterministic challenge seeds. Server authoritative score verification ensures fair play.
          </p>

          <NvButton variant="primary" size="lg" icon={Swords} onClick={onStartDuel} style={{ margin: '0 auto' }}>
            Find Match (Best of 3)
          </NvButton>
        </NvCard>
      )}
    </div>
  );
};
