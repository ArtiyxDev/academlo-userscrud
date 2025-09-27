import { useRef, useEffect, type ReactNode, type SyntheticEvent } from "react";

interface DialogProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
}

function Dialog({ children, isOpen, onClose }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleDialogClick = (e: SyntheticEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isClickOutside =
      e.nativeEvent instanceof MouseEvent &&
      (e.nativeEvent.clientX < rect.left ||
        e.nativeEvent.clientX > rect.right ||
        e.nativeEvent.clientY < rect.top ||
        e.nativeEvent.clientY > rect.bottom);

    if (isClickOutside) {
      onClose?.();
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  // No renderizar el dialog si no debe estar abierto
  if (!isOpen) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="fixed inset-0 z-50 m-0 flex h-screen max-h-none w-screen max-w-none items-center justify-center border-0 bg-gray-900/50 p-0 backdrop-blur-[1px]"
      onClick={handleDialogClick}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </dialog>
  );
}

export default Dialog;
