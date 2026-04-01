import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
}

// Combine motion props and base button props
const MotionButton = motion.button;

const Button: React.FC<ButtonProps & HTMLMotionProps<"button">> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed rounded-full';

    const variants: Record<ButtonVariant, string> = {
        primary: 'bg-primary text-white shadow-lg shadow-primary/15 hover:-translate-y-0.5 hover:bg-primary-hover focus:ring-primary',
        secondary: 'bg-secondary text-white shadow-lg shadow-secondary/20 hover:-translate-y-0.5 hover:bg-secondary-hover focus:ring-secondary',
        ghost: 'text-text-body hover:bg-white/80 hover:text-text-main focus:ring-primary/30',
        danger: 'bg-status-error text-white hover:bg-red-600 focus:ring-red-500',
        outline: 'border border-primary/20 bg-white/70 text-primary hover:bg-primary-light focus:ring-primary',
    };

    const sizes: Record<ButtonSize, string> = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <MotionButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </MotionButton>
    );
};

export default Button;
