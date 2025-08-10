import { useEffect, useState } from "react";

/**
 * Debounce hook
 * @param value - The value to debounce (e.g., search term)
 * @param delay - Delay in milliseconds (default 500ms)
 * @returns debouncedValue - The debounced value
 */
function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup timeout if value or delay changes or component unmounts
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
