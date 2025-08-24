/* eslint-disable @typescript-eslint/no-explicit-any */

import { router } from "@inertiajs/react";



// debounce utility (same as before)
export function debounce<F extends (...args: any[]) => void>(func: F, wait: number = 300) {
    let timeoutId: ReturnType<typeof setTimeout> | null;
    return function (this: any, ...args: Parameters<F>) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), wait);
    };
}

// helper to remove empty keys from object
function cleanParams(params: Record<string, any>) {
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
        preserveState: true,
        replace: true,
    });
}, 300);

export function watchFilters(key: string, value: any, query: Record<string, any> = {}) {
    const searchParams = new URLSearchParams(window.location.search);

    // Merge params
    const params = {
        batch: searchParams.get('batch'),
        brand: searchParams.get('brand'),
        search: searchParams.get('search'),
        location: searchParams.get('location'),
        ...query,
        [key]: value,
    };

    // Clean params by removing empty keys
    const cleanedParams = cleanParams(params);

    debouncedNavigate(cleanedParams);
}


export const watcheSearch = watchFilters;

export const handleSerchSort = (columns: string[], direction: string) => {

    const search = (new URLSearchParams(window.location.search)).get('search');

    const params = {
        search,
        direction: direction || 'asc',
        columns: columns,
    }

    // Clean params by removing empty keys
    const cleanedParams = cleanParams(params);

    //inertia naviate search by url
    debouncedNavigate(cleanedParams);
};
// export function watcheSearch(key: string, value: any, query: Record<string, any> = {}) {
//     const search = new URLSearchParams(window.location.search).get('search') || '';

//     // Merge params
//     const params = {
//         search,
//         ...query,
//         [key]: value,
//     };

//     // Clean params by removing empty keys
//     const cleanedParams = cleanParams(params);

//     debouncedNavigate(cleanedParams);
// }



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


