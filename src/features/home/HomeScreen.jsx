import React from 'react';
import { Play, Sparkles, Brain, Zap, Target, ArrowRight, Award, Flame, Eye } from 'lucide-react';
import { NvScoreRing } from '../../components/ui/NvScoreRing';
import { NvHeroCard } from '../../components/ui/NvHeroCard';
import { NvSkillCard } from '../../components/ui/NvSkillCard';
import { NvGameCard } from '../../components/ui/NvGameCard';
import { NvButton } from '../../components/ui/NvButton';
import { NvCard } from '../../components/ui/NvCard';

export const HomeScreen = ({
  userState,
  gamesCatalog,
  onLaunchGame,
  onStartQuickTrain,
  onStartDailyChallenge,
  onNavigateTab,
}) => {
  const { user, scores, gameProgress } = userState;
  
  // Calculate average Brain Score
  const scoreValues = Object.values(scores);
  const avgBrainScore = Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length);

  // Pick top 3 recent / recommended games
  const recommendedGames = gamesCatalog.slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="animate-fade-in">
      {/* Top Greeting & Brain Score Dashboard Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
        <NvCard padding="24px" variant="hero" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', justifyContent: 'center' }}>
          <NvScoreRing score={avgBrainScore} maxScore={1000} size={130} label="BRAIN SCORE" />
          <div style={{ flex: '1 1 220px', minWidth: 0, textAlign: 'left' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              WELCOME BACK, {user.name.toUpperCase()}
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)', margin: '4px 0 6px', lineHeight: 1.25 }}>
              Your mind is sharp today.
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
              You're on a <strong style={{ color: 'var(--color-warning)' }}>{user.streak}-day streak</strong>! Complete today's session to keep building focus.
            </p>
            <NvButton size="sm" variant="primary" icon={Zap} onClick={onStartQuickTrain} style={{ width: 'auto', display: 'inline-flex' }}>
              Quick Train (4 mins)
            </NvButton>
          </div>
        </NvCard>

        {/* Daily Challenge Featured Card */}
        <NvHeroCard onStart={onStartDailyChallenge} />
      </div>

      {/* Cognitive Skill Radar Breakdown */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
              Cognitive Profile
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Performance metrics across 7 cognitive dimensions
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('profile')}
            style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            View Details <ArrowRight size={14} />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '12px',
          }}
        >
          <NvSkillCard name="Memory" score={scores.memory} color="#6C4DFF" icon={Brain} trend="+8%" />
          <NvSkillCard name="Attention" score={scores.attention} color="#06B6D4" icon={Target} trend="+12%" />
          <NvSkillCard name="Speed" score={scores.speed} color="#F59E0B" icon={Zap} trend="+5%" />
          <NvSkillCard name="Logic" score={scores.logic} color="#10B981" icon={Sparkles} trend="+14%" />
          <NvSkillCard name="Spatial" score={scores.spatial} color="#EC4899" icon={Eye} trend="+9%" />
          <NvSkillCard name="Flexibility" score={scores.flexibility} color="#8B5CF6" icon={Award} trend="+10%" />
        </div>
      </div>

      {/* Featured Games Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
              Recommended Games
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Tailored for your current cognitive dimensions
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('games')}
            style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Explore All {gamesCatalog.length} <ArrowRight size={14} />
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          {recommendedGames.map((game) => (
            <NvGameCard
              key={game.id}
              id={game.id}
              name={game.name}
              category={game.category}
              description={game.description}
              difficulty={game.difficulty}
              bestScore={gameProgress[game.id]?.bestScore || null}
              onPlay={() => onLaunchGame(game.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
