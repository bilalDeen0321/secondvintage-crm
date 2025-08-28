/* eslint-disable @typescript-eslint/no-explicit-any */
import Status from "@/app/models/Status";
import BatchSelector from "@/components/BatchSelector";
import BrandSelector from "@/components/BrandSelector";
import LocationSelector from "@/components/LocationSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { handleEditBatches, handleEditBrands, handleEditLocations } from "../_actions";
import { getSearchStatus, getSelectSearch, watchFilter } from "../_search";

type StatusKey = (typeof Status.statuses)[number];
type WatchCount = Record<StatusKey, number>;

interface WatchFiltersProps {
    data: {
        search: string;
        status: string[];
        brand: string;
        batch: string;
        location: string;
    };
    setData: (key: string, value: any) => void;
    watch_count: Partial<WatchCount>;
    brands: string[];
    batches: string[];
    locations: string[];
}

const WatchFilters = ({ data, setData, watch_count, brands, batches, locations }: WatchFiltersProps) => {
    return (
        <>
            {/* Multi-select Status Filter */}
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
                                    updatedStatus = updatedStatus.filter((s) => s !== status);
                                } else {
                                    updatedStatus.push(status);
                                }

                                if (updatedStatus.length === 0) {
                                    updatedStatus = ["all"];
                                } else {
                                    updatedStatus = updatedStatus.filter((s) => s !== "all");
                                }

                                setData("status", updatedStatus);
                                watchFilter("status", getSearchStatus(updatedStatus));
                            }}
                            className={`h-16 w-[100px] rounded-lg border p-2 text-center transition-all ${data.status.includes(status)
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

            {/* Search and Filters */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row">
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="Search watches by name, brand, or SKU..."
                        value={data.search}
                        onChange={(e) => {
                            watchFilter("search", e.target.value);
                            setData("search", e.target.value);
                        }}
                        className="w-full"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                            Brand:
                        </span>
                        <BrandSelector
                            value={data.brand}
                            onValueChange={(value) => {
                                setData("brand", value);
                                watchFilter("brand", getSelectSearch(value));
                            }}
                            brands={["All", ...brands]}
                            onEditBrands={handleEditBrands}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                            Batch:
                        </span>
                        <BatchSelector
                            value={data.batch}
                            onValueChange={(value) => {
                                setData("batch", value);
                                watchFilter("batch", getSelectSearch(value));
                            }}
                            batches={["All", ...batches]}
                            onEditBatches={handleEditBatches}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                            Location:
                        </span>
                        <LocationSelector
                            value={data.location}
                            onValueChange={(value) => {
                                setData("location", value);
                                watchFilter("location", getSelectSearch(value));
                            }}
                            locations={["All", ...locations]}
                            onEditLocations={handleEditLocations}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default WatchFilters;
