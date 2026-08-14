import React, { useState } from 'react';
import { Search, Filter, Play, Info, Trophy, Zap, Clock } from 'lucide-react';
import { NvPill } from '../../components/ui/NvPill';
import { NvGameCard } from '../../components/ui/NvGameCard';
import { NvBottomSheet } from '../../components/ui/NvBottomSheet';
import { NvButton } from '../../components/ui/NvButton';

export const GamesLibraryScreen = ({
  gamesCatalog,
  gameProgress,
  onLaunchGame,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedGameDetail, setSelectedGameDetail] = useState(null);

  const categories = ['All', 'Memory', 'Attention', 'Executive', 'Speed', 'Spatial', 'Reasoning', 'Mixed'];
  const difficulties = ['All', 'Lvl 1-2', 'Lvl 3-4', 'Lvl 5'];

  const filteredGames = gamesCatalog.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category.toLowerCase().includes(selectedCategory.toLowerCase());
    let matchesDifficulty = true;
    if (selectedDifficulty === 'Lvl 1-2') matchesDifficulty = game.difficulty <= 2;
    if (selectedDifficulty === 'Lvl 3-4') matchesDifficulty = game.difficulty >= 3 && game.difficulty <= 4;
    if (selectedDifficulty === 'Lvl 5') matchesDifficulty = game.difficulty >= 5;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      {/* Header & Search */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
          Game Catalog ({gamesCatalog.length} Engines)
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Procedurally generated cognitive challenges across 7 key brain dimensions.
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
          <Search size={18} color="var(--text-tertiary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search games, rules, or cognitive skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 46px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Category Pills Slider */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <NvPill
            key={cat}
            active={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </NvPill>
        ))}
      </div>

      {/* Catalog Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '16px',
        }}
      >
        {filteredGames.map((game) => (
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

      {filteredGames.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-tertiary)' }}>
          <p style={{ fontSize: '16px', fontWeight: '600' }}>No games found matching your filters.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setSelectedDifficulty('All'); }}
            style={{ marginTop: '12px', fontSize: '14px', color: 'var(--accent-primary)', fontWeight: '700' }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

