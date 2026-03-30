import React, { InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: LucideIcon;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-text-main">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    className={`
                        w-full bg-canvas border rounded-xl px-4 py-2.5 text-text-main placeholder:text-text-muted
                        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                        ${Icon ? 'pl-11' : ''}
                        ${error ? 'border-status-error' : 'border-border'}
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs font-medium text-status-error animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
