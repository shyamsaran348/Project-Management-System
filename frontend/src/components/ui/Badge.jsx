import React from 'react';

export default function Badge({ children, variant = 'default', className = '' }) {
    const baseStyles = "px-3 py-1 text-[0.68rem] font-bold uppercase tracking-widest rounded-full inline-flex items-center justify-center font-mono border transition-all";
    
    const variants = {
        default: "bg-[var(--surface2)] text-[var(--text-muted)] border-transparent",
        primary: "bg-[var(--ink)] text-white border-transparent",
        success: "bg-[var(--accent-light)] text-[var(--accent)] border-[rgba(26,107,60,0.2)]",
        warning: "bg-[var(--amber-light)] text-[var(--amber)] border-[rgba(200,128,10,0.2)]",
        info: "bg-[var(--blue-light)] text-[var(--blue)] border-[rgba(26,58,107,0.2)]",
        
        'sdg-1': "bg-[#e5243b]/10 text-[#e5243b] border-[#e5243b]/20",
        'sdg-2': "bg-[#dda63a]/10 text-[#dda63a] border-[#dda63a]/20",
        'sdg-3': "bg-[#4c9f38]/10 text-[#4c9f38] border-[#4c9f38]/20",
        'sdg-4': "bg-[#c5192d]/10 text-[#c5192d] border-[#c5192d]/20",
        'sdg-5': "bg-[#ff3a21]/10 text-[#ff3a21] border-[#ff3a21]/20",
        'sdg-6': "bg-[#26bde2]/10 text-[#26bde2] border-[#26bde2]/20",
        'sdg-7': "bg-[#fcc30b]/10 text-[#fcc30b] border-[#fcc30b]/20",
        'sdg-8': "bg-[#a21942]/10 text-[#a21942] border-[#a21942]/20",
        'sdg-9': "bg-[#fd6925]/10 text-[#fd6925] border-[#fd6925]/20",
        'sdg-10': "bg-[#dd1367]/10 text-[#dd1367] border-[#dd1367]/20",
        'sdg-11': "bg-[#fd9d24]/10 text-[#fd9d24] border-[#fd9d24]/20",
        'sdg-12': "bg-[#bf8b2e]/10 text-[#bf8b2e] border-[#bf8b2e]/20",
        'sdg-13': "bg-[#3f7e44]/10 text-[#3f7e44] border-[#3f7e44]/20",
        'sdg-14': "bg-[#0a97d9]/10 text-[#0a97d9] border-[#0a97d9]/20",
        'sdg-15': "bg-[#56c02b]/10 text-[#56c02b] border-[#56c02b]/20",
        'sdg-16': "bg-[#00689d]/10 text-[#00689d] border-[#00689d]/20",
        'sdg-17': "bg-[#19486a]/10 text-[#19486a] border-[#19486a]/20"
    };

    return (
        <span className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}>
            {children}
        </span>
    );
}
