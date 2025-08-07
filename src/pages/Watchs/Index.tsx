import BatchSelector from "@/components/BatchSelector";
import BrandSelector from "@/components/BrandSelector";
import Layout from "@/components/Layout";
import LocationSelector from "@/components/LocationSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import LaravelPaginate from "@/components/ui/table/LaravelPaginate";
import WatchCard from "@/components/WatchCard";
import WatchForm from "@/components/WatchForm";
import WatchListView from "@/components/WatchListView";
import { useSearchParams } from "@/hooks/useSearchParams";
import { PaginateData } from "@/types/laravel";
import { Status, Watch as Twatch } from "@/types/watch";
import { Head, usePage } from "@inertiajs/react";
import { Edit, Grid, List, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Watch = Twatch & {
    brand: string, status: Status['name'], location: string,
    images: ({ id: string, url: string, useForAI: boolean })[]
}

const WatchManagement = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const pageProps = usePage().props;

    // If pageProps.watches is null or undefined, watche_response is null
    const watche_response = (pageProps.watches as PaginateData<Watch> | null) ?? null;

    const [watches, setWatches] = useState<Watch[]>(watche_response.data || []);

    const [showForm, setShowForm] = useState(false);
    const [editingWatch, setEditingWatch] = useState<Watch | undefined>();
    const [statusFilters, setStatusFilters] = useState<string[]>(["All"]);
    const [brandFilter, setBrandFilter] = useState<string>("All");
    const [batchFilter, setBatchFilter] = useState<string>("All");
    const [locationFilter, setLocationFilter] = useState<string>("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [currentPage, setCurrentPage] = useState(1);
    const [showBrandEditor, setShowBrandEditor] = useState(false);
    const [sortField, setSortField] = useState<string>("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [selectedWatches, setSelectedWatches] = useState<string[]>([]);

    const itemsPerPage = 50;

    const getBatchGroup = (watchId: string) => {
        // Simple logic to assign batch groups based on watch ID
        const batchNumber = (parseInt(watchId) % 4) + 1;
        return `B00${batchNumber}`;
    };

    const getNavigationInfo = () => {
        if (!editingWatch) return { hasNext: false, hasPrevious: false };

        const currentIndex = filteredAndSortedWatches.findIndex(
            (w) => w.id === editingWatch.id,
        );
        return {
            hasNext: currentIndex < filteredAndSortedWatches.length - 1,
            hasPrevious: currentIndex > 0,
        };
    };

    const handleAddWatch = () => {
        setEditingWatch(undefined);
        setShowForm(true);
    };

    const handleEditWatch = (watch: Watch) => {
        setEditingWatch(watch);
        setShowForm(true);
        // Update URL with SKU parameter for easy sharing
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("sku", watch.sku);
        setSearchParams(newSearchParams, { replace: true });
    };

    const handleSaveWatch = (watchData: Omit<Watch, "id">) => {
        if (editingWatch) {
            setWatches(
                watches.map((w) =>
                    w.id === editingWatch.id
                        ? { ...watchData, id: editingWatch.id }
                        : w,
                ),
            );
        } else {
            const newWatch: Watch = {
                ...watchData,
                id: Date.now().toString(),
            };
            setWatches([...watches, newWatch]);
        }
        setShowForm(false);
        setEditingWatch(undefined);
        // Clean up URL when closing form
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("sku");
        setSearchParams(newSearchParams, { replace: true });
    };

    const handleDeleteWatch = (id: string) => {
        if (window.confirm("Are you sure you want to delete this watch?")) {
            setWatches(watches.filter((w) => w.id !== id));
        }
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handleSelectWatch = (watchId: string, checked: boolean) => {
        if (checked) {
            setSelectedWatches([...selectedWatches, watchId]);
        } else {
            setSelectedWatches(selectedWatches.filter((id) => id !== watchId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedWatches(filteredAndSortedWatches.map((w) => w.id));
        } else {
            setSelectedWatches([]);
        }
    };

    const handleBulkStatusChange = (newStatus: string) => {
        setWatches((prev) =>
            prev.map((watch) =>
                selectedWatches.includes(watch.id)
                    ? { ...watch, status: newStatus as Watch["status"] }
                    : watch,
            ),
        );
        setSelectedWatches([]);
    };

    const handleBulkLocationChange = (newLocation: string) => {
        setWatches((prev) =>
            prev.map((watch) =>
                selectedWatches.includes(watch.id)
                    ? { ...watch, location: newLocation }
                    : watch,
            ),
        );
        setSelectedWatches([]);
    };

    const handleBulkBatchChange = (batchGroup: string) => {
        setWatches((prev) =>
            prev.map((watch) =>
                selectedWatches.includes(watch.id)
                    ? { ...watch, batchGroup }
                    : watch,
            ),
        );
        setSelectedWatches([]);
    };

    const handleStatusToggle = (status: string) => {
        if (status === "All") {
            setStatusFilters(["All"]);
        } else {
            setStatusFilters((prev) => {
                // Remove 'All' if it's selected and we're selecting another status
                const newFilters = prev.filter((s) => s !== "All");

                if (newFilters.includes(status)) {
                    // Remove the status if it's already selected
                    const filtered = newFilters.filter((s) => s !== status);
                    return filtered.length === 0 ? ["All"] : filtered;
                } else {
                    // Add the status
                    return [...newFilters, status];
                }
            });
        }
        setCurrentPage(1);
    };

    const filteredAndSortedWatches = useMemo(() => {
        let filtered = watches.filter((watch) => {
            const matchesStatus =
                statusFilters.includes("All") ||
                statusFilters.includes(watch.status);
            const matchesBrand =
                brandFilter === "All" || watch.brand === brandFilter;
            const matchesBatch =
                batchFilter === "All" ||
                getBatchGroup(watch.id) === batchFilter;
            const matchesLocation =
                locationFilter === "All" || watch.location === locationFilter;
            const matchesSearch =
                watch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                watch.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                watch.sku.toLowerCase().includes(searchTerm.toLowerCase());
            return (
                matchesStatus &&
                matchesBrand &&
                matchesBatch &&
                matchesLocation &&
                matchesSearch
            );
        });

        if (sortField) {
            filtered = [...filtered].sort((a, b) => {
                let aValue = a[sortField as keyof Watch];
                let bValue = b[sortField as keyof Watch];

                if (typeof aValue === "string") {
                    aValue = aValue.toLowerCase();
                }
                if (typeof bValue === "string") {
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
                if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [
        watches,
        statusFilters,
        brandFilter,
        batchFilter,
        locationFilter,
        searchTerm,
        sortField,
        sortDirection,
    ]);

    const paginatedWatches = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedWatches.slice(
            startIndex,
            startIndex + itemsPerPage,
        );
    }, [filteredAndSortedWatches, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(
        filteredAndSortedWatches.length / itemsPerPage,
    );

    // Fix: Filter out empty strings when creating unique brands, batches, and locations
    const uniqueBrands = [
        "All",
        ...Array.from(
            new Set(
                watches
                    .map((w) => w.brand)
                    .filter((brand) => brand && brand.trim() !== ""),
            ),
        ),
    ];
    const uniqueBatches = [
        "All",
        ...Array.from(new Set(watches.map((w) => getBatchGroup(w.id)))),
    ];
    const uniqueLocations = [
        "All",
        ...Array.from(
            new Set(
                watches
                    .map((w) => w.location)
                    .filter((location) => location && location.trim() !== ""),
            ),
        ),
    ];

    const statusCounts = {
        All: pageProps?.watch_count_total || 0,
        Draft: pageProps?.watch_count_draft || 0,
        Review: pageProps?.watch_count_review || 0,
        Approved: pageProps?.watch_count_approved || 0,
        "Platform Review": pageProps?.watch_count_platform || 0,
        "Ready for listing": pageProps?.watch_count_listing || 0,
        Listed: pageProps?.watch_count_listed || 0,
        Reserved: pageProps?.watch_count_reserved || 0,
        Sold: pageProps?.watch_count_sold || 0,
        "Defect/Problem": pageProps?.watch_count_problem || 0,
        Standby: pageProps?.watch_count_standby || 0,
    };

    const handleEditBrands = () => {
        alert(
            "Brand editing feature would be implemented here. This would open a modal to add, edit, or remove brands from the list.",
        );
    };

    const handleEditBatches = () => {
        alert(
            "Batch editing feature would be implemented here. This would open a modal to add, edit, or remove batch groups from the list.",
        );
    };

    const handleEditLocations = () => {
        alert(
            "Location editing feature would be implemented here. This would open a modal to add, edit, or remove locations from the list.",
        );
    };

    const statuses = [
        "Draft",
        "Review",
        "Approved",
        "Platform Review",
        "Ready for listing",
        "Listed",
        "Reserved",
        "Sold",
        "Defect/Problem",
        "Standby",
    ];
    const locations = ["Denmark", "Vietnam", "Japan", "In Transit"];
    const batchGroups = ["B001", "B002", "B003", "B004"];

    const handleNextWatch = () => {
        if (editingWatch) {
            const currentIndex = filteredAndSortedWatches.findIndex(
                (w) => w.id === editingWatch.id,
            );
            if (currentIndex < filteredAndSortedWatches.length - 1) {
                const nextWatch = filteredAndSortedWatches[currentIndex + 1];
                setEditingWatch(nextWatch);
                // Update URL with new SKU
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.set("sku", nextWatch.sku);
                setSearchParams(newSearchParams, { replace: true });
            }
        }
    };

    const handlePreviousWatch = () => {
        if (editingWatch) {
            const currentIndex = filteredAndSortedWatches.findIndex(
                (w) => w.id === editingWatch.id,
            );
            if (currentIndex > 0) {
                const previousWatch =
                    filteredAndSortedWatches[currentIndex - 1];
                setEditingWatch(previousWatch);
                // Update URL with new SKU
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.set("sku", previousWatch.sku);
                setSearchParams(newSearchParams, { replace: true });
            }
        }
    };

    // Handle SKU query parameter
    useEffect(() => {
        const skuParam = searchParams.get("sku");
        if (skuParam && !showForm) {
            const watchToEdit = watches.find((watch) => watch.sku === skuParam);
            if (watchToEdit) {
                setEditingWatch(watchToEdit);
                setShowForm(true);
            }
        }
    }, [searchParams, watches, showForm]);

    return (
        <Layout>
            <Head title="Watch Management" />
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Watch Management
                            </h1>
                            <p className="mt-1 text-slate-600">
                                Manage your watch inventory and track status
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex h-[42px] rounded-lg border border-slate-300">
                                <Button
                                    variant={
                                        viewMode === "grid"
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                    className="h-full rounded-r-none"
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={
                                        viewMode === "list"
                                            ? "default"
                                            : "ghost"
                                    }
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                    className="h-full rounded-l-none"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button
                                onClick={handleAddWatch}
                                className="flex items-center gap-2"
                            >
                                <span className="text-lg">+</span>
                                Add New Watch
                            </Button>
                        </div>
                    </div>

                    {/* Multi-select Status Filter */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(statusCounts).map(
                                ([status, count]) => (
                                    <button
                                        key={status}
                                        onClick={() =>
                                            handleStatusToggle(status)
                                        }
                                        className={`h-16 w-[100px] rounded-lg border p-2 text-center transition-all ${statusFilters.includes(status)
                                            ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                    >
                                        <div className="text-lg font-bold text-slate-900">
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {count as any}
                                        </div>
                                        <div className="truncate text-xs leading-tight text-slate-600">
                                            {status}
                                        </div>
                                    </button>
                                ),
                            )}
                        </div>

                        {/* Clear status filters button */}
                        {statusFilters.length > 1 ||
                            (statusFilters.length === 1 &&
                                !statusFilters.includes("All")) ? (
                            <div className="mt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setStatusFilters(["All"])}
                                    className="border-slate-300 text-slate-600 hover:bg-slate-100"
                                >
                                    <X className="mr-1 h-3 w-3" />
                                    Clear Status Filters
                                </Button>
                            </div>
                        ) : null}
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row">
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Search watches by name, brand, or SKU..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                                    Brand:
                                </span>
                                <BrandSelector
                                    value={brandFilter}
                                    onValueChange={(value) => {
                                        setBrandFilter(value);
                                        setCurrentPage(1);
                                    }}
                                    brands={uniqueBrands}
                                    onEditBrands={handleEditBrands}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                                    Batch:
                                </span>
                                <BatchSelector
                                    value={batchFilter}
                                    onValueChange={(value) => {
                                        setBatchFilter(value);
                                        setCurrentPage(1);
                                    }}
                                    batches={uniqueBatches}
                                    onEditBatches={handleEditBatches}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                                    Location:
                                </span>
                                <LocationSelector
                                    value={locationFilter}
                                    onValueChange={(value) => {
                                        setLocationFilter(value);
                                        setCurrentPage(1);
                                    }}
                                    locations={uniqueLocations}
                                    onEditLocations={handleEditLocations}
                                />
                            </div>
                        </div>
                    </div>

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
                                <Select onValueChange={handleBulkStatusChange}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((status) => (
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
                                    onValueChange={handleBulkLocationChange}
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
                                <Select onValueChange={handleBulkBatchChange}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change Batch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {batchGroups.map((batch) => (
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

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedWatches([])}
                                className="border-blue-300 text-blue-600 hover:bg-blue-100"
                            >
                                Clear Selection
                            </Button>
                        </div>
                    )}

                    {/* Results info and pagination controls */}
                    <LaravelPaginate meta={watche_response.meta} />
                </div>

                {/* Content */}
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {paginatedWatches.map((watch) => (
                            <WatchCard
                                key={watch.id}
                                watch={watch}
                                onEdit={handleEditWatch}
                                onDelete={handleDeleteWatch}
                            />
                        ))}
                    </div>
                ) : (
                    <WatchListView
                        watches={paginatedWatches}
                        onEdit={handleEditWatch}
                        onDelete={handleDeleteWatch}
                        onSort={handleSort}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        selectedWatches={selectedWatches}
                        onSelectWatch={handleSelectWatch}
                        onSelectAll={handleSelectAll}
                    />
                )}

                {filteredAndSortedWatches.length === 0 && (
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


                {/* Form Modal */}
                {showForm && (
                    <WatchForm
                        watch={editingWatch}
                        onSave={handleSaveWatch}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingWatch(undefined);
                            // Clean up URL when canceling
                            const newSearchParams = new URLSearchParams(
                                searchParams,
                            );
                            newSearchParams.delete("sku");
                            setSearchParams(newSearchParams, { replace: true });
                        }}
                        onNext={
                            getNavigationInfo().hasNext
                                ? handleNextWatch
                                : undefined
                        }
                        onPrevious={
                            getNavigationInfo().hasPrevious
                                ? handlePreviousWatch
                                : undefined
                        }
                        hasNext={getNavigationInfo().hasNext}
                        hasPrevious={getNavigationInfo().hasPrevious}
                    />
                )}
            </div>
        </Layout>
    );
};

export default WatchManagement;
