import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Share2, X } from 'lucide-react';

interface ToastProps {
  show: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
  icon?: React.ReactNode;
  onClose: () => void;
}

function Toast({ show, type, message, icon, onClose }: ToastProps) {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getDefaultIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5" />;
      case 'error':
        return <X className="h-5 w-5" />;
      default:
        return <Share2 className="h-5 w-5" />;
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className={`fixed top-4 left-1/2 z-50 ${getToastStyles()} px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3`}
        >
          {icon || getDefaultIcon()}
          <span className="font-medium">{message}</span>
          <button 
            onClick={onClose}
            className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Toast;
