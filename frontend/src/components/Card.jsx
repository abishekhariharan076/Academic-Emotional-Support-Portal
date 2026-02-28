import React from 'react';

const Card = ({ children, className = '', ...props }) => {
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
