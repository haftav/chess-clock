import Head from 'next/head';
import * as React from 'react';
import EasyTimer, {TimerParams, TimeCounter} from 'easytimer.js';

import styles from '../styles/Home.module.css';
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

export enum Players {
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
  const [sidesSwitched, setSidesSwitched ] = React.useState(false);

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
  }, [switchTurn, turnState, p1Timer, p2Timer, updateP1Timer, updateP2Timer, toggleTimer, sidesSwitched]);

  const switchSides = () => setSidesSwitched(prevState => !prevState);

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
    <div className={styles.container}>
      <Head>
        <title>Chess Clock</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {gameState === GameStates.Menu ? (
          <Options config={timerConfig} increment={increment}>
            <h2>Time Modes</h2>
            <button onClick={handleOptionClick(30)}>30 sec</button>
            <button onClick={handleOptionClick(60)}>1 min</button>
            <button onClick={handleOptionClick(60, 1)}>1 | 1</button>
            <button onClick={handleOptionClick(60 * 2, 1)}>2 | 1</button>
            <button onClick={handleOptionClick(60 * 3)}>3 min</button>
            <button onClick={handleOptionClick(60 * 3, 2)}>3 | 2</button>
            <button onClick={handleOptionClick(60 * 5)}>5 min</button>
            <button onClick={handleOptionClick(60 * 5, 5)}>5 | 5</button>
            <button onClick={handleOptionClick(60 * 10)}>10 min</button>
            <button onClick={handleOptionClick(60 * 15, 10)}>15 | 10</button>
            <button onClick={handleOptionClick(60 * 30)}>30 min</button>
            <button onClick={handleOptionClick(60 * 60)}>60 min</button>
            <h2>Switch Sides</h2>
            <button onClick={switchSides}>Switch Sides</button>
          </Options>
        ) : (
          <button>New Options</button>
        )}
        <div className={styles.content}>
          {Timers}
        </div>
        <button style={{marginTop: 50}} onClick={toggleTimer}>
          {currentTimer.isRunning() ? 'Pause' : 'Play'}
        </button>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
