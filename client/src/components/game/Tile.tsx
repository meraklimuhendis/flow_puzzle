import { memo } from 'react';

interface TileProps {
  row: number;
  col: number;
  letter: string | null;
  bgColor: string | null;
  textColor: string | null;
  isActive: boolean;
  isEndpoint: boolean;
  size: number;
}

function Tile({
  row,
  col,
  letter,
  bgColor,
  textColor,
  isActive,
  isEndpoint,
  size,
}: TileProps) {
  const hasPath = bgColor !== null;

  return (
    <div
      className={`
        relative flex items-center justify-center
        rounded-xl transition-all duration-150
        select-none touch-none
        ${hasPath ? 'shadow-md' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}
        ${isActive ? 'shadow-lg scale-105 z-10' : ''}
        ${isEndpoint ? 'font-bold' : ''}
      `}
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor || undefined,
        color: textColor || undefined,
      }}
      data-testid={`tile-${row}-${col}`}
      data-row={row}
      data-col={col}
    >
      {letter && (
        <span
          className="text-lg md:text-xl lg:text-2xl font-bold pointer-events-none"
          style={{ color: textColor || undefined }}
        >
          {letter}
        </span>
      )}
    </div>
  );
}

export default memo(Tile);
