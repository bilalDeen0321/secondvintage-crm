import PlatformData from "@/app/models/PlatformData";
import Status from "@/app/models/Status";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import React from "react";
import { isDisablePlatform } from "../_helpers";

interface BulkActionsProps {
    selectedWatches: string[];
    locations: string[];
    batches: string[];
    onBulkPlatformChange: (platform: string) => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
    selectedWatches,
    locations,
    batches,
    onBulkPlatformChange,
}) => {
    if (selectedWatches.length === 0) {
        return null;
    }

    return (
        <div className="mb-6 flex flex-wrap gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
                <Edit className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                    {selectedWatches.length} watches selected - Bulk Actions:
                </span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">Status:</span>
                <Select onValueChange={() => alert("handleBulkStatusChange")}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {Status.allStatuses().map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">Location:</span>
                <Select onValueChange={() => alert("handleBulkLocationChange")}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Change Location" />
                    </SelectTrigger>
                    <SelectContent>
                        {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                                {location}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">Batch Group:</span>
                <Select onValueChange={() => alert("handleBulkBatchGroupChange")}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Change Batch" />
                    </SelectTrigger>
                    <SelectContent>
                        {batches
                            .filter((b) => b !== "All")
                            .map((batch) => (
                                <SelectItem key={batch} value={batch}>
                                    {batch}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">Platform:</span>
                <Select onValueChange={onBulkPlatformChange}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Change Platform" />
                    </SelectTrigger>
                    <SelectContent>
                        {["None", ...PlatformData.allPlatforms()].map((platform) => (
                            <SelectItem
                                key={platform}
                                value={platform}
                                disabled={isDisablePlatform(platform)}
                                className={isDisablePlatform(platform) ? "text-gray-400" : ""}
                            >
                                {PlatformData.toLabel(platform)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default BulkActions;
