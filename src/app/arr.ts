/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Check if a value exists in an array (including nested arrays).
 */
export function in_array<T>(needle: T, haystack: any[], strict: boolean = false): boolean {
    for (const item of haystack) {
        if (Array.isArray(item)) {
            if (in_array(needle, item, strict)) {
                return true; // found in nested array
            }
        } else {
            if (strict ? item === needle : item == needle) {
                return true;
            }
        }
    }
    return false;
}