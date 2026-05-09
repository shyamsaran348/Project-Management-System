import React from 'react';

export default function Button({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    isLoading = false,
    disabled = false,
    ...props 
}) {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed cursor-pointer";
    
    const variants = {
        primary: "bg-[var(--ink)] text-white hover:bg-[var(--ink2)] shadow-sm hover:shadow-md",
        secondary: "bg-[var(--surface2)] text-[var(--ink)] hover:bg-[var(--sand)] border border-[rgba(180,168,130,0.2)]",
        outline: "bg-transparent border-[1.5px] border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-white",
        accent: "bg-[var(--accent)] text-white hover:bg-[var(--accent2)] shadow-sm hover:shadow-md",
        ghost: "bg-transparent text-[var(--text-mid)] hover:bg-[var(--surface2)] hover:text-[var(--ink)]",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
    };

    const sizes = {
        xs: "px-2.5 py-1.5 text-[0.7rem] rounded-[6px]",
        sm: "px-4 py-2 text-[0.75rem] rounded-[8px]",
        md: "px-6 py-2.5 text-[0.875rem] rounded-[10px]",
        lg: "px-8 py-3.5 text-[1rem] rounded-[12px]"
    };

    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
}
