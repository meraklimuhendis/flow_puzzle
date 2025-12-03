export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'letters' | 'shapes' | 'maze';
export type ShapeType = 'circle' | 'triangle' | 'square' | 'star' | 'heart' | 'sun';

export interface LevelConfig {
  gridSize: number;
  pairs: number;
}

// Maze mode için yapılar
export interface WallSet {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface MazeCell {
  walls: WallSet;
  isStart: boolean;
  isEnd: boolean;
}

export interface MazeConfig {
  grid: MazeCell[][];
  start: { row: number; col: number };
  end: { row: number; col: number };
}

export interface CellData {
  letter: string | null;
  shape: ShapeType | null;
  colorIndex: number | null;
  // Maze mode için
  mazeWalls?: WallSet;
  isStart?: boolean;
  isEnd?: boolean;
}

export interface Level {
  difficulty: Difficulty;
  mode?: GameMode; // Hangi modda olduğunu belirtmek için
  grid: CellData[][];
  endpoints: Map<string, { row: number; col: number }[]>;
  // Maze mode için
  mazeStart?: { row: number; col: number };
  mazeEnd?: { row: number; col: number };
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

// Maze mode için grid size ayarları
export const MAZE_CONFIG: Record<Difficulty, { gridSize: number }> = {
  easy: { gridSize: 7 },
  medium: { gridSize: 9 },
  hard: { gridSize: 11 },
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
    return levelsCache as LevelsJSON;
  }

  try {
    const response = await fetch('/levels.json');
    if (!response.ok) {
      throw new Error(`Failed to load levels: ${response.statusText}`);
    }
    levelsCache = await response.json();
    return levelsCache as LevelsJSON;
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
  // Maze mode için direkt generator kullan
  if (mode === 'maze') {
    const gridSize = MAZE_CONFIG[difficulty].gridSize;
    const mazeConfig = generateMaze(gridSize);
    const { grid, mazeStart, mazeEnd } = createGridFromMaze(mazeConfig, gridSize);
    
    return {
      difficulty,
      mode: 'maze',
      grid,
      endpoints: new Map(), // Maze'de endpoint yok
      mazeStart,
      mazeEnd,
    };
  }

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
    
    return { difficulty, mode, grid, endpoints };
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

// ==============================================
// MAZE MODE FUNCTIONS
// ==============================================

/**
 * Recursive Backtracking algoritması ile labirent üret
 * Her labirent çözülebilir ve tek bir çözüm yoluna sahip
 */
function generateMaze(size: number): MazeConfig {
  // Tüm duvarları kapalı olarak başlat
  const grid: MazeCell[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      walls: { top: true, right: true, bottom: true, left: true },
      isStart: false,
      isEnd: false,
    }))
  );

  const visited: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  // Recursive backtracking ile labirent oluştur
  function carve(row: number, col: number) {
    visited[row][col] = true;

    // Komşuları rastgele sıraya koy
    const directions = [
      { dr: -1, dc: 0, wall: 'top', opposite: 'bottom' }, // yukarı
      { dr: 0, dc: 1, wall: 'right', opposite: 'left' },   // sağ
      { dr: 1, dc: 0, wall: 'bottom', opposite: 'top' },   // aşağı
      { dr: 0, dc: -1, wall: 'left', opposite: 'right' },  // sol
    ];

    // Rastgele sıralama (Fisher-Yates shuffle)
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [directions[i], directions[j]] = [directions[j], directions[i]];
    }

    for (const dir of directions) {
      const newRow = row + dir.dr;
      const newCol = col + dir.dc;

      // Sınırlar içinde ve ziyaret edilmemiş mi?
      if (
        newRow >= 0 && newRow < size &&
        newCol >= 0 && newCol < size &&
        !visited[newRow][newCol]
      ) {
        // Duvarları kaldır
        grid[row][col].walls[dir.wall as keyof WallSet] = false;
        grid[newRow][newCol].walls[dir.opposite as keyof WallSet] = false;

        // Recursive olarak devam et
        carve(newRow, newCol);
      }
    }
  }

  // Sol üst köşeden başla
  carve(0, 0);

  // Başlangıç ve bitiş noktalarını belirle
  const start = { row: 0, col: 0 };
  const end = { row: size - 1, col: size - 1 };

  grid[start.row][start.col].isStart = true;
  grid[end.row][end.col].isEnd = true;

  return { grid, start, end };
}

/**
 * MazeConfig'den CellData grid'i oluştur
 */
function createGridFromMaze(mazeConfig: MazeConfig, gridSize: number): {
  grid: CellData[][];
  mazeStart: { row: number; col: number };
  mazeEnd: { row: number; col: number };
} {
  const grid: CellData[][] = Array.from({ length: gridSize }, (_, row) =>
    Array.from({ length: gridSize }, (_, col) => {
      const mazeCell = mazeConfig.grid[row][col];
      return {
        letter: null,
        shape: null,
        colorIndex: null,
        mazeWalls: mazeCell.walls,
        isStart: mazeCell.isStart,
        isEnd: mazeCell.isEnd,
      };
    })
  );

  return {
    grid,
    mazeStart: mazeConfig.start,
    mazeEnd: mazeConfig.end,
  };
}

/**
 * JSON'dan maze config'i yükle
 */
interface MazeJSON {
  walls: string; // "1111" formatında (top,right,bottom,left)
  isStart?: boolean;
  isEnd?: boolean;
}

function parseMazeFromJSON(mazeData: MazeJSON[][], start: { row: number; col: number }, end: { row: number; col: number }): MazeConfig {
  const size = mazeData.length;
  const grid: MazeCell[][] = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => {
      const cellData = mazeData[row][col];
      const walls = cellData.walls;
      
      return {
        walls: {
          top: walls[0] === '1',
          right: walls[1] === '1',
          bottom: walls[2] === '1',
          left: walls[3] === '1',
        },
        isStart: row === start.row && col === start.col,
        isEnd: row === end.row && col === end.col,
      };
    })
  );

  return { grid, start, end };
}

