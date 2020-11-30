interface ActionButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ActionButton = ({children, ...rest}: ActionButtonProps) => {
  return (
    <button
      className="text-xl block mx-auto bg-gradient-to-r from-red-500 to-red-300 w-52 px-6 py-3 rounded-md text-white font-semibold mb-10"
      {...rest}
    >
      {children}
    </button>
  );
};

export default ActionButton;
