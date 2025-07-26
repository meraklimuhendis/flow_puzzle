// Game Utility Functions

import { Position, Dimensions, Cell, CellType, GameGrid } from '../types/game';
import { GAME_CONFIG } from '../constants/game';

/**
 * Grid position utilities
 */
export const positionUtils = {
  // Check if position is within grid bounds
  isValidPosition(pos: Position, dimensions: Dimensions): boolean {
    return pos.x >= 0 && pos.x < dimensions.width && 
           pos.y >= 0 && pos.y < dimensions.height;
  },

  // Convert array index to grid position
  indexToPosition(index: number, width: number): Position {
    return {
      x: index % width,
      y: Math.floor(index / width)
    };
  },

  // Convert grid position to array index
  positionToIndex(pos: Position, width: number): number {
    return pos.y * width + pos.x;
  },

  // Calculate distance between two positions
  distance(pos1: Position, pos2: Position): number {
    return Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)
    );
  },

  // Check if two positions are adjacent (4-directional)
  areAdjacent(pos1: Position, pos2: Position): boolean {
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  },

  // Get adjacent positions
  getAdjacentPositions(pos: Position, dimensions: Dimensions): Position[] {
    const adjacent: Position[] = [];
    const directions = [
      { x: 0, y: -1 }, // Up
      { x: 1, y: 0 },  // Right
      { x: 0, y: 1 },  // Down
      { x: -1, y: 0 }  // Left
    ];

    directions.forEach(dir => {
      const newPos = { x: pos.x + dir.x, y: pos.y + dir.y };
      if (this.isValidPosition(newPos, dimensions)) {
        adjacent.push(newPos);
      }
    });

    return adjacent;
  }
};

/**
 * Cell utilities
 */
export const cellUtils = {
  // Create empty cell
  createCell(position: Position, type: CellType = CellType.EMPTY): Cell {
    return {
      id: `cell-${position.x}-${position.y}`,
      position,
      type,
      isConnected: false
    };
  },

  // Create letter cell
  createLetterCell(position: Position, letter: string, color: string, isStart: boolean = false): Cell {
    return {
      id: `cell-${position.x}-${position.y}`,
      position,
      type: CellType.LETTER,
      letter,
      color,
      isStart,
      isEnd: !isStart,
      isConnected: false
    };
  },

  // Check if cell is letter type
  isLetterCell(cell: Cell): boolean {
    return cell.type === CellType.LETTER && !!cell.letter;
  },

  // Check if cell is empty and can be used for path
  isPathable(cell: Cell): boolean {
    return cell.type === CellType.EMPTY || cell.type === CellType.PATH;
  }
};

/**
 * Grid utilities
 */
export const gridUtils = {
  // Create empty grid
  createEmptyGrid(dimensions: Dimensions): Cell[][] {
    const grid: Cell[][] = [];
    
    for (let y = 0; y < dimensions.height; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < dimensions.width; x++) {
        row.push(cellUtils.createCell({ x, y }));
      }
      grid.push(row);
    }
    
    return grid;
  },

  // Get cell at position
  getCellAt(grid: Cell[][], position: Position): Cell | null {
    if (!positionUtils.isValidPosition(position, { 
      width: grid[0]?.length || 0, 
      height: grid.length 
    })) {
      return null;
    }
    return grid[position.y][position.x];
  },

  // Set cell at position
  setCellAt(grid: Cell[][], position: Position, cell: Cell): Cell[][] {
    const newGrid = grid.map(row => [...row]);
    if (positionUtils.isValidPosition(position, { 
      width: newGrid[0]?.length || 0, 
      height: newGrid.length 
    })) {
      newGrid[position.y][position.x] = cell;
    }
    return newGrid;
  },

  // Find all cells with specific letter
  findCellsByLetter(grid: Cell[][], letter: string): Cell[] {
    const cells: Cell[] = [];
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell.letter === letter) {
          cells.push(cell);
        }
      });
    });
    return cells;
  }
};

/**
 * Color utilities
 */
export const colorUtils = {
  // Get random color from available colors
  getRandomColor(usedColors: string[] = []): string {
    const availableColors = GAME_CONFIG.LETTER_COLORS.filter(
      color => !usedColors.includes(color)
    );
    
    if (availableColors.length === 0) {
      return GAME_CONFIG.LETTER_COLORS[0];
    }
    
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  },

  // Convert hex to rgba
  hexToRgba(hex: string, alpha: number = 1): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
};

/**
 * Game state utilities
 */
export const gameUtils = {
  // Generate unique ID
  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  },

  // Format time in mm:ss
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  // Calculate score
  calculateScore(moves: number, timeElapsed: number, isComplete: boolean): number {
    if (!isComplete) return 0;
    
    const baseScore = GAME_CONFIG.SCORING.BASE_SCORE;
    const timeBonus = Math.max(0, (300 - timeElapsed) * GAME_CONFIG.SCORING.TIME_BONUS_MULTIPLIER);
    const movePenalty = moves * GAME_CONFIG.SCORING.MOVE_PENALTY;
    const completionBonus = GAME_CONFIG.SCORING.COMPLETION_BONUS;
    
    return Math.max(0, Math.floor(baseScore + timeBonus - movePenalty + completionBonus));
  }
};
