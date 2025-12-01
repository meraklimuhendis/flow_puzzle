import { memo } from 'react';
import { Path, PathSegment, getPathColor } from '@/logic/gameEngine';

interface PathRendererProps {
  paths: Map<string, Path>;
  currentPath: Path | null;
  tileSize: number;
  gap: number;
}

function PathRenderer({ paths, currentPath, tileSize, gap }: PathRendererProps) {
  const cellCenter = tileSize / 2;
  const strokeWidth = Math.max(8, tileSize * 0.15);

  const getCoord = (index: number): number => {
    return index * (tileSize + gap) + cellCenter;
  };

  const renderPath = (path: Path, key: string) => {
    if (path.segments.length < 2) return null;

    const points = path.segments.map(
      (segment) => `${getCoord(segment.col)},${getCoord(segment.row)}`
    );

    return (
      <polyline
        key={key}
        points={points.join(' ')}
        fill="none"
        stroke={getPathColor(path.colorIndex)}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.7}
        className="transition-all duration-100"
      />
    );
  };

  const allPaths: [string, Path][] = Array.from(paths.entries());
  if (currentPath && currentPath.segments.length >= 2) {
    allPaths.push([`current-${currentPath.letter}`, currentPath]);
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      {allPaths.map(([key, path]) => renderPath(path, key))}
    </svg>
  );
}

export default memo(PathRenderer);
