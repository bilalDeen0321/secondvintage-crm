
import { echo } from "@/app/echo";
import Status from "@/app/models/Status";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Linkui from "@/components/ui/Link";
import { WatchResource } from "@/types/resources/watch";
import { Link } from "@inertiajs/react";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    watch: WatchResource;
    onSelectWatch: (watchId: string, checked: boolean) => void,
    selectedWatches: string[],
    handleImageClick: (watch: WatchResource) => void,
    onDelete: (id: string | number) => void
}

export default function WatchItem(props: Props) {
    const { watch, onSelectWatch, selectedWatches, handleImageClick, onDelete } = props;

    const [aiStatus, setAiStatus] = useState<string | null>(null);

    useEffect(() => {
        echo.listen(`watch.${watch.routeKey}`, 'WatchAiDescriptionProcessed', (event) => {
            setAiStatus(event.ai_status);
        })
        return () => echo.leave(`watch.${watch.routeKey}`);
    }, [watch.routeKey]);


    return <tr
        key={watch.id}
        className={`hover:bg-slate-50 ${selectedWatches.includes(String(watch.id)) ? "bg-amber-50" : ""}`}
    >
        <td className="p-2">
            <Checkbox
                checked={selectedWatches.includes(String(watch.id),
                )}
                onCheckedChange={(checked) =>
                    onSelectWatch(
                        watch.sku,
                        checked as boolean,
                    )
                }
            />
        </td>
        <td className="p-2">
            <div
                className="h-12 w-12 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg bg-slate-100 transition-opacity hover:opacity-80"
                onClick={() =>
                    handleImageClick(watch)
                }
            >
                {watch.images &&
                    watch.images.length > 0 ? (
                    <img
                        src={watch.images[0].url}
                        alt={watch.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <img
                        src="/assests/watch-placeholder.png"
                        alt="Watch placeholder"
                        className="h-full w-full object-cover opacity-50"
                    />
                )}
            </div>
        </td>
        <td className="p-2">
            <Link
                href={route('watches.show', watch.routeKey)}
                className="cursor-pointer truncate text-sm font-medium text-slate-900 transition-colors hover:text-blue-600"
                title={watch.name}
            >
                {watch.name}
            </Link>
        </td>
        <td className="p-2">
            <Link
                href={route('watches.show', watch.routeKey)}
                className="cursor-pointer text-sm text-slate-600 transition-colors hover:text-blue-600"
            >
                {watch.sku}
            </Link>
        </td>
        <td className="p-2">
            <div className="text-sm text-slate-600">
                {watch.brand}
            </div>
        </td>
        <td className="p-2">
            <div className="text-sm text-slate-900">
                {watch.current_cost
                    ? `€${watch.current_cost.toLocaleString()}`
                    : "-"}
            </div>
        </td>
        <td className="p-2">
            <div className="text-sm text-slate-600">
                {watch.currency}
            </div>
        </td>
        <td className="p-2">
            <div className="text-sm text-slate-600">
                {/* {getBatchGroup(watch.id)} */}
                {watch?.batch}
            </div>
        </td>
        <td className="p-2">
            <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${Status.toColorClass(watch.status)}`}
            >
                {Status.toHuman(watch.status)}
            </span>
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
                {aiStatus === 'loading'
                    ? 'Loading...'
                    : aiStatus === 'failed'
                        ? 'Failed'
                        : watch.description || '-'}
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
                title={watch.notes}
            >
                {watch.notes || "-"}
            </div>
        </td>
        <td className="p-2">
            <div className="flex gap-1">
                <Linkui
                    href={route('watches.show', watch.routeKey)}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                >
                    <Edit className="h-3 w-3" />
                </Linkui>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(watch.routeKey)}
                    className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
        </td>
    </tr>
}