import {TimeCounter} from 'easytimer.js';

interface TimerProps {
  timeLeft: TimeCounter;
}

const Timer = ({timeLeft}: TimerProps) => {
  const {minutes, seconds, secondTenths: rawSecondTenths} = timeLeft;

  const secondTenths = minutes < 1 ? ` : ${rawSecondTenths}` : '';

  const formattedTime = `${minutes} : ${seconds}${secondTenths}`;

  return (
    <div className="h-full flex justify-center items-center border border-red-500">
      <h1>{formattedTime}</h1>
    </div>
  );
};

export default Timer;
