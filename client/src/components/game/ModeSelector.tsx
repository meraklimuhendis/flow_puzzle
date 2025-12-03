import { GameMode } from '@/logic/levels';
import { Button } from '@/components/ui/button';
import { Type, Shapes, MapPin } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: GameMode;
  onSelect: (mode: GameMode) => void;
  disabled?: boolean;
}

export default function ModeSelector({ currentMode, onSelect, disabled }: ModeSelectorProps) {
  const modes: { value: GameMode; label: string; icon: React.ReactNode }[] = [
    { value: 'letters', label: 'Letters', icon: <Type className="w-4 h-4" /> },
    { value: 'shapes', label: 'Shapes', icon: <Shapes className="w-4 h-4" /> },
    { value: 'maze', label: 'Maze', icon: <MapPin className="w-4 h-4" /> },
  ];

  return (
    <div className="flex gap-2" data-testid="mode-selector">
      {modes.map((mode) => (
        <Button
          key={mode.value}
          variant={currentMode === mode.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(mode.value)}
          disabled={disabled}
          className="flex items-center gap-2"
          data-testid={`mode-${mode.value}`}
        >
          {mode.icon}
          {mode.label}
        </Button>
      ))}
    </div>
  );
}
