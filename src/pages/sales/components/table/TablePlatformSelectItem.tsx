import PlatformData from "@/app/models/PlatformData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WatchResource } from "@/types/resources/watch";
import { router } from "@inertiajs/react";
import { isDisablePlatform } from "../../_helpers";

interface Props {
    value?: string;
    onValueChange?(value: string): void;
    watch: WatchResource;
}

export default function TablePlatformSelectItem({ value, onValueChange, watch }: Props) {
    if (!watch) return null;

    //on change handler
    const onPlatformChange = (value: string) => {
        if (onValueChange) onValueChange(value);

        //request body data
        const data = { platform: value };

        //make the request to send the platform change
        router.post(route("platform-data.changes", watch?.routeKey), data, {
            preserveState: true,
            preserveScroll: true,
            onError: (errors) => {
                console.error("Error updating platform:", errors);
            },
        });
    };

    return (
        <>
            <td className="p-2">
                <Select value={value} onValueChange={onPlatformChange}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                        {["None", ...PlatformData.allPlatforms()].map((platform, index) => (
                            <SelectItem key={index} value={platform} disabled={isDisablePlatform(platform)} className={isDisablePlatform(platform) ? "text-gray-400" : ""}>
                                {PlatformData.toLabel(platform)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </td>
        </>
    );
}
