import { Checkbox } from "@/components/ui/checkbox";
import { debouncedNavigate } from "@/pages/watches/_searchActions";
import { WatchResource } from "@/types/resources/watch";
import { ChevronDown, ChevronUp } from "lucide-react";
import qs from 'qs';
import { useState } from "react";
import ImageViewer from "./ImageViewer";
import WatchItem from "./WatchItem";

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
                            {watches.map((watch, index) => (
                                <WatchItem
                                    key={index}
                                    watch={watch}
                                    handleImageClick={handleImageClick}
                                    onSelectWatch={onSelectWatch}
                                    selectedWatches={selectedWatches}
                                    onDelete={onDelete} />
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
