import { memo } from 'react';
import { ArrowRight, Target } from 'lucide-react';

interface WallSet {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

interface MazeTileProps {
  row: number;
  col: number;
  walls: WallSet;
  isStart: boolean;
  isEnd: boolean;
  bgColor: string | null;
  isActive: boolean;
  size: number;
}

function MazeTile({
  row,
  col,
  walls,
  isStart,
  isEnd,
  bgColor,
  isActive,
  size,
}: MazeTileProps) {
  const hasPath = bgColor !== null;
  const wallThickness = 3;
  const iconSize = size * 0.4;

  return (
    <div
      className="relative flex items-center justify-center select-none touch-none"
      style={{
        width: size,
        height: size,
        backgroundColor: hasPath ? bgColor : (isStart ? '#86efac' : isEnd ? '#fca5a5' : '#f7fafc'),
      }}
      data-testid={`maze-tile-${row}-${col}`}
      data-row={row}
      data-col={col}
    >
      {/* Duvarlar */}
      {walls.top && (
        <div
          className="absolute top-0 left-0 right-0 bg-gray-700"
          style={{ height: wallThickness }}
        />
      )}
      {walls.right && (
        <div
          className="absolute top-0 right-0 bottom-0 bg-gray-700"
          style={{ width: wallThickness }}
        />
      )}
      {walls.bottom && (
        <div
          className="absolute bottom-0 left-0 right-0 bg-gray-700"
          style={{ height: wallThickness }}
        />
      )}
      {walls.left && (
        <div
          className="absolute top-0 left-0 bottom-0 bg-gray-700"
          style={{ width: wallThickness }}
        />
      )}

      {/* Başlangıç ikonu */}
      {isStart && (
        <div className="pointer-events-none">
          <ArrowRight
            size={iconSize}
            strokeWidth={2.5}
            color="#16a34a"
            className="animate-pulse"
          />
        </div>
      )}

      {/* Bitiş ikonu */}
      {isEnd && (
        <div className="pointer-events-none">
          <Target
            size={iconSize}
            strokeWidth={2.5}
            color="#dc2626"
            className="animate-pulse"
          />
        </div>
      )}

      {/* Aktif animasyon */}
      {isActive && (
        <div
          className="absolute inset-0 bg-blue-400 opacity-30 rounded-sm animate-pulse"
        />
      )}
    </div>
  );
}

export default memo(MazeTile);
