import { CurrencyAttributes } from "@/app/models/Currency";
import { PlatformTypes } from "@/app/models/PlatformData";
import Layout from "@/components/Layout";
import TablePaginate from "@/components/ui/table/TablePaginate";
import PlatformDataModal from "@/pages/sales/components/platform/PlatformDataModal";
import { PaginateData } from "@/types/laravel";
import { SaleWatchResource, WatchResource } from "@/types/resources/watch";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { watchPlatformsItems } from "./_constraints";
import { createHandlers, SortDirection, SortField } from "./_handlers";
import EmptyState from "./components/EmptyState";
import SaleExports from "./components/SaleExports";
import SaleQuickSelectionActions from "./components/SaleQuickSelectionActions";
import { SaleSearchFilter } from "./components/SaleSearchFilter";
import SaleWatchBlukActions from "./components/SaleWatchBlukActions";
import SingleViewModal from "./components/SingleViewModal";
import WatchTable from "./components/WatchTable"; 

export type SaleSearchData = {
    column: string;
    search: string;
    status: string[];
    brand: string;
    batch: string;
    location: string;
    direction: string;
};

type Props = {
    batches: string[];
    brands: string[];
    statuses: string[];
    locations: string[];
    currencies: CurrencyAttributes[];
    watches: PaginateData<SaleWatchResource>;
};

const MultiplatformSales = (props: Props) => {
    //server props
    const { locations = [], batches = [], brands = [], currencies = [] } = props || {};
    const { data: watches = [], meta } = props.watches || {};

    /**
     * ============================================================================
     * ============================================================================
     */
    // State management
    const [selectedWatches, setSelectedWatches] = useState<WatchResource["id"][]>([]);
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [watchPlatforms, setWatchPlatforms] = useState(watchPlatformsItems);
    const [processingWatches, setProcessingWatches] = useState<Set<WatchResource["id"]>>(new Set());

    const [platformDataModal, setPlatformDataModal] = useState<{
        isOpen: boolean;
        watch: SaleWatchResource | null;
        platform: PlatformTypes;
    }>({
        isOpen: false,
        watch: null,
        platform: "" as PlatformTypes,
    });

    const [singleViewModal, setSingleViewModal] = useState<{
        isOpen: boolean;
        watch: SaleWatchResource | null;
        selectedImageIndex: number;
    }>({
        isOpen: false,
        watch: null,
        selectedImageIndex: 0,
    });

    // Create handlers using the external handler factory
    const handlers = createHandlers({
        watches,
        selectedWatches,
        watchPlatforms,
        sortField,
        sortDirection,
        platformDataModal,
        setSelectedWatches,
        setWatchPlatforms,
        setProcessingWatches,
        setSortField,
        setSortDirection,
        setPlatformDataModal,
        setSingleViewModal,
    });

    return (
        <Layout>
            <Head title="Multi-platform Sales" />
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Multi-platform Sales</h1>
                            <p className="mt-1 text-slate-600">Select and export watches for different sales platforms</p>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <SaleSearchFilter brands={brands} batches={batches} />

                    {/* Quick Selection Actions */}
                    <SaleQuickSelectionActions handleSelectAll={handlers.handleSelectAll} handleSelectByStatus={handlers.handleSelectByStatus} watcheLength={watches.length} />

                    {/* Bulk Actions */}
                    <SaleWatchBlukActions ids={selectedWatches} locations={locations} batches={batches} />

                    {/* Export Actions */}
                    <SaleExports watch_ids={selectedWatches} />
                </div>

                {/* Watch Table */}
                <WatchTable watches={watches} selectedWatches={selectedWatches} watchPlatforms={watchPlatforms} processingWatches={processingWatches} sortField={sortField} sortDirection={sortDirection} onSelectWatch={handlers.handleSelectWatch} onSelectAll={handlers.handleSelectAll} onSort={handlers.handleSort} onPlatformChange={handlers.handlePlatformChange} onViewPlatformData={handlers.handleViewPlatformData} onOpenSingleView={handlers.handleOpenSingleView} />

                {/* Empty State */}
                {watches.length === 0 && <EmptyState />}

                {/* Laravel Pagination */}
                {meta?.total > meta?.per_page && <TablePaginate links={meta.links} />}

                {/* Platform Data Modal with Navigation */}
                {platformDataModal.watch && <PlatformDataModal watch={platformDataModal.watch} platform={platformDataModal.platform} isOpen={platformDataModal.isOpen} onClose={handlers.closePlatformDataModal} onNext={handlers.handleModalNext} onPrevious={handlers.handleModalPrevious} />}

                {/* Single View Modal */}
                <SingleViewModal isOpen={singleViewModal.isOpen} watch={singleViewModal.watch} selectedImageIndex={singleViewModal.selectedImageIndex} onClose={handlers.closeSingleViewModal} onThumbnailClick={handlers.handleThumbnailClick} />
            </div>
        </Layout>
    );
};

export default MultiplatformSales;
