import * as React from 'react';
import EasyTimer, {TimeCounter, TimerParams} from 'easytimer.js';

function useTimer(
  timerConfig: TimerParams,
  player: string,
): readonly [EasyTimer, TimeCounter, (newTimer: EasyTimer) => void] {
  const [timer, setTimer] = React.useState(new EasyTimer(timerConfig));

  // keeping this in state to trigger rerender when values change
  const [timeLeft, setTimeLeft] = React.useState(timer.getTimeValues());

  const updateTimer = (newTimer: EasyTimer) => {
    setTimer(newTimer);
  };

  React.useEffect(() => {
    setTimer(new EasyTimer(timerConfig));
  }, [timerConfig]);

  React.useEffect(() => {
    setTimeLeft(timer.getTimeValues());

    const eventListener = () => {
      const newValues = {...timer.getTimeValues()};
      setTimeLeft(newValues);
    };

    const targetAchievedListener = () => {
      alert(`${player.toUpperCase()} Wins!`);
    }

    timer.addEventListener('secondTenthsUpdated', eventListener);

    timer.addEventListener('targetAchieved', targetAchievedListener)

    return () => {
      timer.removeEventListener('secondTenthsUpdated', eventListener);
      timer.removeEventListener('targetAchieved', targetAchievedListener);
    };
  }, [timer, player]);

  return [timer, timeLeft, updateTimer] as const;
}

export default useTimer;
