/* eslint-disable @typescript-eslint/no-explicit-any */
export class Arr {

    /**
     * Get a value from an object/array using dot notation.
     */
    static get<T>(obj: Record<string, any>, key: string, defaultValue: T | null = null): T | null {
        if (!key) return obj as T;
        const keys = key.split(".");
        let result: any = obj;

        for (const k of keys) {
            if (result && typeof result === "object" && k in result) {
                result = result[k];
            } else {
                return defaultValue;
            }
        }

        return result as T;
    }

    /**
     * Check if a key exists in an object/array using dot notation.
     */
    static has(obj: Record<string, any>, key: string): boolean {
        if (!key) return false;
        const keys = key.split(".");
        let result: any = obj;

        for (const k of keys) {
            if (result && typeof result === "object" && k in result) {
                result = result[k];
            } else {
                return false;
            }
        }
        return true;
    }

    /**
     * Set a value in an object/array using dot notation.
     */
    static set(obj: Record<string, any>, key: string, value: any): Record<string, any> {
        if (!key) return obj;

        const keys = key.split(".");
        let result: any = obj;

        while (keys.length > 1) {
            const k = keys.shift()!;
            if (!(k in result) || typeof result[k] !== "object") {
                result[k] = {};
            }
            result = result[k];
        }

        result[keys[0]] = value;
        return obj;
    }

    /**
     * Get the first element of an array.
     */
    static first<T>(arr: T[], defaultValue: T | null = null): T | null {
        return arr.length > 0 ? arr[0] : defaultValue;
    }

    /**
     * Get the last element of an array.
     */
    static last<T>(arr: T[], defaultValue: T | null = null): T | null {
        return arr.length > 0 ? arr[arr.length - 1] : defaultValue;
    }

    /**
     * Pluck a list of values from an array of objects.
     */
    static pluck<T = any>(arr: Record<string, any>[], key: string): T[] {
        return arr.map(item => this.get(item, key));
    }

    /**
     * Flatten a nested array.
     */
    static flatten<T>(arr: any[]): T[] {
        return arr.reduce((flat: T[], toFlatten) => {
            return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten);
        }, []);
    }

    /**
     * Remove duplicate values.
     */
    static unique<T>(arr: T[]): T[] {
        return Array.from(new Set(arr));
    }

    /**
     * Only return specific keys from an object.
     */
    static only<T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> {
        return keys.reduce((acc, key) => {
            if (key in obj) acc[key] = obj[key];
            return acc;
        }, {} as Partial<T>);
    }

    /**
     * Exclude specific keys from an object.
     */
    static except<T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> {
        return Object.keys(obj).reduce((acc, key) => {
            if (!keys.includes(key as keyof T)) {
                acc[key as keyof T] = obj[key as keyof T];
            }
            return acc;
        }, {} as Partial<T>);
    }
}
