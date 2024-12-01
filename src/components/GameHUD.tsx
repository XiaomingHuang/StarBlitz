interface GameHUDProps {
  score: number;
  level: number;
  timeRemaining: number;
}

const GameHUD = ({ score, level, timeRemaining }: GameHUDProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white">
      <div className="text-xl font-bold">Score: {score}</div>
      <div className="text-xl font-bold">Level {level}</div>
      <div className={`text-xl font-bold ${timeRemaining <= 10 ? 'text-red-500' : ''}`}>
        Time: {formatTime(timeRemaining)}
      </div>
    </div>
  );
};

export default GameHUD;