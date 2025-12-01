import { useState } from 'react';
import DifficultySelector from '../game/DifficultySelector';
import { Difficulty } from '@/logic/levels';

export default function DifficultySelectorExample() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  return (
    <DifficultySelector
      currentDifficulty={difficulty}
      onSelect={setDifficulty}
    />
  );
}
