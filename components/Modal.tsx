import FocusLock from 'react-focus-lock';
import * as React from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const Modal = ({isOpen, closeModal}: ModalProps) => {
  const closeIcon = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  React.useEffect(() => {
    if (isOpen && closeIcon.current) {
      closeIcon.current.focus();
    }
  }, [isOpen]);

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
    <FocusLock returnFocus>
      <div
        onClick={handleClick}
        id="modal-bg"
        className="absolute inset-0 bg-opacity-50 bg-gray-500 z-40"
      >
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 h-auto w-96 p-10 rounded-md bg-white">
          <button className="absolute top-4 right-4" onClick={closeModal} ref={closeIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="24"
              height="24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold mb-4">Instructions</h1>
          <ul className="list-inside list-disc">
            <li>Left Shift/Right Shift switches turns.</li>
            <li>Space bar pauses and unpauses.</li>
          </ul>
          <p className="text-lg mt-4">Have fun!</p>
        </div>
      </div>
    </FocusLock>
  );
};

export default Modal;
