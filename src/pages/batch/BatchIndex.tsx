/* eslint-disable @typescript-eslint/no-explicit-any */
import Layout from "@/components/Layout";
import TablePaginate from "@/components/ui/table/TablePaginate";
import WatchDetailModal from "@/components/WatchDetailModal";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PaginateData } from "@/types/laravel";
import { BatchResource } from "@/types/resources/batch";
import { WatchResource } from "@/types/resources/watch";
import { Head, router } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { useBatchActions } from "./_actions";
import { AddWatchModal } from "./components/AddWatchModal";
import { BatchFilters } from "./components/BatchFilters";
import { BatchList } from "./components/BatchList";
import { BatchStats } from "./components/BatchStats";
import { CreateBatchForm } from "./components/CreateBatchForm";
import { EditBatchModal } from "./components/EditBatchModal";

interface BatchManagementProps {
    batches: PaginateData<BatchResource>;
    availableWatches: WatchResource[];
    batchStastistics: any;
}

const BatchManagement = ({
    batches: serverBatches,
    availableWatches,
    batchStastistics,
}: BatchManagementProps) => {
    const {
        selectedWatch,
        setSelectedWatch,
        isWatchModalOpen,
        setIsWatchModalOpen,
        editingBatch,
        setEditingBatch,
        isAddWatchModalOpen,
        setIsAddWatchModalOpen,
        data,
        setData,
        watchSearchTerm,
        setWatchSearchTerm,
        watchStatusFilter,
        setWatchStatusFilter,
        batchWatchSortField,
        batchWatchSortDirection,
        addWatchSortField,
        addWatchSortDirection,
        selectedWatchesToAdd,
        showCreateForm,
        setShowCreateForm,
        editingBatchData,
        setEditingBatchData,
        filteredAndSortedAvailableWatches,
        currentEditingBatch,
        availableWatches: actionAvailableWatches,
        filteredBatches,

        // Functions
        getSortedBatchWatches,
        updateBatchDetails,
        handleWatchClick,
        handleAddSelectedWatchesToBatch,
        openAddWatchModal,
        openEditBatchModal,
        handleBatchWatchSort,
        handleAddWatchSort,
        handleSelectAllWatches,
        handleSelectWatch,
    } = useBatchActions(serverBatches.data, availableWatches, batchStastistics);

    //start of the complete state and consts list
    const [viewMode, setViewMode] = useLocalStorage<"list" | "grid">("watch_view_mode", "list");

    const setFilterBatches = (key: string, value: string) => {
        setData({ ...data, [key]: value, page: 1 });
    };

    const isInitialMount = useRef(true);

    useEffect(() => {
        // Skip the first render to avoid duplicate requests on initial load
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        router.get(route("batches.index"), data, {
            only: ["batches"],
            preserveState: true,
            preserveScroll: true,
        });
    }, [data]);
    return (
        <Layout>
            <Head title="Batch Management" />
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

                {showCreateForm && <CreateBatchForm onCancel={() => setShowCreateForm(false)} />}

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

                {editingBatch && (
                    <EditBatchModal
                        isOpen={editingBatch !== null}
                        onClose={() => setEditingBatch(null)}
                        batch={currentEditingBatch}
                        editingBatchData={editingBatchData}
                        setEditingBatchData={setEditingBatchData}
                        availableWatches={actionAvailableWatches}
                        batchWatchSortField={batchWatchSortField}
                        batchWatchSortDirection={batchWatchSortDirection}
                        onBatchWatchSort={handleBatchWatchSort}
                        onUpdateBatchDetails={updateBatchDetails}
                        onAddWatchToBatch={openAddWatchModal}
                        getSortedBatchWatches={getSortedBatchWatches}
                    />
                )}

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
