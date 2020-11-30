import Head from 'next/head';
import * as React from 'react';
import EasyTimer, {TimerParams, TimeCounter} from 'easytimer.js';

import Timer from '../components/Timer';
import Options from '../components/Options';
import useTimer from '../hooks/useTimer';
import {getIncrementedTime} from '../utils';

enum GameStates {
  Menu,
  Playing,
  Paused,
  Ended,
}

enum Players {
  p1,
  p2,
}

enum KeyCodes {
  RIGHT_SHIFT = 'ShiftRight',
  LEFT_SHIFT = 'ShiftLeft',
  SPACE = 'Space',
}

interface SwitchTurnParams {
  currentTimer: EasyTimer;
  nextTimer: EasyTimer;
  updateTimer: (newValues: TimeCounter) => void;
  nextPlayer: Players;
}

function isNumber(num: number | undefined): num is number {
  return typeof num === 'number';
}

interface OptionButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  children: React.ReactNode;
}

const OptionButton = ({selected, children, ...rest}: OptionButtonProps) => {
  let classes = 'w-auto h-12 rounded-md text-white font-bold bg-gradient-to-r';

  if (selected) {
    classes += ' from-cyan-500 to-cyan-300';
  } else {
    classes += ' from-gray-500 to-gray-400';
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
};

interface ActionButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ActionButton = ({children, ...rest}: ActionButtonProps) => {
  return (
    <button
      className="text-xl block mx-auto bg-gradient-to-r from-red-500 to-red-300 w-52 px-6 py-3 rounded-md text-white font-semibold mb-10"
      {...rest}
    >
      {children}
    </button>
  );
};

export default function Home() {
  const [gameState, setGameState] = React.useState(GameStates.Menu);
  const [turnState, setTurnState] = React.useState<Players>(Players.p1);
  const [timerConfig, setTimerConfig] = React.useState<TimerParams>({
    precision: 'secondTenths',
    countdown: true,
    startValues: {
      seconds: 300,
    },
  });
  const [gameType, setGameType] = React.useState('5 min');
  const [increment, setIncrement] = React.useState(0);
  const [sidesSwitched, setSidesSwitched] = React.useState(false);

  const [p1Timer, p1TimeLeft, updateP1Timer] = useTimer(timerConfig, 'Player 2');
  const [p2Timer, p2TimeLeft, updateP2Timer] = useTimer(timerConfig, 'Player 1');

  const currentTimer = turnState === Players.p1 ? p1Timer : p2Timer;

  const handleOptionClick = (duration: number, gameType: string, increment?: number) => () => {
    setTimerConfig((prevConfig) => {
      return {
        ...prevConfig,
        startValues: {
          seconds: duration,
        },
      };
    });

    setGameType(gameType);

    if (isNumber(increment)) {
      setIncrement(increment);
    } else {
      setIncrement(0);
    }
  };

  const switchTurn = React.useCallback(
    ({currentTimer, nextTimer, updateTimer, nextPlayer}: SwitchTurnParams) => () => {
      // pause current player's timer (and add increment if necessary)
      currentTimer.pause();
      // start next player's timer
      nextTimer.start();

      setTurnState(nextPlayer);

      if (increment) {
        const newValues = getIncrementedTime(currentTimer.getTimeValues(), increment);
        updateTimer(newValues);
      }

      if (gameState !== GameStates.Playing) {
        setGameState(GameStates.Playing);
      }
    },
    [increment, gameState]
  );

  const toggleTimer = React.useCallback(() => {
    if (currentTimer.isRunning()) {
      currentTimer.pause();
      setGameState(GameStates.Paused);
    } else {
      currentTimer.start();
      setGameState(GameStates.Playing);
    }
  }, [currentTimer]);

  const moveToMenuState = () => {
    if (currentTimer.isRunning()) {
      currentTimer.stop();
    }
    setGameState(GameStates.Menu);
  }

  React.useEffect(() => {
    const eventListener = (e: KeyboardEvent) => {
      const p1Key = KeyCodes.LEFT_SHIFT;
      const p2Key = KeyCodes.RIGHT_SHIFT;

      if (gameState === GameStates.Menu || gameState === GameStates.Ended) {
        return;
      }

      if (e.code === p1Key && turnState === Players.p1) {
        switchTurn({
          currentTimer: p1Timer,
          nextTimer: p2Timer,
          updateTimer: updateP1Timer,
          nextPlayer: Players.p2,
        })();
      }

      if (e.code === p2Key && turnState === Players.p2) {
        switchTurn({
          currentTimer: p2Timer,
          nextTimer: p1Timer,
          updateTimer: updateP2Timer,
          nextPlayer: Players.p1,
        })();
      }

      if (e.code === KeyCodes.SPACE) {
        e.preventDefault();
        toggleTimer();
      }
    };

    document.addEventListener('keydown', eventListener);

    return () => document.removeEventListener('keydown', eventListener);
  }, [
    gameState,
    switchTurn,
    turnState,
    p1Timer,
    p2Timer,
    updateP1Timer,
    updateP2Timer,
    toggleTimer,
    sidesSwitched,
  ]);

  const switchSides = () => {
    setSidesSwitched((prevState) => !prevState);
    setTurnState((prevState) => (prevState === Players.p1 ? Players.p2 : Players.p1));
  };

  const FirstTimer = (
    <div key="p1" className="flex-flex-col">
      <h2 className="hidden sm:inline text-xl">Player 1</h2>
      <button
        className="btn-cyan disabled:btn-disabled w-56 h-11 font-semibold mx-auto mb-4 block"
        onClick={switchTurn({
          currentTimer: p1Timer,
          nextTimer: p2Timer,
          updateTimer: updateP1Timer,
          nextPlayer: Players.p2,
        })}
        disabled={gameState === GameStates.Menu || turnState === Players.p2}
      >
        SWITCH
      </button>
      <Timer timeLeft={p1TimeLeft} />
    </div>
  );

  const SecondTimer = (
    <div key="p2" className="flex flex-col-reverse">
      <h2 className="hidden sm:inline text-xl">Player 2</h2>
      <button
        className="btn-cyan disabled:btn-disabled w-56 h-11 font-semibold mx-auto mt-4 block"
        onClick={switchTurn({
          currentTimer: p2Timer,
          nextTimer: p1Timer,
          updateTimer: updateP2Timer,
          nextPlayer: Players.p1,
        })}
        disabled={gameState === GameStates.Menu || turnState === Players.p1}
      >
        SWITCH
      </button>
      <Timer timeLeft={p2TimeLeft} />
    </div>
  );

  const Timers = [FirstTimer, SecondTimer];

  return (
    <div>
      <Head>
        <title>Chess Clock</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {gameState === GameStates.Menu ? (
          <div className="container mx-auto px-8 py-8">
            <h1 className="text-4xl text-gray-600 text-center my-10">CHESS TIMER</h1>
            <div className="pb-8">
              <h2 className="text-2xl font-regular text-gray-600 text-center">
                Selected Game Mode:
              </h2>
              <h2 className="text-center text-lg font-bold">{gameType}</h2>
            </div>
            <ActionButton onClick={toggleTimer}>START GAME</ActionButton>
            <h3 className="text-center my-4 text-lg">
              {sidesSwitched ? 'P1 - Black' : 'P1 - White'}
            </h3>
            <button className="btn-gray mx-auto block" onClick={switchSides}>
              Switch Sides
            </button>
            <h3 className="text-center my-4 text-lg">
              {sidesSwitched ? 'P2 - White' : 'P2 - Black'}
            </h3>
            <Options config={timerConfig} increment={increment}>
              <h2 className="text-2xl font-normal mb-4">Game Options</h2>
              <div className="container h-px bg-gray-200 mb-6"></div>
              <div className="grid grid-cols-2 gap-6">
                <OptionButton
                  selected={gameType === '30 sec'}
                  onClick={handleOptionClick(30, '30 sec')}
                >
                  30 sec
                </OptionButton>
                <OptionButton
                  selected={gameType === '1 min'}
                  onClick={handleOptionClick(60, '1 min')}
                >
                  1 min
                </OptionButton>
                <OptionButton
                  selected={gameType === '1 | 1'}
                  onClick={handleOptionClick(60, '1 | 1', 1)}
                >
                  1 | 1
                </OptionButton>
                <OptionButton
                  selected={gameType === '2 | 1'}
                  onClick={handleOptionClick(60 * 2, '2 | 1', 1)}
                >
                  2 | 1
                </OptionButton>
                <OptionButton
                  selected={gameType === '3 min'}
                  onClick={handleOptionClick(60 * 3, '3 min')}
                >
                  3 min
                </OptionButton>
                <OptionButton
                  selected={gameType === '3 | 2'}
                  onClick={handleOptionClick(60 * 3, '3 | 2', 2)}
                >
                  3 | 2
                </OptionButton>
                <OptionButton
                  selected={gameType === '5 min'}
                  onClick={handleOptionClick(60 * 5, '5 min')}
                >
                  5 min
                </OptionButton>
                <OptionButton
                  selected={gameType === '5 | 5'}
                  onClick={handleOptionClick(60 * 5, '5 | 5', 5)}
                >
                  5 | 5
                </OptionButton>
                <OptionButton
                  selected={gameType === '10 min'}
                  onClick={handleOptionClick(60 * 10, '10 min')}
                >
                  10 min
                </OptionButton>
                <OptionButton
                  selected={gameType === '15 | 10'}
                  onClick={handleOptionClick(60 * 15, '15 | 10', 10)}
                >
                  15 | 10
                </OptionButton>
                <OptionButton
                  selected={gameType === '30 min'}
                  onClick={handleOptionClick(60 * 30, '30 min')}
                >
                  30 min
                </OptionButton>
                <OptionButton
                  selected={gameType === '60 min'}
                  onClick={handleOptionClick(60 * 60, '60 min')}
                >
                  60 min
                </OptionButton>
              </div>
            </Options>
          </div>
        ) : (
          <div className="container flex items-center justify-center h-screen mx-auto">
            <div className="h-auto sm:h-96 flex flex-col justify-center py-10 sm:py-0">
              <div className="h-full border border-blue-500 flex flex-col justify-between">
                {Timers[0]}
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
                {Timers[1]}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
