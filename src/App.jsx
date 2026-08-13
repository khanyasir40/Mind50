import React, { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { HomeScreen } from './features/home/HomeScreen';
import { GamesLibraryScreen } from './features/games/GamesLibraryScreen';
import { QuickTrainScreen } from './features/train/QuickTrainScreen';
import { PerceptionLabScreen } from './features/perception/PerceptionLabScreen';
import { LeaderboardsScreen } from './features/rank/LeaderboardsScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { AdminConsoleScreen } from './features/admin/AdminConsoleScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { GameplayHost } from './features/gameplay/GameplayHost';
import { AiCoachDrawer } from './features/ai/AiCoachDrawer';
import { AuthModalScreen } from './features/auth/AuthModalScreen';
import { GAMES_CATALOG } from './game_engine/catalog';
import { loadUserState, saveUserState, recordGameAttempt } from './data/storage';
import { AuthService } from './core/auth/AuthService';

export function App() {
  const [userState, setUserState] = useState(() => loadUserState());
  const [currentTab, setCurrentTab] = useState('home');
  const [activeGameId, setActiveGameId] = useState(null);
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  const handleLaunchGame = (gameId) => {
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
    reloadState();
  };

  const activeGameDefinition = GAMES_CATALOG.find((g) => g.id === activeGameId);

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
            gamesCatalog={GAMES_CATALOG}
            onLaunchGame={handleLaunchGame}
            onStartQuickTrain={() => setCurrentTab('train')}
            onStartDailyChallenge={() => handleLaunchGame('digit_span_forward')}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'games' && (
          <GamesLibraryScreen
            gamesCatalog={GAMES_CATALOG}
            gameProgress={userState.gameProgress}
            onLaunchGame={handleLaunchGame}
          />
        )}

        {currentTab === 'train' && (
          <QuickTrainScreen
            userScores={userState.scores}
            onStartSession={(count) => {
              const randomGame = GAMES_CATALOG[Math.floor(Math.random() * GAMES_CATALOG.length)].id;
              handleLaunchGame(randomGame);
            }}
          />
        )}

        {currentTab === 'perception' && <PerceptionLabScreen />}

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

      {/* Authentication Modal */}
      <AuthModalScreen
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
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
