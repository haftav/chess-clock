import EasyTimer from 'easytimer.js';

interface GameControlProps {
  currentTimer: EasyTimer;
  toggleTimer: () => void;
  moveToMenuState: () => void;
}

const GameControl = ({currentTimer, toggleTimer, moveToMenuState}: GameControlProps) => {
  return (
    <div className="mx-auto my-4 flex justify-around se:flex-col se:justify-center se:w-auto">
    <button
      className="btn-cyan font-semibold text-lg w-32 p-2 mx-2"
      onClick={toggleTimer}
    >
      {currentTimer.isRunning() ? 'Pause' : 'Play'}
    </button>
    <button
      className="btn-red font-semibold text-lg w-32 p-2 mx-2"
      onClick={moveToMenuState}
    >
      New Game
    </button>
  </div>
  )
}

export default GameControl;
