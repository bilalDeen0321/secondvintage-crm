/* eslint-disable @typescript-eslint/no-explicit-any */

export function getError(error: any) {

    // Server returned a response 
    if (error?.response?.data?.message) {
        return String(error?.response?.data?.message);
    }

    if (error?.response?.message) {
        return String(error?.response?.message);
    }

    if (error?.message) {
        return String(error?.message);
    }

    if (typeof error === 'object' && Array.isArray(error)) {
        // If error is an array, join the messages
        return error.map((e) => e.message || String(e)).join(', ');
    }

    if (typeof error === 'object' && Object.keys(error).length > 0) {
        // If error is an object with properties, join the messages
        return Object.values(error)
            .map((e: any) => (typeof e === 'string' ? e : e?.message || String(e)))
            .join(', ');
    }
    if (typeof error === 'object') {
        // If error is an object, convert it to a string
        return JSON.stringify(error);
    }

    return String(error)
}