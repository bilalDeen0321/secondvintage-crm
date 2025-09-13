import { PaginateData } from "@/types/laravel";
import { BatchResource } from "@/types/resources/batch";
import { usePage } from "@inertiajs/react";
import { BatchCard } from "./BatchCard";

interface Props {
    batches: BatchResource[];
    viewMode: "grid" | "list";
    onWatchClick: (watchId: string) => void;
    onEditBatch: (batchId: string) => void;
}

export const BatchList = ({ viewMode, onWatchClick, onEditBatch }: Props) => {
    const { data: batches } = usePage().props.batches as PaginateData<BatchResource>;

    if (batches.length === 0) {
        return (
            <div className="py-12 text-center">
                <div className="mb-4 text-6xl">📦</div>
                <h3 className="mb-2 text-xl font-medium text-slate-900">No batches found</h3>
                <p className="text-slate-600">
                    Try adjusting your filters or create your first batch to start tracking
                    shipments
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {batches.map((batch) => (
                <BatchCard
                    key={batch.id}
                    batch={batch}
                    viewMode={viewMode}
                    onWatchClick={onWatchClick}
                    onEditBatch={onEditBatch}
                />
            ))}
        </div>
    );
};
