import ActionButton from '../components/ActionButton';

interface MenuProps {
  children: React.ReactNode;
  gameType: string; // can probably type this as a union
  toggleTimer: () => void;
  switchSides: () => void;
  sidesSwitched: boolean;
}

const Menu = ({children, gameType, toggleTimer, switchSides, sidesSwitched}: MenuProps) => {
  return (
    <div className="container mx-auto px-8 py-8 relative">
      <h1 className="text-4xl text-gray-600 text-center my-10">CHESS TIMER</h1>
      <div className="pb-8">
        <h2 className="text-2xl font-regular text-gray-600 text-center">Selected Game Mode:</h2>
        <h2 className="text-center text-lg font-bold">{gameType}</h2>
      </div>
      <ActionButton onClick={toggleTimer}>START GAME</ActionButton>
      <div className="flex justify-center items-center w-96 max-w-full m-auto">
        <h3 className="text-center my-4 text-lg">{sidesSwitched ? 'P1 - Black' : 'P1 - White'}</h3>
        <button className="btn-gray mx-auto block" onClick={switchSides}>
          Switch Sides
        </button>
        <h3 className="text-center my-4 text-lg">{sidesSwitched ? 'P2 - White' : 'P2 - Black'}</h3>
      </div>
      {children}
    </div>
  );
};

export default Menu;
