import React, { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'primary' | 'secondary';

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
        info: 'bg-status-info/10 text-status-info border-status-info/20',
        neutral: 'bg-text-main/8 text-text-main border-text-main/10',
        primary: 'bg-primary/10 text-primary border-primary/20',
        secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
