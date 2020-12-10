import EasyTimer, {TimeCounter, TimerParams, TimerValues} from 'easytimer.js';

import ProgressRing from './ProgressRing';

interface TimerProps {
  timeLeft: TimeCounter;
  timerConfig: TimerParams;
  timer: EasyTimer;
}

function formatMinutes(rawMinutes: number): string {
  return rawMinutes < 1 ? '00' : rawMinutes.toString();
}

function formatSeconds(rawSeconds: number): string {
  return rawSeconds < 10 ? `0${rawSeconds}` : rawSeconds.toString();
}

const Timer = ({timeLeft, timerConfig = {}, timer}: TimerProps) => {
  const {minutes, seconds, secondTenths: rawSecondTenths} = timeLeft;

  const formattedMinutes = formatMinutes(minutes);
  const formattedSeconds = formatSeconds(seconds);
  const formattedSecondTenths = formatSeconds(rawSecondTenths);

  const formattedTime = (
    <>
      <span className={`inline-block ${minutes < 1 ? 'w-9' : minutes < 10 ? 'w-3' : 'w-9'}`}>
        {formattedMinutes}
      </span>
      <span className="mx-1">:</span>
      <span className="inline-block w-9">{formattedSeconds}</span>
      {minutes < 1 ? (
        <>
          <span className="mx-1">:</span>
          <span className="inline-block w-9">{formattedSecondTenths}</span>
        </>
      ) : (
        ''
      )}
    </>
  );
  const startValues = timerConfig?.startValues || {};
  const initialSeconds: number = (startValues as TimerValues).seconds || 0;
  const rawSeconds = timer.getTotalTimeValues().seconds + timer.getTimeValues().secondTenths / 10;

  const percentProgress = (rawSeconds / initialSeconds) * 100;

  return (
    <div className="relative h-full flex justify-center items-center se:h-auto se:w-full se:max-w-xs">
      <div className={`flex justify-center`}>
        <h1 className="text-3xl text-right">{formattedTime}</h1>
        {/* <h1 className="block text-3xl se:text-xl lg:text-3xl font-medium text-gray-600">
          {formattedTime}
        </h1> */}
      </div>
      <div className="absolute inset-0 flex justify-center w-full h-full py-5 se:px-3 md:px-8 lg:px-12">
        <ProgressRing percent={percentProgress} />
      </div>
    </div>
  );
};

export default Timer;
