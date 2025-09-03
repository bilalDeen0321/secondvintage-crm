import PlatformData from "@/app/models/PlatformData";
import Status from "@/app/models/Status";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { onBulkAction } from "@/pages/watches/_actions";
import { router } from "@inertiajs/react";
import { Edit } from "lucide-react";
import { isDisablePlatform } from "../_helpers";

interface Props {
    ids: string[];
    locations: string[];
    batches: string[];
    onBulkPlatformChange: (platform: string) => void;
}

export default function SaleWatchBlukActions({ ids, locations, batches }) {
    //
    if (ids?.length === 0) {
        return null;
    }

    //on bulk action change platform
    const onBulkPlatformChange = (platform: string) => {
        //
        const data = { platform, ids };

        router.post(route("platform-data.bulk-actions"), data, {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <div className="mb-6 flex flex-wrap gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
                <Edit className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{ids?.length} watches selected - Bulk Actions:</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">Status:</span>
                <Select onValueChange={(val) => onBulkAction("status", val, ids)}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {Status.allStatuses().map((status) => (
                            <SelectItem key={status} value={status}>
                                {Status.toHuman(status)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700">Location:</span>
                <Select onValueChange={(val) => onBulkAction("location", val, ids)}>
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
                <Select onValueChange={(val) => onBulkAction("batch", val, ids)}>
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
                            <SelectItem key={platform} value={platform} disabled={isDisablePlatform(platform)} className={isDisablePlatform(platform) ? "text-gray-400" : ""}>
                                {PlatformData.toLabel(platform)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
