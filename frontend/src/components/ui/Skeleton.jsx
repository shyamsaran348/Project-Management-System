import React from 'react';

export default function Skeleton({ className = "", variant = "rect" }) {
    const baseClass = "skeleton bg-[var(--surface)] relative overflow-hidden";
    const variantClass = variant === "circle" ? "rounded-full" : "rounded-lg";
    
    return (
        <div className={`${baseClass} ${variantClass} ${className}`}></div>
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-[var(--cream)] rounded-[28px] border border-[rgba(180,168,130,0.2)] p-7 flex flex-col h-full shadow-sm">
            <div className="flex justify-between items-start mb-5">
                <Skeleton className="w-24 h-6 rounded-full" />
                <Skeleton className="w-16 h-4" />
            </div>
            <Skeleton className="w-3/4 h-6 mb-5" />
            <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                    <Skeleton variant="circle" className="w-8 h-8" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="w-20 h-3" />
                        <Skeleton className="w-32 h-4" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="w-12 h-5" />
                    <Skeleton className="w-12 h-5" />
                </div>
            </div>
            <div className="mt-auto">
                <Skeleton className="w-full h-10 rounded-xl" />
            </div>
        </div>
    );
}
