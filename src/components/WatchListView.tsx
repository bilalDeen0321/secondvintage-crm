import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Linkui from "@/components/ui/Link";
import { WatchResource } from "@/types/resources/watch";
import { Link } from "@inertiajs/react";
import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
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
    sortField,
    sortDirection,
    selectedWatches,
    onSelectWatch,
    onSelectAll,
}: WatchListViewProps) => {
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

    const getSortIcon = (field: string) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? (
            <ChevronUp className="ml-1 inline h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 inline h-4 w-4" />
        );
    };

    const getStatusColor = (status: WatchResource["status"]) => {
        switch (status) {
            case "Draft":
                return "bg-gray-100 text-gray-800";
            case "Review":
                return "bg-blue-100 text-blue-800";
            case "Approved":
                return "bg-green-100 text-green-800";
            case "Platform Review":
                return "bg-blue-600 text-white";
            case "Ready for listing":
                return "bg-green-100 text-green-800";
            case "Listed":
                return "bg-green-600 text-white";
            case "Reserved":
                return "bg-purple-100 text-purple-800";
            case "Sold":
                return "bg-slate-100 text-slate-800";
            case "Defect/Problem":
                return "bg-red-100 text-red-800";
            case "Standby":
                return "bg-amber-100 text-amber-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getBatchGroup = (watchId: string) => {
        // Simple logic to assign batch groups based on watch ID
        const batchNumber = (parseInt(watchId) % 4) + 1;
        return `B00${batchNumber}`;
    };

    const getLocalCurrency = (
        original_cost: number | undefined,
        location: string,
    ) => {
        if (!original_cost) return "-";

        if (location === "Vietnam") {
            // Convert EUR to VND (approximate rate: 1 EUR = 26,000 VND)
            const vndAmount = original_cost * 26000;
            return `₫${vndAmount.toLocaleString()}`;
        } else if (location === "Japan") {
            // Convert EUR to JPY (approximate rate: 1 EUR = 160 JPY)
            const jpyAmount = original_cost * 160;
            return `¥${jpyAmount.toLocaleString()}`;
        }
        return "EUR";
    };

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
                                <th className="w-16 p-2 text-xs font-medium text-slate-700">
                                    Image
                                </th>
                                <th
                                    className="w-48 cursor-pointer p-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                    onClick={() => onSort("name")}
                                >
                                    Name {getSortIcon("name")}
                                </th>
                                <th
                                    className="w-24 cursor-pointer p-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                    onClick={() => onSort("sku")}
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
                                    onClick={() => onSort("original_cost")}
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
                                    onClick={() => onSort("status")}
                                >
                                    Status {getSortIcon("status")}
                                </th>
                                <th
                                    className="w-24 cursor-pointer p-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                    onClick={() => onSort("location")}
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
                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(watch.status)}`}
                                        >
                                            {watch.status}
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
