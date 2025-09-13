import { router } from "@inertiajs/react";

type BulkActions = 'status' | 'location' | 'batch';

/**
 * Delete a watch by its route key using laravel resource route + inertia router.
 */
export function deleteWatch(routeKey: string | number) {
    if (confirm("Are you sure you want to delete this watch?.")) {
        router.delete(route('watches.destroy', routeKey), {
            preserveScroll: true,
            preserveState: false,
        });
    }
}



/**
 * Handles bulk actions on watches by sending a POST request with the specified action, value, and IDs.
 */
export function onBulkAction(action: BulkActions, value: string, ids: (string | number)[]) {
    router.post(route('watches.bulk-actions'), { action, value, ids }, {
        // preserveScroll: true,
        // preserveState: false,
    });
}

export const hanldeBatchAction = () => {

    const newBatch = prompt("Enter new batch name:");

    if (newBatch && newBatch.trim()) {
        // Direct Inertia POST request without page reload

        router.post(route('batches.store'), { name: newBatch }, { fresh: false });
    }
};

export const handleEditBatches = hanldeBatchAction;


export const handleEditBrands = () => {

    const newBrand = prompt("Enter new brand name:");

    if (newBrand && newBrand.trim()) {

        router.post(route('brands.store'), { name: newBrand }, { fresh: false });
    }
};


export const handleEditLocations = () => {
    const newLocation = prompt("Enter new location:");
    if (!newLocation?.trim()) return;
    router.post(route('api.locations.store'), { name: newLocation });
};

