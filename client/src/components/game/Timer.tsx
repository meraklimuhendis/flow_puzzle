import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  isPuzzleSolved: boolean;
  onReset?: () => void;
}

export default function Timer({ isPuzzleSolved, onReset }: TimerProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [wasAutoStopped, setWasAutoStopped] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wasRunningRef = useRef(false);

  // Track running state in ref for puzzle solved detection
  useEffect(() => {
    wasRunningRef.current = isRunning;
  }, [isRunning]);

  // Auto-pause when puzzle is solved
  useEffect(() => {
    if (isPuzzleSolved && wasRunningRef.current) {
      setIsRunning(false);
      setWasAutoStopped(true);
    }
  }, [isPuzzleSolved]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
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
  }, [isRunning]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
    setWasAutoStopped(false);
  }, []);

  const handlePause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setTime(0);
    setIsRunning(false);
    setWasAutoStopped(false);
    onReset?.();
  }, [onReset]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4" data-testid="timer-container">
      <div
        className={`
          text-3xl md:text-4xl font-semibold tabular-nums tracking-wider
          transition-colors duration-300
          ${wasAutoStopped ? 'text-green-600 dark:text-green-400' : 'text-foreground'}
        `}
        data-testid="timer-display"
      >
        {formatTime(time)}
      </div>

      <div className="flex items-center gap-2">
        {!isRunning ? (
          <Button
            variant="outline"
            size="default"
            onClick={handleStart}
            disabled={isPuzzleSolved}
            data-testid="button-timer-start"
          >
            <Play className="w-4 h-4 mr-2" />
            Start
          </Button>
        ) : (
          <Button
            variant="outline"
            size="default"
            onClick={handlePause}
            data-testid="button-timer-pause"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        )}

        <Button
          variant="outline"
          size="default"
          onClick={handleReset}
          data-testid="button-timer-reset"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {wasAutoStopped && (
        <p className="text-sm text-green-600 dark:text-green-400 font-medium animate-pulse" data-testid="text-puzzle-complete">
          Puzzle Complete!
        </p>
      )}
    </div>
  );
}
