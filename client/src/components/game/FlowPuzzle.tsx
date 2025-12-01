import { useState, useCallback, useEffect } from 'react';
import DifficultySelector from './DifficultySelector';
import Grid from './Grid';
import Timer from './Timer';
import { Difficulty, getLevel } from '@/logic/levels';
import { GameState, createInitialGameState } from '@/logic/gameEngine';

export default function FlowPuzzle() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [level, setLevel] = useState(() => getLevel('easy'));
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState(level)
  );
  const [key, setKey] = useState(0);

  useEffect(() => {
    const newLevel = getLevel(difficulty);
    setLevel(newLevel);
    setGameState(createInitialGameState(newLevel));
    setKey((k) => k + 1);
  }, [difficulty]);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  }, []);

  const handleGameStateChange = useCallback((newState: GameState) => {
    setGameState(newState);
  }, []);

  const handleReset = useCallback(() => {
    const newLevel = getLevel(difficulty);
    setLevel(newLevel);
    setGameState(createInitialGameState(newLevel));
    setKey((k) => k + 1);
  }, [difficulty]);

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

        <DifficultySelector
          currentDifficulty={difficulty}
          onSelect={handleDifficultyChange}
          disabled={gameState.isDrawing}
        />

        <div className="relative" data-testid="grid-container">
          <Grid
            key={key}
            level={level}
            gameState={gameState}
            onGameStateChange={handleGameStateChange}
          />

          {gameState.isSolved && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-xl backdrop-blur-sm"
              data-testid="victory-overlay"
            >
              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  Puzzle Solved!
                </p>
              </div>
            </div>
          )}
        </div>

        <Timer isPuzzleSolved={gameState.isSolved} onReset={handleReset} />
      </div>
    </div>
  );
}
