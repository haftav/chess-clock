import EasyTimer, {TimeCounter} from 'easytimer.js';
import {GameStates, Players, SwitchTurnParams} from '../models';

interface TimerContainerProps {
  children: React.ReactNode;
  switchTurn: (params: SwitchTurnParams) => () => void;
  currentTimer: EasyTimer;
  nextTimer: EasyTimer;
  updateTimer: (newValues: TimeCounter) => void;
  nextPlayer: Players;
  gameState: GameStates;
  turnState: Players;
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
}: TimerContainerProps) => {
  return (
    <div key="p1" className="flex-flex-col">
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
