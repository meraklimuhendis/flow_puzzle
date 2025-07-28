import React from 'react';
import { createSampleGrid } from './utils/gridUtils';
import { Position, Cell, CellType } from './types/game';

function App() {
  const [apiStatus, setApiStatus] = React.useState('Checking...');
  const [grid, setGrid] = React.useState(() => createSampleGrid());
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [currentPath, setCurrentPath] = React.useState<Position[]>([]);
  const [currentColor, setCurrentColor] = React.useState<string | null>(null);
  const [currentLetter, setCurrentLetter] = React.useState<string | null>(null);
  
  // Ref'ler ile gerçek zamanlı değerleri takip edelim
  const currentPathRef = React.useRef<Position[]>([]);
  const isDrawingRef = React.useRef(false);
  const currentColorRef = React.useRef<string | null>(null);
  
  // Mouse durumu için ek state
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const isMouseDownRef = React.useRef(false);

  // Visual path tracking (grid'i değiştirmeden)
  const [visualPath, setVisualPath] = React.useState<Position[]>([]);
  const visualPathRef = React.useRef<Position[]>([]);

  // Debug için currentPath değişimini izleyelim
  React.useEffect(() => {
    console.log('📍 CurrentPath değişti:', currentPath);
  }, [currentPath]);

  React.useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch('/api/test');
        const data = await response.json();
        setApiStatus('✅ API Connected: ' + data.message);
      } catch (error) {
        console.error('API Error:', error);
        setApiStatus('❌ API Failed');
      }
    };
    
    testApi();
  }, []);

  const handleMouseDown = (position: Position, cell: Cell) => {
    console.log('�️ Mouse down:', position, cell.type, cell.letter);
    
    setIsMouseDown(true);
    isMouseDownRef.current = true;
    
    // Eğer letter cell'e mouse down yapıldıysa path başlat
    if (cell.type === CellType.LETTER && cell.letter) {
      startPath(position, cell);
    }
  };

  const handleMouseUp = (position: Position, cell: Cell) => {
    console.log('🖱️ Mouse up:', position, cell.type, cell.letter);
    
    setIsMouseDown(false);
    isMouseDownRef.current = false;
    
    // Eğer çizim yapıyorsak ve aynı renkteki letter'a mouse up yapıldıysa path bitir
    if (isDrawing && cell.type === CellType.LETTER && cell.letter === currentLetter && cell.color === currentColor) {
      finishPath(position, cell);
    } else if (isDrawing) {
      // Başka yerde mouse up yapıldıysa çizimi durdur
      stopDrawing();
    }
  };

  const handleCellClick = (position: Position, cell: Cell) => {
    console.log('🔥 Cell clicked:', JSON.stringify(position), JSON.stringify(cell), 'Type:', cell.type, 'Letter:', cell.letter);
    
    // Click eventi artık sadece fallback, asıl logic mouse down/up'ta
    if (!isMouseDown && cell.type === CellType.LETTER && cell.letter) {
      console.log('✅ Starting path for letter (click fallback):', cell.letter);
      startPath(position, cell);
    }
  };

  const handleCellHover = (position: Position, cell: Cell) => {
    // SADECE mouse basılı tutulduğunda ve çizim yapıyorsak hover ile path devam ettir
    if (isMouseDownRef.current && isDrawingRef.current && cell.type === CellType.EMPTY) {
      const positionExists = currentPathRef.current.some((p: Position) => p.x === position.x && p.y === position.y);
      if (!positionExists) {
        addToPath(position, cell);
      }
    }
  };

  const startPath = (position: Position, cell: Cell) => {
    console.log('🎨 Path başlatılıyor:', cell.letter, cell.color);
    
    // Önceki visual path'i DOM'dan temizle
    clearVisualPathFromDOM();
    
    // State'leri güncelle
    setIsDrawing(true);
    setCurrentPath([position]);
    setCurrentColor(cell.color || null);
    setCurrentLetter(cell.letter || null);
    
    // Ref'leri de güncelle (gerçek zamanlı kullanım için)
    isDrawingRef.current = true;
    currentPathRef.current = [position];
    currentColorRef.current = cell.color || null;
    
    // Visual path'i temizle ve start position'ı ekle
    setVisualPath([]);
    visualPathRef.current = [];
  };

  // DOM manipülasyonu ile gerçek zamanlı visual feedback
  const addVisualPathToDOM = (position: Position) => {
    const selector = `div[data-position="${position.x},${position.y}"]`;
    const element = document.querySelector(selector) as HTMLDivElement;
    
    if (element) {
      // HEMEN DOM'a style ekle
      element.style.backgroundColor = currentColorRef.current || '#4CAF50';
      element.style.border = `3px solid ${currentColorRef.current || '#4CAF50'}`;
      element.style.opacity = '0.8';
      element.style.transform = 'scale(1.1)';
      element.textContent = '●';
      console.log('🚀 DOM güncellendi:', position.x, position.y, 'selector:', selector);
    } else {
      console.log('❌ DOM element bulunamadı:', selector);
    }
  };

  const clearVisualPathFromDOM = () => {
    // Tüm visual path'leri DOM'dan temizle
    visualPathRef.current.forEach((pos: Position) => {
      const selector = `div[data-position="${pos.x},${pos.y}"]`;
      const element = document.querySelector(selector) as HTMLDivElement;
      if (element) {
        element.style.backgroundColor = '';
        element.style.border = '';
        element.style.opacity = '';
        element.style.transform = '';
        element.textContent = '';
        console.log('🧹 DOM temizlendi:', pos.x, pos.y);
      }
    });
  };

  const addToVisualPath = (position: Position) => {
    console.log('👀 addToVisualPath çağrıldı:', position);
    
    const currentVisualPath = visualPathRef.current;
    
    // Eğer position zaten visual path'de varsa ekleme
    const positionExists = currentVisualPath.some((p: Position) => p.x === position.x && p.y === position.y);
    if (positionExists) {
      console.log('❌ Visual pathde zaten var:', position);
      return;
    }

    const newVisualPath = [...currentVisualPath, position];
    
    // State'i güncelle (ama buna güvenme)
    setVisualPath(newVisualPath);
    visualPathRef.current = newVisualPath;
    
    // HEMEN DOM'u güncelle
    console.log('🚀 DOM güncelleme çağrılıyor:', position);
    addVisualPathToDOM(position);
    
    console.log('👀 Visual path güncellendi (DOM):', newVisualPath);
  };

  const addToPath = (position: Position, cell: Cell) => {
    console.log('🔍 addToPath çağrıldı:', position, 'currentPath:', currentPathRef.current);
    
    // Ref'ten güncel path'i al
    const currentPathFromRef = currentPathRef.current;
    
    // Eğer position zaten path'de varsa ekleme
    const positionExists = currentPathFromRef.some((p: Position) => p.x === position.x && p.y === position.y);
    if (positionExists) {
      console.log('❌ Position zaten var:', position);
      return;
    }

    // Son position ile adjacent mi kontrol et
    if (currentPathFromRef.length === 0) {
      console.log('❌ Path boş');
      return;
    }
    const lastPosition = currentPathFromRef[currentPathFromRef.length - 1];
    const isAdjacent = Math.abs(lastPosition.x - position.x) + Math.abs(lastPosition.y - position.y) === 1;
    
    if (isAdjacent) {
      console.log('✅ Adjacent position, path genişletiliyor');
      const newPath = [...currentPathFromRef, position];
      
      // Hem state'i hem ref'i güncelle
      setCurrentPath(newPath);
      currentPathRef.current = newPath;
      
      // Visual path'i HEMEN güncelle (grid'den bağımsız)
      console.log('🎨 addToVisualPath çağrılıyor:', position);
      addToVisualPath(position);
      
      // Grid'i de güncelle (ama visual feedback visual path'ten gelecek)
      updateGridWithPath(newPath);
      console.log('Path genişletildi:', newPath);
    } else {
      console.log('❌ Position adjacent değil. Last:', lastPosition, 'New:', position);
    }
  };

  const finishPath = (position: Position, cell: Cell) => {
    console.log('Path tamamlandı:', currentLetter, currentPathRef.current.length + 1, 'adım');
    
    // Final path'i oluştur
    const finalPath = [...currentPathRef.current, position];
    
    // Grid'i son path ile güncelle
    updateGridWithPath(finalPath, true);
    
    // Path state'ini temizle
    setIsDrawing(false);
    setCurrentPath([]);
    setCurrentColor(null);
    setCurrentLetter(null);
    setIsMouseDown(false);
    
    // Ref'leri temizle
    isDrawingRef.current = false;
    currentPathRef.current = [];
    currentColorRef.current = null;
    isMouseDownRef.current = false;
    
    // Visual path'i temizle
    setVisualPath([]);
    visualPathRef.current = [];
  };

  const stopDrawing = () => {
    console.log('Çizim durduruldu');
    
    // DOM'dan visual path'i temizle
    clearVisualPathFromDOM();
    
    // Mevcut path'i temizle
    clearCurrentPath();
    
    setIsDrawing(false);
    setCurrentPath([]);
    setCurrentColor(null);
    setCurrentLetter(null);
    setIsMouseDown(false);
    
    // Ref'leri temizle
    isDrawingRef.current = false;
    currentPathRef.current = [];
    currentColorRef.current = null;
    isMouseDownRef.current = false;
    
    // Visual path'i temizle
    setVisualPath([]);
    visualPathRef.current = [];
  };

  const updateGridWithPath = (path: Position[], isComplete = false) => {
    console.log('🔄 Updating grid with path:', path, 'isComplete:', isComplete);
    const newGrid = { ...grid };
    newGrid.cells = grid.cells.map((row: Cell[]) => [...row]);
    
    // Önceki geçici path'leri temizle (complete olmayan)
    for (let y = 0; y < newGrid.dimensions.height; y++) {
      for (let x = 0; x < newGrid.dimensions.width; x++) {
        const cell = newGrid.cells[y][x];
        if (cell.type === CellType.PATH && !cell.isConnected) {
          console.log('🧹 Clearing old path at:', x, y);
          newGrid.cells[y][x] = {
            ...cell,
            type: CellType.EMPTY,
            color: undefined,
          };
        }
      }
    }
    
    // Yeni path'i ekle
    path.forEach((pos, index) => {
      if (index === 0 || index === path.length - 1) return; // Start/end cells'i atla
      
      const cell = newGrid.cells[pos.y][pos.x];
      if (cell.type === CellType.EMPTY) {
        console.log('🎨 Adding path cell at:', pos.x, pos.y, 'with color:', currentColorRef.current);
        newGrid.cells[pos.y][pos.x] = {
          ...cell,
          type: CellType.PATH,
          color: currentColorRef.current || undefined,
          isConnected: isComplete,
        };
      }
    });
    
    console.log('✅ Grid updated, setting new grid');
    setGrid(newGrid);
  };

  const clearCurrentPath = () => {
    const newGrid = { ...grid };
    newGrid.cells = grid.cells.map((row: Cell[]) => [...row]);
    
    // Geçici path'leri temizle
    for (let y = 0; y < newGrid.dimensions.height; y++) {
      for (let x = 0; x < newGrid.dimensions.width; x++) {
        const cell = newGrid.cells[y][x];
        if (cell.type === CellType.PATH && !cell.isConnected) {
          newGrid.cells[y][x] = {
            ...cell,
            type: CellType.EMPTY,
            color: undefined,
          };
        }
      }
    }
    
    setGrid(newGrid);
  };

  const resetGame = () => {
    const newGrid = createSampleGrid();
    console.log('🔄 Oyun sıfırlanıyor, yeni grid:', newGrid);
    setGrid(newGrid);
    setIsDrawing(false);
    setCurrentPath([]);
    setCurrentColor(null);
    setCurrentLetter(null);
    console.log('Oyun sıfırlandı');
  };

  // Simple Grid render function using createElement
  const renderGrid = () => {
    const cellElements = [];
    
    for (let y = 0; y < grid.dimensions.height; y++) {
      for (let x = 0; x < grid.dimensions.width; x++) {
        const cell = grid.cells[y][x];
        const cellStyle: React.CSSProperties = {
          width: '60px',
          height: '60px',
          border: '2px solid #ddd',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: 'bold',
          backgroundColor: cell.color || '#f8f9fa',
          color: cell.color ? '#fff' : '#333',
          transition: 'all 0.2s ease',
          position: 'relative',
        };

        // Path cell styling
        if (cell.type === CellType.PATH) {
          cellStyle.backgroundColor = cell.color || '#ddd';
          cellStyle.opacity = cell.isConnected ? 1 : 0.7;
          cellStyle.border = `3px solid ${cell.color || '#999'}`;
        }

        // Visual path styling (gerçek zamanlı feedback)
        const isInVisualPath = visualPath.some((p: Position) => p.x === cell.position.x && p.y === cell.position.y);
        if (isInVisualPath && cell.type === CellType.EMPTY) {
          cellStyle.backgroundColor = currentColorRef.current || '#4CAF50';
          cellStyle.border = `3px solid ${currentColorRef.current || '#4CAF50'}`;
          cellStyle.opacity = 0.8;
        }

        // Drawing feedback
        if (isDrawing && cell.type === CellType.EMPTY && !isInVisualPath) {
          cellStyle.backgroundColor = '#e8f5e8';
          cellStyle.border = '2px dashed #4CAF50';
        }

        if (cell.isStart) {
          cellStyle.boxShadow = '0 0 0 4px rgba(255, 255, 255, 0.6)';
        }
        if (cell.isEnd) {
          cellStyle.boxShadow = 'inset 0 0 0 4px rgba(255, 255, 255, 0.8)';
        }

        cellElements.push(
          React.createElement('div', {
            key: cell.id,
            style: cellStyle,
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              handleCellClick(cell.position, cell);
            },
            onMouseDown: (e: React.MouseEvent) => {
              e.preventDefault();
              console.log('🎯 MOUSE DOWN!', cell.position);
              handleMouseDown(cell.position, cell);
            },
            onMouseUp: (e: React.MouseEvent) => {
              e.preventDefault();
              console.log('🎯 MOUSE UP!', cell.position);
              handleMouseUp(cell.position, cell);
            },
            onMouseEnter: () => handleCellHover(cell.position, cell),
            onMouseMove: () => {
              if (isMouseDownRef.current && isDrawingRef.current && cell.type === CellType.EMPTY) {
                handleCellHover(cell.position, cell);
              }
            },
            'data-position': `${cell.position.x},${cell.position.y}`,
            'data-type': cell.type,
            'data-letter': cell.letter || '',
          }, cell.letter || (cell.type === CellType.PATH ? '●' : ''))
        );
      }
    }

    return React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${grid.dimensions.width}, 60px)`,
        gridTemplateRows: `repeat(${grid.dimensions.height}, 60px)`,
        gap: '4px',
        padding: '20px',
        backgroundColor: '#667eea',
        borderRadius: '16px',
        margin: '20px auto',
        width: 'fit-content',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      }
    }, cellElements);
  };

  return React.createElement('div', { style: { padding: '20px', textAlign: 'center' } }, [
    React.createElement('h1', { key: 'title' }, '🎮 Flow Puzzle'),
    React.createElement('p', { key: 'desc' }, 'Path çizme sistemi aktif! Aynı renkteki harfleri birbirine bağlayın.'),
    
    React.createElement('div', { 
      key: 'game-area',
      style: { 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '12px',
        margin: '20px 0'
      }
    }, [
      React.createElement('h3', { key: 'grid-title' }, '🎯 Oyun Grid\'i'),
      React.createElement('p', { key: 'grid-desc' }, isDrawing 
        ? `🎨 Çizim modu: ${currentLetter} harfi (${currentPath.length} adım) - Mouse'u ${isMouseDown ? 'basılı tutun' : 'bırakın'}`
        : 'Bir harfe MOUSE DOWN yapın ve BASILI TUTARAK sürükleyin'),
      React.createElement('button', {
        key: 'reset-btn',
        onClick: resetGame,
        style: {
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '10px',
          fontSize: '14px'
        }
      }, '🔄 Oyunu Sıfırla'),
      renderGrid()
    ]),
    
    React.createElement('div', { 
      key: 'status',
      style: { 
        background: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }
    }, [
      React.createElement('h3', { key: 'status-title' }, 'System Status'),
      React.createElement('p', { key: 'react-status' }, '✅ React.js çalışıyor'),
      React.createElement('p', { key: 'grid-status' }, '✅ Grid sistemi aktif'),
      React.createElement('p', { key: 'path-status' }, `✅ Path çizme: ${isDrawing ? 'Aktif' : 'Beklemede'}`),
      React.createElement('p', { key: 'api-status' }, apiStatus)
    ])
  ]);
}

export default App;
