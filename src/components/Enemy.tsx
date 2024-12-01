import { EnemyShip } from './Game';

interface EnemyProps {
  position: EnemyShip;
}

const Enemy = ({ position }: EnemyProps) => {
  return (
    <div
      className="absolute w-10 h-10 transition-all duration-100"
      style={{ left: position.x - 20, top: position.y - 20 }}
    >
      <div className={`w-full h-full rounded ${position.health > 1 ? 'bg-red-700' : 'bg-red-500'}`} />
      {position.health > 1 && (
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
          {position.health}
        </div>
      )}
    </div>
  );
};

export default Enemy;