import { Batch } from "@/types/Batch";

interface BatchStatsProps {
    batches: Batch[];
}

export const BatchStats = ({ batches }: BatchStatsProps) => {
    const statuses = ["Preparing", "Shipped", "In Transit", "Customs", "Delivered"] as const;

    return (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
            {statuses.map((status) => (
                <div key={status} className="rounded-lg border bg-white p-4">
                    <div className="text-2xl font-bold text-slate-900">
                        {batches.filter((b) => b.status === status).length}
                    </div>
                    <div className="text-sm text-slate-600">{status}</div>
                </div>
            ))}
        </div>
    );
};
