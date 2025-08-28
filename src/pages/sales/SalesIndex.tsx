import { CurrencyAttributes } from "@/app/models/Currency";
import Status from "@/app/models/Status";
import Layout from "@/components/Layout";
import PlatformDataModal from "@/components/PlatformDataModal";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PaginateData } from "@/types/laravel";
import { WatchResource } from "@/types/resources/watch";
import { Head } from "@inertiajs/react";
import {
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Edit,
    Eye,
    FileText,
    MapPin,
    Package
} from "lucide-react";
import React, { useState } from "react";
import { platforms, watchPlatformsItems } from "./_constraints";
import SaleExports from "./components/SaleExports";
import SaleQuickSelectionActions from "./components/SaleQuickSelectionActions";
import { SaleSearchFilter } from "./components/SaleSearchFilter";

type SortField =
    | "name"
    | "sku"
    | "brand"
    | "acquisitionCost"
    | "batchGroup"
    | "status"
    | "location";
type SortDirection = "asc" | "desc";

type Props = {
    batches: string[];
    brands: string[];
    statuses: string[];
    locations: string[];
    currencies: CurrencyAttributes[];
    watches: PaginateData<WatchResource>
};

const MultiplatformSales = (props: Props) => {

    //server props
    const { locations = [], batches = [], brands = [], currencies = [] } = props || {};
    const { data: watches = [], meta } = props.watches || {};

    const [selectedWatches, setSelectedWatches] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("Approved & Platform Review");
    const [brandFilter, setBrandFilter] = useState<string>("All");
    const [platformFilter, setPlatformFilter] = useState<string>("All");
    const [batchFilter, setBatchFilter] = useState<string>("All");
    const [batchSearchTerm, setBatchSearchTerm] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [watchPlatforms, setWatchPlatforms] = useState(watchPlatformsItems);

    // New state for tracking processing status
    const [processingWatches, setProcessingWatches] = useState<Set<string>>(new Set());

    const [platformDataModal, setPlatformDataModal] = useState<{
        isOpen: boolean;
        watch: WatchResource | null;
        platform: string;
    }>({
        isOpen: false,
        watch: null,
        platform: "",
    });

    const [singleViewModal, setSingleViewModal] = useState<{
        isOpen: boolean;
        watch: WatchResource | null;
        selectedImageIndex: number;
    }>({
        isOpen: false,
        watch: null,
        selectedImageIndex: 0,
    });

    const handleSelectWatch = (watchId: string, checked: boolean) => {
        if (checked) {
            setSelectedWatches([...selectedWatches, watchId]);
        } else {
            setSelectedWatches(selectedWatches.filter((id) => id !== watchId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedWatches(watches.map((w) => String(w.id)));
        } else {
            setSelectedWatches([]);
        }
    };

    const handleSelectByStatus = (status: string) => {
        const watchesByStatus = watches.filter(
            (w) => w.status === status,
        );
        const statusWatchIds = watchesByStatus.map((w) => String(w.id));
        setSelectedWatches([
            ...new Set([...selectedWatches, ...statusWatchIds]),
        ]);
    };

    const handlePlatformChange = (watchId: string, platform: string) => {
        // Add the watch to processing state
        setProcessingWatches((prev) => new Set([...prev, watchId]));

        // Update the platform immediately
        setWatchPlatforms((prev) => ({
            ...prev,
            [watchId]: platform,
        }));

        // Remove from processing state after 3 seconds
        setTimeout(() => {
            setProcessingWatches((prev) => {
                const newSet = new Set(prev);
                newSet.delete(watchId);
                return newSet;
            });
        }, 3000);
    };


    const handleBulkPlatformChange = (newPlatform: string) => {
        const updates: Record<string, string> = {};
        selectedWatches.forEach((watchId) => {
            updates[watchId] = newPlatform;
            // Add each watch to processing state
            setProcessingWatches((prev) => new Set([...prev, watchId]));
        });
        setWatchPlatforms((prev) => ({
            ...prev,
            ...updates,
        }));

        // Remove all from processing state after 3 seconds
        setTimeout(() => {
            setProcessingWatches((prev) => {
                const newSet = new Set(prev);
                selectedWatches.forEach((watchId) => newSet.delete(watchId));
                return newSet;
            });
        }, 3000);
    };

    const handleViewPlatformData = (watch: WatchResource, platform: string) => {
        setPlatformDataModal({
            isOpen: true,
            watch,
            platform,
        });
    };

    const closePlatformDataModal = () => {
        setPlatformDataModal({
            isOpen: false,
            watch: null,
            platform: "",
        });
    };

    // Navigation functions for modal
    const handleModalNext = () => {
        if (!platformDataModal.watch) return;

        const currentIndex = watches.findIndex(
            (w) => w.id === platformDataModal.watch!.id,
        );
        const nextIndex = (currentIndex + 1) % watches.length;
        const nextWatch = watches[nextIndex];
        const nextPlatform = watchPlatforms[nextWatch.id] || "None";

        if (nextPlatform !== "None") {
            setPlatformDataModal({
                isOpen: true,
                watch: nextWatch,
                platform: nextPlatform,
            });
        }
    };

    const handleModalPrevious = () => {
        if (!platformDataModal.watch) return;

        const currentIndex = watches.findIndex(
            (w) => w.id === platformDataModal.watch!.id,
        );
        const prevIndex =
            currentIndex === 0 ? watches.length - 1 : currentIndex - 1;
        const prevWatch = watches[prevIndex];
        const prevPlatform = watchPlatforms[prevWatch.id] || "None";

        if (prevPlatform !== "None") {
            setPlatformDataModal({
                isOpen: true,
                watch: prevWatch,
                platform: prevPlatform,
            });
        }
    };

    const handleOpenSingleView = (watch: WatchResource) => {
        setSingleViewModal({
            isOpen: true,
            watch,
            selectedImageIndex: 0,
        });
    };

    const closeSingleViewModal = () => {
        setSingleViewModal({
            isOpen: false,
            watch: null,
            selectedImageIndex: 0,
        });
    };

    const handleThumbnailClick = (index: number) => {
        setSingleViewModal((prev) => ({
            ...prev,
            selectedImageIndex: index,
        }));
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const SortableHeader = ({
        field,
        children,
    }: {
        field: SortField;
        children: React.ReactNode;
    }) => (
        <th
            className="cursor-pointer select-none p-3 text-xs font-medium text-slate-700 hover:bg-slate-100"
            onClick={() => handleSort(field)}
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
        <Layout>
            <Head title="Multi-platform Sales" />
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Multi-platform Sales
                            </h1>
                            <p className="mt-1 text-slate-600">
                                Select and export watches for different sales
                                platforms
                            </p>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <SaleSearchFilter brands={brands} batches={batches} watchPlatforms={watchPlatforms} />

                    {/* Quick Selection Actions */}
                    <SaleQuickSelectionActions
                        handleSelectAll={handleSelectAll}
                        handleSelectByStatus={handleSelectByStatus}
                        watcheLength={watches.length}
                    />

                    {/* Bulk Actions */}
                    {selectedWatches.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-center gap-2">
                                <Edit className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">
                                    {selectedWatches.length} watches selected -
                                    Bulk Actions:
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-700">
                                    Status:
                                </span>
                                <Select onValueChange={() => alert('handleBulkStatusChange')}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Status.allStatuses().map((status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-700">
                                    Location:
                                </span>
                                <Select
                                    onValueChange={() => alert('handleBulkLocationChange')}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change Location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map((location) => (
                                            <SelectItem
                                                key={location}
                                                value={location}
                                            >
                                                {location}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-700">
                                    Batch Group:
                                </span>
                                <Select
                                    onValueChange={() => alert('handleBulkBatchGroupChange')}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change Batch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {batches
                                            .filter((b) => b !== "All")
                                            .map((batch) => (
                                                <SelectItem
                                                    key={batch}
                                                    value={batch}
                                                >
                                                    {batch}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-700">
                                    Platform:
                                </span>
                                <Select
                                    onValueChange={handleBulkPlatformChange}
                                >
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Change Platform" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {platforms.map((platform) => (
                                            <SelectItem
                                                key={platform}
                                                value={platform}
                                                className={
                                                    isGreyedOutPlatform(
                                                        platform,
                                                    )
                                                        ? "text-gray-400"
                                                        : ""
                                                }
                                            >
                                                {platform}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Export Actions */}
                    <SaleExports
                        selectedWatches={selectedWatches}
                        watchPlatforms={watchPlatforms}
                        watches={watches}
                    />
                </div>

                {/* Watch Table */}
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr className="text-left">
                                    <th className="w-8 p-3 text-xs font-medium text-slate-700">
                                        <Checkbox
                                            checked={
                                                selectedWatches.length ===
                                                watches.length &&
                                                watches.length > 0
                                            }
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="w-16 p-3 text-xs font-medium text-slate-700">
                                        Image
                                    </th>
                                    <SortableHeader field="name">
                                        Name
                                    </SortableHeader>
                                    <SortableHeader field="sku">
                                        SKU
                                    </SortableHeader>
                                    <SortableHeader field="brand">
                                        Brand
                                    </SortableHeader>
                                    <SortableHeader field="acquisitionCost">
                                        Cost
                                    </SortableHeader>
                                    <SortableHeader field="batchGroup">
                                        Batch Group
                                    </SortableHeader>
                                    <SortableHeader field="status">
                                        Status
                                    </SortableHeader>
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
                                        className={`hover:bg-slate-50 ${selectedWatches.includes(String(watch.id)) ? "bg-amber-50" : ""}`}
                                    >
                                        <td className="p-3">
                                            <Checkbox
                                                checked={selectedWatches.includes(
                                                    String(watch.id),
                                                )}
                                                onCheckedChange={(checked) =>
                                                    handleSelectWatch(
                                                        String(watch.id),
                                                        checked as boolean,
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="p-3">
                                            <div
                                                className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-slate-100 hover:opacity-80"
                                                onClick={() =>
                                                    handleOpenSingleView(watch)
                                                }
                                            >
                                                {watch.images?.[0] ? (
                                                    <img
                                                        src={
                                                            watch.images[0].url
                                                        }
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
                                                onClick={() =>
                                                    handleOpenSingleView(watch)
                                                }
                                            >
                                                {watch.name}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div
                                                className="cursor-pointer text-sm text-slate-600 transition-colors hover:text-blue-600"
                                                onClick={() =>
                                                    handleOpenSingleView(watch)
                                                }
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
                                                €
                                                {watch.original_cost?.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <div className="text-sm text-slate-600">
                                                {watch.batch}
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${Status.toColorClass(watch.status)}`}
                                            >
                                                {watch.status}
                                            </span>
                                        </td>
                                        <td className="p-2">
                                            <Select
                                                value={
                                                    watchPlatforms[watch.id] ||
                                                    "None"
                                                }
                                                onValueChange={(value) =>
                                                    handlePlatformChange(
                                                        String(watch.id),
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-48">
                                                    <SelectValue placeholder="Platform" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {platforms.map(
                                                        (platform) => (
                                                            <SelectItem
                                                                key={platform}
                                                                value={platform}
                                                                className={
                                                                    isGreyedOutPlatform(
                                                                        platform,
                                                                    )
                                                                        ? "text-gray-400"
                                                                        : ""
                                                                }
                                                            >
                                                                {platform}
                                                            </SelectItem>
                                                        ),
                                                    )}
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
                                                                Platform Data
                                                                Error
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                There was an
                                                                error processing
                                                                the platform
                                                                data for this
                                                                watch. Please
                                                                check the
                                                                platform
                                                                configuration
                                                                and try again,
                                                                or contact
                                                                support if the
                                                                issue persists.
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
                                                watchPlatforms[watch.id] !==
                                                "None" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleViewPlatformData(
                                                                watch,
                                                                watchPlatforms[
                                                                watch.id
                                                                ],
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

                {watches.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="mb-4 text-6xl">⌚</div>
                        <h3 className="mb-2 text-xl font-medium text-slate-900">
                            No watches found
                        </h3>
                        <p className="text-slate-600">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}

                {/* Platform Data Modal with Navigation */}
                <PlatformDataModal
                    watch={platformDataModal.watch}
                    platform={platformDataModal.platform}
                    isOpen={platformDataModal.isOpen}
                    onClose={closePlatformDataModal}
                    onNext={handleModalNext}
                    onPrevious={handleModalPrevious}
                />

                {/* Single View Modal - BIGGER with MORE IMAGES */}
                <Dialog
                    open={singleViewModal.isOpen}
                    onOpenChange={closeSingleViewModal}
                >
                    <DialogContent className="max-h-[95vh] max-w-7xl overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <DialogTitle className="text-3xl font-bold text-slate-900">
                                        {singleViewModal.watch?.name}
                                    </DialogTitle>
                                    <div className="mt-2 flex items-center gap-4">
                                        <span className="text-lg text-slate-600">
                                            SKU: {singleViewModal.watch?.sku}
                                        </span>
                                        <Badge
                                            className={`px-3 py-1 text-sm ${singleViewModal.watch ? Status.toColorClass(singleViewModal.watch.status) : ""}`}
                                        >
                                            {singleViewModal.watch?.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>

                        {singleViewModal.watch && (
                            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                                {/* Images Section */}
                                <div>
                                    {/* Main Image - Larger */}
                                    <div className="mb-6 aspect-square overflow-hidden rounded-lg bg-slate-100">
                                        <img
                                            src={
                                                singleViewModal.watch.images?.[
                                                    singleViewModal
                                                        .selectedImageIndex
                                                ]?.url || "/placeholder.svg"
                                            }
                                            alt={singleViewModal.watch.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Thumbnail Images Grid - Show more images */}
                                    {singleViewModal.watch.images &&
                                        singleViewModal.watch.images.length >
                                        1 && (
                                            <div className="grid grid-cols-6 gap-3">
                                                {singleViewModal.watch.images.map(
                                                    (image, index) => (
                                                        <div
                                                            key={image.id}
                                                            className={`aspect-square cursor-pointer overflow-hidden rounded-lg bg-slate-100 transition-all duration-200 hover:opacity-80 ${index ===
                                                                singleViewModal.selectedImageIndex
                                                                ? "ring-3 ring-blue-500 ring-offset-2"
                                                                : "hover:ring-2 hover:ring-slate-300"
                                                                }`}
                                                            onClick={() =>
                                                                handleThumbnailClick(
                                                                    index,
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={image.url}
                                                                alt={`${singleViewModal.watch.name} ${index + 1}`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}

                                    {/* Image Counter */}
                                    {singleViewModal.watch.images &&
                                        singleViewModal.watch.images.length >
                                        1 && (
                                            <div className="mt-4 text-center text-sm text-slate-600">
                                                Image{" "}
                                                {singleViewModal.selectedImageIndex +
                                                    1}{" "}
                                                of{" "}
                                                {
                                                    singleViewModal.watch.images
                                                        .length
                                                }
                                            </div>
                                        )}
                                </div>

                                {/* Details Section */}
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="mb-4 text-xl font-semibold text-slate-900">
                                            Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Package className="h-5 w-5 text-slate-400" />
                                                <span className="text-slate-600">
                                                    Brand:
                                                </span>
                                                <span className="text-lg font-medium">
                                                    {
                                                        singleViewModal.watch
                                                            .brand
                                                    }
                                                </span>
                                            </div>
                                            {singleViewModal.watch
                                                .current_cost && (
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-slate-600">
                                                            Acquisition Cost:
                                                        </span>
                                                        <span className="text-lg font-medium">
                                                            €
                                                            {singleViewModal.watch.current_cost.toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-5 w-5 text-slate-400" />
                                                <span className="text-slate-600">
                                                    Location:
                                                </span>
                                                <span className="text-lg font-medium">
                                                    {
                                                        singleViewModal.watch
                                                            .location
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {singleViewModal.watch.description && (
                                        <div>
                                            <div className="mb-4 flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-slate-400" />
                                                <h3 className="text-xl font-semibold text-slate-900">
                                                    Description
                                                </h3>
                                            </div>
                                            <p className="text-base leading-relaxed text-slate-700">
                                                {
                                                    singleViewModal.watch
                                                        .description
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {singleViewModal.watch.original_cost && (
                                        <div>
                                            <h3 className="mb-4 text-xl font-semibold text-slate-900">
                                                AI Instructions
                                            </h3>
                                            <p className="rounded-lg bg-slate-50 p-4 text-base leading-relaxed text-slate-700">
                                                {
                                                    singleViewModal.watch
                                                        .original_cost
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </Layout>
    );
};

export default MultiplatformSales;
