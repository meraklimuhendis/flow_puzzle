import { memo } from 'react';
import { Circle, Triangle, Square, Star, Heart, Sun } from 'lucide-react';

type ShapeType = 'circle' | 'triangle' | 'square' | 'star' | 'heart' | 'sun';

interface TileProps {
  row: number;
  col: number;
  letter: string | null;
  shape: ShapeType | null;
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
  shape,
  bgColor,
  textColor,
  isActive,
  isEndpoint,
  size,
}: TileProps) {
  const hasPath = bgColor !== null;

  // Shape icon mapping
  const getShapeIcon = (shapeType: ShapeType | null) => {
    if (!shapeType) return null;
    
    const iconSize = size * 0.5; // Icon'ların tile boyutunun %50'si kadar olması
    const iconProps = {
      size: iconSize,
      strokeWidth: 2.5,
      fill: isEndpoint ? (textColor || 'currentColor') : 'none',
      color: textColor || 'currentColor',
    };

    switch (shapeType) {
      case 'circle':
        return <Circle {...iconProps} />;
      case 'triangle':
        return <Triangle {...iconProps} />;
      case 'square':
        return <Square {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      case 'heart':
        return <Heart {...iconProps} />;
      case 'sun':
        return <Sun {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        relative flex items-center justify-center
        rounded-xl transition-all duration-150
        select-none touch-none
        ${hasPath || (isEndpoint && bgColor) ? 'shadow-md' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}
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
      {shape && (
        <div className="pointer-events-none">
          {getShapeIcon(shape)}
        </div>
      )}
      {letter && !shape && (
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
