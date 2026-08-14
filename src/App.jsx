import React, { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { HomeScreen } from './features/home/HomeScreen';
import { GamesLibraryScreen } from './features/games/GamesLibraryScreen';
import { QuickTrainScreen } from './features/train/QuickTrainScreen';
import { LeaderboardsScreen } from './features/rank/LeaderboardsScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { AdminConsoleScreen } from './features/admin/AdminConsoleScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { GameplayHost } from './features/gameplay/GameplayHost';
import { AiCoachDrawer } from './features/ai/AiCoachDrawer';
import { AuthModalScreen, AuthFullPage } from './features/auth/AuthModalScreen';
import { GAMES_CATALOG } from './game_engine/catalog';
import { loadUserState, saveUserState, recordGameAttempt, getDisabledGames } from './data/storage';
import { AuthService } from './core/auth/AuthService';

export function App() {
  const [userState, setUserState] = useState(() => loadUserState());
  const [currentTab, setCurrentTab] = useState('home');
  const [activeGameId, setActiveGameId] = useState(null);
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // Show full-screen login on first visit until user logs in or skips
  const [showAuthGate, setShowAuthGate] = useState(() => {
    const session = AuthService.getActiveSession();
    const hasSeenGate = sessionStorage.getItem('mind40_gate_seen');
    return !session && !hasSeenGate;
  });

  const [disabledGames, setDisabledGames] = useState(() => getDisabledGames());

  // Listen for admin game flag changes in real-time
  useEffect(() => {
    const handleFlagsChanged = (e) => {
      setDisabledGames(e.detail || getDisabledGames());
    };
    window.addEventListener('mind40_game_flags_changed', handleFlagsChanged);
    return () => window.removeEventListener('mind40_game_flags_changed', handleFlagsChanged);
  }, []);

  // Apply Theme attribute on html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', userState.settings.theme);
  }, [userState.settings.theme]);

  // Ensure default accounts exist
  useEffect(() => {
    AuthService.initializeDefaults();
  }, []);

  const reloadState = () => {
    setUserState(loadUserState());
  };

  const handleUpdateSettings = (newSettings) => {
    const updated = {
      ...userState,
      settings: { ...userState.settings, ...newSettings },
    };
    setUserState(updated);
    saveUserState(updated);
  };

  const handleFinishGame = (gameId, category, score, accuracy, reactionMs) => {
    const result = recordGameAttempt(gameId, category, score, accuracy, reactionMs, activeGameDefinition?.difficulty || 1);
    setUserState(result.updatedState);
    return result;
  };

  const activeCatalog = GAMES_CATALOG.filter(g => !disabledGames[g.id]);

  const handleLaunchGame = (gameId) => {
    if (disabledGames[gameId]) {
      alert('This game has been temporarily disabled by the platform administrator.');
      return;
    }
    setActiveGameId(gameId);
  };

  const handleToggleTheme = () => {
    const nextTheme = userState.settings.theme === 'dark' ? 'light' : 'dark';
    handleUpdateSettings({ theme: nextTheme });
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `neurovault_data_${userState.user.name}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset your local progress?")) {
      localStorage.clear();
      AuthService.initializeDefaults().then(() => {
        reloadState();
      });
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    // Show login gate again on logout
    sessionStorage.removeItem('mind40_gate_seen');
    setShowAuthGate(true);
    reloadState();
  };

  const handleAuthGateSuccess = (session) => {
    sessionStorage.setItem('mind40_gate_seen', '1');
    setShowAuthGate(false);
    reloadState();
  };

  const handleAuthGateSkip = () => {
    sessionStorage.setItem('mind40_gate_seen', '1');
    setShowAuthGate(false);
  };

  const activeGameDefinition = GAMES_CATALOG.find((g) => g.id === activeGameId);

  // ── Full-screen Auth Gate (first visit) ──────────────────────────────────
  if (showAuthGate) {
    return (
      <AuthFullPage
        onAuthSuccess={handleAuthGateSuccess}
        onSkip={handleAuthGateSkip}
      />
    );
  }

  return (
    <>
      <AppShell
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo(0, 0);
        }}
        userProfile={userState.user}
        theme={userState.settings.theme}
        onToggleTheme={handleToggleTheme}
        onOpenAdmin={() => setCurrentTab('admin')}
        onOpenAiCoach={() => setIsAiCoachOpen(true)}
      >
        {currentTab === 'home' && (
          <HomeScreen
            userState={userState}
            gamesCatalog={activeCatalog}
            onLaunchGame={handleLaunchGame}
            onStartQuickTrain={() => setCurrentTab('train')}
            onStartDailyChallenge={() => {
              const daily = activeCatalog.find(g => g.id === 'digit_span_forward') || activeCatalog[0];
              if (daily) handleLaunchGame(daily.id);
            }}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'games' && (
          <GamesLibraryScreen
            gamesCatalog={activeCatalog}
            gameProgress={userState.gameProgress}
            onLaunchGame={handleLaunchGame}
          />
        )}

        {currentTab === 'train' && (
          <QuickTrainScreen
            userScores={userState.scores}
            onStartSession={(count) => {
              if (activeCatalog.length > 0) {
                const randomGame = activeCatalog[Math.floor(Math.random() * activeCatalog.length)].id;
                handleLaunchGame(randomGame);
              }
            }}
          />
        )}

        {currentTab === 'rank' && (
          <LeaderboardsScreen
            userState={userState}
            onStartDuel={() => handleLaunchGame('stroop_sprint')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            userState={userState}
            onNavigateTab={setCurrentTab}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
          />
        )}

        {currentTab === 'admin' && <AdminConsoleScreen gamesCatalog={GAMES_CATALOG} />}

        {currentTab === 'settings' && (
          <SettingsScreen
            settings={userState.settings}
            onUpdateSettings={handleUpdateSettings}
            onExportData={handleExportData}
            onResetData={handleResetData}
          />
        )}
      </AppShell>

      {/* AI Brain Coach Drawer */}
      <AiCoachDrawer
        isOpen={isAiCoachOpen}
        onClose={() => setIsAiCoachOpen(false)}
        userState={userState}
      />

      {/* Authentication Modal (in-app, e.g. from profile button) */}
      <AuthModalScreen
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
          sessionStorage.setItem('mind50_gate_seen', '1');
          reloadState();
        }}
      />

      {/* Active Game Arena Overlay */}
      {activeGameDefinition && (
        <GameplayHost
          game={activeGameDefinition}
          userState={userState}
          onFinishGame={handleFinishGame}
          onClose={() => setActiveGameId(null)}
        />
      )}
    </>
  );
}
