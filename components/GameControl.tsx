import {GameStates} from '../models';
import HelpIcon from './HelpIcon';

interface GameControlProps {
  gameState: GameStates;
  toggleTimer: () => void;
  moveToMenuState: () => void;
  resetTimers: () => void;
}

const GameControl = ({gameState, toggleTimer, moveToMenuState, resetTimers}: GameControlProps) => {
  return (
    <div className="my-4 flex justify-around se:flex-col se:justify-center se:items-center se:w-auto se:p-3 md:p-10">
      <h1 className="hidden mb-4 text-2xl se:block sm:text-3xl font-normal text-center w-28">
        CHESS TIMER
      </h1>
      <button
        className="btn-cyan font-semibold text-lg w-32 se:w-24 se:text-sm p-2 mx-2 se:my-2 md:w-36 md:text-lg"
        onClick={gameState === GameStates.Ended ? resetTimers : toggleTimer}
      >
        {gameState === GameStates.Ended
          ? 'Reset'
          : gameState === GameStates.Playing
          ? 'Pause'
          : 'Play'}
      </button>
      <button
        className="btn-red font-semibold text-lg w-32 se:w-24 se:text-sm p-2 mx-2 se:my-2 md:w-36 md:text-lg"
        onClick={moveToMenuState}
      >
        New Game
      </button>
    </div>
  );
};

export default GameControl;
