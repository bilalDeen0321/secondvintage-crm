/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const getRoleColor = (role: string) => {
    switch (role) {
        case "admin":
            return "bg-purple-100 text-purple-800";
        case "manager":
            return "bg-blue-100 text-blue-800";
        case "viewer":
            return "bg-gray-100 text-gray-800";
        case "agent":
            return "bg-green-100 text-green-800";
        case "seller":
            return "bg-orange-100 text-orange-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case "active":
            return "bg-green-100 text-green-800";
        case "inactive":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

/**
 * Generate a unique SKU based on brand, model, and existing SKUs
 */
export function generateSKU(brand: string, model: string, existingSKUs = []) {
    if (!brand || !model) return "";

    // BrandCode: first 3 letters
    const brandCode = brand.slice(0, 3).toUpperCase();

    // ModelCode: first letter of up to 3 words (excluding numbers), padded if needed
    const modelCode = model
        .split(" ")
        .filter((w) => isNaN(w as unknown as number))
        .slice(0, 3)
        .map((w) => w[0]?.toUpperCase() || "X")
        .join("")
        .padEnd(3, "X");

    const base = `${brandCode}-${modelCode}`;

    // Serial: start from 0001 and find next available
    let serial = 1;
    let sku = `${base}-${serial.toString().padStart(4, "0")}`;

    while (existingSKUs.includes(sku)) {
        serial++;
        sku = `${base}-${serial.toString().padStart(4, "0")}`;
    }

    return sku;
}
/**
 * Generate a server SKU based on brand, model, and existing SKUs
 */
export async function generateServerSKU(brand_name: string, watch_name: string) {
    if (!brand_name || !watch_name) return "";
    return (await axios.get(route('api.watches.sku-generate', {
        watch_name: watch_name,
        brand_name: brand_name,
    }))).data?.sku;
}


export function debounce<F extends (...args: any[]) => void>(func: F, wait: number = 300) {
    let timeoutId: ReturnType<typeof setTimeout> | null;

    return function (this: any, ...args: Parameters<F>) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}


/**
 * Sleeping while
 */
export function sleepWhile(ms: number) {
    const start = Date.now();
    while (Date.now() - start < ms) {
        // busy-wait, blocking execution
    }
}

/**
 * Sleep 
 */
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * Returns a unique array.
 * Optionally filters out falsy values before deduplication.
 */
export function uniqueArray<T>(arr: readonly T[], removeFalsy = false): T[] {
    return arr.unique(removeFalsy);
}

// Utility function to clean empty parameters

export const cleanQueryParams = (params: Record<string, any>) => {
    const cleaned = {};
    Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== null && value !== undefined && value !== '' &&
            !(Array.isArray(value) && value.length === 0)) {
            cleaned[key] = value;
        }
    });
    return cleaned;
};




/**
 * Makes properties of an object read-only.
 *
 * @param o The object on which to define or modify properties.
 * @param p A single property key or an array of property keys to make read-only.
 * @returns The object with the specified properties made read-only.
 * @throws {TypeError} If `o` is not an object or `null`.
 */
export function readonly<T extends object>(o: T, p: PropertyKey | PropertyKey[]): T {
    //
    const keysToProcess = Array.isArray(p) ? p : [p];

    for (const key of keysToProcess) {
        // Only apply if the property actually exists on the object
        // This prevents creating new, non-writable properties accidentally
        if (Object.prototype.hasOwnProperty.call(o, key)) {
            //
            Object.defineProperty(o, key, {
                writable: false,
                configurable: false,
                enumerable: true,
                value: o[key as keyof T], // Type assertion for safety
            });
        }
    }

    return o; // Return the modified object for chaining or direct use
}


/**
 * base64 to file
 */
export const base64ToFile = (base64: string, filename: string) => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
};



/**
 * Removes given keys from an object and returns a new object.
 *
 * @param obj - The source object
 * @param keys - Array of keys to remove
 * @returns A new object without the specified keys
 */
export function sliceObject<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const clone = { ...obj };
    for (const key of keys) {
        delete clone[key];
    }
    return clone;
}
