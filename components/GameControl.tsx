import EasyTimer from 'easytimer.js';

interface GameControlProps {
  currentTimer: EasyTimer;
  toggleTimer: () => void;
  moveToMenuState: () => void;
}

const GameControl = ({currentTimer, toggleTimer, moveToMenuState}: GameControlProps) => {
  return (
    <div className="my-4 flex justify-around se:flex-col se:justify-center se:w-auto se:p-3 md:p-10">
    <button
      className="btn-cyan font-semibold text-lg w-32 se:w-24 se:text-sm p-2 mx-2 se:my-2 md:w-36 md:text-lg"
      onClick={toggleTimer}
    >
      {currentTimer.isRunning() ? 'Pause' : 'Play'}
    </button>
    <button
      className="btn-red font-semibold text-lg w-32 se:w-24 se:text-sm p-2 mx-2 se:my-2 md:w-36 md:text-lg"
      onClick={moveToMenuState}
    >
      New Game
    </button>
  </div>
  )
}

export default GameControl;
