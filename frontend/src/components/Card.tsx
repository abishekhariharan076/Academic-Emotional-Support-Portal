import React, { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-surface rounded-xl border border-border-light shadow-soft p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
