import Tile from '../game/Tile';

export default function TileExample() {
  return (
    <div className="flex gap-4 items-center">
      <Tile
        row={0}
        col={0}
        letter="A"
        bgColor="rgb(251, 207, 232)"
        textColor="rgb(157, 23, 77)"
        isActive={false}
        isEndpoint={true}
        size={60}
      />
      <Tile
        row={0}
        col={1}
        letter={null}
        bgColor={null}
        textColor={null}
        isActive={false}
        isEndpoint={false}
        size={60}
      />
      <Tile
        row={0}
        col={2}
        letter={null}
        bgColor="rgb(196, 181, 253)"
        textColor={null}
        isActive={true}
        isEndpoint={false}
        size={60}
      />
      <Tile
        row={0}
        col={3}
        letter="B"
        bgColor="rgb(196, 181, 253)"
        textColor="rgb(76, 29, 149)"
        isActive={false}
        isEndpoint={true}
        size={60}
      />
    </div>
  );
}
