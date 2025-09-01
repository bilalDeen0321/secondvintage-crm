import Layout from "@/components/Layout";
import WatchDetailModal from "@/components/WatchDetailModal";
import { Head } from "@inertiajs/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useBatchActions } from "./_actions";
import { AddWatchModal } from "./components/AddWatchModal";
import { BatchFilters } from "./components/BatchFilters";
import { BatchList } from "./components/BatchList";
import { BatchStats } from "./components/BatchStats";
import { CreateBatchForm } from "./components/CreateBatchForm";
import { EditBatchModal } from "./components/EditBatchModal";

const BatchManagement = () => {
    const {
        // State
        viewMode,
        setViewMode,
        selectedWatch,
        setSelectedWatch,
        isWatchModalOpen,
        setIsWatchModalOpen,
        editingBatch,
        setEditingBatch,
        isAddWatchModalOpen,
        setIsAddWatchModalOpen,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        watchSearchTerm,
        setWatchSearchTerm,
        watchStatusFilter,
        setWatchStatusFilter,
        batchWatchSortField,
        batchWatchSortDirection,
        addWatchSortField,
        addWatchSortDirection,
        selectedWatchesToAdd,
        batches,
        showCreateForm,
        setShowCreateForm,
        newBatch,
        setNewBatch,
        editingBatchData,
        setEditingBatchData,

        // Computed values
        filteredBatches,
        filteredAndSortedAvailableWatches,
        currentEditingBatch,

        // Functions
        getSortedBatchWatches,
        getStatusColor,
        getWatchStatusColor,
        getTrackingUrl,
        handleCreateBatch,
        updateBatchStatus,
        updateBatchDetails,
        handleWatchClick,
        handleCreateInvoice,
        removeWatchFromBatch,
        handleAddSelectedWatchesToBatch,
        handleAddWatchToBatch,
        openAddWatchModal,
        openEditBatchModal,
        handleBatchWatchSort,
        handleAddWatchSort,
        handleSelectAllWatches,
        handleSelectWatch,
    } = useBatchActions();

    const getSortIcon = (
        field: string,
        currentSortField: string,
        currentSortDirection: "asc" | "desc",
    ) => {
        if (currentSortField !== field) return null;
        return currentSortDirection === "asc" ? (
            <ChevronUp className="ml-1 inline h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 inline h-4 w-4" />
        );
    };

    return (
        <Layout>
            <Head title="Batch Management" />
            <div className="p-8">
                <BatchFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    onCreateBatch={() => setShowCreateForm(true)}
                />

                <BatchStats batches={batches} />

                {showCreateForm && <CreateBatchForm onCancel={() => setShowCreateForm(false)} />}

                <BatchList
                    batches={filteredBatches}
                    viewMode={viewMode}
                    onWatchClick={handleWatchClick}
                    onEditBatch={openEditBatchModal}
                    onCreateInvoice={handleCreateInvoice}
                    onStatusUpdate={updateBatchStatus}
                    getStatusColor={getStatusColor}
                    getTrackingUrl={getTrackingUrl}
                />

                <EditBatchModal
                    isOpen={editingBatch !== null}
                    onClose={() => setEditingBatch(null)}
                    batch={currentEditingBatch}
                    editingBatchData={editingBatchData}
                    setEditingBatchData={setEditingBatchData}
                    availableWatches={[]}
                    batchWatchSortField={batchWatchSortField}
                    batchWatchSortDirection={batchWatchSortDirection}
                    onBatchWatchSort={handleBatchWatchSort}
                    onUpdateBatchDetails={updateBatchDetails}
                    onAddWatchToBatch={openAddWatchModal}
                    onRemoveWatchFromBatch={removeWatchFromBatch}
                    getWatchStatusColor={getWatchStatusColor}
                    getSortedBatchWatches={getSortedBatchWatches}
                />

                <AddWatchModal
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
                    onAddSingleWatch={handleAddWatchToBatch}
                    getWatchStatusColor={getWatchStatusColor}
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
