import React from 'react';

export default function Input({ 
    label, 
    error, 
    className = '', 
    id,
    ...props 
}) {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-[0.7rem] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`w-full px-4 py-3 bg-[var(--surface)] border-[1.5px] border-transparent rounded-[12px] text-[0.875rem] focus:bg-white focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(26,107,60,0.08)] outline-none transition-all placeholder:text-[var(--text-muted)]/50 ${error ? 'border-red-500' : ''}`}
                {...props}
            />
            {error && <span className="text-red-600 text-[0.75rem] mt-1 block">{error}</span>}
        </div>
    );
}
