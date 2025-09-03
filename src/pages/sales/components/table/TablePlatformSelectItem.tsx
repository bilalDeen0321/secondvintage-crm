import PlatformData from "@/app/models/PlatformData";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WatchResource } from "@/types/resources/watch";
import { isDisablePlatform } from "../../_helpers";

interface Props {
    value?: string;
    onValueChange?(value: string): void;
    watch: WatchResource;
}

export default function TablePlatformSelectItem({ value, onValueChange, watch }: Props) {
    // const handlePlatformChange = (watchId: string, platform: string) => {
    //     // Add the watch to processing state
    //     setProcessingWatches((prev) => new Set([...prev, watchId]));

    //     // Update the platform immediately
    //     setWatchPlatforms((prev) => ({
    //         ...prev,
    //         [watchId]: platform,
    //     }));

    //     // Remove from processing state after 3 seconds
    //     setTimeout(() => {
    //         setProcessingWatches((prev) => {
    //             const newSet = new Set(prev);
    //             newSet.delete(watchId);
    //             return newSet;
    //         });
    //     }, 3000);
    // };

    return (
        <>
            <td className="p-2">
                <Select value={value} onValueChange={onValueChange}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                        {["None", ...PlatformData.allPlatforms()].map((platform, index) => (
                            <SelectItem
                                key={index}
                                value={platform}
                                disabled={isDisablePlatform(platform)}
                                className={isDisablePlatform(platform) ? "text-gray-400" : ""}
                            >
                                {PlatformData.toLabel(platform)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </td>
        </>
    );
}
