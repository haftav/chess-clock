interface GameProps {
  children: React.ReactNode;
}

const Game = ({children}: GameProps) => {
  return (
    <div className="container flex items-center se:items-start justify-center h-screen py-10 mx-auto">
      <div className="h-full border border-blue-500 flex flex-col justify-between">{children}</div>
    </div>
  );
};

export default Game;
