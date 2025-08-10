import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
    // Load initial value from localStorage or fallback
    const [value, setValue] = useState<T>(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? (JSON.parse(stored) as T) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Update localStorage whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing localStorage key "${key}":`, error);
        }
    }, [key, value]);

    return [value, setValue];
}
