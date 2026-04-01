import React, { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-surface/95 rounded-[28px] border border-white/70 shadow-soft p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
