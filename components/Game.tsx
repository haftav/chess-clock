interface GameProps {
  children: React.ReactNode;
}

const Game = ({children}: GameProps) => {
  return (
    <div className="container mx-auto flex items-center justify-center h-screen py-10 px-5 landscape:py-3 landscape:px-3 se:px-5 se:py-24 lg:px-10 xl:py-28 xl:px-40">
      <div className="h-full w-full flex flex-col justify-between se:flex-row xl:max-h-fullg">{children}</div>
    </div>
  );
};

export default Game;
