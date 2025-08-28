import Status from "@/app/models/Status";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WatchResource } from "@/types/resources/watch";
import { AlertTriangle, ChevronDown, ChevronUp, Eye } from "lucide-react";
import React from "react";
import { platforms } from "../_constraints";
import { SortDirection, SortField } from "../_handlers";

interface WatchTableProps {
    watches: WatchResource[];
    selectedWatches: string[];
    watchPlatforms: Record<string, string>;
    processingWatches: Set<string>;
    sortField: SortField;
    sortDirection: SortDirection;
    onSelectWatch: (watchId: string, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
    onSort: (field: SortField) => void;
    onPlatformChange: (watchId: string, platform: string) => void;
    onViewPlatformData: (watch: WatchResource, platform: string) => void;
    onOpenSingleView: (watch: WatchResource) => void;
}

const WatchTable: React.FC<WatchTableProps> = ({
    watches,
    selectedWatches,
    watchPlatforms,
    processingWatches,
    sortField,
    sortDirection,
    onSelectWatch,
    onSelectAll,
    onSort,
    onPlatformChange,
    onViewPlatformData,
    onOpenSingleView,
}) => {
    const SortableHeader = ({
        field,
        children,
    }: {
        field: SortField;
        children: React.ReactNode;
    }) => (
        <th
            className="cursor-pointer select-none p-3 text-xs font-medium text-slate-700 hover:bg-slate-100"
            onClick={() => onSort(field)}
        >
            <div className="flex items-center gap-1">
                {children}
                {sortField === field &&
                    (sortDirection === "asc" ? (
                        <ChevronUp className="h-3 w-3" />
                    ) : (
                        <ChevronDown className="h-3 w-3" />
                    ))}
            </div>
        </th>
    );

    // Helper function to determine if a platform should be greyed out
    const isGreyedOutPlatform = (platform: string) => {
        return [
            "eBay (Fixed Price)",
            "eBay (Auction)",
            "Chrono24 (Fixed Price)",
            "Webshop (Fixed Price)",
        ].includes(platform);
    };

    return (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr className="text-left">
                            <th className="w-8 p-3 text-xs font-medium text-slate-700">
                                <Checkbox
                                    checked={
                                        selectedWatches.length === watches.length &&
                                        watches.length > 0
                                    }
                                    onCheckedChange={onSelectAll}
                                />
                            </th>
                            <th className="w-16 p-3 text-xs font-medium text-slate-700">
                                Image
                            </th>
                            <SortableHeader field="name">Name</SortableHeader>
                            <SortableHeader field="sku">SKU</SortableHeader>
                            <SortableHeader field="brand">Brand</SortableHeader>
                            <SortableHeader field="acquisitionCost">
                                Cost
                            </SortableHeader>
                            <SortableHeader field="batchGroup">
                                Batch Group
                            </SortableHeader>
                            <SortableHeader field="status">Status</SortableHeader>
                            <th className="w-48 p-3 text-xs font-medium text-slate-700">
                                Platform
                            </th>
                            <th className="w-20 p-3 text-xs font-medium text-slate-700">
                                View Data
                            </th>
                            <SortableHeader field="location">
                                Location
                            </SortableHeader>
                            <th className="w-24 p-3 text-xs font-medium text-slate-700">
                                Description
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {watches.map((watch) => (
                            <tr
                                key={watch.id}
                                className={`hover:bg-slate-50 ${selectedWatches.includes(String(watch.id))
                                        ? "bg-amber-50"
                                        : ""
                                    }`}
                            >
                                <td className="p-3">
                                    <Checkbox
                                        checked={selectedWatches.includes(
                                            String(watch.id)
                                        )}
                                        onCheckedChange={(checked) =>
                                            onSelectWatch(
                                                String(watch.id),
                                                checked as boolean
                                            )
                                        }
                                    />
                                </td>
                                <td className="p-3">
                                    <div
                                        className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-100 hover:opacity-80"
                                        onClick={() => onOpenSingleView(watch)}
                                    >
                                        {watch.images?.[0] ? (
                                            <img
                                                src={watch.images[0].url}
                                                alt={watch.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src="/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png"
                                                alt="Watch placeholder"
                                                className="h-6 w-6 opacity-40"
                                            />
                                        )}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div
                                        className="cursor-pointer text-sm font-medium text-slate-900 transition-colors hover:text-blue-600"
                                        onClick={() => onOpenSingleView(watch)}
                                    >
                                        {watch.name}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div
                                        className="cursor-pointer text-sm text-slate-600 transition-colors hover:text-blue-600"
                                        onClick={() => onOpenSingleView(watch)}
                                    >
                                        {watch.sku}
                                    </div>
                                </td>
                                <td className="p-2">
                                    <div className="text-sm text-slate-600">
                                        {watch.brand}
                                    </div>
                                </td>
                                <td className="p-2">
                                    <div className="text-sm font-semibold">
                                        €{watch.original_cost?.toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-2">
                                    <div className="text-sm text-slate-600">
                                        {watch.batch}
                                    </div>
                                </td>
                                <td className="p-2">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${Status.toColorClass(
                                            watch.status
                                        )}`}
                                    >
                                        {watch.status}
                                    </span>
                                </td>
                                <td className="p-2">
                                    <Select
                                        value={watchPlatforms[watch.id] || "None"}
                                        onValueChange={(value) =>
                                            onPlatformChange(String(watch.id), value)
                                        }
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Platform" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {platforms.map((platform) => (
                                                <SelectItem
                                                    key={platform}
                                                    value={platform}
                                                    className={
                                                        isGreyedOutPlatform(platform)
                                                            ? "text-gray-400"
                                                            : ""
                                                    }
                                                >
                                                    {platform}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </td>
                                <td className="p-2">
                                    {processingWatches.has(String(watch.id)) ? (
                                        <div className="flex items-center justify-center">
                                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
                                        </div>
                                    ) : String(watch.id) === "13" ? (
                                        // Show red exclamation mark for Hamilton Khaki Field
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:bg-red-50 hover:text-red-800"
                                                >
                                                    <AlertTriangle className="h-5 w-5" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-red-600">
                                                        Platform Data Error
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        There was an error processing
                                                        the platform data for this
                                                        watch. Please check the
                                                        platform configuration and
                                                        try again, or contact support
                                                        if the issue persists.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogAction>
                                                        OK
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    ) : (
                                        watchPlatforms[watch.id] &&
                                        watchPlatforms[watch.id] !== "None" && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    onViewPlatformData(
                                                        watch,
                                                        watchPlatforms[watch.id]
                                                    )
                                                }
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Eye className="mr-1 h-4 w-4" />
                                                Data
                                            </Button>
                                        )
                                    )}
                                </td>
                                <td className="p-2">
                                    <div className="text-sm text-slate-600">
                                        {watch.location}
                                    </div>
                                </td>
                                <td className="p-2">
                                    <div
                                        className="line-clamp-2 text-xs leading-tight text-slate-600"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                        title={watch.description}
                                    >
                                        {watch.description || "-"}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WatchTable;