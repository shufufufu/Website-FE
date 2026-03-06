import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from '../components/atoms/Toast';
import ConfirmModal from '../components/atoms/ConfirmModal';

interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmType?: 'danger' | 'primary';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Array<ToastOptions & { id: number }>>([]);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions | null;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    options: null,
    resolve: null,
  });

  const showToast = useCallback((options: ToastOptions) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...options, id }]);
  }, []);

  const hideToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    confirmState.resolve?.(true);
    setConfirmState({ isOpen: false, options: null, resolve: null });
  }, [confirmState]);

  const handleCancel = useCallback(() => {
    confirmState.resolve?.(false);
    setConfirmState({ isOpen: false, options: null, resolve: null });
  }, [confirmState]);

  const ToastContainer = useCallback(
    () => (
      <>
        {/* Toast 容器 */}
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-md">
          <AnimatePresence>
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                onClose={() => hideToast(toast.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Confirm Modal */}
        <AnimatePresence>
          {confirmState.isOpen && confirmState.options && (
            <ConfirmModal
              {...confirmState.options}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          )}
        </AnimatePresence>
      </>
    ),
    [toasts, confirmState, hideToast, handleConfirm, handleCancel]
  );

  return {
    showToast,
    showConfirm,
    ToastContainer,
  };
};
