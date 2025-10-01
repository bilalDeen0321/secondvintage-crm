/* eslint-disable @typescript-eslint/no-explicit-any */

import { debounce } from "@/app/utils";
import { router } from "@inertiajs/react";



// debounce utility (same as before)


// helper to remove empty keys from object
export function cleanParams(params: Record<string, any>) {
    const cleaned: Record<string, any> = {};
    for (const key in params) {
        const value = params[key];
        if (
            value !== undefined &&
            value !== null &&
            (typeof value !== 'string' || value.trim() !== '') // remove empty strings
        ) {
            cleaned[key] = value;
        }
    }
    return cleaned;
}

// Create a debounced router call once
export const debouncedNavigate = debounce((params: Record<string, any>) => {
    router.get(route("watches.index"), params, {
        preserveScroll: true,
        preserveState: true,
        replace: true,
    });
}, 300);


/**
 * Handles filtering watches by updating URL parameters and navigating.
 */
export function watchFilter(key: string, value: any, query: Record<string, any> = {}) {
    const searchParams = new URLSearchParams(window.location.search);

    // Merge params
    const params = {
        batch: searchParams.get('batch'),
        brand: searchParams.get('brand'),
        search: searchParams.get('search'),
        location: searchParams.get('location'),
        per_page: searchParams.get('per_page'),
        ...query,
        [key]: value,
    };

    // Clean params by removing empty keys
    const cleanedParams = cleanParams(params);

    debouncedNavigate(cleanedParams);
}


export const getSearchStatus = (data: string[]) => {
    return Array.from(
        new Set(
            data
                .map(String)
                .filter(s => s.toLowerCase() !== 'all')
                .filter(Boolean)
        )
    );
};

export const getSelectSearch = (value: string, lower: boolean = false) => {
    const str = lower ? value.toLowerCase() : value;
    return str.replace(/all/gi, '');
};


export const getSelectStatus = (arr: string[]) => {
    return arr.filter(s => String(s) != 'all').filter(Boolean);
};


