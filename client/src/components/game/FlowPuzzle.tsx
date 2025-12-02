import { useState, useCallback, useEffect, useRef } from 'react';
import DifficultySelector from './DifficultySelector';
import ModeSelector from './ModeSelector';
import Grid from './Grid';
import Timer, { formatTime } from './Timer';
import { Button } from '@/components/ui/button';
import { Difficulty, GameMode, getLevel } from '@/logic/levels';
import { GameState, createInitialGameState } from '@/logic/gameEngine';
import { Play } from 'lucide-react';

type GamePhase = 'not-started' | 'playing' | 'completed';

export default function FlowPuzzle() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [mode, setMode] = useState<GameMode>('letters');
  const [level, setLevel] = useState<any>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [key, setKey] = useState(0);
  const [gamePhase, setGamePhase] = useState<GamePhase>('not-started');
  const [time, setTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const prevSolvedRef = useRef(false);

  // İlk yükleme
  useEffect(() => {
    const loadInitialLevel = async () => {
      setIsLoading(true);
      try {
        const newLevel = await getLevel('easy', 'letters');
        setLevel(newLevel);
        setGameState(createInitialGameState(newLevel));
      } catch (error) {
        console.error('Failed to load initial level:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialLevel();
  }, []);

  // Difficulty veya mode değiştiğinde
  useEffect(() => {
    const loadLevel = async () => {
      setIsLoading(true);
      try {
        const newLevel = await getLevel(difficulty, mode);
        setLevel(newLevel);
        setGameState(createInitialGameState(newLevel));
        setKey((k) => k + 1);
        setGamePhase('not-started');
        setTime(0);
        setFinalTime(0);
        prevSolvedRef.current = false;
      } catch (error) {
        console.error('Failed to load level:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLevel();
  }, [difficulty, mode]);

  // Detect puzzle completion
  useEffect(() => {
    if (gameState?.isSolved && !prevSolvedRef.current && gamePhase === 'playing') {
      prevSolvedRef.current = true;
      setFinalTime(time);
      setGamePhase('completed');
    }
  }, [gameState?.isSolved, gamePhase, time]);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  }, []);

  const handleModeChange = useCallback((newMode: GameMode) => {
    setMode(newMode);
  }, []);

  const handleGameStateChange = useCallback((newState: GameState) => {
    setGameState(newState);
  }, []);

  const handleStart = useCallback(() => {
    setGamePhase('playing');
    setTime(0);
  }, []);

  const handleReset = useCallback(async () => {
    setIsLoading(true);
    try {
      const newLevel = await getLevel(difficulty, mode);
      setLevel(newLevel);
      setGameState(createInitialGameState(newLevel));
      setKey((k) => k + 1);
      setGamePhase('not-started');
      setTime(0);
      setFinalTime(0);
      prevSolvedRef.current = false;
    } catch (error) {
      console.error('Failed to reset level:', error);
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, mode]);

  const handleTimeUpdate = useCallback((newTime: number) => {
    setTime(newTime);
  }, []);

  const isTimerRunning = gamePhase === 'playing';
  const isGamePlayable = gamePhase === 'playing';

  // Loading state
  if (isLoading || !level || !gameState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-50 dark:bg-gray-900"
      data-testid="flow-puzzle-container"
    >
      <div className="flex flex-col items-center gap-8 w-full max-w-lg">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="text-game-title">
            Flow Puzzle
          </h1>
          <p className="text-muted-foreground text-sm md:text-base" data-testid="text-game-subtitle">
            Connect matching letters without crossing paths
          </p>
        </div>

        <ModeSelector
          currentMode={mode}
          onSelect={handleModeChange}
          disabled={gamePhase === 'playing'}
        />

        <DifficultySelector
          currentDifficulty={difficulty}
          onSelect={handleDifficultyChange}
          disabled={gamePhase === 'playing'}
        />

        <div className="relative" data-testid="grid-container">
          <div className={gamePhase === 'not-started' ? 'blur-sm pointer-events-none' : ''}>
            <Grid
              key={key}
              level={level}
              gameState={gameState}
              onGameStateChange={isGamePlayable ? handleGameStateChange : () => {}}
            />
          </div>

          {/* Start Overlay */}
          {gamePhase === 'not-started' && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 rounded-xl"
              data-testid="start-overlay"
            >
              <Button
                size="lg"
                onClick={handleStart}
                className="px-8 py-6 text-lg"
                data-testid="button-start-game"
              >
                <Play className="w-6 h-6 mr-3" />
                Start
              </Button>
            </div>
          )}

          {/* Completion Popup */}
          {gamePhase === 'completed' && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 rounded-xl backdrop-blur-sm"
              data-testid="completion-overlay"
            >
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2" data-testid="text-puzzle-completed">
                  Puzzle Completed!
                </p>
                <p className="text-xl font-semibold text-foreground mb-6" data-testid="text-final-time">
                  Time: {formatTime(finalTime)}
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                  data-testid="button-play-again"
                >
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>

        <Timer
          time={time}
          isRunning={isTimerRunning}
          onTimeUpdate={handleTimeUpdate}
          onReset={handleReset}
          showReset={gamePhase === 'playing'}
        />
      </div>
    </div>
  );
}
