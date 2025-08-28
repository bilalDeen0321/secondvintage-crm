/* eslint-disable @typescript-eslint/no-explicit-any */
import { debounce } from "@/app/utils";
import { router } from "@inertiajs/react";
import { cleanParams } from "../watches/_search";

// Create a debounced router call once
export const debouncedNavigate = debounce((params: Record<string, any>) => {
    router.get(route("sales.index"), params, {
        preserveScroll: true,
        preserveState: true,
        replace: true,
    });
}, 300);

/**
 * Handles filtering watches by updating URL parameters and navigating.
 */
export function saleSearchFilter(key: string, value: any, query: Record<string, any> = {}) {
    const searchParams = new URLSearchParams(window.location.search);

    // Merge params
    const params = {
        batch: searchParams.get("batch"),
        brand: searchParams.get("brand"),
        search: searchParams.get("search"),
        location: searchParams.get("location"),
        ...query,
        [key]: value,
    };

    // Clean params by removing empty keys
    const cleanedParams = cleanParams(params);

    debouncedNavigate(cleanedParams);
}
