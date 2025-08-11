import { useEffect, useRef } from "react";

type KeyList = string | string[];

/**
 * useKeyboard
 * @param keys - key or keys to listen for
 * @param callback - function to run when one of the keys is pressed
 * @returns element ref to attach to the element you want to listen on
 */
export default function useKeyboard<T extends HTMLElement>(
    keys: KeyList,
    callback: (event: KeyboardEvent) => void
) {
    const elementRef = useRef<T>(null);

    useEffect(() => {
        const keyArray = Array.isArray(keys) ? keys : [keys];

        const handleKeyDown = (event: KeyboardEvent) => {
            if (keyArray.includes(event.key)) {
                callback(event);
            }
        };

        const el = elementRef.current;
        if (el) {
            el.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            if (el) {
                el.removeEventListener("keydown", handleKeyDown);
            }
        };
    }, [keys, callback]);

    return elementRef;
}
