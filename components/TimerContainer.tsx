import EasyTimer from 'easytimer.js';
import {GameStates, Players, SwitchTurnParams} from '../models';

import ChessPiece from './ChessPiece';
import Game from './Game';

interface TimerContainerProps {
  children: React.ReactNode;
  switchTurn: (params: SwitchTurnParams) => () => void;
  currentTimer: EasyTimer;
  nextTimer: EasyTimer;
  updateTimer: (newTimer: EasyTimer) => void;
  nextPlayer: Players;
  gameState: GameStates;
  turnState: Players;
  color: 'black' | 'white';
  isWinningPlayer: boolean;
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
  color,
  isWinningPlayer,
  reverse = false,
}: TimerContainerProps) => {
  let wrapperClasses = 'flex flex-1';
  if (reverse) {
    wrapperClasses += ' flex-col';
  } else {
    wrapperClasses += ' flex-col-reverse se:flex-col';
  }

  const playerName = nextPlayer === Players.p2 ? 'Player 1' : 'Player 2';
  return (
    <div key="p1" className={`${wrapperClasses} se:border se:border-gray-100 se:shadow-sm se:px-3 se:py-4`}>
      <h2 className="hidden se:inline text-xl se:text-center sm:text-2xl text-gray-600 font-light tracking-wide">
        {`${playerName}${isWinningPlayer ? ' wins!' : ''}`}
      </h2>
      <div className="flex-1 block se:flex se:justify-center">{children}</div>
      <div className="hidden landscape:hidden se:flex se:h-16 sm:h-20 mb-12">
        <ChessPiece color={color} />
      </div>
      <button
        className="flex-none btn-cyan disabled:cursor-default disabled:btn-disabled w-full h-14 text-xl font-medium tracking-wide mx-auto block sm:w-4/5 sm:font-normal sm:tracking-wider "
        onClick={switchTurn({
          currentTimer,
          nextTimer,
          updateTimer,
          nextPlayer,
        })}
        disabled={gameState !== GameStates.Playing || turnState === nextPlayer}
      >
        SWITCH
      </button>
    </div>
  );
};

export default TimerContainer;
