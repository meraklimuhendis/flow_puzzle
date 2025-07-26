// GameBoard Component

import React from 'react';
import { GameState, Position } from '../types/game';
import './GameBoard.css';

interface GameBoardProps {
  gameState: GameState;
  onCellClick: (position: Position) => void;
  onCellHover: (position: Position) => void;
  currentPath: Position[];
  isDrawing: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onCellClick,
  onCellHover,
  currentPath,
  isDrawing
}) => {
  const { grid } = gameState;

  const handleCellClick = (x: number, y: number) => {
    onCellClick({ x, y });
  };

  const handleCellHover = (x: number, y: number) => {
    if (isDrawing) {
      onCellHover({ x, y });
    }
  };

  const isInCurrentPath = (x: number, y: number): boolean => {
    return currentPath.some(pos => pos.x === x && pos.y === y);
  };

  const getCellClasses = (x: number, y: number): string => {
    const cell = grid.cells[y][x];
    const classes = ['game-cell'];
    
    classes.push(`cell-${cell.type}`);
    
    if (cell.letter) {
      classes.push('cell-letter');
      if (cell.isStart) classes.push('cell-start');
      if (cell.isEnd) classes.push('cell-end');
    }
    
    if (isInCurrentPath(x, y)) {
      classes.push('cell-in-path');
    }
    
    if (cell.isConnected) {
      classes.push('cell-connected');
    }
    
    return classes.join(' ');
  };

  const getCellStyle = (x: number, y: number): React.CSSProperties => {
    const cell = grid.cells[y][x];
    const style: React.CSSProperties = {};
    
    if (cell.color) {
      style.backgroundColor = cell.color;
      style.borderColor = cell.color;
    }
    
    return style;
  };

  return (
    <div className="game-board-container">
      <div className="game-info">
        <div className="game-stats">
          <span>Level: {gameState.level}</span>
          <span>Moves: {gameState.moves}</span>
          <span>Time: {Math.floor(gameState.timeElapsed / 60)}:{(gameState.timeElapsed % 60).toString().padStart(2, '0')}</span>
          <span>Score: {gameState.score}</span>
        </div>
        {gameState.isComplete && (
          <div className="game-complete">
            🎉 Puzzle Complete! 🎉
          </div>
        )}
      </div>
      
      <div 
        className="game-board"
        style={{
          gridTemplateColumns: `repeat(${grid.dimensions.width}, 1fr)`,
          gridTemplateRows: `repeat(${grid.dimensions.height}, 1fr)`
        }}
      >
        {grid.cells.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={getCellClasses(x, y)}
              style={getCellStyle(x, y)}
              onClick={() => handleCellClick(x, y)}
              onMouseEnter={() => handleCellHover(x, y)}
              data-x={x}
              data-y={y}
            >
              {cell.letter && (
                <span className="cell-letter-text">
                  {cell.letter}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
