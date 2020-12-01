interface GameProps {
  children: React.ReactNode;
}

const Game = ({children}: GameProps) => {
  return (
    <div className="container flex items-center se:items-start justify-center h-screen py-5 mx-auto se:px-10">
      <div className="h-full flex flex-col justify-between se:flex-row">{children}</div>
    </div>
  );
};

export default Game;
