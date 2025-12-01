import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface TimerProps {
  time: number;
  isRunning: boolean;
  onTimeUpdate: (time: number) => void;
  onReset: () => void;
  showReset: boolean;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function Timer({ time, isRunning, onTimeUpdate, onReset, showReset }: TimerProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        onTimeUpdate(time + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time, onTimeUpdate]);

  return (
    <div className="flex flex-col items-center gap-4" data-testid="timer-container">
      <div
        className="text-3xl md:text-4xl font-semibold tabular-nums tracking-wider text-foreground"
        data-testid="timer-display"
      >
        {formatTime(time)}
      </div>

      {showReset && (
        <Button
          variant="outline"
          size="default"
          onClick={onReset}
          data-testid="button-timer-reset"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      )}
    </div>
  );
}
