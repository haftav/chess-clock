interface GameProps {
  children: React.ReactNode;
}

const Game = ({children}: GameProps) => {
  return (
    <div className="container mx-auto flex items-center justify-center h-screen py-5 px-5 se:py-8 se:px-4 lg:px-20  lg:py-24 xl:py-28 xl:px-40">
      <div className="h-full w-full flex flex-col justify-between se:flex-row">{children}</div>
    </div>
  );
};

export default Game;
