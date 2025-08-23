import { CurrencyAttributes } from "@/app/models/Currency";
import Status from "@/app/models/Status";
import { uniqueArray } from "@/app/utils";
import BatchSelector from "@/components/BatchSelector";
import BrandSelector from "@/components/BrandSelector";
import Layout from "@/components/Layout";
import LocationSelector from "@/components/LocationSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "@/components/ui/Link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import TablePaginate from "@/components/ui/table/TablePaginate";
import WatchCard from "@/components/WatchCard";
import WatchListView from "@/components/WatchListView";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PaginateData } from "@/types/laravel";
import { WatchResource } from "@/types/resources/watch";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Edit, Grid, List, X } from "lucide-react";
import { useState } from "react";
import { onBulkAction } from "./_actions";
import {
    getSearchStatus,
    getSelectSearch,
    getSelectStatus,
    handleSerchSort,
    watcheSearch,
} from "./_searchActions";
import { handleEditBatches, handleEditBrands, handleEditLocations } from "./actions";

type StatusKey = (typeof Status.statuses)[number];
type WatchCount = Record<StatusKey, number>;

type Props = {
    batches: string[];
    brands: string[];
    statuses: string[];
    locations: string[];
    currencies: CurrencyAttributes[];
};

const WatchManagement = (props: Props) => {
    //server props
    const { locations = [], batches = [], brands = [], currencies = [] } = props || {};

    //complete state and consts list
    const [viewMode, setViewMode] = useLocalStorage<"list" | "grid">("watch_view_mode", "list");

    const page = usePage();
    const { data: watches = [], meta } = page.props.watches as PaginateData<WatchResource>;
    const watch_count: Partial<WatchCount> = page.props.watch_count || {};
    const [selectedWatches, setSelectedWatches] = useState<string[]>([]);

    const {
        data,
        setData,
        delete: destroy,
    } = useForm({
        column: "",
        search: "",
        status: ["all"],
        brand: "All",
        batch: "All",
        location: "All",
        direction: "asc",
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

    /**
     * =======================================
     * Server actions
     * ========================================
     */

    //handle server delete actions
    const handleDelete = (routeKey: string | number) => {
        const confirmed = window.confirm("Are you sure you want to delete the Watch?");
        if (routeKey && confirmed) {
            destroy(route("watches.destroy", routeKey), {
                preserveScroll: true,
                onSuccess(response) { },
            });
        }
    };

    //Handle sort state
    const handleSort = (field: string) => {
        const params = new URLSearchParams();

        const direction = data.direction === "asc" ? "desc" : "asc";

        setData("direction", direction);
        setData("column", field);

        const columns = uniqueArray([field, field], true);

        handleSerchSort(columns, direction);
    };

    return (
        <Layout>
            <Head title="Watch Management" />
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Watch Management</h1>
                            <p className="mt-1 text-slate-600">
                                Manage your watch inventory and track status
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex h-[42px] rounded-lg border border-slate-300">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                    className="h-full rounded-r-none"
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                    className="h-full rounded-l-none"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                            <Link
                                href={route("watches.create")}
                                className="flex items-center gap-2"
                            >
                                <span className="text-lg">+</span>
                                Add New Watch
                            </Link>
                        </div>
                    </div>

                    {/* Multi-select Status Filter */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            {["all", ...Status.allStatuses()].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        if (status == "all") {
                                            setData("status", ["all"]);
                                            watcheSearch("status", getSearchStatus(["all"]));
                                            return;
                                        }
                                        setData(
                                            "status",
                                            getSelectStatus([...data.status, status]),
                                        );
                                        watcheSearch(
                                            "status",
                                            getSearchStatus([...data.status, status]),
                                        );
                                    }}
                                    className={`h-16 w-[100px] rounded-lg border p-2 text-center transition-all ${data.status.includes(status)
                                        ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                        }`}
                                >
                                    <div className="text-lg font-bold text-slate-900">
                                        {watch_count[status] || 0}
                                    </div>
                                    <div className="truncate text-xs leading-tight text-slate-600">
                                        {Status.toHuman(status)}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Clear status filters button */}
                        {data.status.length > 1 ||
                            (data.status.length === 1 && !data.status.includes("All")) ? (
                            <div className="mt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setData("status", ["All"]);
                                        watcheSearch("status", null);
                                    }}
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
                                value={data.search}
                                onChange={(e) => {
                                    watcheSearch("search", e.target.value);
                                    setData("search", e.target.value);
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
                                    value={data.brand}
                                    onValueChange={(value) => {
                                        setData("brand", value);
                                        watcheSearch("brand", getSelectSearch(value));
                                    }}
                                    brands={["All", ...brands]}
                                    onEditBrands={handleEditBrands}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                                    Batch:
                                </span>
                                <BatchSelector
                                    value={data.batch}
                                    onValueChange={(value) => {
                                        setData("batch", value);
                                        watcheSearch("batch", getSelectSearch(value));
                                    }}
                                    batches={["All", ...batches]}
                                    onEditBatches={handleEditBatches}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="whitespace-nowrap text-sm font-medium text-slate-700">
                                    Location:
                                </span>
                                <LocationSelector
                                    value={data.location}
                                    onValueChange={(value) => {
                                        setData("location", value);
                                        watcheSearch("location", getSelectSearch(value));
                                    }}
                                    locations={["All", ...locations]}
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
                                    {selectedWatches.length} watches selected - Bulk Actions:
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-700">Status:</span>
                                <Select
                                    onValueChange={(value) => {
                                        onBulkAction("status", value, selectedWatches);
                                    }}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Status.allStatuses().map((status, index) => (
                                            <SelectItem key={index} value={status}>
                                                {Status.toHuman(status)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-700">Location:</span>
                                <Select
                                    onValueChange={(value) =>
                                        onBulkAction("location", value, selectedWatches)
                                    }
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change Location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locations.map((location, index) => (
                                            <SelectItem key={index} value={location}>
                                                {location}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-blue-700">Batch Group:</span>
                                <Select
                                    onValueChange={(value) =>
                                        onBulkAction("batch", value, selectedWatches)
                                    }
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Change Batch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {batches.map((batch, index) => (
                                            <SelectItem key={index} value={batch}>
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
                    <div className="mb-4 flex items-center justify-between">
                        <div className="w-full text-sm text-slate-600">
                            Showing {meta.from ?? 0}-{meta.to ?? 0} of {meta.total} watches
                        </div>
                        <TablePaginate links={meta.links} className="block w-full" />
                    </div>
                </div>

                {/* Content */}
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {watches.map((watch) => (
                            <WatchCard key={watch.id} watch={watch} onDelete={handleDelete} />
                        ))}
                    </div>
                ) : (
                    <WatchListView
                        watches={watches}
                        onDelete={handleDelete}
                        onSort={handleSort}
                        sortField={data.column}
                        sortDirection={data.direction as "asc"}
                        selectedWatches={selectedWatches}
                        onSelectWatch={handleSelectWatch}
                        onSelectAll={handleSelectAll}
                    />
                )}

                {watches.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="mb-4 text-6xl">⌚</div>
                        <h3 className="mb-2 text-xl font-medium text-slate-900">
                            No watches found
                        </h3>
                        <p className="text-slate-600">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default WatchManagement;
