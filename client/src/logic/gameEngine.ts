import { CellData, PASTEL_COLORS, Level, DIFFICULTY_CONFIG } from './levels';

export interface PathSegment {
  row: number;
  col: number;
}

export interface Path {
  letter: string;
  colorIndex: number;
  segments: PathSegment[];
  isComplete: boolean;
}

export interface GameState {
  level: Level;
  paths: Map<string, Path>;
  currentPath: Path | null;
  isDrawing: boolean;
  isSolved: boolean;
}

export function createInitialGameState(level: Level): GameState {
  return {
    level,
    paths: new Map(),
    currentPath: null,
    isDrawing: false,
    isSolved: false,
  };
}

export function isAdjacent(a: PathSegment, b: PathSegment): boolean {
  const rowDiff = Math.abs(a.row - b.row);
  const colDiff = Math.abs(a.col - b.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

export function isEndpoint(level: Level, row: number, col: number): { letter: string; colorIndex: number } | null {
  const cell = level.grid[row]?.[col];
  // Endpoint hem letter hem de shape olabilir
  if (cell && cell.colorIndex !== null && (cell.letter || cell.shape)) {
    // Letter varsa letter kullan, yoksa shape key'ini kullan (örn: "shape_0", "shape_1")
    const key = cell.letter || `shape_${cell.colorIndex}`;
    return { letter: key, colorIndex: cell.colorIndex };
  }
  return null;
}

export function isCellOccupied(
  paths: Map<string, Path>,
  row: number,
  col: number,
  excludeLetter?: string
): string | null {
  const entries = Array.from(paths.entries());
  for (let i = 0; i < entries.length; i++) {
    const [letter, path] = entries[i];
    if (excludeLetter && letter === excludeLetter) continue;
    for (const segment of path.segments) {
      if (segment.row === row && segment.col === col) {
        return letter;
      }
    }
  }
  return null;
}

export function startPath(
  state: GameState,
  row: number,
  col: number
): GameState {
  const endpoint = isEndpoint(state.level, row, col);
  
  if (!endpoint) {
    const occupyingLetter = isCellOccupied(state.paths, row, col);
    if (occupyingLetter) {
      const existingPath = state.paths.get(occupyingLetter);
      if (existingPath) {
        // Tamamlanmış path'lerin üzerine tıklanamaz
        if (existingPath.isComplete) {
          return state;
        }
        
        const segmentIndex = existingPath.segments.findIndex(
          s => s.row === row && s.col === col
        );
        if (segmentIndex !== -1) {
          const truncatedSegments = existingPath.segments.slice(0, segmentIndex + 1);
          const newPaths = new Map(state.paths);
          newPaths.set(occupyingLetter, {
            ...existingPath,
            segments: truncatedSegments,
            isComplete: false,
          });
          
          return {
            ...state,
            paths: newPaths,
            currentPath: {
              letter: occupyingLetter,
              colorIndex: existingPath.colorIndex,
              segments: truncatedSegments,
              isComplete: false,
            },
            isDrawing: true,
            isSolved: false,
          };
        }
      }
    }
    return state;
  }

  const existingPath = state.paths.get(endpoint.letter);
  if (existingPath) {
    const newPaths = new Map(state.paths);
    newPaths.delete(endpoint.letter);
    
    return {
      ...state,
      paths: newPaths,
      currentPath: {
        letter: endpoint.letter,
        colorIndex: endpoint.colorIndex,
        segments: [{ row, col }],
        isComplete: false,
      },
      isDrawing: true,
      isSolved: false,
    };
  }

  return {
    ...state,
    currentPath: {
      letter: endpoint.letter,
      colorIndex: endpoint.colorIndex,
      segments: [{ row, col }],
      isComplete: false,
    },
    isDrawing: true,
  };
}

export function extendPath(
  state: GameState,
  row: number,
  col: number
): GameState {
  if (!state.isDrawing || !state.currentPath) return state;

  const { currentPath, paths, level } = state;
  const lastSegment = currentPath.segments[currentPath.segments.length - 1];

  if (lastSegment.row === row && lastSegment.col === col) {
    return state;
  }

  if (!isAdjacent(lastSegment, { row, col })) {
    return state;
  }

  const gridSize = DIFFICULTY_CONFIG[level.difficulty].gridSize;
  if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
    return state;
  }

  const existingSegmentIndex = currentPath.segments.findIndex(
    s => s.row === row && s.col === col
  );
  if (existingSegmentIndex !== -1) {
    const truncatedSegments = currentPath.segments.slice(0, existingSegmentIndex + 1);
    return {
      ...state,
      currentPath: {
        ...currentPath,
        segments: truncatedSegments,
        isComplete: false,
      },
    };
  }

  const occupyingLetter = isCellOccupied(paths, row, col, currentPath.letter);
  if (occupyingLetter) {
    const newPaths = new Map(paths);
    const occupiedPath = newPaths.get(occupyingLetter);
    if (occupiedPath) {
      // Eğer başka bir path tamamlanmışsa (isComplete: true), onun üzerine gelinemez
      if (occupiedPath.isComplete) {
        return state; // Hareketi engelle
      }
      
      // Tamamlanmamış path ise, kes
      const cutIndex = occupiedPath.segments.findIndex(
        s => s.row === row && s.col === col
      );
      if (cutIndex !== -1) {
        const truncatedOccupied = occupiedPath.segments.slice(0, cutIndex);
        if (truncatedOccupied.length === 0) {
          newPaths.delete(occupyingLetter);
        } else {
          newPaths.set(occupyingLetter, {
            ...occupiedPath,
            segments: truncatedOccupied,
            isComplete: false,
          });
        }
      }
    }

    const endpoint = isEndpoint(level, row, col);
    const isPathComplete = endpoint && endpoint.letter === currentPath.letter && currentPath.segments.length > 0;

    return {
      ...state,
      paths: newPaths,
      currentPath: {
        ...currentPath,
        segments: [...currentPath.segments, { row, col }],
        isComplete: isPathComplete || false,
      },
    };
  }

  const endpoint = isEndpoint(level, row, col);
  
  if (endpoint && endpoint.letter !== currentPath.letter) {
    return state;
  }

  const isPathComplete = endpoint && endpoint.letter === currentPath.letter && currentPath.segments.length > 0;

  return {
    ...state,
    currentPath: {
      ...currentPath,
      segments: [...currentPath.segments, { row, col }],
      isComplete: isPathComplete || false,
    },
  };
}

export function endPath(state: GameState): GameState {
  if (!state.currentPath) {
    return { ...state, isDrawing: false };
  }

  const newPaths = new Map(state.paths);
  
  // Sadece path tamamlanmışsa kaydet (her iki endpoint'e ulaşılmışsa)
  if (state.currentPath.segments.length > 0 && state.currentPath.isComplete) {
    newPaths.set(state.currentPath.letter, state.currentPath);
  }
  // Path tamamlanmamışsa, o harfin eski path'ini sil (eğer varsa ve tamamlanmamışsa)
  else if (state.currentPath.letter) {
    const existingPath = newPaths.get(state.currentPath.letter);
    if (existingPath && !existingPath.isComplete) {
      newPaths.delete(state.currentPath.letter);
    }
  }

  const isSolved = checkSolved(newPaths, state.level);

  return {
    ...state,
    paths: newPaths,
    currentPath: null,
    isDrawing: false,
    isSolved,
  };
}

export function checkSolved(paths: Map<string, Path>, level: Level): boolean {
  const requiredPairs = level.endpoints.size;
  
  if (paths.size !== requiredPairs) return false;

  const entries = Array.from(paths.entries());
  for (let i = 0; i < entries.length; i++) {
    const [letter, path] = entries[i];
    if (!path.isComplete) return false;
    
    const endpoints = level.endpoints.get(letter);
    if (!endpoints || endpoints.length !== 2) return false;

    const firstSegment = path.segments[0];
    const lastSegment = path.segments[path.segments.length - 1];

    const matchesStart = endpoints.some(
      e => e.row === firstSegment.row && e.col === firstSegment.col
    );
    const matchesEnd = endpoints.some(
      e => e.row === lastSegment.row && e.col === lastSegment.col
    );

    if (!matchesStart || !matchesEnd) return false;
  }

  // Oyun bitişi için sadece tüm harf çiftlerinin birbirlerine bağlanmış olması yeterli
  // Grid'de boş hücreler kalabilir
  return true;
}

export function getCellColor(
  state: GameState,
  row: number,
  col: number
): { bg: string; text: string } | null {
  const endpoint = isEndpoint(state.level, row, col);
  if (endpoint) {
    return PASTEL_COLORS[endpoint.colorIndex];
  }

  if (state.currentPath) {
    for (const segment of state.currentPath.segments) {
      if (segment.row === row && segment.col === col) {
        return PASTEL_COLORS[state.currentPath.colorIndex];
      }
    }
  }

  const pathValues = Array.from(state.paths.values());
  for (let i = 0; i < pathValues.length; i++) {
    const path = pathValues[i];
    for (const segment of path.segments) {
      if (segment.row === row && segment.col === col) {
        return PASTEL_COLORS[path.colorIndex];
      }
    }
  }

  return null;
}

export function getPathColor(colorIndex: number): string {
  return PASTEL_COLORS[colorIndex]?.bg || 'transparent';
}

// ==============================================
// MAZE MODE FUNCTIONS
// ==============================================

/**
 * Maze mode için iki hücre arasında duvar var mı kontrol et
 */
export function hasWallBetween(
  level: Level,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number
): boolean {
  const fromCell = level.grid[fromRow]?.[fromCol];
  if (!fromCell?.mazeWalls) return false;

  // Yön belirle
  if (toRow < fromRow) {
    // Yukarı gidiyor
    return fromCell.mazeWalls.top;
  } else if (toRow > fromRow) {
    // Aşağı gidiyor
    return fromCell.mazeWalls.bottom;
  } else if (toCol < fromCol) {
    // Sola gidiyor
    return fromCell.mazeWalls.left;
  } else if (toCol > fromCol) {
    // Sağa gidiyor
    return fromCell.mazeWalls.right;
  }

  return false;
}

/**
 * Maze mode için path başlat (sadece start noktasından)
 */
export function startMazePath(
  state: GameState,
  row: number,
  col: number
): GameState {
  const cell = state.level.grid[row]?.[col];
  
  // Sadece start noktasından başlatılabilir
  if (!cell?.isStart) {
    return state;
  }

  return {
    ...state,
    currentPath: {
      letter: 'maze',
      colorIndex: 0, // Mavi renk kullan
      segments: [{ row, col }],
      isComplete: false,
    },
    isDrawing: true,
  };
}

/**
 * Maze mode için path genişlet (duvar kontrolü ile)
 */
export function extendMazePath(
  state: GameState,
  row: number,
  col: number
): GameState {
  if (!state.currentPath || !state.isDrawing) return state;

  const lastSegment = state.currentPath.segments[state.currentPath.segments.length - 1];
  
  // Aynı hücreye tekrar gitme
  if (lastSegment.row === row && lastSegment.col === col) {
    return state;
  }

  // Komşu hücre kontrolü
  if (!isAdjacent(lastSegment, { row, col })) {
    return state;
  }

  // Duvar kontrolü - aralarında duvar varsa geçemez
  if (hasWallBetween(state.level, lastSegment.row, lastSegment.col, row, col)) {
    return state;
  }

  // Backtrack kontrolü (geri gitme)
  const segmentIndex = state.currentPath.segments.findIndex(
    s => s.row === row && s.col === col
  );

  if (segmentIndex !== -1) {
    // Geri gidiyor - path'i kısalt
    const truncatedSegments = state.currentPath.segments.slice(0, segmentIndex + 1);
    return {
      ...state,
      currentPath: {
        ...state.currentPath,
        segments: truncatedSegments,
        isComplete: false,
      },
    };
  }

  // Yeni segment ekle
  const newSegments = [...state.currentPath.segments, { row, col }];
  
  // End noktasına ulaştı mı?
  const cell = state.level.grid[row]?.[col];
  const isComplete = cell?.isEnd || false;

  return {
    ...state,
    currentPath: {
      ...state.currentPath,
      segments: newSegments,
      isComplete,
    },
  };
}

/**
 * Maze mode için path bitir
 */
export function endMazePath(state: GameState): GameState {
  if (!state.currentPath) {
    return { ...state, isDrawing: false };
  }

  // End noktasına ulaştıysa kaydet
  if (state.currentPath.isComplete) {
    const newPaths = new Map(state.paths);
    newPaths.set('maze', state.currentPath);

    return {
      ...state,
      paths: newPaths,
      currentPath: null,
      isDrawing: false,
      isSolved: true, // Maze'de tek path var, tamamlandı = çözüldü
    };
  }

  // Tamamlanmadıysa sil
  return {
    ...state,
    currentPath: null,
    isDrawing: false,
  };
}

