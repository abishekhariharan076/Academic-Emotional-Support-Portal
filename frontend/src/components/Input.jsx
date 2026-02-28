import React from 'react';

const Input = React.forwardRef(({
    label,
    error,
    className = '',
    id,
    type = 'text',
    ...props
}, ref) => {
    const inputId = id || props.name;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-text-main mb-1.5"
                >
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={inputId}
                type={type}
                className={`
          block w-full px-3 py-2 rounded-lg border 
          text-text-body placeholder-text-muted
          focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200
          ${error
                        ? 'border-status-error focus:border-status-error focus:ring-status-error/20'
                        : 'border-gray-300 focus:border-primary focus:ring-primary/20'
                    }
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-status-error">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
