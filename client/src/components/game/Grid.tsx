import { useCallback, useRef, useState, useEffect } from 'react';
import Tile from './Tile';
import PathRenderer from './PathRenderer';
import {
  GameState,
  startPath,
  extendPath,
  endPath,
  getCellColor,
} from '@/logic/gameEngine';
import { DIFFICULTY_CONFIG, Level } from '@/logic/levels';

interface GridProps {
  level: Level;
  gameState: GameState;
  onGameStateChange: (state: GameState) => void;
}

export default function Grid({ level, gameState, onGameStateChange }: GridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [tileSize, setTileSize] = useState(60);
  const gridSize = DIFFICULTY_CONFIG[level.difficulty].gridSize;
  const gap = 8;

  useEffect(() => {
    const updateTileSize = () => {
      const maxWidth = Math.min(window.innerWidth - 48, 500);
      const maxHeight = Math.min(window.innerHeight - 300, 500);
      const availableSpace = Math.min(maxWidth, maxHeight);
      const calculatedSize = Math.floor((availableSpace - gap * (gridSize - 1)) / gridSize);
      setTileSize(Math.max(40, Math.min(80, calculatedSize)));
    };

    updateTileSize();
    window.addEventListener('resize', updateTileSize);
    return () => window.removeEventListener('resize', updateTileSize);
  }, [gridSize]);

  const getCellFromEvent = useCallback(
    (clientX: number, clientY: number): { row: number; col: number } | null => {
      if (!gridRef.current) return null;

      const rect = gridRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const col = Math.floor(x / (tileSize + gap));
      const row = Math.floor(y / (tileSize + gap));

      if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
        return { row, col };
      }

      return null;
    },
    [tileSize, gridSize, gap]
  );

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      const cell = getCellFromEvent(clientX, clientY);
      if (cell) {
        const newState = startPath(gameState, cell.row, cell.col);
        onGameStateChange(newState);
      }
    },
    [gameState, getCellFromEvent, onGameStateChange]
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!gameState.isDrawing) return;

      const cell = getCellFromEvent(clientX, clientY);
      if (cell) {
        const newState = extendPath(gameState, cell.row, cell.col);
        onGameStateChange(newState);
      }
    },
    [gameState, getCellFromEvent, onGameStateChange]
  );

  const handleEnd = useCallback(() => {
    const newState = endPath(gameState);
    onGameStateChange(newState);
  }, [gameState, onGameStateChange]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientX, e.clientY);
    },
    [handleStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    },
    [handleMove]
  );

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const handleMouseLeave = useCallback(() => {
    if (gameState.isDrawing) {
      handleEnd();
    }
  }, [gameState.isDrawing, handleEnd]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    },
    [handleStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    [handleMove]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      handleEnd();
    },
    [handleEnd]
  );

  const gridWidth = gridSize * tileSize + (gridSize - 1) * gap;
  const gridHeight = gridSize * tileSize + (gridSize - 1) * gap;

  return (
    <div
      ref={gridRef}
      className="relative select-none touch-none"
      style={{
        width: gridWidth,
        height: gridHeight,
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, ${tileSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${tileSize}px)`,
        gap: `${gap}px`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-testid="game-grid"
    >
      <PathRenderer
        paths={gameState.paths}
        currentPath={gameState.currentPath}
        tileSize={tileSize}
        gap={gap}
      />

      {level.grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const color = getCellColor(gameState, rowIndex, colIndex);
          const isActive =
            gameState.currentPath?.segments.some(
              (s) => s.row === rowIndex && s.col === colIndex
            ) || false;

          return (
            <Tile
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              letter={cell.letter}
              bgColor={color?.bg || null}
              textColor={color?.text || null}
              isActive={isActive}
              isEndpoint={cell.letter !== null}
              size={tileSize}
            />
          );
        })
      )}
    </div>
  );
}
