// Game State Hook

import { useState, useCallback, useEffect } from 'react';
import { GameState, GameGrid, Path, Cell, Position, CellType } from '../types/game';
import { GAME_CONFIG } from '../constants/game';
import { gridUtils, cellUtils, gameUtils, colorUtils } from '../utils/gameUtils';

interface UseGameStateProps {
  initialLevel?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface UseGameStateReturn {
  gameState: GameState;
  isDrawing: boolean;
  currentPath: Position[];
  
  // Actions
  startPath: (position: Position) => void;
  continuePath: (position: Position) => void;
  endPath: () => void;
  resetGame: () => void;
  clearPath: (pathId: string) => void;
  
  // Checks
  isGameComplete: () => boolean;
  canStartPath: (position: Position) => boolean;
  canContinuePath: (position: Position) => boolean;
}

export const useGameState = ({
  initialLevel = 1,
  difficulty = 'easy'
}: UseGameStateProps = {}): UseGameStateReturn => {
  
  // Initialize game state
  const createInitialGameState = useCallback((): GameState => {
    const config = GAME_CONFIG.DIFFICULTY[difficulty];
    const grid = generateGameGrid(config.gridSize, config.letterPairs);
    
    return {
      id: gameUtils.generateId(),
      grid,
      isComplete: false,
      moves: 0,
      timeElapsed: 0,
      score: 0,
      level: initialLevel,
      difficulty
    };
  }, [initialLevel, difficulty]);

  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Position[]>([]);
  const [currentPathId, setCurrentPathId] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    if (gameState.isComplete) return;

    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 1
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isComplete]);

  // Generate game grid with letter pairs
  const generateGameGrid = (dimensions: { width: number, height: number }, letterPairs: number): GameGrid => {
    const grid = gridUtils.createEmptyGrid(dimensions);
    const usedColors: string[] = [];
    const paths: Path[] = [];

    // Place letter pairs
    for (let i = 0; i < letterPairs; i++) {
      const letter = GAME_CONFIG.AVAILABLE_LETTERS[i];
      const color = colorUtils.getRandomColor(usedColors);
      usedColors.push(color);

      // Find random positions for start and end
      const positions = findRandomPositions(grid, 2);
      if (positions.length === 2) {
        // Create letter cells
        const startCell = cellUtils.createLetterCell(positions[0], letter, color, true);
        const endCell = cellUtils.createLetterCell(positions[1], letter, color, false);
        
        // Place in grid
        grid[positions[0].y][positions[0].x] = startCell;
        grid[positions[1].y][positions[1].x] = endCell;

        // Create path
        paths.push({
          id: gameUtils.generateId(),
          letter,
          color,
          startCell: positions[0],
          endCell: positions[1],
          points: [],
          isComplete: false
        });
      }
    }

    return {
      id: gameUtils.generateId(),
      dimensions,
      cells: grid,
      paths
    };
  };

  // Find random empty positions in grid
  const findRandomPositions = (grid: Cell[][], count: number): Position[] => {
    const emptyPositions: Position[] = [];
    
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.type === CellType.EMPTY) {
          emptyPositions.push({ x, y });
        }
      });
    });

    // Shuffle and take first 'count' positions
    const shuffled = emptyPositions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // Start drawing a path
  const startPath = useCallback((position: Position) => {
    const cell = gridUtils.getCellAt(gameState.grid.cells, position);
    if (!cell || !canStartPath(position)) return;

    if (cell.type === CellType.LETTER && cell.letter) {
      setIsDrawing(true);
      setCurrentPath([position]);
      setCurrentPathId(cell.letter);
      
      setGameState(prev => ({
        ...prev,
        moves: prev.moves + 1
      }));
    }
  }, [gameState.grid.cells]);

  // Continue drawing a path
  const continuePath = useCallback((position: Position) => {
    if (!isDrawing || !canContinuePath(position)) return;

    setCurrentPath(prev => {
      const newPath = [...prev];
      const lastPosition = newPath[newPath.length - 1];
      
      // Check if we're going back (remove last position)
      if (newPath.length > 1 && 
          newPath[newPath.length - 2].x === position.x && 
          newPath[newPath.length - 2].y === position.y) {
        return newPath.slice(0, -1);
      }
      
      // Add new position
      newPath.push(position);
      return newPath;
    });
  }, [isDrawing]);

  // End drawing a path
  const endPath = useCallback(() => {
    if (!isDrawing || currentPath.length === 0 || !currentPathId) return;

    const endPosition = currentPath[currentPath.length - 1];
    const endCell = gridUtils.getCellAt(gameState.grid.cells, endPosition);
    
    if (endCell && endCell.type === CellType.LETTER && 
        endCell.letter === currentPathId && !endCell.isStart) {
      
      // Valid path completion
      setGameState(prev => {
        const newPaths = prev.grid.paths.map(path => {
          if (path.letter === currentPathId) {
            return {
              ...path,
              points: [...currentPath],
              isComplete: true
            };
          }
          return path;
        });

        // Update grid cells to show path
        const newGrid = prev.grid.cells.map(row => row.map(cell => ({ ...cell })));
        currentPath.forEach(pos => {
          const cell = newGrid[pos.y][pos.x];
          if (cell.type === CellType.EMPTY) {
            cell.type = CellType.PATH;
            cell.pathId = currentPathId;
            cell.color = prev.grid.paths.find(p => p.letter === currentPathId)?.color;
          }
        });

        const updatedGrid = {
          ...prev.grid,
          cells: newGrid,
          paths: newPaths
        };

        return {
          ...prev,
          grid: updatedGrid,
          isComplete: isGameComplete(updatedGrid)
        };
      });
    }

    // Reset drawing state
    setIsDrawing(false);
    setCurrentPath([]);
    setCurrentPathId(null);
  }, [isDrawing, currentPath, currentPathId, gameState.grid.cells]);

  // Check if game is complete
  const isGameComplete = useCallback((grid?: GameGrid) => {
    const gridToCheck = grid || gameState.grid;
    return gridToCheck.paths.every(path => path.isComplete);
  }, [gameState.grid]);

  // Check if can start path at position
  const canStartPath = useCallback((position: Position) => {
    const cell = gridUtils.getCellAt(gameState.grid.cells, position);
    return cell?.type === CellType.LETTER && cell.isStart === true;
  }, [gameState.grid.cells]);

  // Check if can continue path to position
  const canContinuePath = useCallback((position: Position) => {
    if (currentPath.length === 0) return false;
    
    const lastPosition = currentPath[currentPath.length - 1];
    const cell = gridUtils.getCellAt(gameState.grid.cells, position);
    
    if (!cell) return false;

    // Must be adjacent
    const isAdjacent = Math.abs(position.x - lastPosition.x) + Math.abs(position.y - lastPosition.y) === 1;
    if (!isAdjacent) return false;

    // Can move to empty cells, path cells of same letter, or end letter
    return (
      cell.type === CellType.EMPTY ||
      (cell.type === CellType.PATH && cell.pathId === currentPathId) ||
      (cell.type === CellType.LETTER && cell.letter === currentPathId && !cell.isStart)
    );
  }, [currentPath, gameState.grid.cells, currentPathId]);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    setIsDrawing(false);
    setCurrentPath([]);
    setCurrentPathId(null);
  }, [createInitialGameState]);

  // Clear specific path
  const clearPath = useCallback((pathId: string) => {
    setGameState(prev => {
      const newGrid = prev.grid.cells.map(row => 
        row.map(cell => {
          if (cell.pathId === pathId && cell.type === CellType.PATH) {
            return { ...cell, type: CellType.EMPTY, pathId: undefined, color: undefined };
          }
          return cell;
        })
      );

      const newPaths = prev.grid.paths.map(path => {
        if (path.id === pathId) {
          return { ...path, points: [], isComplete: false };
        }
        return path;
      });

      return {
        ...prev,
        grid: {
          ...prev.grid,
          cells: newGrid,
          paths: newPaths
        },
        isComplete: false
      };
    });
  }, []);

  return {
    gameState,
    isDrawing,
    currentPath,
    startPath,
    continuePath,
    endPath,
    resetGame,
    clearPath,
    isGameComplete: () => isGameComplete(),
    canStartPath,
    canContinuePath
  };
};
