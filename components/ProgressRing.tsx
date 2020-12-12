const radius = 46;
const circumference = radius * 2 * Math.PI;

interface ProgressRingProps {
  percent: number;
}

const ProgressRing = ({percent = 100}: ProgressRingProps) => {
  const correctedPercent = percent > 100 ? 100 : percent;
  const offset = circumference - (correctedPercent / 100) * circumference * -1;

  const strokeColor = percent <= 25 ? ' text-red-400' : ' text-cyan-300';

  return (
    <svg
      viewBox="0 0 100 100"
      height="100%"
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden mini:block"
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        className="stroke-current z-0 text-gray-200 transform origin-center -rotate-90"
        strokeWidth="6"
        fill="transparent"
      />
      <circle
        cx="50"
        cy="50"
        r="46"
        className={`stroke-current z-10 ${strokeColor} transform origin-center -rotate-90`}
        strokeWidth="6"
        fill="transparent"
        style={{
          strokeDasharray: `${circumference} ${circumference}`,
          strokeDashoffset: `${offset}`,
          transition: '.12s stroke-dashoffset ease',
        }}
      />
    </svg>
  );
};

export default ProgressRing;
