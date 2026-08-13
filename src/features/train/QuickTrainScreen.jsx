import React, { useState } from 'react';
import { Play, Dumbbell, Zap, Clock, ShieldCheck, Flame, RefreshCw } from 'lucide-react';
import { NvCard } from '../../components/ui/NvCard';
import { NvButton } from '../../components/ui/NvButton';
import { NvBadge } from '../../components/ui/NvBadge';

export const QuickTrainScreen = ({
  userScores,
  onStartSession,
}) => {
  const [selectedDuration, setSelectedDuration] = useState(5); // 3, 5, 10 mins

  const workoutPresets = [
    { mins: 3, title: "Quick Focus Sprint", gamesCount: 3, description: "Fast 3-game session for immediate alertness." },
    { mins: 5, title: "Balanced Cognitive Session", gamesCount: 4, description: "Covers Memory, Speed, Attention, and Reasoning." },
    { mins: 10, title: "Deep Focus Mastery", gamesCount: 6, description: "Comprehensive workout across all cognitive dimensions." },
  ];

  const activePreset = workoutPresets.find(p => p.mins === selectedDuration);

  // Find lowest score area
  const lowestDimension = Object.entries(userScores).sort((a, b) => a[1] - b[1])[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Daily Workout Builder
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Adaptive session generator tuned to your cognitive profile.
        </p>
      </div>

      {/* Recommended Weak-Area Highlight Card */}
      <NvCard padding="20px" variant="accent">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Zap size={20} color="var(--accent-primary)" />
          <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-primary)' }}>
            TARGETED FOCUS AREA
          </span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
          Today's session is optimized for your <strong style={{ textTransform: 'capitalize' }}>{lowestDimension ? lowestDimension[0] : 'Speed'}</strong> dimension (Score: {lowestDimension ? lowestDimension[1] : 690}/1000).
        </p>
      </NvCard>

      {/* Duration Selection Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {workoutPresets.map((preset) => (
          <NvCard
            key={preset.mins}
            hoverable
            onClick={() => setSelectedDuration(preset.mins)}
            padding="20px"
            style={{
              border: selectedDuration === preset.mins ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
              background: selectedDuration === preset.mins ? 'var(--accent-primary-light)' : 'var(--bg-surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                {preset.mins} Minutes
              </span>
              <NvBadge variant={selectedDuration === preset.mins ? 'primary' : 'neutral'}>
                {preset.gamesCount} Games
              </NvBadge>
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {preset.title}
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {preset.description}
            </p>
          </NvCard>
        ))}
      </div>

      {/* Start Session CTA */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
        <NvButton
          variant="primary"
          size="lg"
          icon={Play}
          onClick={() => onStartSession(activePreset.gamesCount)}
          style={{ width: '100%', maxWidth: '360px' }}
        >
          Start {selectedDuration}-Min Workout
        </NvButton>
      </div>
    </div>
  );
};
