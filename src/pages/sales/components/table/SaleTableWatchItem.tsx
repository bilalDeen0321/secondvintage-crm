import { Checkbox } from "@/components/ui/checkbox";
import WatchTableDescription from "@/components/watch/columns/WatchTableDescription";
import WatchTablePrice from "@/components/watch/columns/WatchTablePrice";
import WatchTableStatus from "@/components/watch/columns/WatchTableStatus";
import { SaleWatchResource, WatchResource } from "@/types/resources/watch";
import { useEffect, useState } from "react";
import { WatchTableProps } from "../WatchTable";
import { SaleTablePlatformItem } from "./SaleTablePlatformItem";
import TablePlatformSelectItem from "./TablePlatformSelectItem";

export interface SaleTableWatchItemProps {
    onOpenSingleView: (watch: WatchResource) => void;
    onPlatformChange: WatchTableProps["onPlatformChange"];
    onSelectWatch: WatchTableProps["onSelectWatch"];
    onViewPlatformData: WatchTableProps["onViewPlatformData"];
    processingWatches: Set<WatchResource["id"]>;
    selectedWatches: WatchResource["id"][];
    watch: SaleWatchResource;
    watchPlatforms: Record<string, string>;
}

export default function SaleTableWatchItem({ onOpenSingleView, onSelectWatch, onViewPlatformData, processingWatches, selectedWatches, watch, watchPlatforms }: SaleTableWatchItemProps) {
    const [platform, setPlatform] = useState<string>(watch.platform || "None");
    const [processing, setLoading] = useState(false);

    useEffect(() => {
        if (watch.platform) setPlatform(watch.platform);
    }, [watch.platform]);

    const onPlatformChange = (value: string) => {
        setPlatform(value);
        setLoading(true);
        onSelectWatch(String(watch.id), false); // Deselect the watch when platform changes
        setTimeout(() => {
            setLoading(false);
        }, 2000); // Simulate loading time
    };

    return (
        <tr key={watch.id} className={`hover:bg-slate-50 ${selectedWatches.includes(watch.id) ? "bg-amber-50" : ""}`}>
            <td className="p-3">
                <Checkbox checked={selectedWatches.includes(watch.id)} onCheckedChange={(checked) => onSelectWatch(String(watch.id), checked as boolean)} />
            </td>
            <td className="p-3">
                <div className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-100 hover:opacity-80" onClick={() => onOpenSingleView(watch)}>
                    {watch.images?.[0] ? <img src={watch.images[0].url} alt={watch.name} className="h-full w-full object-cover" /> : <img src="/lovable-uploads/02bcd7a1-2bd6-4118-ac09-c5414b210a1f.png" alt="Watch placeholder" className="h-6 w-6 opacity-40" />}
                </div>
            </td>
            <td className="p-3">
                <div className="cursor-pointer text-sm font-medium text-slate-900 transition-colors hover:text-blue-600" onClick={() => onOpenSingleView(watch)}>
                    {watch.name}
                </div>
            </td>
            <td className="p-3">
                <div className="cursor-pointer text-sm text-slate-600 transition-colors hover:text-blue-600" onClick={() => onOpenSingleView(watch)}>
                    {watch.sku}
                </div>
            </td>
            <td className="p-2">
                <div className="text-sm text-slate-600">{watch.brand}</div>
            </td>
            <td className="p-2">
                <WatchTablePrice watch={watch} />
            </td>
            <td className="p-2">
                <div className="text-sm text-slate-600">{watch.batch}</div>
            </td>
            <td className="p-2">
                <WatchTableStatus watch={watch} />
            </td>

            <TablePlatformSelectItem watch={watch} value={platform} onValueChange={onPlatformChange} />

            <SaleTablePlatformItem onViewPlatformData={onViewPlatformData} platform={platform} processing={processing} watch={watch} />

            <td className="p-2">
                <div className="text-sm text-slate-600">{watch.location}</div>
            </td>
            <td className="p-2">
                <WatchTableDescription watch={watch} />
            </td>
        </tr>
    );
}
