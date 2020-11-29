import * as React from 'react';
import EasyTimer, {TimeCounter, TimerParams} from 'easytimer.js';

interface OptionsProps {
  config: TimerParams;
  children: React.ReactNode;
  increment: number;
}

function createGameTypeDisplay(timeValues: TimeCounter, increment: number): string {
  const {minutes, seconds} = timeValues;

  if (increment) {
    return `${minutes} | ${increment}`;
  }

  return seconds < 60 ? `${seconds} sec` : `${minutes} min`;
}

const Options = ({config, increment, children}: OptionsProps) => {
  const timer = React.useMemo(() => new EasyTimer(config), [config]);


  const display = createGameTypeDisplay(timer.getTotalTimeValues(), increment);

  return (
    <div style={{marginBottom: 50}}>
      <h1>Options</h1>
      <h2>Game Type: {display}</h2>
      {children}
    </div>
  );
};

export default Options;
