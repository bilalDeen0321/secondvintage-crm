import { Batch } from "@/app/models/Batch";

interface BatchStatsProps {
    batchStastistics: any;
}

export const BatchStats = ({ batchStastistics }: BatchStatsProps) => {
    const statuses = ["preparing", "shipped", "in_transit", "customs", "delivered"] as const;

    return (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
            {statuses.map((status) => (
                <div key={status} className="rounded-lg border bg-white p-4">
                    <div className="text-2xl font-bold text-slate-900">
                        {batchStastistics.find((b: any) => b.status === status)?.count}
                    </div>
                    <div className="text-sm text-slate-600">{Batch.toHuman(status)}</div>
                </div>
            ))}
        </div>
    );
};
