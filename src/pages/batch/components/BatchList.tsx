import { Batch } from "@/types/Batch";
import { BatchCard } from "./BatchCard";

interface BatchListProps {
    batches: Batch[];
    viewMode: "grid" | "list";
    onWatchClick: (watchId: string) => void;
    onEditBatch: (batchId: string) => void;
    onCreateInvoice: (batchId: string) => void;
    onStatusUpdate: (batchId: string, status: Batch["status"]) => void;
    getStatusColor: (status: Batch["status"]) => string;
    getTrackingUrl: (trackingNumber: string) => string;
}

export const BatchList = ({
    batches,
    viewMode,
    onWatchClick,
    onEditBatch,
    onCreateInvoice,
    onStatusUpdate,
    getStatusColor,
    getTrackingUrl,
}: BatchListProps) => {
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
                    onCreateInvoice={onCreateInvoice}
                    onStatusUpdate={onStatusUpdate}
                    getStatusColor={getStatusColor}
                    getTrackingUrl={getTrackingUrl}
                />
            ))}
        </div>
    );
};
