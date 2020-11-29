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
  children: React.ReactNode;
}

const OptionButton = ({children, ...rest}: OptionButtonProps) => {
  return (
    <button
      className="w-30 h-12 rounded-md text-white font-bold bg-gradient-to-r from-blue-500 to-blue-300"
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
  const [increment, setIncrement] = React.useState(0);
  const [sidesSwitched, setSidesSwitched] = React.useState(false);

  const [p1Timer, p1TimeLeft, updateP1Timer] = useTimer(timerConfig, 'Player 2');
  const [p2Timer, p2TimeLeft, updateP2Timer] = useTimer(timerConfig, 'Player 1');

  const currentTimer = turnState === Players.p1 ? p1Timer : p2Timer;

  const handleOptionClick = (duration: number, increment?: number) => () => {
    setTimerConfig((prevConfig) => {
      return {
        ...prevConfig,
        startValues: {
          seconds: duration,
        },
      };
    });

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

  React.useEffect(() => {
    const eventListener = (e: KeyboardEvent) => {
      const p1Key = sidesSwitched ? KeyCodes.RIGHT_SHIFT : KeyCodes.LEFT_SHIFT;
      const p2Key = sidesSwitched ? KeyCodes.LEFT_SHIFT : KeyCodes.RIGHT_SHIFT;

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

  const switchSides = () => setSidesSwitched((prevState) => !prevState);

  const P1Timer = (
    <div key="p1">
      P1 - Playing White
      <Timer timeLeft={p1TimeLeft} />
      <button
        onClick={switchTurn({
          currentTimer: p1Timer,
          nextTimer: p2Timer,
          updateTimer: updateP1Timer,
          nextPlayer: Players.p2,
        })}
        disabled={gameState === GameStates.Menu || turnState === Players.p2}
      >
        Switch
      </button>
    </div>
  );

  const P2Timer = (
    <div key="p2">
      P2 - Playing Black
      <Timer timeLeft={p2TimeLeft} />
      <button
        onClick={switchTurn({
          currentTimer: p2Timer,
          nextTimer: p1Timer,
          updateTimer: updateP2Timer,
          nextPlayer: Players.p1,
        })}
        disabled={gameState === GameStates.Menu || turnState === Players.p1}
      >
        Switch
      </button>
    </div>
  );

  let Timers = [P1Timer, P2Timer];

  if (sidesSwitched) {
    Timers = Timers.reverse();
  }

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
            <Options config={timerConfig} increment={increment}>
              <button
                onClick={toggleTimer}
                className="block mx-auto bg-gradient-to-r from-red-500 to-red-300 w-52 px-6 py-3 rounded-md text-lg text-white font-bold mb-10"
              >
                START GAME
              </button>
              <h2 className="text-2xl font-normal mb-4">Game Options</h2>
              <div className="container h-px bg-gray-200 mb-6"></div>
              <div className="grid grid-cols-2 gap-6">
                <OptionButton onClick={handleOptionClick(30)}>30 sec</OptionButton>
                <OptionButton onClick={handleOptionClick(60)}>1 min</OptionButton>
                <OptionButton onClick={handleOptionClick(60, 1)}>1 | 1</OptionButton>
                <OptionButton onClick={handleOptionClick(60 * 2, 1)}>2 | 1</OptionButton>
                <OptionButton onClick={handleOptionClick(60 * 3)}>3 min</OptionButton>
                <OptionButton onClick={handleOptionClick(60 * 3, 2)}>3 | 2</OptionButton>
                <OptionButton onClick={handleOptionClick(60 * 5)}>5 min</OptionButton>
                <OptionButton onClick={handleOptionClick(60 * 5, 5)}>5 | 5</OptionButton>
                <OptionButton onClick={handleOptionClick(60 * 10)}>10 min</OptionButton>
                <OptionButton onClick={handleOptionClick(60 * 15, 10)}>15 | 10</OptionButton>
                <OptionButton onClick={handleOptionClick(60 * 30)}>30 min</OptionButton>
                <OptionButton onClick={handleOptionClick(60 * 60)}>60 min</OptionButton>
              </div>
              <button onClick={switchSides}>Switch Sides</button>
            </Options>
          </div>
        ) : (
          <>
            <div>{Timers}</div>
            <button style={{marginTop: 50}} onClick={toggleTimer}>
              {currentTimer.isRunning() ? 'Pause' : 'Play'}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
