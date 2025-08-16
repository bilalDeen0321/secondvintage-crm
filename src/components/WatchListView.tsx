import Status from "@/app/models/Status";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Linkui from "@/components/ui/Link";
import { debouncedNavigate } from "@/pages/watches/_searchActions";
import { WatchResource } from "@/types/resources/watch";
import { Link } from "@inertiajs/react";
import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import qs from 'qs';
import { useState } from "react";
import ImageViewer from "./ImageViewer";

interface WatchListViewProps {
    watches: WatchResource[];
    onDelete: (id: string | number) => void;
    onSort: (field: string) => void;
    sortField: string;
    sortDirection: "asc" | "desc";
    selectedWatches: string[];
    onSelectWatch: (watchId: string, checked: boolean) => void;
    onSelectAll: (checked: boolean) => void;
}

const WatchListView = ({
    watches,
    onDelete,
    onSort,
    selectedWatches,
    onSelectWatch,
    onSelectAll,
}: WatchListViewProps) => {

    const [sortField, setSortField] = useState('created_at'); // default sort field
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // default direction



    const [imageViewer, setImageViewer] = useState<{
        isOpen: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        images: any[];
        currentIndex: number;
    }>({
        isOpen: false,
        images: [],
        currentIndex: 0,
    });



    const handleImageClick = (watch: WatchResource) => {
        if (watch.images && watch.images.length > 0) {
            setImageViewer({
                isOpen: true,
                images: watch.images,
                currentIndex: 0,
            });
        }
    };

    const handleCloseImageViewer = () => {
        setImageViewer({
            isOpen: false,
            images: [],
            currentIndex: 0,
        });
    };

    const handlePreviousImage = () => {
        setImageViewer((prev) => ({
            ...prev,
            currentIndex: Math.max(0, prev.currentIndex - 1),
        }));
    };

    const handleNextImage = () => {
        setImageViewer((prev) => ({
            ...prev,
            currentIndex: Math.min(
                prev.images.length - 1,
                prev.currentIndex + 1,
            ),
        }));
    };


    // Update getSortIcon to use local state
    const getSortIcon = (field: string) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? (
            <ChevronUp className="ml-1 inline h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 inline h-4 w-4" />
        );
    };

    // Updated handleSort
    const handleSort = (field: string) => {
        let direction: 'asc' | 'desc' | null = 'asc';

        if (sortField === field) {
            // toggle ascending/descending
            direction = sortDirection === 'asc' ? 'desc' : 'asc';
        }

        // clicking same field again to remove sorting
        if (sortField === field && sortDirection === 'desc') {
            direction = null;
        }

        setSortField(field);
        setSortDirection(direction as 'asc' | 'desc');

        // Get current query params
        const current = qs.parse(window.location.search, { ignoreQueryPrefix: true });

        // Build new order params
        const params = {
            ...current,
            order: direction
                ? [{ column: field, dir: direction, name: field }]
                : [], // empty = no sorting
        };

        debouncedNavigate(params);
    };



    return (
        <>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr className="text-left">
                                <th className="w-8 p-2 text-xs font-medium text-slate-700">
                                    <Checkbox
                                        checked={
                                            selectedWatches.length ===
                                            watches.length &&
                                            watches.length > 0
                                        }
                                        onCheckedChange={onSelectAll}
                                    />
                                </th>
                                <th className="w-16 p-2 text-xs font-medium text-slate-700 cursor-pointer" onClick={() => handleSort("created_at")}>
                                    Image {getSortIcon("created_at")}
                                </th>
                                <th
                                    className="w-48 cursor-pointer p-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                    onClick={() => handleSort("name")}
                                >
                                    Name {getSortIcon("name")}
                                </th>
                                <th
                                    className="w-24 cursor-pointer p-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                    onClick={() => handleSort("sku")}
                                >
                                    SKU {getSortIcon("sku")}
                                </th>
                                <th
                                    className="w-24 cursor-pointer p-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                >
                                    Brand
                                    {/* Brand {getSortIcon("brand")} */}
                                </th>
                                <th
                                    className="w-20 cursor-pointer p-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                    onClick={() => handleSort("original_cost")}
                                >
                                    Cost {getSortIcon("original_cost")}
                                </th>
                                <th className="w-24 p-2 text-xs font-medium text-slate-700">
                                    Org. Currency
                                </th>
                                <th className="w-24 p-2 text-xs font-medium text-slate-700">
                                    Batch Group
                                </th>
                                <th
                                    className="w-28 cursor-pointer p-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                    onClick={() => handleSort("status")}
                                >
                                    Status {getSortIcon("status")}
                                </th>
                                <th
                                    className="w-24 cursor-pointer p-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                    onClick={() => handleSort("location")}
                                >
                                    Location {getSortIcon("location")}
                                </th>
                                <th className="w-24 p-2 text-xs font-medium text-slate-700">
                                    Description
                                </th>
                                <th className="w-24 p-2 text-xs font-medium text-slate-700">
                                    Notes
                                </th>
                                <th className="w-20 p-2 text-xs font-medium text-slate-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {watches.map((watch) => (
                                <tr
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
                                            {watch.description || "-"}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {imageViewer.isOpen && (
                <ImageViewer
                    images={imageViewer.images}
                    currentIndex={imageViewer.currentIndex}
                    onClose={handleCloseImageViewer}
                    onPrevious={handlePreviousImage}
                    onNext={handleNextImage}
                />
            )}
        </>
    );
};

export default WatchListView;
