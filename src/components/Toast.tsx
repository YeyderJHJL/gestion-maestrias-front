import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  XIcon } from
'lucide-react';
type ToastVariant = 'success' | 'error' | 'warning' | 'info';
interface ToastProps {
  variant: ToastVariant;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}
export function Toast({
  variant,
  message,
  isVisible,
  onClose,
  duration = 4000
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return {
          borderColor: 'border-success',
          Icon: CheckCircleIcon,
          iconColor: 'text-success'
        };
      case 'error':
        return {
          borderColor: 'border-accent',
          Icon: XCircleIcon,
          iconColor: 'text-accent'
        };
      case 'warning':
        return {
          borderColor: 'border-warning',
          Icon: AlertTriangleIcon,
          iconColor: 'text-warning'
        };
      case 'info':
        return {
          borderColor: 'border-primary',
          Icon: InfoIcon,
          iconColor: 'text-primary'
        };
    }
  };
  const { borderColor, Icon, iconColor } = getStyles();
  return (
    <AnimatePresence>
      {isVisible &&
      <motion.div
        initial={{
          opacity: 0,
          x: 100
        }}
        animate={{
          opacity: 1,
          x: 0
        }}
        exit={{
          opacity: 0,
          x: 100
        }}
        className={`fixed bottom-6 right-6 bg-surface shadow-lg rounded-lg border-l-4 ${borderColor} p-4 flex items-start gap-3 max-w-md z-50`}>
        
          <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
          <p className="text-sm text-text flex-1">{message}</p>
          <button
          onClick={onClose}
          className="text-text-muted hover:text-text transition-colors"
          aria-label="Cerrar">
          
            <XIcon className="w-4 h-4" />
          </button>
        </motion.div>
      }
    </AnimatePresence>);

}