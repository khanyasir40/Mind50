/* ==========================================================================
   NEUROVAULT PERSISTENCE & LOCAL DATABASE ENGINE (MULTI-USER ENHANCED)
   ========================================================================== */

import { AuthService } from '../core/auth/AuthService';
import { ServerScoringValidator } from '../game_engine/core/ServerScoringValidator';

const STORAGE_KEY_PREFIX = 'neurovault_user_state_';
const GLOBAL_LEADERBOARD_KEY = 'neurovault_global_leaderboard_v1';
const DISABLED_GAMES_KEY = 'mind50_disabled_games_v1';
const ADMIN_GAME_CONFIGS_KEY = 'mind50_admin_game_configs_v2';

export const getDisabledGames = () => {
  try {
    const raw = localStorage.getItem(DISABLED_GAMES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const setGameDisabledStatus = (gameId, isDisabled) => {
  const current = getDisabledGames();
  if (isDisabled) {
    current[gameId] = true;
  } else {
    delete current[gameId];
  }
  localStorage.setItem(DISABLED_GAMES_KEY, JSON.stringify(current));
  window.dispatchEvent(new CustomEvent('mind50_game_flags_changed', { detail: current }));
  return current;
};

export const isGameDisabled = (gameId) => {
  const disabledMap = getDisabledGames();
  return !!disabledMap[gameId];
};

export const getAdminGameConfigs = () => {
  try {
    const raw = localStorage.getItem(ADMIN_GAME_CONFIGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const getSingleGameAdminConfig = (gameId) => {
  const configs = getAdminGameConfigs();
  const isDefaultDisabled = gameId === 'sequence_reproduction' || gameId === 'tower_of_london';
  const disabledMap = getDisabledGames();

  const defaultConfig = {
    isActive: isDefaultDisabled ? false : !disabledMap[gameId],
    totalTrials: 10,
    hasTimer: !['tower_of_hanoi', 'tower_of_london', 'maze_planning', 'wisconsin_card_sorting', 'logic_grid', 'planning_challenge', 'abstract_reasoning'].includes(gameId),
    timeLimitSeconds: 10,
    difficultyMode: 'NORMAL',
    memorizeTimeSeconds: 5,
  };

  return { ...defaultConfig, ...(configs[gameId] || {}) };
};

export const updateSingleGameAdminConfig = (gameId, newSettings) => {
  const configs = getAdminGameConfigs();
  const current = getSingleGameAdminConfig(gameId);
  const updated = { ...current, ...newSettings };
  configs[gameId] = updated;
  localStorage.setItem(ADMIN_GAME_CONFIGS_KEY, JSON.stringify(configs));

  setGameDisabledStatus(gameId, !updated.isActive);
  window.dispatchEvent(new CustomEvent('mind50_admin_configs_changed', { detail: { gameId, updated } }));
  return configs;
};

export const resetAllGameAdminConfigs = () => {
  localStorage.removeItem(ADMIN_GAME_CONFIGS_KEY);
  localStorage.removeItem(DISABLED_GAMES_KEY);
  setGameDisabledStatus('sequence_reproduction', true);
  setGameDisabledStatus('tower_of_london', true);
  window.dispatchEvent(new CustomEvent('mind50_admin_configs_changed', { detail: {} }));
};

const defaultState = {
  user: {
    id: 'usr_guest',
    name: 'Cognitive Explorer',
    email: 'player@mind50.com',
    role: 'PLAYER',
    avatar: '🧩',
    xp: 1250,
    level: 5,
    streak: 3,
    lastPlayedDate: new Date().toISOString().split('T')[0],
    joinedAt: new Date().toISOString(),
  },
  scores: {
    memory: 740,
    attention: 810,
    speed: 690,
    logic: 780,
    spatial: 720,
    flexibility: 750,
    inhibition: 800,
  },
  gameProgress: {}, // { [gameId]: { bestScore: 920, attemptsCount: 14, lastPlayed: '...' } }
  achievements: [
    { id: 'first_game', unlockedAt: new Date().toISOString() },
    { id: 'streak_3', unlockedAt: new Date().toISOString() },
  ],
  dailyChallenge: {
    lastCompletedDate: null,
    history: [],
  },
  settings: {
    theme: 'light',
    sound: true,
    haptics: true,
    highContrast: false,
    reducedMotion: false,
  },
};

/**
 * Load state for currently authenticated session or active user
 */
export const loadUserState = () => {
  const session = AuthService.getActiveSession();
  const userId = session ? session.user.id : 'usr_guest';
  const key = STORAGE_KEY_PREFIX + userId;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      const state = {
        ...defaultState,
        user: {
          ...defaultState.user,
          ...(session ? session.user : {}),
        },
      };
      saveUserState(state);
      return state;
    }
    const parsed = JSON.parse(raw);
    if (session) {
      parsed.user = { ...parsed.user, ...session.user };
    }
    return { ...defaultState, ...parsed };
  } catch (e) {
    console.error('Failed to load user state from localStorage:', e);
    return defaultState;
  }
};

/**
 * Save state for currently authenticated user
 */
export const saveUserState = (state) => {
  const userId = state.user?.id || 'usr_guest';
  const key = STORAGE_KEY_PREFIX + userId;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save user state:', e);
  }
};

/**
 * Record a game attempt, update user XP, level, category score, and leaderboards
 */
export const recordGameAttempt = (gameId, category, score, accuracy, reactionMs, difficulty = 1) => {
  const state = loadUserState();
  const current = state.gameProgress[gameId] || { bestScore: 0, attemptsCount: 0 };
  const isNewBest = score > current.bestScore;

  const xpEarned = Math.round((score * (accuracy / 100)) / 10) + 20;
  const newXp = state.user.xp + xpEarned;
  const newLevel = Math.floor(newXp / 300) + 1;

  // Update category skill score gradually
  const catKey = category.toLowerCase();
  if (state.scores[catKey] !== undefined) {
    state.scores[catKey] = Math.min(1000, Math.round(state.scores[catKey] * 0.9 + score * 0.1));
  }

  state.user.xp = newXp;
  state.user.level = newLevel;

  // Streak logic check
  const today = new Date().toISOString().split('T')[0];
  if (state.user.lastPlayedDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (state.user.lastPlayedDate === yesterday) {
      state.user.streak += 1;
    } else {
      state.user.streak = 1;
    }
    state.user.lastPlayedDate = today;
  }

  state.gameProgress[gameId] = {
    bestScore: isNewBest ? score : current.bestScore,
    attemptsCount: current.attemptsCount + 1,
    lastPlayed: new Date().toISOString(),
    lastAccuracy: accuracy,
    lastReactionMs: reactionMs,
  };

  saveUserState(state);

  // Submit attempt to global leaderboard if score is valid
  const validation = ServerScoringValidator.validateAttempt({
    seed: Date.now(),
    difficulty,
    durationMs: reactionMs * 10,
    rawScore: score,
    accuracy,
    inputsCount: 10,
  });

  if (validation.valid) {
    recordLeaderboardScore({
      userId: state.user.id,
      userName: state.user.name,
      userAvatar: state.user.avatar,
      gameId,
      category,
      score,
      accuracy,
      reactionMs,
      token: validation.validationToken,
    });
  } else {
    AuthService.logSecurityEvent('FLAGGED_SCORE', `Suspicious score (${score}) flagged for game ${gameId}: ${validation.reason}`);
  }

  return {
    isNewBest,
    xpEarned,
    newLevel,
    updatedState: state,
  };
};

/**
 * Leaderboard persistence helpers
 */
export const getLeaderboards = () => {
  try {
    const raw = localStorage.getItem(GLOBAL_LEADERBOARD_KEY);
    if (!raw) {
      const defaultLeaderboard = [
        { id: 'lb_1', userId: 'usr_superadmin', userName: 'Super Admin', userAvatar: '👑', gameId: 'digit_span_forward', category: 'Memory', score: 1850, accuracy: 100, reactionMs: 340, date: new Date().toISOString() },
        { id: 'lb_2', userId: 'usr_admin', userName: 'Platform Admin', userAvatar: '🛡️', gameId: 'stroop_sprint', category: 'Attention', score: 1720, accuracy: 95, reactionMs: 280, date: new Date().toISOString() },
        { id: 'lb_3', userId: 'usr_player', userName: 'Cognitive Explorer', userAvatar: '🧩', gameId: 'simple_reaction', category: 'Speed', score: 1650, accuracy: 100, reactionMs: 190, date: new Date().toISOString() },
      ];
      localStorage.setItem(GLOBAL_LEADERBOARD_KEY, JSON.stringify(defaultLeaderboard));
      return defaultLeaderboard;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const recordLeaderboardScore = (entry) => {
  try {
    const list = getLeaderboards();
    const newEntry = {
      id: 'lb_' + Math.random().toString(36).substring(2, 9),
      ...entry,
      date: new Date().toISOString(),
    };
    list.unshift(newEntry);
    // Keep top 300 leaderboard entries
    localStorage.setItem(GLOBAL_LEADERBOARD_KEY, JSON.stringify(list.slice(0, 300)));
  } catch (e) {
    console.error('Failed to update leaderboard:', e);
  }
};
