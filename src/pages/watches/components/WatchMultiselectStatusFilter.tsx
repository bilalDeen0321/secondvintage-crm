import Status from "@/app/models/Status";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import { getSearchStatus, watchFilter } from "../_search";

export default function WatchMultiselectStatusFilter({ setData, data, watch_count }) {
    return (
        <div className="mb-6">
            <div className="flex flex-wrap gap-2">
                {["all", ...Status.allStatuses()].map((status) => (
                    <button
                        key={status}
                        onClick={() => {
                            if (status === "all") {
                                setData("status", ["all"]);
                                watchFilter("status", getSearchStatus(["all"]));
                                return;
                            }

                            let updatedStatus = [...data.status];

                            if (updatedStatus.includes(status)) {
                                // Remove the status if already selected
                                updatedStatus = updatedStatus.filter((s) => s !== status);
                            } else {
                                // Add status if not selected
                                updatedStatus.push(status);
                            }

                            // If no status left, default back to "all"
                            if (updatedStatus.length === 0) {
                                updatedStatus = ["all"];
                            } else {
                                // Remove "all" if other statuses are selected
                                updatedStatus = updatedStatus.filter((s) => s !== "all");
                            }

                            setData("status", updatedStatus);
                            watchFilter("status", getSearchStatus(updatedStatus));
                        }}
                        className={`h-16 w-[100px] rounded-lg border p-2 text-center transition-all ${
                            data.status.includes(status)
                                ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                                : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                    >
                        <div className="text-lg font-bold text-slate-900">
                            {watch_count[status] || 0}
                        </div>
                        <div className="truncate text-xs leading-tight text-slate-600">
                            {Status.toHuman(status)}
                        </div>
                    </button>
                ))}
            </div>

            {/* Clear status filters button */}
            {data.status.length > 1 ||
            (data.status.length === 1 && !data.status.includes("All")) ? (
                <div className="mt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setData("status", ["All"]);
                            watchFilter("status", null);
                        }}
                        className="border-slate-300 text-slate-600 hover:bg-slate-100"
                    >
                        <X className="mr-1 h-3 w-3" />
                        Clear Status Filters
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
