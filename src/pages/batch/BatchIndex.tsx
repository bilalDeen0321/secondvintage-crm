/* eslint-disable @typescript-eslint/no-explicit-any */
import Layout from "@/components/Layout";
import TablePaginate from "@/components/ui/table/TablePaginate";
import WatchDetailModal from "@/components/WatchDetailModal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PaginateData } from "@/types/laravel";
import { BatchResource } from "@/types/resources/batch";
import { WatchResource } from "@/types/resources/watch";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { useBatchActions } from "./_actions";
import { AddWatchModal } from "./components/AddWatchModal";
import { BatchFilters } from "./components/BatchFilters";
import { BatchList } from "./components/BatchList";
import { BatchStats } from "./components/BatchStats";
import { CreateBatchForm } from "./components/CreateBatchForm";
interface Location {
  id: number
  name: string
  country_code: string
}
interface BatchManagementProps {
    batches: PaginateData<BatchResource>;
    availableWatches: WatchResource[];
    batchStastistics: any;
    locations: Location[]
}

const BatchManagement = ({
    batches: serverBatches,
    availableWatches,
    batchStastistics,
    locations,
}: BatchManagementProps) => {
    const {
        selectedWatch,
        setSelectedWatch,
        isWatchModalOpen,
        setIsWatchModalOpen,
        isAddWatchModalOpen,
        setIsAddWatchModalOpen,
        data,
        setData,
        watchSearchTerm,
        setWatchSearchTerm,
        watchStatusFilter,
        setWatchStatusFilter,
        addWatchSortField,
        addWatchSortDirection,
        selectedWatchesToAdd,
        filteredAndSortedAvailableWatches,
        currentEditingBatch,
        filteredBatches,

        handleWatchClick,
        handleAddSelectedWatchesToBatch,
        openEditBatchModal,
        handleAddWatchSort,
        handleSelectAllWatches,
        handleSelectWatch,
    } = useBatchActions(serverBatches.data, availableWatches);

    //start of the complete state and consts list
    const [viewMode, setViewMode] = useLocalStorage<"list" | "grid">("watch_view_mode", "list");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const setFilterBatches = (key: string, value: string) => {
        setData({ ...data, [key]: value, page: 1 });
    };
 
    return (
        <Layout>
            <Head title="SV - Batch Management" />
            <div className="p-8">
                <BatchFilters
                    searchTerm={data.search}
                    setSearchTerm={(term) => setFilterBatches("search", term)}
                    statusFilter={data.status}
                    setStatusFilter={(status) => setFilterBatches("status", status)}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    showCreateForm={showCreateForm}
                    onCreateBatch={() => setShowCreateForm(true)}
                />

                <BatchStats batchStastistics={batchStastistics} />

                {showCreateForm && <CreateBatchForm onCancel={() => setShowCreateForm(false)}  locations={locations} />}

                <BatchList
                    batches={filteredBatches}
                    viewMode={viewMode}
                    onWatchClick={handleWatchClick}
                    onEditBatch={openEditBatchModal}
                />

                {/* pagination */}
                <div className="mt-4">
                    <TablePaginate links={serverBatches?.meta?.links} />
                </div>

                <AddWatchModal
                    batch={currentEditingBatch}
                    isOpen={isAddWatchModalOpen}
                    onClose={() => setIsAddWatchModalOpen(false)}
                    watchSearchTerm={watchSearchTerm}
                    setWatchSearchTerm={setWatchSearchTerm}
                    watchStatusFilter={watchStatusFilter}
                    setWatchStatusFilter={setWatchStatusFilter}
                    filteredAndSortedWatches={filteredAndSortedAvailableWatches}
                    addWatchSortField={addWatchSortField}
                    addWatchSortDirection={addWatchSortDirection}
                    onAddWatchSort={handleAddWatchSort}
                    selectedWatchesToAdd={selectedWatchesToAdd}
                    onSelectAllWatches={handleSelectAllWatches}
                    onSelectWatch={handleSelectWatch}
                    onAddSelectedWatches={handleAddSelectedWatchesToBatch}
                />

                <WatchDetailModal
                    watch={selectedWatch}
                    isOpen={isWatchModalOpen}
                    onClose={() => {
                        setIsWatchModalOpen(false);
                        setSelectedWatch(null);
                    }}
                    showEditButton={false}
                />
            </div>
        </Layout>
    );
};

export default BatchManagement;
