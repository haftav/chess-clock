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
  let wrapperClasses = 'flex';
  if (reverse) {
    wrapperClasses += ' flex-col-reverse';
  } else {
    wrapperClasses += ' flex-col';
  }
  return (
    <div key="p1" className={wrapperClasses}>
      <h2 className="hidden se:inline text-xl">Player 1</h2>
      <button
        className="btn-cyan disabled:btn-disabled w-56 h-11 font-semibold mx-auto mb-4 block"
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
      {children}
    </div>
  );
};

export default TimerContainer;
