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

// JSON formatı için type definitions
export interface CoordinatePair {
  x: number;
  y: number;
}

export interface PuzzleConfig {
  [letter: string]: CoordinatePair[];
}

export interface DifficultyLevels {
  letters: PuzzleConfig[];
  shapes?: PuzzleConfig[];
}

export interface LevelsJSON {
  easy: DifficultyLevels;
  medium: DifficultyLevels;
  hard: DifficultyLevels;
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

// JSON cache
let levelsCache: LevelsJSON | null = null;

// JSON dosyasından tüm level'ları yükle
async function loadAllLevels(): Promise<LevelsJSON> {
  if (levelsCache) {
    return levelsCache;
  }

  try {
    const response = await fetch('/levels.json');
    if (!response.ok) {
      throw new Error(`Failed to load levels: ${response.statusText}`);
    }
    levelsCache = await response.json();
    return levelsCache;
  } catch (error) {
    console.error('Error loading levels.json:', error);
    throw error;
  }
}

// Rastgele puzzle seç
function getRandomPuzzleConfig(
  puzzles: PuzzleConfig[],
): PuzzleConfig {
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}

// Koordinatlardan grid oluştur
function createGridFromEndpoints(
  puzzleConfig: PuzzleConfig,
  gridSize: number,
): { grid: CellData[][], endpoints: Map<string, { row: number; col: number }[]> } {
  // Boş grid oluştur
  const grid: CellData[][] = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => ({ letter: null, colorIndex: null }))
  );

  const endpoints = new Map<string, { row: number; col: number }[]>();
  
  // Harfleri alfabetik sıraya göre sırala ve colorIndex ata
  const sortedLetters = Object.keys(puzzleConfig).sort();
  
  sortedLetters.forEach((letter, index) => {
    const coordinates = puzzleConfig[letter];
    const colorIndex = index % PASTEL_COLORS.length;
    
    coordinates.forEach((coord) => {
      // x=col, y=row dönüşümü
      const row = coord.y;
      const col = coord.x;
      
      // Grid'e yerleştir
      grid[row][col] = { letter, colorIndex };
      
      // Endpoint'e ekle
      const existing = endpoints.get(letter) || [];
      existing.push({ row, col });
      endpoints.set(letter, existing);
    });
  });

  return { grid, endpoints };
}

const EASY_LEVELS: CellData[][][] = [
  [
    [{ letter: null, colorIndex: null }, { letter: 'C', colorIndex: 2 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'C', colorIndex: 2 }, { letter: null, colorIndex: null }, { letter: 'D', colorIndex: 3 }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'A', colorIndex: 0 }, { letter: 'D', colorIndex: 3 }, { letter: null, colorIndex: null }],
    [{ letter: 'A', colorIndex: 0 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'B', colorIndex: 1 }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'B', colorIndex: 1 }],
  ],
];

const MEDIUM_LEVELS: CellData[][][] = [
  [
    [{ letter: 'E', colorIndex: 4 }, { letter: null, colorIndex: null }, { letter: 'E', colorIndex: 4 }, { letter: 'C', colorIndex: 2 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'A', colorIndex: 0 }, { letter: 'C', colorIndex: 2 }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: 'B', colorIndex: 1 }, { letter: 'A', colorIndex: 0 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'D', colorIndex: 3 }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: 'B', colorIndex: 1 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'D', colorIndex: 3 }, { letter: null, colorIndex: null }],
  ],
];

const HARD_LEVELS: CellData[][][] = [
  [
    [{ letter: 'C', colorIndex: 2 }, { letter: null, colorIndex: null }, { letter: 'C', colorIndex: 2 }, { letter: null, colorIndex: null }, { letter: 'A', colorIndex: 0 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'A', colorIndex: 0 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'E', colorIndex: 4 }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'F', colorIndex: 5 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: 'F', colorIndex: 5 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'E', colorIndex: 4 }, { letter: 'B', colorIndex: 1 }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'D', colorIndex: 3 }, { letter: null, colorIndex: null }, { letter: 'D', colorIndex: 3 }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }],
    [{ letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: null, colorIndex: null }, { letter: 'B', colorIndex: 1 }, { letter: null, colorIndex: null }],
  ],
];

export async function getLevel(difficulty: Difficulty, mode: 'letters' | 'shapes' = 'letters'): Promise<Level> {
  try {
    // JSON'dan level'ları yükle
    const levelsData = await loadAllLevels();
    
    // Difficulty'e göre level setini al
    const difficultyLevels = levelsData[difficulty];
    
    // Mode'a göre puzzle array'ini seç
    const puzzles = mode === 'letters' ? difficultyLevels.letters : (difficultyLevels.shapes || difficultyLevels.letters);
    
    // Rastgele bir puzzle seç
    const selectedPuzzle = getRandomPuzzleConfig(puzzles);
    
    // Grid size'ı al
    const gridSize = DIFFICULTY_CONFIG[difficulty].gridSize;
    
    // Grid ve endpoint'leri oluştur
    const { grid, endpoints } = createGridFromEndpoints(selectedPuzzle, gridSize);
    
    return { difficulty, grid, endpoints };
  } catch (error) {
    console.error('Error in getLevel:', error);
    // Fallback: Eski sistemi kullan
    return getLevelFallback(difficulty);
  }
}

// Fallback fonksiyonu (JSON yüklenemezse eski sistem)
function getLevelFallback(difficulty: Difficulty): Level {
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
