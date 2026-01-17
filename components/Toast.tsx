import React, { useEffect, useState } from 'react';
import { Flame, X } from 'lucide-react';

export interface ToastData {
    id: string;
    message: string;
    type: 'streak' | 'achievement' | 'info';
    duration?: number;
}

interface ToastProps {
    toast: ToastData;
    onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Animate in
        requestAnimationFrame(() => setIsVisible(true));

        // Auto dismiss
        const duration = toast.duration || 4000;
        const timer = setTimeout(() => {
            setIsLeaving(true);
            setTimeout(() => onDismiss(toast.id), 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [toast, onDismiss]);

    const getStyles = () => {
        switch (toast.type) {
            case 'streak':
                return {
                    bg: 'bg-gradient-to-r from-orange-500 to-amber-500',
                    icon: <Flame className="w-5 h-5 text-white fill-white" />,
                    glow: 'shadow-lg shadow-orange-500/30',
                };
            case 'achievement':
                return {
                    bg: 'bg-gradient-to-r from-purple-500 to-indigo-500',
                    icon: <span className="text-lg">🏆</span>,
                    glow: 'shadow-lg shadow-purple-500/30',
                };
            default:
                return {
                    bg: 'bg-gradient-to-r from-slate-700 to-slate-800',
                    icon: null,
                    glow: 'shadow-lg',
                };
        }
    };

    const styles = getStyles();

    return (
        <div
            className={`
                ${styles.bg} ${styles.glow}
                text-white px-5 py-3 rounded-xl font-bold
                flex items-center gap-3
                transform transition-all duration-300
                ${isVisible && !isLeaving ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
        >
            {styles.icon}
            <span className="font-khmer">{toast.message}</span>
            <button
                onClick={() => {
                    setIsLeaving(true);
                    setTimeout(() => onDismiss(toast.id), 300);
                }}
                className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

interface ToastContainerProps {
    toasts: ToastData[];
    onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[150] flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    );
};

// Hook for managing toasts
export const useToast = () => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = (message: string, type: ToastData['type'] = 'info', duration?: number) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
    };

    const dismissToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return { toasts, addToast, dismissToast };
};
