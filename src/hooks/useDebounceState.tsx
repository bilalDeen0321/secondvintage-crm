import { useCallback, useEffect, useRef, useState } from 'react';

type DebounceReturn<T> = [T, (val: T) => void, (cb?: (debouncedVal: T) => void) => T];

/**
 * useDebounce hook
 * @param initialValue - initial state value
 * @param delay - debounce delay in ms
 * @returns [immediateValue, setter, callbackRegistrar]
 *
 * immediateValue: latest immediate value
 * setter: function to update value (debounced)
 * callbackRegistrar: function to register callback or get current debounced value
 */
function useDebounceCallback<T>(initialValue: T, delay: number = 300): DebounceReturn<T> {
    const [immediateValue, setImmediateValue] = useState<T>(initialValue);
    const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const callbackRef = useRef<(val: T) => void>();

    // Keep latest callback without resetting on every render
    const setCallback = useCallback((cb?: (val: T) => void) => {
        if (cb) {
            callbackRef.current = cb;
        }
        return debouncedValue;
    }, [debouncedValue]);

    const setter = useCallback(
        (val: T) => {
            setImmediateValue(val);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setDebouncedValue(val);
                if (callbackRef.current) {
                    callbackRef.current(val);
                }
            }, delay);
        },
        [delay]
    );

    // Clear timeout on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return [immediateValue, setter, setCallback];
}

export default useDebounceCallback;
