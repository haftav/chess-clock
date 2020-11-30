import EasyTimer from 'easytimer.js';

interface GameControlProps {
  currentTimer: EasyTimer;
  toggleTimer: () => void;
  moveToMenuState: () => void;
}

const GameControl = ({currentTimer, toggleTimer, moveToMenuState}: GameControlProps) => {
  return (
    <div className="w-72 mx-auto my-4 flex justify-around">
    <button
      className="btn-cyan font-semibold text-lg w-28 h-10 flex justify-center items-center"
      onClick={toggleTimer}
    >
      {currentTimer.isRunning() ? 'Pause' : 'Play'}
    </button>
    <button
      className="btn-red font-semibold text-lg w-28 h-10 flex justify-center items-center"
      onClick={moveToMenuState}
    >
      New Game
    </button>
  </div>
  )
}

export default GameControl;
