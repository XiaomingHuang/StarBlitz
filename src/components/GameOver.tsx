interface GameOverProps {
  score: number;
  level: number;
  onRestart: () => void;
}

const GameOver = ({ score, level, onRestart }: GameOverProps) => {
  return (
    <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center">
      <div className="text-4xl font-bold text-white mb-4">Game Over</div>
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="text-2xl text-white">Final Score: {score}</div>
        <div className="text-xl text-blue-400">Reached Level {level}</div>
      </div>
      <button
        onClick={onRestart}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOver;