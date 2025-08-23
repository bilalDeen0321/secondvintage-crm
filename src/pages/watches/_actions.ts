import { router } from "@inertiajs/react";

type BulkActions = 'status' | 'location' | 'batch';

export function onBulkAction(action: BulkActions, value: string, ids: (string | number)[]) {
    router.post(route('watches.bulk-actions'), { action, value, ids });
}