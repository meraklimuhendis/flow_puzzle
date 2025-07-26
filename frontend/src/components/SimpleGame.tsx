// Simple Test Game Component
import React from 'react';

interface SimpleGameProps {}

export const SimpleGame: React.FC<SimpleGameProps> = () => {
  const [cells, setCells] = React.useState(() => {
    // 5x5 grid with some letters
    const grid = Array(5).fill(null).map(() => Array(5).fill(null));
    
    // Add some letter pairs
    grid[0][0] = { letter: 'A', color: '#FF6B6B', isStart: true };
    grid[4][4] = { letter: 'A', color: '#FF6B6B', isEnd: true };
    
    grid[1][1] = { letter: 'B', color: '#4ECDC4', isStart: true };
    grid[3][3] = { letter: 'B', color: '#4ECDC4', isEnd: true };
    
    grid[2][0] = { letter: 'C', color: '#45B7D1', isStart: true };
    grid[2][4] = { letter: 'C', color: '#45B7D1', isEnd: true };
    
    return grid;
  });

  const handleCellClick = (row: number, col: number) => {
    console.log(`Clicked cell: ${row}, ${col}`);
    const cell = cells[row][col];
    if (cell) {
      console.log(`Cell content:`, cell);
    }
  };

  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '80vh',
      borderRadius: '15px',
      margin: '20px'
    }
  }, [
    React.createElement('h2', {
      key: 'title',
      style: { color: 'white', marginBottom: '20px' }
    }, '🎮 Flow Puzzle Test'),
    
    React.createElement('div', {
      key: 'grid',
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 60px)',
        gridTemplateRows: 'repeat(5, 60px)',
        gap: '4px',
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '15px'
      }
    }, 
    cells.flatMap((row, rowIndex) =>
      row.map((cell, colIndex) =>
        React.createElement('div', {
          key: `${rowIndex}-${colIndex}`,
          onClick: () => handleCellClick(rowIndex, colIndex),
          style: {
            width: '60px',
            height: '60px',
            backgroundColor: cell ? cell.color : '#f8f9fa',
            border: `3px solid ${cell ? cell.color : '#ddd'}`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '20px',
            boxShadow: cell?.isStart ? '0 0 0 3px rgba(255,255,255,0.5)' : 
                      cell?.isEnd ? 'inset 0 0 0 3px rgba(255,255,255,0.7)' : 'none',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }
        }, cell ? cell.letter : '')
      )
    )),
    
    React.createElement('div', {
      key: 'instructions',
      style: {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '10px',
        textAlign: 'center',
        color: '#333'
      }
    }, [
      React.createElement('p', { key: 'inst1' }, '🎯 Connect the same colored letters!'),
      React.createElement('p', { key: 'inst2' }, '📱 Click on cells to interact'),
      React.createElement('p', { key: 'inst3' }, '✨ Start letters have outer glow, end letters have inner glow')
    ])
  ]);
};

export default SimpleGame;
