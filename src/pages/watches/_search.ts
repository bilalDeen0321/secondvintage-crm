/* eslint-disable @typescript-eslint/no-explicit-any */
import { debounce } from "@/app/utils";
import { router } from "@inertiajs/react";

/**
 * Parse window.location.search into an object.
 * Handles array params like status[]=a, status[0]=a, or repeated keys.
 */
function parseSearchParams(): Record<string, any> {
    const sp = new URLSearchParams(window.location.search);
    const params: Record<string, any> = {};

    sp.forEach((val, rawKey) => {
        // Normalize keys by stripping [index] or [] suffix
        const baseKey = rawKey.replace(/\[\d*\]$/, "").replace(/\[\]$/, "");

        if (!(baseKey in params)) {
            params[baseKey] = val;
        } else if (Array.isArray(params[baseKey])) {
            (params[baseKey] as string[]).push(val);
        } else {
            params[baseKey] = [params[baseKey], val];
        }
    });

    // Normalize arrays
    Object.keys(params).forEach((k) => {
        if (Array.isArray(params[k])) {
            params[k] = Array.from(new Set(params[k].map(String)));
        } else {
            params[k] = String(params[k]);
        }
    });

    return params;
}

/**
 * Remove empty / null / undefined values.
 */
export function cleanParams(params: Record<string, any>) {
    const cleaned: Record<string, any> = {};
    for (const key in params) {
        const value = params[key];

        if (value === undefined || value === null) continue;

        if (Array.isArray(value)) {
            const arr = value
                .map((v) => String(v ?? "").trim())
                .filter((v) => v && v.toLowerCase() !== "all");
            if (arr.length > 0) cleaned[key] = Array.from(new Set(arr));
            continue;
        }

        if (typeof value === "string") {
            const v = value.trim();
            if (!v || v.toLowerCase() === "all") continue;
            cleaned[key] = v;
            continue;
        }

        cleaned[key] = value;
    }
    return cleaned;
}

/**
 * Debounced Inertia navigation
 */
export const debouncedNavigate = debounce((params: Record<string, any>) => {
    router.get(route("watches.index"), params, {
        preserveScroll: true,
        preserveState: true,
        replace: true,
    });
}, 300);

/**
 * Main filter handler.
 * Removes params on unselect/empty.
 */
export function watchFilter(
    key: string,
    value: any,
    query: Record<string, any> = {}
) {
    const params = parseSearchParams();

    //   Always clear the old key first
    delete params[key];

    if (Array.isArray(value)) {
        const arr = value
            .map((v) => String(v ?? "").trim())
            .filter((v) => v && v.toLowerCase() !== "all");
        if (arr.length > 0) {
            params[key] = Array.from(new Set(arr));
        }
    } else if (
        value !== null &&
        value !== undefined &&
        !(typeof value === "string" && (value.trim() === "" || value.toLowerCase() === "all"))
    ) {
        params[key] = value;
    }

    // Merge overrides
    for (const qk in query) {
        const qv = query[qk];
        if (qv === null || qv === undefined || (typeof qv === "string" && !qv.trim())) {
            delete params[qk];
        } else {
            params[qk] = qv;
        }
    }

    const cleanedParams = cleanParams(params);
    debouncedNavigate(cleanedParams);
}

/**
 * Helpers
 */
export const getSearchStatus = (data: string[]) => {
    return Array.from(
        new Set(
            (data || [])
                .map(String)
                .filter((s) => s.toLowerCase() !== "all")
                .filter(Boolean)
        )
    );
};

export const getSelectSearch = (value: string, lower = false) => {
    const str = lower ? value.toLowerCase() : value;
    return str.replace(/all/gi, "");
};

export const getSelectStatus = (arr: string[]) =>
    (arr || []).filter((s) => String(s) !== "all").filter(Boolean);
