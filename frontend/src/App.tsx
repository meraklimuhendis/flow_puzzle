import React from 'react';
import { createSampleGrid } from './utils/gridUtils';
import { Position, Cell } from './types/game';

function App() {
  const [apiStatus, setApiStatus] = React.useState('Checking...');
  const [grid] = React.useState(() => createSampleGrid());
  
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

  const handleCellClick = (position: Position, cell: Cell) => {
    console.log('Cell clicked:', position, cell);
  };

  const handleCellHover = (position: Position, cell: Cell) => {
    console.log('Cell hovered:', position, cell);
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
            onClick: () => handleCellClick(cell.position, cell),
            onMouseEnter: () => handleCellHover(cell.position, cell),
            'data-position': `${cell.position.x},${cell.position.y}`,
          }, cell.letter || '')
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
    React.createElement('p', { key: 'desc' }, 'Grid sistemi başarıyla oluşturuldu!'),
    
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
      React.createElement('p', { key: 'grid-desc' }, 'Aynı renkteki harfleri birbirine bağlayın'),
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
      React.createElement('p', { key: 'api-status' }, apiStatus)
    ])
  ]);
}

export default App;
