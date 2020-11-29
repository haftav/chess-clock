import * as React from 'react';
import EasyTimer, {TimeCounter, TimerParams} from 'easytimer.js';

function useTimer(
  timerConfig: TimerParams,
  player: string,
): readonly [EasyTimer, TimeCounter, (newValues: TimeCounter) => void] {
  const [timer, setTimer] = React.useState(new EasyTimer(timerConfig));

  const [timeLeft, setTimeLeft] = React.useState(timer.getTimeValues());

  const updateTime = (newValues: TimeCounter) => {
    const newConfig = {...timerConfig, startValues: newValues};
    setTimeLeft(newValues);
    setTimer(new EasyTimer(newConfig));
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

    timer.addEventListener('secondTenthsUpdated', eventListener);

    timer.addEventListener('targetAchieved', () => {
      alert(`${player.toUpperCase()} Wins!`)
    })

    return () => {
      timer.removeEventListener('secondTenthsUpdated', eventListener);
    };
  }, [timer, player]);

  return [timer, timeLeft, updateTime] as const;
}

export default useTimer;
