// Game Types for Flow Puzzle

export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export enum CellType {
  EMPTY = 'empty',
  LETTER = 'letter',
  WALL = 'wall',
  PATH = 'path'
}

export interface Cell {
  id: string;
  position: Position;
  type: CellType;
  letter?: string;
  color?: string;
  isStart?: boolean;
  isEnd?: boolean;
  isConnected?: boolean;
  pathId?: string;
}

export interface Path {
  id: string;
  letter: string;
  color: string;
  startCell: Position;
  endCell: Position;
  points: Position[];
  isComplete: boolean;
}

export interface GameGrid {
  id: string;
  dimensions: Dimensions;
  cells: Cell[][];
  paths: Path[];
}

export interface GameState {
  id: string;
  grid: GameGrid;
  isComplete: boolean;
  moves: number;
  timeElapsed: number;
  score: number;
  level: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameConfig {
  gridSize: Dimensions;
  letterPairs: number;
  allowedColors: string[];
  timeLimit?: number;
  moveLimit?: number;
}

// Drawing/Canvas Types
export interface DrawingContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cellSize: number;
  offset: Position;
}

export interface MousePosition {
  x: number;
  y: number;
  gridX: number;
  gridY: number;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface GameSession {
  id: string;
  userId?: string;
  gameState: GameState;
  createdAt: string;
  updatedAt: string;
}
