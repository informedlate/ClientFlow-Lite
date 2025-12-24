import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black/50" onClick={onClose} />
                <div className={`relative bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-6 ${sizeStyles[size]}`}>
                  {title && (
                      <div className="flex items-center justify-between mb-4">
                                  <h2 className="text-xl font-semibold text-white">{title}</h2>h2>
                                  <button
                                                  onClick={onClose}
                                                  className="text-slate-400 hover:text-white transition"
                                                >
                                                ✕
                                  </button>button>
                      </div>div>
                        )}
                        <div className="text-slate-300">{children}</div>div>
                </div>div>
          </div>div>
        );
};

export default Modal;</div>
