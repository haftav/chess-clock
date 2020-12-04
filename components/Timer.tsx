import EasyTimer, {TimeCounter, TimerParams, TimerValues} from 'easytimer.js';

import ProgressRing from './ProgressRing';

interface TimerProps {
  timeLeft: TimeCounter;
  timerConfig: TimerParams;
  timer: EasyTimer;
}

const Timer = ({timeLeft, timerConfig = {}, timer}: TimerProps) => {
  const {minutes, seconds, secondTenths: rawSecondTenths} = timeLeft;

  const secondTenths = minutes < 1 ? ` : ${rawSecondTenths}` : '';

  const formattedTime = `${minutes} : ${seconds}${secondTenths}`;

  const startValues = timerConfig?.startValues || {};
  const initialSeconds: number = (startValues as TimerValues).seconds || 0;
  const rawSeconds = timer.getTotalTimeValues().seconds + (timer.getTimeValues().secondTenths / 10);

  const percentProgress = (rawSeconds / initialSeconds) * 100;

  return (
    <div className="relative h-full flex justify-center items-center se:h-auto se:w-full se:max-w-xs">
      <h1 className="text-3xl font-medium text-gray-600">{formattedTime}</h1>
      <div className="absolute inset-0 flex justify-center w-full h-full py-5 se:px-3 md:px-8 lg:px-12">
        <ProgressRing percent={percentProgress} />
      </div>
    </div>
  );
};

export default Timer;
