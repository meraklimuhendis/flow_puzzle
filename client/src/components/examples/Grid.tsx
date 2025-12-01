import { useState } from 'react';
import Grid from '../game/Grid';
import { getLevel } from '@/logic/levels';
import { createInitialGameState, GameState } from '@/logic/gameEngine';

export default function GridExample() {
  const level = getLevel('easy');
  const [gameState, setGameState] = useState<GameState>(() => 
    createInitialGameState(level)
  );

  return (
    <Grid
      level={level}
      gameState={gameState}
      onGameStateChange={setGameState}
    />
  );
}
