import { Checkbox } from "@/components/ui/checkbox";
import { SaleWatchResource, WatchResource } from "@/types/resources/watch";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { SortDirection, SortField } from "../_handlers";
import SaleTableWatchItem from "./table/SaleTableWatchItem";

export interface WatchTableProps {
    watches: SaleWatchResource[];
    selectedWatches: WatchResource["id"][];
    watchPlatforms: Record<string, string>;
    processingWatches: Set<WatchResource["id"]>;
    sortField: SortField;
    sortDirection: SortDirection;
    onSelectWatch: (watchId: WatchResource["id"], checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onSort: (field: SortField) => void;
    onPlatformChange: (routeKey: WatchResource["routeKey"], platform: string) => void;
    onViewPlatformData: (watch: SaleWatchResource, platform: string) => void;
    onOpenSingleView: (watch: SaleWatchResource) => void;
}

const SaleWatchTable: React.FC<WatchTableProps> = ({ watches, selectedWatches, watchPlatforms, sortField, sortDirection, onSelectWatch, onSelectAll, onSort, onPlatformChange, onViewPlatformData, onOpenSingleView }) => {
    const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
        <th className="cursor-pointer select-none p-3 text-xs font-medium text-slate-700 hover:bg-slate-100" onClick={() => onSort(field)}>
            <div className="flex items-center gap-1">
                {children}
                {sortField === field && (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
            </div>
        </th>
    );

    return (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr className="text-left">
                            <th className="w-8 p-3 text-xs font-medium text-slate-700">
                                <Checkbox checked={selectedWatches.length === watches.length && watches.length > 0} onCheckedChange={onSelectAll} />
                            </th>
                            {/* <th className="w-16 p-3 text-xs font-medium text-slate-700">Image</th> */}
                            <SortableHeader field="created_at">Image</SortableHeader>
                            <SortableHeader field="name">Name</SortableHeader>
                            <SortableHeader field="sku">SKU</SortableHeader>
                            <SortableHeader field="brand">Brand</SortableHeader>
                            <SortableHeader field="acquisitionCost">Cost</SortableHeader>
                            <SortableHeader field="batchGroup">Batch Group</SortableHeader>
                            <SortableHeader field="status">Status</SortableHeader>
                            <th className="w-48 p-3 text-xs font-medium text-slate-700">Platform</th>
                            <th className="w-20 p-3 text-xs font-medium text-slate-700">View Data</th>
                            <SortableHeader field="location">Location</SortableHeader>
                            <th className="w-24 p-3 text-xs font-medium text-slate-700">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {watches.map((watch, key) => (
                            <SaleTableWatchItem key={key} onOpenSingleView={onOpenSingleView} onPlatformChange={onPlatformChange} onSelectWatch={onSelectWatch} onViewPlatformData={onViewPlatformData} selectedWatches={selectedWatches} watch={watch} watchPlatforms={watchPlatforms} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SaleWatchTable;
