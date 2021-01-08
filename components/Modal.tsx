import * as React from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const Modal = ({isOpen, closeModal}: ModalProps) => {

  React.useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    console.log(e.key);
    if (e.key === 'Escape') {
      closeModal();
    }
  }
    document.addEventListener('keydown', handleKeyDown);    
    return () => document.removeEventListener('keydown', handleKeyDown); 
  }, [closeModal]);

  if (!isOpen) {
    return null;
  }


  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLDivElement).id === 'modal-bg') {
      e.stopPropagation();
      closeModal();
    }
  };
  return (
    <div
      onClick={handleClick}
      id="modal-bg"
      className="absolute inset-0 bg-opacity-50 bg-gray-500 z-40 flex justify-center items-center"
    >
      <div className="w-96 h-96 bg-white"></div>
    </div>
  );
};

export default Modal;
