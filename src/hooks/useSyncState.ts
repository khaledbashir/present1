'use client';

import { useState, useEffect, useCallback } from 'react';

export function useSyncState<T>(key: string, initialValue: T) {
    const [state, setState] = useState<T>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(key);
            if (stored !== null) {
                try {
                    return JSON.parse(stored);
                } catch {
                    return stored as unknown as T;
                }
            }
        }
        return initialValue;
    });

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === key) {
                if (e.newValue === null) {
                    setState(initialValue);
                } else {
                    try {
                        setState(JSON.parse(e.newValue));
                    } catch {
                        setState(e.newValue as unknown as T);
                    }
                }
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [key, initialValue]);

    const setSyncedState = useCallback((value: T | ((prev: T) => T)) => {
        setState((prev) => {
            const newValue = typeof value === 'function' ? (value as Function)(prev) : value;
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, typeof newValue === 'string' ? newValue : JSON.stringify(newValue));
            }
            return newValue;
        });
    }, [key]);

    return [state, setSyncedState] as const;
}
