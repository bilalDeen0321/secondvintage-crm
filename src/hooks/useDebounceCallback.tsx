import { useEffect, useRef, useState } from 'react';

type Callback<T> = (value: T) => void;

/**
 * useDebounceCallback
 * 
 * Example:
 * const [value, setValue] = useDebounceCallback('', (val) => {
 *     console.log('Debounced:', val);
 * }, 500);
 */
function useDebounceCallback<T>(
    initialValue: T,
    cb: Callback<T>,
    delay: number = 300
) {
    const [immediateValue, setImmediateValue] = useState<T>(initialValue);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const latestCb = useRef<Callback<T>>(cb);

    // Keep latest callback in ref (avoid re-binding effect on cb changes)
    useEffect(() => {
        latestCb.current = cb;
    }, [cb]);

    // Run debounce logic internally
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            latestCb.current(immediateValue);
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [immediateValue, delay]);

    return [immediateValue, setImmediateValue] as const;
}

export default useDebounceCallback;
