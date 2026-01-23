'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const toastStyles = {
  success: 'bg-sbb-success',
  error: 'bg-sbb-red',
  info: 'bg-sbb-blue',
};

const toastIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`toast animate-slide-up ${toastStyles[type]}`}
      role="alert"
      aria-live="polite"
    >
      <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
        {toastIcons[type]}
      </span>
      <p className="flex-1 text-sbb-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
        aria-label="Schliessen"
      >
        ✕
      </button>
    </div>
  );
}
