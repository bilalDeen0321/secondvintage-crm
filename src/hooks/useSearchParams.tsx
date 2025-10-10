import { router, usePage } from "@inertiajs/react";
import { useCallback, useMemo } from "react";

export function useSearchParams() {
    const { url } = usePage();

    // Get current search params from Inertia's url
    const searchParams = useMemo(() => {
        return new URLSearchParams(url.split("?")[1] || "");
    }, [url]);

    // Set or update query params using Inertia
    const setSearchParams = useCallback(
        (
            nextInit: URLSearchParams | Record<string, string | number | null>,
            options = {},
        ) => {
            const newParams = new URLSearchParams(searchParams.toString());

            if (nextInit instanceof URLSearchParams) {
                nextInit.forEach((value, key) => {
                    newParams.set(key, value);
                });
            } else {
                Object.entries(nextInit).forEach(([key, value]) => {
                    if (value === null) {
                        newParams.delete(key);
                    } else {
                        newParams.set(key, String(value));
                    }
                });
            }

            // router.get(
            //     `${url.split("?")[0]}?${newParams.toString()}`,
            //     {},
            //     {
            //         preserveState: true,
            //         replace: true,
            //         ...options,
            //     },
            // );
        },
        [searchParams, url],
    );

    return [searchParams, setSearchParams] as const;
}
