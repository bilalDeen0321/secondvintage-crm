import { router } from "@inertiajs/react";

export function clearSearchStatus() {
    const params = { status: [] };
    router.get(route("watches.index"), params, {
        preserveState: true,
        replace: true,
    });
}