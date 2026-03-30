import React, { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
    const variantStyles: Record<BadgeVariant, string> = {
        success: 'bg-status-success/10 text-status-success border-status-success/20',
        warning: 'bg-status-warning/10 text-status-warning border-status-warning/20',
        error: 'bg-status-error/10 text-status-error border-status-error/20',
        info: 'bg-primary/10 text-primary border-primary/20',
        neutral: 'bg-gray-100 text-gray-600 border-gray-200',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
