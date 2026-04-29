// Maze generator script - generates valid maze JSON for levels.json
// Run: node script/gen_mazes.mjs

function generateMaze(size, seed) {
  // Simple seeded pseudo-random for reproducible mazes
  let s = seed || 42;
  function rand() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  }

  // All walls closed initially
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      walls: { top: true, right: true, bottom: true, left: true },
    }))
  );

  const visited = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  const directions = [
    { dr: -1, dc: 0, wall: 'top', opposite: 'bottom' },
    { dr: 0, dc: 1, wall: 'right', opposite: 'left' },
    { dr: 1, dc: 0, wall: 'bottom', opposite: 'top' },
    { dr: 0, dc: -1, wall: 'left', opposite: 'right' },
  ];

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function carve(row, col) {
    visited[row][col] = true;
    const dirs = shuffle([...directions]);
    for (const dir of dirs) {
      const nr = row + dir.dr;
      const nc = col + dir.dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc]) {
        grid[row][col].walls[dir.wall] = false;
        grid[nr][nc].walls[dir.opposite] = false;
        carve(nr, nc);
      }
    }
  }

  carve(0, 0);
  return grid;
}

function wallsToString(walls) {
  return `${walls.top ? 1 : 0}${walls.right ? 1 : 0}${walls.bottom ? 1 : 0}${walls.left ? 1 : 0}`;
}

function mazeToJSON(size, start, end, seed) {
  const grid = generateMaze(size, seed);
  return {
    start,
    end,
    grid: grid.map(row => row.map(cell => ({ walls: wallsToString(cell.walls) }))),
  };
}

// Generate 2 extra mazes per difficulty (seeds chosen for variety)
const mazes = {
  easy: [
    // size=7, puzzle2
    mazeToJSON(7, { row: 3, col: 0 }, { row: 6, col: 6 }, 1234),
    // size=7, puzzle3
    mazeToJSON(7, { row: 0, col: 6 }, { row: 6, col: 0 }, 5678),
  ],
  medium: [
    // size=9, puzzle2
    mazeToJSON(9, { row: 0, col: 4 }, { row: 8, col: 0 }, 9999),
    // size=9, puzzle3
    mazeToJSON(9, { row: 4, col: 0 }, { row: 4, col: 8 }, 3141),
  ],
  hard: [
    // size=11, puzzle2
    mazeToJSON(11, { row: 0, col: 5 }, { row: 10, col: 5 }, 2718),
    // size=11, puzzle3
    mazeToJSON(11, { row: 5, col: 0 }, { row: 5, col: 10 }, 1618),
  ],
};

console.log(JSON.stringify(mazes, null, 2));
