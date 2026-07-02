import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  accentBorder?: boolean;
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  accentBorder = false
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]'
  };
  return createPortal(
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50"
          onClick={onClose} />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto">
            <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`bg-surface rounded-lg shadow-xl w-full max-w-[95vw] ${sizeClasses[size]} my-2 md:my-8 max-h-[95vh] md:max-h-[90vh] flex flex-col ${accentBorder ? 'border-t-4 border-accent' : ''}`}
            onClick={(e) => e.stopPropagation()}>

              <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-border flex-shrink-0">
                <h2 className="text-lg md:text-xl font-serif font-bold text-text">
                  {title}
                </h2>
                <button
                onClick={onClose}
                className="text-text-muted hover:text-text transition-colors"
                aria-label="Cerrar">
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 md:p-6 overflow-y-auto flex-1">{children}</div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>,
    document.body
  );
}