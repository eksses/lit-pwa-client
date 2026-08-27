import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onClose,
}) => {
  const { uiLang } = useLanguageStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pt-safe pb-safe px-safe animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-theme-card text-theme-main border border-theme-main rounded-3xl shadow-2xl overflow-hidden p-6 space-y-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold font-bnUI">
            {title || (uiLang === 'bn' ? 'নিশ্চিতকরণ' : 'Confirmation')}
          </h3>
          <p className="text-xs opacity-75 font-bnUI leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl border border-theme-main text-xs font-semibold font-bnUI opacity-70 hover:opacity-100 transition-opacity"
          >
            {cancelText || (uiLang === 'bn' ? 'বাতিল' : 'Cancel')}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-2xl bg-rose-500 text-white text-xs font-semibold font-bnUI hover:bg-rose-600 shadow-md transition-colors flex items-center justify-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmText || (uiLang === 'bn' ? 'মুছে ফেলুন' : 'Delete')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
