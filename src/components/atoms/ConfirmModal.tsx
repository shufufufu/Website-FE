import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmType?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  confirmType = 'danger',
  onConfirm,
  onCancel,
}) => {
  const confirmButtonStyle =
    confirmType === 'danger'
      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
      : 'bg-gradient-to-r from-[#915EFF] to-[#7c3aed] hover:opacity-90';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-tertiary rounded-2xl p-6 max-w-sm w-full border border-purple-500/20 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-white text-[20px] font-bold mb-3">{title}</h3>
        <p className="text-secondary text-[15px] leading-relaxed mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-[14px] font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-all text-[14px] font-medium ${confirmButtonStyle}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmModal;
