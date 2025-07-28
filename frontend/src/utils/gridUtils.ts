import { GameGrid, Cell, Position, Dimensions, CellType } from '../types/game';
import { GAME_CONFIG } from '../constants/game';

/**
 * Creates an empty grid with the specified dimensions
 */
export const createEmptyGrid = (
  dimensions: Dimensions,
  gridId: string = `grid-${Date.now()}`
): GameGrid => {
  const cells: Cell[][] = [];

  for (let y = 0; y < dimensions.height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < dimensions.width; x++) {
      const cell: Cell = {
        id: `cell-${x}-${y}`,
        position: { x, y },
        type: CellType.EMPTY,
        isStart: false,
        isEnd: false,
        isConnected: false,
      };
      row.push(cell);
    }
    cells.push(row);
  }

  return {
    id: gridId,
    dimensions,
    cells,
    paths: [],
  };
};

/**
 * Creates a sample grid with letter pairs for testing
 */
export const createSampleGrid = (
  dimensions: Dimensions = GAME_CONFIG.DEFAULT_GRID_SIZE,
  gridId: string = `sample-grid-${Date.now()}`
): GameGrid => {
  const grid = createEmptyGrid(dimensions, gridId);
  
  // Define letter pairs with colors
  const letterPairs = [
    { letter: 'A', color: GAME_CONFIG.LETTER_COLORS[0] }, // Red
    { letter: 'B', color: GAME_CONFIG.LETTER_COLORS[1] }, // Teal
    { letter: 'C', color: GAME_CONFIG.LETTER_COLORS[2] }, // Blue
  ];

  // Place letter pairs on the grid - Optimal kesişmeyen yerleşim
  if (dimensions.width >= 5 && dimensions.height >= 5) {
    // Pair A: (3,0) ve (0,1) - L şeklinde path
    grid.cells[0][3] = {
      ...grid.cells[0][3],
      type: CellType.LETTER,
      letter: 'A',
      color: letterPairs[0].color,
      isStart: true,
    };
    
    grid.cells[1][0] = {
      ...grid.cells[1][0],
      type: CellType.LETTER,
      letter: 'A',
      color: letterPairs[0].color,
      isEnd: true,
    };

    // Pair B: (4,0) ve (1,1) - L şeklinde path
    grid.cells[0][4] = {
      ...grid.cells[0][4],
      type: CellType.LETTER,
      letter: 'B',
      color: letterPairs[1].color,
      isStart: true,
    };
    
    grid.cells[1][1] = {
      ...grid.cells[1][1],
      type: CellType.LETTER,
      letter: 'B',
      color: letterPairs[1].color,
      isEnd: true,
    };

    // Pair C: (3,2) ve (1,4) - D yerine C kullanıyoruz (sadece 3 çiftimiz var)
    grid.cells[2][3] = {
      ...grid.cells[2][3],
      type: CellType.LETTER,
      letter: 'C',
      color: letterPairs[2].color,
      isStart: true,
    };
    
    grid.cells[4][1] = {
      ...grid.cells[4][1],
      type: CellType.LETTER,
      letter: 'C',
      color: letterPairs[2].color,
      isEnd: true,
    };
  }

  return grid;
};

/**
 * Gets a cell at the specified position
 */
export const getCellAt = (grid: GameGrid, position: Position): Cell | null => {
  if (
    position.x < 0 ||
    position.x >= grid.dimensions.width ||
    position.y < 0 ||
    position.y >= grid.dimensions.height
  ) {
    return null;
  }
  
  return grid.cells[position.y][position.x];
};

/**
 * Sets a cell at the specified position
 */
export const setCellAt = (
  grid: GameGrid,
  position: Position,
  cell: Partial<Cell>
): GameGrid => {
  if (
    position.x < 0 ||
    position.x >= grid.dimensions.width ||
    position.y < 0 ||
    position.y >= grid.dimensions.height
  ) {
    return grid;
  }

  const newGrid = { ...grid };
  newGrid.cells = grid.cells.map(row => [...row]);
  newGrid.cells[position.y][position.x] = {
    ...newGrid.cells[position.y][position.x],
    ...cell,
  };

  return newGrid;
};

/**
 * Gets all cells with a specific letter
 */
export const getCellsByLetter = (grid: GameGrid, letter: string): Cell[] => {
  const cells: Cell[] = [];
  for (let y = 0; y < grid.dimensions.height; y++) {
    for (let x = 0; x < grid.dimensions.width; x++) {
      const cell = grid.cells[y][x];
      if (cell.letter === letter) {
        cells.push(cell);
      }
    }
  }
  return cells;
};

/**
 * Gets all empty cells
 */
export const getEmptyCells = (grid: GameGrid): Cell[] => {
  const cells: Cell[] = [];
  for (let y = 0; y < grid.dimensions.height; y++) {
    for (let x = 0; x < grid.dimensions.width; x++) {
      const cell = grid.cells[y][x];
      if (cell.type === CellType.EMPTY) {
        cells.push(cell);
      }
    }
  }
  return cells;
};

/**
 * Checks if two positions are adjacent
 */
export const arePositionsAdjacent = (pos1: Position, pos2: Position): boolean => {
  const dx = Math.abs(pos1.x - pos2.x);
  const dy = Math.abs(pos1.y - pos2.y);
  
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
};

/**
 * Gets adjacent positions for a given position
 */
export const getAdjacentPositions = (
  position: Position,
  dimensions: Dimensions
): Position[] => {
  const adjacent: Position[] = [];
  const { x, y } = position;

  // Up
  if (y > 0) adjacent.push({ x, y: y - 1 });
  // Down
  if (y < dimensions.height - 1) adjacent.push({ x, y: y + 1 });
  // Left
  if (x > 0) adjacent.push({ x: x - 1, y });
  // Right
  if (x < dimensions.width - 1) adjacent.push({ x: x + 1, y });

  return adjacent;
};

/**
 * Calculates distance between two positions
 */
export const getDistance = (pos1: Position, pos2: Position): number => {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
};

/**
 * Converts grid position to pixel coordinates
 */
export const gridToPixel = (
  position: Position,
  cellSize: number = GAME_CONFIG.CELL_SIZE,
  padding: number = GAME_CONFIG.CELL_PADDING
): Position => {
  return {
    x: position.x * (cellSize + padding),
    y: position.y * (cellSize + padding),
  };
};

/**
 * Converts pixel coordinates to grid position
 */
export const pixelToGrid = (
  pixel: Position,
  cellSize: number = GAME_CONFIG.CELL_SIZE,
  padding: number = GAME_CONFIG.CELL_PADDING
): Position => {
  return {
    x: Math.floor(pixel.x / (cellSize + padding)),
    y: Math.floor(pixel.y / (cellSize + padding)),
  };
};
