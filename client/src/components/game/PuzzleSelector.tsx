import { Button } from '@/components/ui/button';

interface PuzzleSelectorProps {
  currentIndex: number;
  total: number;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export default function PuzzleSelector({
  currentIndex,
  total,
  onSelect,
  disabled = false,
}: PuzzleSelectorProps) {
  return (
    <div className="flex items-center justify-center gap-2" data-testid="puzzle-selector">
      {Array.from({ length: total }, (_, i) => (
        <Button
          key={i}
          variant={currentIndex === i ? 'default' : 'outline'}
          size="default"
          onClick={() => onSelect(i)}
          disabled={disabled}
          className={`min-w-[80px] transition-all duration-200 ${
            currentIndex === i ? 'scale-105' : ''
          }`}
          data-testid={`button-puzzle-${i + 1}`}
        >
          <span className="font-semibold">Puzzle {i + 1}</span>
        </Button>
      ))}
    </div>
  );
}
