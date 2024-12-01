import './index.css'
import Game from './components/Game'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-800">
      <h1 className="text-4xl font-bold text-white mb-4">Space Blitz</h1>
      <Game />
      <div className="text-slate-400 mt-4">
        Use ←/→ to move, SPACE to shoot
      </div>
    </div>
  )
}

export default App