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
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg';

    const variants: Record<ButtonVariant, string> = {
        primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary',
        secondary: 'bg-secondary text-white hover:bg-secondary-hover focus:ring-secondary',
        ghost: 'text-text-body hover:bg-gray-100 hover:text-text-main focus:ring-gray-500',
        danger: 'bg-status-error text-white hover:bg-red-600 focus:ring-red-500',
        outline: 'border-2 border-primary text-primary hover:bg-primary-light focus:ring-primary',
    };

    const sizes: Record<ButtonSize, string> = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
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
