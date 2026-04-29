function generateMaze(size, seed) {
  let s = seed;
  function rand() { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; }
  const grid = Array.from({length: size}, () => Array.from({length: size}, () => ({walls:{top:true,right:true,bottom:true,left:true}})));
  const visited = Array.from({length: size}, () => Array(size).fill(false));
  const dirs = [{dr:-1,dc:0,wall:'top',opp:'bottom'},{dr:0,dc:1,wall:'right',opp:'left'},{dr:1,dc:0,wall:'bottom',opp:'top'},{dr:0,dc:-1,wall:'left',opp:'right'}];
  function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function carve(r,c){visited[r][c]=true;for(const d of shuffle([...dirs])){const nr=r+d.dr,nc=c+d.dc;if(nr>=0&&nr<size&&nc>=0&&nc<size&&!visited[nr][nc]){grid[r][c].walls[d.wall]=false;grid[nr][nc].walls[d.opp]=false;carve(nr,nc);}}}
  carve(0,0);
  return grid;
}
function w(walls){return (walls.top?1:0)+''+(walls.right?1:0)+''+(walls.bottom?1:0)+''+(walls.left?1:0);}

for (const seed of [7777, 8888, 1111, 2222, 3333, 4444, 5555, 6666, 9999, 12345]) {
  const size = 11;
  const grid = generateMaze(size, seed);
  grid[0][3].walls.top = false;
  grid[size-1][8].walls.bottom = false;
  const rows = grid.map(row => row.map(cell => ({walls: w(cell.walls)})));
  const result = {start:{row:0,col:3}, end:{row:size-1,col:8}, grid: rows};
  // Pretty print rows to visualize
  console.log('--- seed:', seed);
  for (let r = 0; r < 7; r++) {
    console.log(rows[r].map(c => c.walls).join(' '));
  }
  console.log('JSON:', JSON.stringify(result));
  console.log();
}
