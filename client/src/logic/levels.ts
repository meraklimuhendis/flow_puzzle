export type Difficulty = 'easy' | 'medium' | 'hard';

export interface LevelConfig {
  gridSize: number;
  pairs: number;
}

export interface CellData {
  letter: string | null;
  colorIndex: number | null;
}

export interface Level {
  difficulty: Difficulty;
  grid: CellData[][];
  endpoints: Map<string, { row: number; col: number }[]>;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, LevelConfig> = {
  easy: { gridSize: 5, pairs: 4 },
  medium: { gridSize: 6, pairs: 5 },
  hard: { gridSize: 7, pairs: 6 },
};

export const PASTEL_COLORS = [
  { bg: 'rgb(251, 207, 232)', text: 'rgb(157, 23, 77)' },
  { bg: 'rgb(196, 181, 253)', text: 'rgb(76, 29, 149)' },
  { bg: 'rgb(167, 243, 208)', text: 'rgb(6, 95, 70)' },
  { bg: 'rgb(254, 215, 170)', text: 'rgb(154, 52, 18)' },
  { bg: 'rgb(186, 230, 253)', text: 'rgb(12, 74, 110)' },
  { bg: 'rgb(254, 202, 202)', text: 'rgb(153, 27, 27)' },
];

export const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const EASY_LEVELS: CellData[][][] = [
  [
    [{ letter: 'A', colorIndex: 0 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'B', colorIndex: 1 }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'C', colorIndex: 2 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'D', colorIndex: 3 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: 'A', colorIndex: 0 }, { letter: 'B', colorIndex: 1 }, { letter: null, colorIndex: null }, { letter: 'C', colorIndex: 2 }, { letter: 'D', colorIndex: 3 }],
  ],
];

const MEDIUM_LEVELS: CellData[][][] = [
  [
    [{ letter: 'A', colorIndex: 0 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'B', colorIndex: 1 }],
    [{ letter: null, colorIndex: null }, { letter: 'C', colorIndex: 2 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'D', colorIndex: 3 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'E', colorIndex: 4 }],
    [{ letter: null, colorIndex: null }, { letter: 'D', colorIndex: 3 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: 'A', colorIndex: 0 }, { letter: 'B', colorIndex: 1 }, { letter: 'C', colorIndex: 2 }, { letter: null, colorIndex: null }, { letter: 'E', colorIndex: 4 }, { letter: null, colorIndex: null }],
  ],
];

const HARD_LEVELS: CellData[][][] = [
  [
    [{ letter: 'A', colorIndex: 0 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'B', colorIndex: 1 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'C', colorIndex: 2 }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: 'D', colorIndex: 3 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'E', colorIndex: 4 }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'F', colorIndex: 5 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'D', colorIndex: 3 }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'F', colorIndex: 5 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: 'A', colorIndex: 0 }, { letter: 'B', colorIndex: 1 }, { letter: null, colorIndex: null }, { letter: 'C', colorIndex: 2 }, { letter: 'E', colorIndex: 4 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
  ],
];

export function getLevel(difficulty: Difficulty): Level {
  let grid: CellData[][];
  
  switch (difficulty) {
    case 'easy':
      grid = JSON.parse(JSON.stringify(EASY_LEVELS[0]));
      break;
    case 'medium':
      grid = JSON.parse(JSON.stringify(MEDIUM_LEVELS[0]));
      break;
    case 'hard':
      grid = JSON.parse(JSON.stringify(HARD_LEVELS[0]));
      break;
  }

  const endpoints = new Map<string, { row: number; col: number }[]>();
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      if (cell.letter) {
        const existing = endpoints.get(cell.letter) || [];
        existing.push({ row, col });
        endpoints.set(cell.letter, existing);
      }
    }
  }

  return { difficulty, grid, endpoints };
}
