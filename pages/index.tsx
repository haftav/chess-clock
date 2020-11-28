import Head from 'next/head';
import * as React from 'react';
import EasyTimer, {TimerParams} from 'easytimer.js';

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

enum Players {
  p1,
  p2,
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

  const [p1Timer, p1TimeLeft, updateP1Timer] = useTimer(timerConfig);
  const [p2Timer, p2TimeLeft, updateP2Timer] = useTimer(timerConfig);

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

  const switchTurn = () => {
    const currentTimer = turnState === Players.p1 ? p1Timer : p2Timer;
    const updateTimer = turnState === Players.p1 ? updateP1Timer : updateP2Timer;
    const nextTimer = turnState === Players.p1 ? p2Timer : p1Timer;

    // pause current player's timer (and add increment if necessary)
    currentTimer.pause();
    // start next player's timer
    nextTimer.start();

    setTurnState((prevTurn) => (prevTurn === Players.p1 ? Players.p2 : Players.p1));

    if (increment) {
      const newValues = getIncrementedTime(currentTimer.getTimeValues(), increment);
      updateTimer(newValues);
    }

    if (gameState !== GameStates.Playing) {
      setGameState(GameStates.Playing);
    }
  };

  const toggleTimer = () => {
    if (currentTimer.isRunning()) {
      currentTimer.pause();
      setGameState(GameStates.Paused);
    } else {
      currentTimer.start();
      setGameState(GameStates.Playing);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Chess Clock</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Config</h1>
        {JSON.stringify(timerConfig, null, 2)}
        <h1>Increment</h1>
        {increment}
        {gameState === GameStates.Menu ? (
          <Options>
            <h1>Game Modes</h1>
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
          </Options>
        ) : (
          <button>New Options</button>
        )}
        <div className={styles.content}>
          <div>
            <Timer timeLeft={p1TimeLeft} />
            <button onClick={switchTurn} disabled={turnState === Players.p2}>
              Switch
            </button>
          </div>
          <div>
            <Timer timeLeft={p2TimeLeft} />
            <button onClick={switchTurn} disabled={turnState === Players.p1}>
              Switch
            </button>
          </div>
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
