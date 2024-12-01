import { Position } from './Game';

interface PlayerProps {
  position: Position;
}

const Player = ({ position }: PlayerProps) => {
  return (
    <div
      className="absolute w-12 h-12 transition-all duration-100"
      style={{ left: position.x - 24, top: position.y - 24 }}
    >
      <div className="w-full h-full bg-blue-500 clip-path-triangle" />
    </div>
  );
};

export default Player;