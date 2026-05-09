import React from 'react';

export default function Card({ 
    children, 
    className = '', 
    hover = false,
    onClick = null,
    glass = false,
    ...props 
}) {
    const baseStyles = "rounded-[24px] border border-[rgba(180,168,130,0.15)] bg-white overflow-hidden transition-all duration-400 cubic-bezier(0.4, 0, 0.2, 1)";
    
    const interactiveStyles = (hover || onClick) ? "hover:shadow-[0_24px_80px_rgba(10,10,15,0.1)] hover:-translate-y-1.5 cursor-pointer" : "";
    
    const glassStyles = glass ? "bg-white/70 backdrop-blur-xl border-white/40 shadow-xl" : "shadow-sm";

    return (
        <div 
            className={`${baseStyles} ${interactiveStyles} ${glassStyles} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
}
