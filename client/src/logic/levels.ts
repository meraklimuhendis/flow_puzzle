export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'letters' | 'shapes' | 'maze';
export type ShapeType = 'circle' | 'triangle' | 'square' | 'star' | 'heart' | 'sun';

export interface LevelConfig {
  gridSize: number;
  pairs: number;
}

export interface CellData {
  letter: string | null;
  shape: ShapeType | null;
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

export interface ShapePuzzleConfig {
  [shape: string]: {
    type: ShapeType;
    coordinates: CoordinatePair[];
  };
}

export interface DifficultyLevels {
  letters: PuzzleConfig[];
  shapes?: ShapePuzzleConfig[];
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

// Rastgele puzzle seç - letters için
function getRandomPuzzleConfig(
  puzzles: PuzzleConfig[],
): PuzzleConfig {
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}

// Rastgele puzzle seç - shapes için
function getRandomShapePuzzleConfig(
  puzzles: ShapePuzzleConfig[],
): ShapePuzzleConfig {
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}

// Koordinatlardan grid oluştur - letter mode
function createGridFromEndpoints(
  puzzleConfig: PuzzleConfig,
  gridSize: number,
): { grid: CellData[][], endpoints: Map<string, { row: number; col: number }[]> } {
  // Boş grid oluştur
  const grid: CellData[][] = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => ({ letter: null, shape: null, colorIndex: null }))
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
      grid[row][col] = { letter, shape: null, colorIndex };
      
      // Endpoint'e ekle
      const existing = endpoints.get(letter) || [];
      existing.push({ row, col });
      endpoints.set(letter, existing);
    });
  });

  return { grid, endpoints };
}

// Koordinatlardan grid oluştur - shape mode
function createGridFromShapeEndpoints(
  puzzleConfig: ShapePuzzleConfig,
  gridSize: number,
): { grid: CellData[][], endpoints: Map<string, { row: number; col: number }[]> } {
  // Boş grid oluştur
  const grid: CellData[][] = Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => ({ letter: null, shape: null, colorIndex: null }))
  );

  const endpoints = new Map<string, { row: number; col: number }[]>();
  
  // Shape'leri sıraya göre işle ve colorIndex ata
  const shapeKeys = Object.keys(puzzleConfig);
  
  shapeKeys.forEach((shapeKey, index) => {
    const shapeData = puzzleConfig[shapeKey];
    const { type: shapeType, coordinates } = shapeData;
    const colorIndex = index % PASTEL_COLORS.length;
    
    // Shape endpoint'leri için unique key oluştur (shape_0, shape_1, etc.)
    const endpointKey = `shape_${colorIndex}`;
    
    coordinates.forEach((coord) => {
      // x=col, y=row dönüşümü
      const row = coord.y;
      const col = coord.x;
      
      // Grid'e yerleştir
      grid[row][col] = { letter: null, shape: shapeType, colorIndex };
      
      // Endpoint'e ekle (unique key ile)
      const existing = endpoints.get(endpointKey) || [];
      existing.push({ row, col });
      endpoints.set(endpointKey, existing);
    });
  });

  return { grid, endpoints };
}

const EASY_LEVELS: CellData[][][] = [
  [
    [{ letter: null, shape: null, colorIndex: null }, { letter: 'C', shape: null, colorIndex: 2 }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }],
    [{ letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: 'C', shape: null, colorIndex: 2 }, { letter: null, shape: null, colorIndex: null }, { letter: 'D', shape: null, colorIndex: 3 }],
    [{ letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: 'A', shape: null, colorIndex: 0 }, { letter: 'D', shape: null, colorIndex: 3 }, { letter: null, shape: null, colorIndex: null }],
    [{ letter: 'A', shape: null, colorIndex: 0 }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: 'B', shape: null, colorIndex: 1 }, { letter: null, shape: null, colorIndex: null }],
    [{ letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: 'B', shape: null, colorIndex: 1 }],
  ],
];

const MEDIUM_LEVELS: CellData[][][] = [
  [
    [{ letter: 'E', shape: null, colorIndex: 4 }, { letter: null, shape: null, colorIndex: null }, { letter: 'E', shape: null, colorIndex: 4 }, { letter: 'C', shape: null, colorIndex: 2 }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }],
    [{ letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: 'A', shape: null, colorIndex: 0 }, { letter: 'C', shape: null, colorIndex: 2 }, { letter: null, shape: null, colorIndex: null }],
    [{ letter: null, shape: null, colorIndex: null }, { letter: 'B', shape: null, colorIndex: 1 }, { letter: 'A', shape: null, colorIndex: 0 }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }],
    [{ letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: 'D', shape: null, colorIndex: 3 }, { letter: null, shape: null, colorIndex: null }],
    [{ letter: null, shape: null, colorIndex: null }, { letter: 'B', shape: null, colorIndex: 1 }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }],
    [{ letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: 'D', shape: null, colorIndex: 3 }, { letter: null, shape: null, colorIndex: null }],
  ],
];

const HARD_LEVELS: CellData[][][] = [
  [
    [{ letter: 'C', shape: null, colorIndex: 2 }, { letter: null, shape: null, colorIndex: null }, { letter: 'C', shape: null, colorIndex: 2 }, { letter: null, shape: null, colorIndex: null }, { letter: 'A', shape: null, colorIndex: 0 }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }],
    [{ letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: 'A', shape: null, colorIndex: 0 }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }],
    [{ letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: 'E', shape: null, colorIndex: 4 }],
    [{ letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: 'F', shape: null, colorIndex: 5 }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }],
    [{ letter: 'F', shape: null, colorIndex: 5 }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: 'E', shape: null, colorIndex: 4 }, { letter: 'B', shape: null, colorIndex: 1 }, { letter: null, shape: null, colorIndex: null }],
    [{ letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: 'D', shape: null, colorIndex: 3 }, { letter: null, shape: null, colorIndex: null }, { letter: 'D', shape: null, colorIndex: 3 }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }],
    [{ letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: null, shape: null, colorIndex: null }, { letter: 'B', shape: null, colorIndex: 1 }, { letter: null, shape: null, colorIndex: null }],
  ],
];

export async function getLevel(difficulty: Difficulty, mode: GameMode = 'letters'): Promise<Level> {
  try {
    // JSON'dan level'ları yükle
    const levelsData = await loadAllLevels();
    
    // Difficulty'e göre level setini al
    const difficultyLevels = levelsData[difficulty];
    
    // Grid size'ı al
    const gridSize = DIFFICULTY_CONFIG[difficulty].gridSize;
    
    let grid: CellData[][];
    let endpoints: Map<string, { row: number; col: number }[]>;
    
    // Mode'a göre puzzle seç ve grid oluştur
    if (mode === 'shapes' && difficultyLevels.shapes && difficultyLevels.shapes.length > 0) {
      // Shape mode
      const selectedPuzzle = getRandomShapePuzzleConfig(difficultyLevels.shapes);
      const result = createGridFromShapeEndpoints(selectedPuzzle, gridSize);
      grid = result.grid;
      endpoints = result.endpoints;
    } else {
      // Letter mode (default)
      const selectedPuzzle = getRandomPuzzleConfig(difficultyLevels.letters);
      const result = createGridFromEndpoints(selectedPuzzle, gridSize);
      grid = result.grid;
      endpoints = result.endpoints;
    }
    
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
