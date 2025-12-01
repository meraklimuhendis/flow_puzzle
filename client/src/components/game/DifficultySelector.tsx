import { Button } from '@/components/ui/button';
import { Difficulty } from '@/logic/levels';

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const DIFFICULTY_INFO: Record<Difficulty, string> = {
  easy: '5x5',
  medium: '6x6',
  hard: '7x7',
};

export default function DifficultySelector({
  currentDifficulty,
  onSelect,
  disabled = false,
}: DifficultySelectorProps) {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="flex items-center justify-center gap-2" data-testid="difficulty-selector">
      {difficulties.map((difficulty) => {
        const isActive = currentDifficulty === difficulty;
        
        return (
          <Button
            key={difficulty}
            variant={isActive ? 'default' : 'outline'}
            size="default"
            onClick={() => onSelect(difficulty)}
            disabled={disabled}
            className={`min-w-[90px] transition-all duration-200 ${
              isActive ? 'scale-105' : ''
            }`}
            data-testid={`button-difficulty-${difficulty}`}
          >
            <span className="flex flex-col items-center leading-tight">
              <span className="font-semibold">{DIFFICULTY_LABELS[difficulty]}</span>
              <span className="text-xs opacity-70">{DIFFICULTY_INFO[difficulty]}</span>
            </span>
          </Button>
        );
      })}
    </div>
  );
}
