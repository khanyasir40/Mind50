import React, { useState, useEffect, useRef } from 'react';
import { X, Pause, Play, Flame, Zap, Shield, Trophy, Clock } from 'lucide-react';
import { ServerScoringValidator } from '../../game_engine/core/ServerScoringValidator';
import { createGameChallenge, calculateGameScore } from '../../game_engine/core/GameEngine';
import { getSingleGameAdminConfig } from '../../data/storage';
import '../../game_engine/games'; // Register all 50 engines
import { NvCard } from '../../components/ui/NvCard';
import { NvButton } from '../../components/ui/NvButton';
import { NvResultCard } from '../../components/ui/NvResultCard';
import { NvProgressBar } from '../../components/ui/NvProgressBar';

// Domain UI Renderers
import {
  DigitSpanRenderer,
  CorsiBlocksRenderer,
  SpatialSpanRenderer,
  PictureRecallRenderer,
  FaceNameMemoryRenderer,
  PairedAssociatesRenderer,
  ObjectLocationRenderer,
  SequenceReproductionRenderer,
  VisualPatternMemoryRenderer,
} from './renderers/MemoryRenderers';

import {
  StroopRenderer,
  TrailMakingRenderer,
  GoNoGoRenderer,
  FlankerRenderer,
  SimonRenderer,
  VisualSearchRenderer,
  CancellationRenderer,
  ContinuousPerformanceRenderer,
  MultipleObjectTrackingRenderer,
} from './renderers/AttentionRenderers';

import {
  WisconsinCardRenderer,
  TowerRenderer,
  RuleSwitchingRenderer,
  DualTaskRenderer,
  CategorySortingRenderer,
  MazePlanningRenderer,
  PlanningChallengeRenderer,
  MathSequenceRenderer,
} from './renderers/PlanningRenderers';

import {
  SimpleReactionRenderer,
  ChoiceReactionRenderer,
  RapidSymbolRenderer,
  NumberReactionRenderer,
  ShapeReactionRenderer,
  ColorReactionRenderer,
} from './renderers/SpeedRenderers';

import {
  MentalRotationRenderer,
  BlockDesignRenderer,
  MirrorImageRenderer,
  SpatialMatchingRenderer,
  MapNavigationRenderer,
  ChangeBlindnessRenderer,
} from './renderers/SpatialRenderers';

import {
  RavenMatrixRenderer,
  PatternCompletionRenderer,
  OddOneOutRenderer,
  LogicGridRenderer,
  SequencePredictionRenderer,
  AbstractReasoningRenderer,
} from './renderers/ReasoningRenderers';

import {
  HiddenObjectRenderer,
  ChallengeFusionRenderer,
} from './renderers/MixedRenderers';

export const GameplayHost = ({
  game,
  userState,
  onFinishGame,
  onClose,
}) => {
  const [gameState, setGameState] = useState('tutorial'); // 'tutorial', 'playing', 'paused', 'finished'
  const [isHardMode, setIsHardMode] = useState(false);
  const [totalTrials, setTotalTrials] = useState(10); // Default to 10 trials for deep replayability!
  const [currentTrial, setCurrentTrial] = useState(1);

  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [comboStreak, setComboStreak] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [resultData, setResultData] = useState(null);

  // Live Trial Countdown Timer (ms remaining for reaction/speed games)
  const [trialTimeLeftMs, setTrialTimeLeftMs] = useState(null);

  const [challenge, setChallenge] = useState(null);
  const [trialPhase, setTrialPhase] = useState('show'); // 'show', 'input'
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', 'timeout'
  const [reactionStartMs, setReactionStartMs] = useState(0);

  const seedRef = useRef(Date.now() + Math.floor(Math.random() * 10000));
  const phaseTimeoutRef = useRef(null);
  const correctCountRef = useRef(0);
  const scoreRef = useRef(0);
  const isRespondingRef = useRef(false);

  const loadNextTrial = (trialIndex, hardModeActive = isHardMode) => {
    isRespondingRef.current = false;
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }

    setFeedback(null);
    setTrialPhase('show');
    setTrialTimeLeftMs(null);

    const newSeed = seedRef.current + trialIndex * 1337;
    const ch = createGameChallenge(game.id, newSeed, game.difficulty, hardModeActive, trialIndex);
    setChallenge(ch);
    setReactionStartMs(Date.now());

    // Auto phase transition for memory/exposure games
    if (['digit_span_forward', 'digit_span_backward', 'corsi_blocks', 'spatial_span', 'picture_recall', 'face_name_memory', 'paired_associates', 'object_location', 'visual_pattern_memory', 'map_navigation', 'block_design'].includes(game.id)) {
      const delay = ch.payload.displayDurationMs || ch.payload.exposureMs || ch.payload.studyDurationMs || 2500;
      phaseTimeoutRef.current = setTimeout(() => {
        setTrialPhase('input');
        setReactionStartMs(Date.now());
      }, delay);
    } else {
      setTrialPhase('input');
    }
  };

  useEffect(() => {
    correctCountRef.current = 0;
    scoreRef.current = 0;
    isRespondingRef.current = false;
    loadNextTrial(1, isHardMode);
  }, [game.id, isHardMode]);

  // Main Session Elapsed Timer
  useEffect(() => {
    let timerId;
    if (gameState === 'playing') {
      const intervalStart = Date.now() - elapsedMs;
      timerId = setInterval(() => {
        setElapsedMs(Date.now() - intervalStart);
      }, 50);
    }
    return () => clearInterval(timerId);
  }, [gameState]);

  // Live Trial Countdown Timer Effect
  useEffect(() => {
    let timerId;
    const noTimeLimitGames = ['tower_of_hanoi', 'tower_of_london', 'maze_planning', 'wisconsin_card_sorting', 'logic_grid', 'planning_challenge', 'abstract_reasoning'];

    if (gameState === 'playing' && trialPhase === 'input' && challenge && !noTimeLimitGames.includes(game.id) && challenge.payload.timeLimitMs !== null) {
      const limitMs = challenge.payload.timeLimitMs || challenge.payload.durationMs || (isHardMode ? 7000 : 12000);
      const startMs = Date.now();

      timerId = setInterval(() => {
        const remaining = Math.max(0, limitMs - (Date.now() - startMs));
        setTrialTimeLeftMs(remaining);

        if (remaining <= 0) {
          clearInterval(timerId);
          if (!isRespondingRef.current) {
            isRespondingRef.current = true;
            setFeedback('timeout');
            setComboStreak(0);
            setTimeout(() => {
              if (currentTrial < totalTrials) {
                setCurrentTrial(prev => prev + 1);
                loadNextTrial(currentTrial + 1, isHardMode);
              } else {
                completeGameSession();
              }
            }, 700);
          }
        }
      }, 50);
    } else {
      setTrialTimeLeftMs(null);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [gameState, trialPhase, challenge, currentTrial, totalTrials, isHardMode, game.id]);

  const handleUserResponse = (sessionResultPayload) => {
    if (gameState !== 'playing' || isRespondingRef.current) return;
    isRespondingRef.current = true;

    const rtMs = Date.now() - reactionStartMs;
    const fullResultPayload = {
      ...sessionResultPayload,
      reactionTimeMs: rtMs,
      totalTimeMs: elapsedMs,
    };

    const calculated = calculateGameScore(game.id, challenge, fullResultPayload);
    const isCorrect = Boolean(calculated.isCorrect);

    if (isCorrect) {
      const newCombo = comboStreak + 1;
      setComboStreak(newCombo);
      const comboBonus = Math.min(newCombo * 50, 250);
      setFeedback('correct');
      correctCountRef.current += 1;
      setCorrectCount(correctCountRef.current);

      const added = calculated.score + comboBonus;
      scoreRef.current += added;
      setScore(scoreRef.current);
    } else {
      setComboStreak(0);
      setFeedback('incorrect');
    }

    setTimeout(() => {
      if (currentTrial < totalTrials) {
        setCurrentTrial((prev) => prev + 1);
        loadNextTrial(currentTrial + 1, isHardMode);
      } else {
        completeGameSession();
      }
    }, 600);
  };

  const completeGameSession = () => {
    setGameState('finished');
    const finalCorrect = correctCountRef.current;
    const finalTotalScore = scoreRef.current;

    const accuracy = Math.round((finalCorrect / totalTrials) * 100);
    const avgReactionMs = Math.round(elapsedMs / totalTrials);

    const validation = ServerScoringValidator.validateAttempt({
      seed: seedRef.current,
      difficulty: game.difficulty,
      durationMs: elapsedMs,
      rawScore: finalTotalScore,
      accuracy,
      inputsCount: totalTrials,
    });

    const finalScore = validation.valid ? validation.verifiedScore : finalTotalScore;
    const result = onFinishGame(game.id, game.category, finalScore, accuracy, avgReactionMs);

    setResultData({
      score: finalScore,
      accuracy,
      reactionMs: avgReactionMs,
      isPersonalBest: result?.isNewBest || false,
      xpGained: result?.xpEarned || (isHardMode ? 120 : 70),
    });
  };

  const startGameplay = () => {
    setGameState('playing');
    setReactionStartMs(Date.now());
  };

  if (!challenge) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="animate-fade-in"
    >
      {/* Gameplay HUD Header */}
      <header
        style={{
          height: '60px',
          padding: '0 20px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button onClick={onClose} style={{ padding: '8px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
          <X size={22} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>{game.name}</h3>
            {isHardMode && (
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--color-error)', color: '#FFF', fontWeight: '800', textTransform: 'uppercase' }}>
                PRO HARD MODE
              </span>
            )}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Trial {currentTrial} of {totalTrials}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {trialTimeLeftMs !== null && trialPhase === 'input' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: trialTimeLeftMs < 3000 ? 'var(--color-error-bg)' : 'var(--accent-primary-light)',
                color: trialTimeLeftMs < 3000 ? 'var(--color-error)' : 'var(--accent-primary)',
                fontWeight: '800',
                fontSize: '13px',
                border: trialTimeLeftMs < 3000 ? '1px solid var(--color-error)' : '1px solid var(--border-light)',
                transition: 'all 0.2s ease',
              }}
            >
              <Clock size={15} />
              {(trialTimeLeftMs / 1000).toFixed(1)}s
            </div>
          )}
          {comboStreak > 1 && (
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Flame size={14} /> {comboStreak}x COMBO
            </span>
          )}
          <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--accent-primary)' }}>{score} pts</span>
          <button
            onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
            style={{ padding: '8px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {gameState === 'playing' ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <NvProgressBar progress={(currentTrial / totalTrials) * 100} height={4} color={isHardMode ? 'var(--color-error)' : 'var(--accent-primary)'} />

      {/* Dynamic Live Trial Time Limit Countdown Bar */}
      {trialTimeLeftMs !== null && trialPhase === 'input' && challenge && (
        <NvProgressBar
          progress={(trialTimeLeftMs / (challenge.payload.timeLimitMs || (isHardMode ? 7000 : 12000))) * 100}
          height={3}
          color={trialTimeLeftMs < 3000 ? 'var(--color-error)' : 'var(--color-warning)'}
        />
      )}

      {/* Main Gameplay Arena Body */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', overflowY: 'auto' }}>
        {gameState === 'tutorial' && (
          <NvCard padding="28px" variant="hero" style={{ maxWidth: '440px', textAlign: 'center' }}>
            <span style={{ padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
              {game.category} • Level {game.difficulty}
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', margin: '12px 0 8px' }}>
              {game.name}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
              {game.tutorial}
            </p>

            {/* Mode Selector */}
            <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
                SELECT DIFFICULTY MODE
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => setIsHardMode(false)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: !isHardMode ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                    background: !isHardMode ? 'var(--accent-primary-light)' : 'var(--bg-base)',
                    color: !isHardMode ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  NORMAL (10 Trials)
                </button>
                <button
                  onClick={() => setIsHardMode(true)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: isHardMode ? '2px solid var(--color-error)' : '1px solid var(--border-light)',
                    background: isHardMode ? 'var(--color-error-bg)' : 'var(--bg-base)',
                    color: isHardMode ? 'var(--color-error)' : 'var(--text-secondary)',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  🔥 HARD MODE (PRO)
                </button>
              </div>
            </div>

            <NvButton variant="primary" size="lg" fullWidth onClick={startGameplay}>
              Start {isHardMode ? 'PRO Hard Challenge' : 'Challenge'}
            </NvButton>
          </NvCard>
        )}

        {gameState === 'playing' && (
          <div style={{ width: '100%', maxWidth: '480px', textAlign: 'center' }}>
            {/* Feedback Banner */}
            {feedback === 'correct' && (
              <div style={{ color: 'var(--color-success)', fontWeight: '800', fontSize: '20px', marginBottom: '16px' }}>
                ✓ Correct! (+{Math.round(200 + game.difficulty * 25 + (isHardMode ? 100 : 0))} pts)
              </div>
            )}
            {feedback === 'incorrect' && (
              <div style={{ color: 'var(--color-error)', fontWeight: '800', fontSize: '20px', marginBottom: '16px' }}>
                ✗ Incorrect
              </div>
            )}
            {feedback === 'timeout' && (
              <div style={{ color: 'var(--color-warning)', fontWeight: '800', fontSize: '20px', marginBottom: '16px' }}>
                ⏰ Time's Up!
              </div>
            )}

            {/* --- MEMORY GAMES (01 - 10) --- */}
            {(game.id === 'digit_span_forward' || game.id === 'digit_span_backward') && (
              <DigitSpanRenderer challenge={challenge} trialPhase={trialPhase} onRespond={handleUserResponse} isBackward={game.id === 'digit_span_backward'} />
            )}
            {game.id === 'corsi_blocks' && (
              <CorsiBlocksRenderer challenge={challenge} trialPhase={trialPhase} onRespond={handleUserResponse} />
            )}
            {game.id === 'spatial_span' && (
              <SpatialSpanRenderer challenge={challenge} trialPhase={trialPhase} onRespond={handleUserResponse} />
            )}
            {game.id === 'picture_recall' && (
              <PictureRecallRenderer challenge={challenge} trialPhase={trialPhase} onRespond={handleUserResponse} />
            )}
            {game.id === 'face_name_memory' && (
              <FaceNameMemoryRenderer challenge={challenge} trialPhase={trialPhase} onRespond={handleUserResponse} />
            )}
            {game.id === 'paired_associates' && (
              <PairedAssociatesRenderer challenge={challenge} trialPhase={trialPhase} onRespond={handleUserResponse} />
            )}
            {game.id === 'object_location' && (
              <ObjectLocationRenderer challenge={challenge} trialPhase={trialPhase} onRespond={handleUserResponse} />
            )}
            {game.id === 'sequence_reproduction' && (
              <SequenceReproductionRenderer challenge={challenge} trialPhase={trialPhase} onRespond={handleUserResponse} />
            )}
            {game.id === 'visual_pattern_memory' && (
              <VisualPatternMemoryRenderer challenge={challenge} trialPhase={trialPhase} onRespond={handleUserResponse} />
            )}

            {/* --- ATTENTION GAMES (11 - 20) --- */}
            {game.id === 'stroop_sprint' && (
              <StroopRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {(game.id === 'trail_making_a' || game.id === 'trail_making_b') && (
              <TrailMakingRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'go_no_go' && (
              <GoNoGoRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'flanker_task' && (
              <FlankerRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'simon_task' && (
              <SimonRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'visual_search' && (
              <VisualSearchRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'cancellation_task' && (
              <CancellationRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'continuous_performance' && (
              <ContinuousPerformanceRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'multiple_object_tracking' && (
              <MultipleObjectTrackingRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}

            {/* --- PLANNING GAMES (21 - 30) --- */}
            {game.id === 'wisconsin_card_sorting' && (
              <WisconsinCardRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {(game.id === 'tower_of_london' || game.id === 'tower_of_hanoi') && (
              <TowerRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'rule_switching' && (
              <RuleSwitchingRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'dual_task' && (
              <DualTaskRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'category_sorting' && (
              <CategorySortingRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'maze_planning' && (
              <MazePlanningRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'planning_challenge' && (
              <PlanningChallengeRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {(game.id === 'serial_subtraction' || game.id === 'backward_counting') && (
              <MathSequenceRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}

            {/* --- SPEED GAMES (31 - 36) --- */}
            {game.id === 'simple_reaction' && (
              <SimpleReactionRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'choice_reaction' && (
              <ChoiceReactionRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'rapid_symbol' && (
              <RapidSymbolRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'number_reaction' && (
              <NumberReactionRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'shape_reaction' && (
              <ShapeReactionRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'color_reaction' && (
              <ColorReactionRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}

            {/* --- SPATIAL GAMES (37 - 42) --- */}
            {game.id === 'mental_rotation' && (
              <MentalRotationRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'block_design' && (
              <BlockDesignRenderer challenge={challenge} trialPhase={trialPhase} onRespond={handleUserResponse} />
            )}
            {game.id === 'mirror_image' && (
              <MirrorImageRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'spatial_matching' && (
              <SpatialMatchingRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'map_navigation' && (
              <MapNavigationRenderer challenge={challenge} trialPhase={trialPhase} onRespond={handleUserResponse} />
            )}
            {game.id === 'change_blindness' && (
              <ChangeBlindnessRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}

            {/* --- REASONING GAMES (43 - 48) --- */}
            {game.id === 'raven_matrix' && (
              <RavenMatrixRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'pattern_completion' && (
              <PatternCompletionRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'odd_one_out' && (
              <OddOneOutRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'logic_grid' && (
              <LogicGridRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'sequence_prediction' && (
              <SequencePredictionRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'abstract_reasoning' && (
              <AbstractReasoningRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}

            {/* --- MIXED GAMES (49 - 50) --- */}
            {game.id === 'hidden_object' && (
              <HiddenObjectRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
            {game.id === 'challenge_fusion' && (
              <ChallengeFusionRenderer challenge={challenge} onRespond={handleUserResponse} />
            )}
          </div>
        )}

        {gameState === 'finished' && resultData && (
          <NvResultCard
            gameName={game.name}
            score={resultData.score}
            accuracy={resultData.accuracy}
            reactionMs={resultData.reactionMs}
            isPersonalBest={resultData.isPersonalBest}
            xpGained={resultData.xpGained}
            onPlayAgain={() => {
              setGameState('playing');
              setCurrentTrial(1);
              setScore(0);
              setCorrectCount(0);
              setComboStreak(0);
              setElapsedMs(0);
              loadNextTrial(1, isHardMode);
            }}
            onNext={onClose}
            onBackToHome={onClose}
          />
        )}
      </main>
    </div>
  );
};
