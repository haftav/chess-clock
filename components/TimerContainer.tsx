import EasyTimer from 'easytimer.js';
import {GameStates, Players, SwitchTurnParams} from '../models';

interface TimerContainerProps {
  children: React.ReactNode;
  switchTurn: (params: SwitchTurnParams) => () => void;
  currentTimer: EasyTimer;
  nextTimer: EasyTimer;
  updateTimer: (newTimer: EasyTimer) => void;
  nextPlayer: Players;
  gameState: GameStates;
  turnState: Players;
  reverse?: boolean;
}

const TimerContainer = ({
  children,
  switchTurn,
  currentTimer,
  nextTimer,
  updateTimer,
  nextPlayer,
  gameState,
  turnState,
  reverse = false,
}: TimerContainerProps) => {
  let wrapperClasses = 'flex flex-1';
  if (reverse) {
    wrapperClasses += ' flex-col';
  } else {
    wrapperClasses += ' flex-col-reverse se:flex-col';
  }
  return (
    <div key="p1" className={`${wrapperClasses} se:border se:border-gray-100 se:px-3 se:py-4`}>
      <h2 className="hidden se:inline text-xl">{nextPlayer === Players.p2 ? 'Player 1' : 'Player 2'}</h2>
      <div className="flex-1 block se:flex se:justify-center">
        {children}
      </div>
      <button
        className="flex-none btn-cyan disabled:btn-disabled w-full h-14 text-xl font-medium tracking-wide mx-auto block"
        onClick={switchTurn({
          currentTimer,
          nextTimer,
          updateTimer,
          nextPlayer,
        })}
        disabled={gameState === GameStates.Menu || turnState === nextPlayer}
      >
        SWITCH
      </button>
    </div>
  );
};

export default TimerContainer;
