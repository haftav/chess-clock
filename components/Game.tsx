interface GameProps {
  children: React.ReactNode;
}

const Game = ({children}: GameProps) => {
  return (
    <div className="container flex items-center se:items-start justify-center h-screen se:h-auto mx-auto">
      <div className="h-auto se:h-auto flex flex-col justify-center py-10 se:py-0">
        <div className="h-full border border-blue-500 flex flex-col justify-between">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Game;
