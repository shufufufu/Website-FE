import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-900/90 to-emerald-900/90',
          border: 'border-green-500/50',
          icon: '✓',
          iconBg: 'bg-green-500',
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-900/90 to-rose-900/90',
          border: 'border-red-500/50',
          icon: '✕',
          iconBg: 'bg-red-500',
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-900/90 to-orange-900/90',
          border: 'border-yellow-500/50',
          icon: '!',
          iconBg: 'bg-yellow-500',
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-900/90 to-indigo-900/90',
          border: 'border-blue-500/50',
          icon: 'i',
          iconBg: 'bg-blue-500',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`${styles.bg} ${styles.border} border backdrop-blur-xl rounded-lg px-6 py-4 shadow-2xl max-w-md w-full`}
    >
      <div className="flex items-center gap-3">
        <div className={`${styles.iconBg} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[14px] flex-shrink-0`}>
          {styles.icon}
        </div>
        <p className="text-white text-[15px] font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors text-[20px] leading-none flex-shrink-0"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
};

export default Toast;
