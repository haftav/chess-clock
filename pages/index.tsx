import Head from 'next/head';
import * as React from 'react';
import EasyTimer, {TimerParams, TimeCounter} from 'easytimer.js';

import TimerContainer from '../components/TimerContainer';
import Timer from '../components/Timer';
import Options from '../components/Options';
import Menu from '../components/Menu';
import Game from '../components/Game';
import GameControl from '../components/GameControl';
import useTimer from '../hooks/useTimer';
import {getIncrementedTime} from '../utils';
import {GameStates, Players, SwitchTurnParams} from '../models';

enum KeyCodes {
  RIGHT_SHIFT = 'ShiftRight',
  LEFT_SHIFT = 'ShiftLeft',
  SPACE = 'Space',
}

function isNumber(num: number | undefined): num is number {
  return typeof num === 'number';
}

interface OptionButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  children: React.ReactNode;
}

const OptionButton = ({selected, children, ...rest}: OptionButtonProps) => {
  let classes = 'w-auto max-w-xs h-12 rounded-md text-white font-bold bg-gradient-to-r';

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
  const [winner, setWinner] = React.useState<Players | null>();

  const onEnd = React.useCallback((winningPlayer: Players) => {
    setWinner(winningPlayer);
    setGameState(GameStates.Ended);
  }, []);

  const onPlayerOneTimerEnd = React.useCallback(() => onEnd(Players.p2), [onEnd]);
  const onPlayerTwoTimerEnd = React.useCallback(() => onEnd(Players.p1), [onEnd]);

  const [p1Timer, p1TimeLeft, updateP1Timer] = useTimer(timerConfig, onPlayerOneTimerEnd);
  const [p2Timer, p2TimeLeft, updateP2Timer] = useTimer(timerConfig, onPlayerTwoTimerEnd);

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

  // I don't need to use a closure here, but I prefer this syntax vs. creating arrow functions in the JSX
  const switchTurn = React.useCallback(
    ({currentTimer, nextTimer, updateTimer, nextPlayer}: SwitchTurnParams) => () => {
      // pause current player's timer (and add increment if necessary)
      currentTimer.pause();
      // start next player's timer
      nextTimer.start();

      setTurnState(nextPlayer);

      if (increment) {
        const newValues = getIncrementedTime(currentTimer.getTimeValues(), increment);
        const newConfig = {...timerConfig, startValues: newValues};
        updateTimer(new EasyTimer(newConfig));
      }

      if (gameState !== GameStates.Playing) {
        setGameState(GameStates.Playing);
      }
    },
    [increment, gameState, timerConfig]
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
    currentTimer.stop();

    updateP1Timer(new EasyTimer(timerConfig));
    updateP2Timer(new EasyTimer(timerConfig));

    setTurnState(sidesSwitched ? Players.p2 : Players.p1);

    setWinner(null);
    setGameState(GameStates.Menu);
  };

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

  const resetTimers = () => {
    updateP1Timer(new EasyTimer(timerConfig));
    updateP2Timer(new EasyTimer(timerConfig));

    setTurnState(sidesSwitched ? Players.p2 : Players.p1);
    setWinner(null);
    setGameState(GameStates.Paused);
  };

  return (
    <div>
      <Head>
        <title>Chess Clock</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-h-full">
        {gameState === GameStates.Menu ? (
          <Menu
            gameType={gameType}
            toggleTimer={toggleTimer}
            switchSides={switchSides}
            sidesSwitched={sidesSwitched}
          >
            <Options>
              <OptionButton selected={gameType === '5 sec'} onClick={handleOptionClick(5, '5 sec')}>
                5 sec
              </OptionButton>
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
            </Options>
          </Menu>
        ) : (
          <Game>
            <TimerContainer
              currentTimer={p1Timer}
              nextTimer={p2Timer}
              nextPlayer={Players.p2}
              switchTurn={switchTurn}
              updateTimer={updateP1Timer}
              gameState={gameState}
              turnState={turnState}
              color={sidesSwitched ? 'black' : 'white'}
              isWinningPlayer={winner === Players.p1}
            >
              <Timer timeLeft={p1TimeLeft} timer={p1Timer} timerConfig={timerConfig} />
            </TimerContainer>
            <GameControl
              gameState={gameState}
              toggleTimer={toggleTimer}
              moveToMenuState={moveToMenuState}
              resetTimers={resetTimers}
            />
            <TimerContainer
              currentTimer={p2Timer}
              nextTimer={p1Timer}
              nextPlayer={Players.p1}
              switchTurn={switchTurn}
              updateTimer={updateP2Timer}
              gameState={gameState}
              turnState={turnState}
              color={sidesSwitched ? 'white' : 'black'}
              isWinningPlayer={winner === Players.p2}
              reverse
            >
              <Timer timeLeft={p2TimeLeft} timer={p2Timer} timerConfig={timerConfig} />
            </TimerContainer>
          </Game>
        )}
      </main>
    </div>
  );
}
