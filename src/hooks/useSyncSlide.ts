'use client';

import { useEffect, useState, useCallback } from 'react';

export function useSyncSlide(initialSlide = 0) {
    const [currentSlide, setCurrentSlide] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('present_current_slide');
            if (stored !== null) {
                return parseInt(stored, 10) || 0;
            }
        }
        return initialSlide;
    });

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'present_current_slide') {
                const newSlide = parseInt(e.newValue || '0', 10);
                if (!isNaN(newSlide)) {
                    setCurrentSlide(newSlide);
                }
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const setSlide = useCallback((index: number | ((prev: number) => number)) => {
        setCurrentSlide((prev) => {
            const newIndex = typeof index === 'function' ? index(prev) : index;
            if (typeof window !== 'undefined') {
                localStorage.setItem('present_current_slide', newIndex.toString());
            }
            return newIndex;
        });
    }, []);

    return [currentSlide, setSlide] as const;
}
