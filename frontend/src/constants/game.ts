// Game Constants

export const GAME_CONFIG = {
  // Grid Settings
  DEFAULT_GRID_SIZE: { width: 5, height: 5 },
  MIN_GRID_SIZE: { width: 3, height: 3 },
  MAX_GRID_SIZE: { width: 10, height: 10 },
  
  // Cell Settings
  CELL_SIZE: 60,
  CELL_PADDING: 2,
  BORDER_WIDTH: 2,
  
  // Colors for letter pairs
  LETTER_COLORS: [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal  
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#FFB347', // Orange
    '#98D8C8', // Mint
    '#F7DC6F', // Light Yellow
    '#BB8FCE', // Light Purple
  ],
  
  // Game Mechanics
  MAX_PATHS: 8,
  MIN_PATHS: 3,
  
  // Difficulty Settings
  DIFFICULTY: {
    easy: {
      gridSize: { width: 5, height: 5 },
      letterPairs: 3,
      timeLimit: 300, // 5 minutes
    },
    medium: {
      gridSize: { width: 7, height: 7 },
      letterPairs: 5,
      timeLimit: 600, // 10 minutes
    },
    hard: {
      gridSize: { width: 9, height: 9 },
      letterPairs: 7,
      timeLimit: 900, // 15 minutes
    }
  },
  
  // Scoring
  SCORING: {
    BASE_SCORE: 100,
    TIME_BONUS_MULTIPLIER: 0.1,
    MOVE_PENALTY: 2,
    COMPLETION_BONUS: 500,
  },
  
  // Letters for pairs
  AVAILABLE_LETTERS: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  
  // Animation
  ANIMATION: {
    DRAW_SPEED: 150, // ms
    FADE_DURATION: 300, // ms
    PULSE_DURATION: 1000, // ms
  }
} as const;

// CSS Classes
export const CSS_CLASSES = {
  GAME_CONTAINER: 'flow-puzzle-game',
  GAME_BOARD: 'game-board',
  GAME_CELL: 'game-cell',
  GAME_CELL_EMPTY: 'cell-empty',
  GAME_CELL_LETTER: 'cell-letter',
  GAME_CELL_PATH: 'cell-path',
  GAME_CELL_SELECTED: 'cell-selected',
  GAME_PATH: 'game-path',
  GAME_COMPLETED: 'game-completed',
} as const;

// Event Types
export const GAME_EVENTS = {
  CELL_CLICK: 'cellClick',
  CELL_HOVER: 'cellHover',
  PATH_START: 'pathStart',
  PATH_DRAW: 'pathDraw',
  PATH_COMPLETE: 'pathComplete',
  GAME_WIN: 'gameWin',
  GAME_RESET: 'gameReset',
} as const;
