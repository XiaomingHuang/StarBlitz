import { Rocket } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="w-[800px] h-[600px] bg-slate-900 rounded-lg flex flex-col items-center justify-center gap-8">
      <div className="text-6xl font-bold text-white flex items-center gap-4">
        <Rocket size={48} className="text-blue-500" />
        Space Blitz
      </div>
      
      <div className="text-slate-300 text-center max-w-md">
        <p className="mb-4">Defend Earth from alien invasion! Complete all levels before time runs out.</p>
        <p>Use ←/→ to move, SPACE to shoot</p>
      </div>

      <button
        onClick={onStart}
        className="px-8 py-4 bg-blue-500 text-white text-xl font-bold rounded-lg hover:bg-blue-600 transition-colors"
      >
        Start Game
      </button>
    </div>
  );
};

export default StartScreen;