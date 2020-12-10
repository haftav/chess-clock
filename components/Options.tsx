import * as React from 'react';

interface OptionsProps {
  children: React.ReactNode;
}

const Options = ({children}: OptionsProps) => {
  return (
    <>
      <h2 className="text-2xl font-normal mb-4">Game Options</h2>
      <div className="container h-px bg-gray-200 mb-6"></div>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">{children}</div>
    </>
  );
};

export default Options;
