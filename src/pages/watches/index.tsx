import { CurrencyAttributes } from "@/app/models/Currency";
import Status from "@/app/models/Status";
import Layout from "@/components/Layout";
import TablePaginate from "@/components/ui/table/TablePaginate";
import WatchCard from "@/components/WatchCard";
import WatchListView from "@/components/WatchListView";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PaginateData } from "@/types/laravel";
import { WatchResource } from "@/types/resources/watch";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { deleteWatch } from "./_actions";
import WatchBulkActions from "./components/WatchBulkActions";
import WatchHeaderRight from "./components/WatchHeaderRight";
import WatchMultiselectStatusFilter from "./components/WatchMultiselectStatusFilter";
import WatchSearchAndFilter from "./components/WatchSearchAndFilter";
import { getSelectSearch, watchFilter } from "./_search";

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
    const perPage = page.props.perPage as number;
    

    const [selectedWatches, setSelectedWatches] = useState<string[]>([]);
    const { status: initialStatus } = props;

    const { data, setData } = useForm({
        column: "",
        search: "",
        status: initialStatus?.length ? initialStatus : ["all"],
        brand: "All",
        batch: "All",
        location: "All",
        direction: "asc",
    });
   

    // Add effect to handle data refresh when coming back from edit
    useEffect(() => {
        let wasHidden = false;

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                wasHidden = true;
            } else if (document.visibilityState === "visible" && wasHidden) {
                // Only refresh if the page was actually hidden and is now visible
                // This prevents unnecessary reloads on initial page load
                router.reload({ only: ["watches", "watch_count"] });
                wasHidden = false;
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            route("watches.index"), // your route name
            {
                ...data, //  keep filters/search applied
                per_page: e.target.value,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
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
            setSelectedWatches(watches.map((w) => String(w.id)));
        } else {
            setSelectedWatches([]);
        }
    };  
    return (
        <Layout>
            <Head title="SV - Watch Management" />
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Watch Management</h1>
                            <p className="mt-1 text-slate-600">Manage your watch inventory and track status</p>
                        </div>
                        <WatchHeaderRight viewMode={viewMode} setViewMode={setViewMode} />
                    </div>

                    {/* Multi-select Status Filter */}
                    <WatchMultiselectStatusFilter data={data}  setData={setData} watch_count={watch_count} />

                    {/* Search and Filters */}
                    <WatchSearchAndFilter data={data} setData={setData} batches={batches} brands={brands} locations={locations} />

                    {/* Bulk Actions */}
                    <WatchBulkActions batches={batches} locations={locations} selectedWatches={selectedWatches} setSelectedWatches={setSelectedWatches} />

                    {/* Results info and pagination controls */}
                 <div className="mb-4 flex items-center justify-between">
                    {/* Left side: showing text + per page dropdown */}
                    <div className="flex items-center gap-6 text-sm text-slate-600">
                        <span>
                        Showing {meta.from ?? 0}-{meta.to ?? 0} of {meta.total} watches
                        </span>

                        <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap">Per Page:</span>
                        <select
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={perPage}
                           onChange={(e) => {
                                        watchFilter("per_page", e.target.value); //correct for native select
                                    }}
                        >
                            {[20, 50, 100, 200, 500].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                            ))}
                        </select>
                        </div>
                    </div>

                    {/* Right side: pagination always aligned right */}
                    <div className="flex-shrink-0">
                        <TablePaginate links={meta.links} />
                    </div>
                    </div>


                </div>

                {/* Content */}
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {watches.map((watch) => (
                            <WatchCard key={watch.id} watch={watch} onDelete={deleteWatch} />
                        ))}
                    </div>
                ) : (
                    <WatchListView watches={watches} onDelete={deleteWatch} selectedWatches={selectedWatches} onSelectWatch={handleSelectWatch} onSelectAll={handleSelectAll} />
                )}

                {watches.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="mb-4 text-6xl">⌚</div>
                        <h3 className="mb-2 text-xl font-medium text-slate-900">No watches found</h3>
                        <p className="text-slate-600">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default WatchManagement;
