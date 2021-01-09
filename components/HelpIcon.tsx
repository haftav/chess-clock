import * as React from 'react';
interface HelpIconProps {
  handleClick: () => void;
}

const HelpIcon = React.forwardRef(
  ({handleClick}: HelpIconProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    return (
      <button
        ref={ref}
        onClick={handleClick}
        className="w-8 h-8 z-10 flex justify-center items-center absolute top-2 right-2 md:top-8 md:right-8"
      >
        <svg
          className="stroke-current text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    );
  }
);

HelpIcon.displayName = 'HelpIcon';

export default HelpIcon;
