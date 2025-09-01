/* eslint-disable @typescript-eslint/no-explicit-any */
import { Batch } from "@/types/Batch";
import { BatchResource } from "@/types/resources/batch";
import { WatchResource } from "@/types/resources/watch";
import { useState } from "react";

// Mock available watches (these would come from a separate API call)
const mockAvailableWatches: WatchResource[] = [
    {
        id: 1,
        name: "Rolex Datejust",
        sku: "ROL-DAT-001",
        brand: "Rolex",
        status: "Ready for listing",
        location: "Hørning",
        description: "Classic timepiece",
        images: [
            {
                id: "1",
                url: "/lovable-uploads/0884f9b0-c02c-4735-9af7-ebe16f554fe8.png",
                useForAI: false,
            },
        ],
        serial_number: "",
        reference: "",
        case_size: "",
        caliber: "",
        timegrapher: "",
        original_cost: "",
        current_cost: "",
        currency: "",
        ai_instructions: "",
        ai_thread_id: "",
        ai_selected_images: "",
        notes: "",
        stage: "",
        user_id: 0,
        batch_id: 0,
        brand_id: 0,
        agent_id: 0,
        seller_id: 0,
        created_at: "",
        updated_at: "",
        image_urls: [],
        routeKey: "",
        batch: undefined
    },
    // ...existing watch data...
];

export const useBatchActions = (serverBatches: BatchResource[] = []) => {
    // Convert server batches to local Batch format
    const convertServerBatchesToLocal = (batches: BatchResource[]): Batch[] => {
        return batches.map(batch => ({
            id: batch.id.toString(),
            name: batch.name,
            trackingNumber: batch.trackingNumber,
            origin: batch.origin,
            destination: batch.destination,
            status: batch.status as Batch["status"],
            notes: batch.notes,
            shippedDate: batch.shippedDate,
            estimatedDelivery: batch.estimatedDelivery,
            actualDelivery: batch.actualDelivery,
            watches: batch.watches?.map(watch => ({
                id: watch.id.toString(),
                name: watch.name,
                sku: watch.sku,
                brand: watch.brand,
                image: watch.images?.[0]?.url || "/lovable-uploads/e4da5380-362e-422c-a981-6370f96719da.png"
            })) || []
        }));
    };

    // State management
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedWatch, setSelectedWatch] = useState<WatchResource | null>(null);
    const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<string | null>(null);
    const [isAddWatchModalOpen, setIsAddWatchModalOpen] = useState(false);
    const [selectedBatchForWatch, setSelectedBatchForWatch] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [watchSearchTerm, setWatchSearchTerm] = useState("");
    const [watchStatusFilter, setWatchStatusFilter] = useState<string>("all");
    const [batchWatchSortField, setBatchWatchSortField] = useState<string>("name");
    const [batchWatchSortDirection, setBatchWatchSortDirection] = useState<"asc" | "desc">("asc");
    const [addWatchSortField, setAddWatchSortField] = useState<string>("name");
    const [addWatchSortDirection, setAddWatchSortDirection] = useState<"asc" | "desc">("asc");
    const [selectedWatchesToAdd, setSelectedWatchesToAdd] = useState<(number | string)[]>([]);
    const [availableWatches] = useState<WatchResource[]>(mockAvailableWatches);
    const [batches, setBatches] = useState<Batch[]>(convertServerBatchesToLocal(serverBatches));
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newBatch, setNewBatch] = useState<Partial<Batch>>({
        name: "",
        trackingNumber: "",
        origin: "Ho Chi Minh City, Vietnam",
        destination: "Hørning, Denmark",
        status: "Preparing",
        watches: [],
        notes: "",
    });
    const [editingBatchData, setEditingBatchData] = useState<Partial<Batch>>({});



    const filteredAndSortedAvailableWatches = availableWatches
        .filter((watch) => {
            const matchesSearch =
                watchSearchTerm === "" ||
                watch.name.toLowerCase().includes(watchSearchTerm.toLowerCase()) ||
                watch.sku.toLowerCase().includes(watchSearchTerm.toLowerCase()) ||
                watch.brand.toLowerCase().includes(watchSearchTerm.toLowerCase());

            const matchesStatus = watchStatusFilter === "all" || watch.status === watchStatusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const aValue = a[addWatchSortField as keyof WatchResource] || "";
            const bValue = b[addWatchSortField as keyof WatchResource] || "";

            if (addWatchSortDirection === "asc") {
                return aValue.toString().localeCompare(bValue.toString());
            } else {
                return bValue.toString().localeCompare(aValue.toString());
            }
        });

    const currentEditingBatch = editingBatch ? batches.find((b) => b.id === editingBatch) : null;

    // Utility functions
    const getSortedBatchWatches = (watches: any[]) => {
        return [...watches].sort((a, b) => {
            const aValue = a[batchWatchSortField] || "";
            const bValue = b[batchWatchSortField] || "";

            if (batchWatchSortDirection === "asc") {
                return aValue.toString().localeCompare(bValue.toString());
            } else {
                return bValue.toString().localeCompare(aValue.toString());
            }
        });
    };

    const getStatusColor = (status: Batch["status"]) => {
        switch (status) {
            case "Preparing":
                return "bg-yellow-100 text-yellow-800";
            case "Shipped":
                return "bg-blue-100 text-blue-800";
            case "In Transit":
                return "bg-purple-100 text-purple-800";
            case "Customs":
                return "bg-orange-100 text-orange-800";
            case "Delivered":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getWatchStatusColor = (status: WatchResource["status"]) => {
        switch (status) {
            case "Draft":
                return "bg-gray-100 text-gray-800";
            case "Review":
                return "bg-yellow-100 text-yellow-800";
            case "Platform Review":
                return "bg-orange-100 text-orange-800";
            case "Ready for listing":
                return "bg-blue-100 text-blue-800";
            case "Listed":
                return "bg-green-100 text-green-800";
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

    const getTrackingUrl = (trackingNumber: string) => {
        return `https://www.track-trace.com/trace?t=${trackingNumber}`;
    };

    // Action functions
    const handleCreateBatch = () => {
        if (newBatch.name && newBatch.trackingNumber) {
            const batch: Batch = {
                id: Date.now().toString(),
                name: newBatch.name,
                trackingNumber: newBatch.trackingNumber,
                origin: newBatch.origin || "Ho Chi Minh City, Vietnam",
                destination: newBatch.destination || "Hørning, Denmark",
                status: (newBatch.status as Batch["status"]) || "Preparing",
                watches: newBatch.watches || [],
                notes: newBatch.notes,
            };
            setBatches([...batches, batch]);
            setNewBatch({
                name: "",
                trackingNumber: "",
                origin: "Ho Chi Minh City, Vietnam",
                destination: "Hørning, Denmark",
                status: "Preparing",
                watches: [],
                notes: "",
            });
            setShowCreateForm(false);
        }
    };

    const updateBatchStatus = (batchId: string, status: Batch["status"]) => {
        setBatches(batches.map((batch) => (batch.id === batchId ? { ...batch, status } : batch)));
    };

    const updateBatchDetails = () => {
        if (editingBatch && editingBatchData) {
            setBatches(
                batches.map((batch) =>
                    batch.id === editingBatch ? { ...batch, ...editingBatchData } : batch,
                ),
            );
        }
    };

    const handleWatchClick = (watchId: string) => {
        console.log("Watch clicked:", watchId);

        let foundWatch: WatchResource | null = null;
        for (const batch of batches) {
            const watch = batch.watches.find((w) => w.id === watchId);
            if (watch) {
                foundWatch = {
                    id: Number(watch.id),
                    name: watch.name,
                    sku: watch.sku,
                    brand: watch.brand,
                    status: "Listed" as WatchResource["status"],
                    location: batch.destination,
                    description: `Part of ${batch.name}`,
                    images: watch.image ? [{ id: "1", url: watch.image, useForAI: false }] : [],
                    // ...existing default properties...
                };
                break;
            }
        }

        if (foundWatch) {
            setSelectedWatch(foundWatch);
            setIsWatchModalOpen(true);
        }
    };

    const handleCreateInvoice = (batchId: string) => {
        console.log("Creating package invoice for batch:", batchId);
        alert(`Package invoice created for batch ${batchId}`);
    };

    const removeWatchFromBatch = (batchId: string, watchId: string) => {
        setBatches(
            batches.map((batch) =>
                batch.id === batchId
                    ? {
                        ...batch,
                        watches: batch.watches.filter((w) => w.id !== watchId),
                    }
                    : batch,
            ),
        );
    };

    const handleAddSelectedWatchesToBatch = () => {
        if (!selectedBatchForWatch || selectedWatchesToAdd.length === 0) return;

        const watchesToAdd = availableWatches
            .filter((w) => selectedWatchesToAdd.includes(String(w.id)))
            .map((watch) => ({
                id: String(watch.id),
                name: watch.name,
                sku: watch.sku,
                brand: watch.brand,
                image:
                    watch.images?.[0]?.url ||
                    "/lovable-uploads/e4da5380-362e-422c-a981-6370f96719da.png",
            }));

        setBatches(
            batches.map((batch) =>
                batch.id === selectedBatchForWatch
                    ? { ...batch, watches: [...batch.watches, ...watchesToAdd] }
                    : batch,
            ),
        );

        setIsAddWatchModalOpen(false);
        setSelectedBatchForWatch(null);
        setSelectedWatchesToAdd([]);
    };

    const handleAddWatchToBatch = (watchId: number) => {
        if (!selectedBatchForWatch) return;

        const watchToAdd = availableWatches.find((w) => w.id === watchId);
        if (!watchToAdd) return;

        const batchWatch = {
            id: String(watchToAdd.id),
            name: watchToAdd.name,
            sku: watchToAdd.sku,
            brand: watchToAdd.brand,
            image:
                watchToAdd.images?.[0]?.url ||
                "/lovable-uploads/e4da5380-362e-422c-a981-6370f96719da.png",
        };

        setBatches(
            batches.map((batch) =>
                batch.id === selectedBatchForWatch
                    ? { ...batch, watches: [...batch.watches, batchWatch] }
                    : batch,
            ),
        );
    };

    const openAddWatchModal = (batchId: string) => {
        setSelectedBatchForWatch(batchId);
        setIsAddWatchModalOpen(true);
        setSelectedWatchesToAdd([]);
    };

    const openEditBatchModal = (batchId: string) => {
        const batch = batches.find((b) => b.id === batchId);
        if (batch) {
            setEditingBatch(batchId);
            setEditingBatchData({
                name: batch.name,
                trackingNumber: batch.trackingNumber,
                origin: batch.origin,
                destination: batch.destination,
                shippedDate: batch.shippedDate,
                estimatedDelivery: batch.estimatedDelivery,
                notes: batch.notes,
            });
        }
    };

    // Sorting functions
    const handleBatchWatchSort = (field: string) => {
        if (batchWatchSortField === field) {
            setBatchWatchSortDirection(batchWatchSortDirection === "asc" ? "desc" : "asc");
        } else {
            setBatchWatchSortField(field);
            setBatchWatchSortDirection("asc");
        }
    };

    const handleAddWatchSort = (field: string) => {
        if (addWatchSortField === field) {
            setAddWatchSortDirection(addWatchSortDirection === "asc" ? "desc" : "asc");
        } else {
            setAddWatchSortField(field);
            setAddWatchSortDirection("asc");
        }
    };

    // Multi-select functions
    const handleSelectAllWatches = (checked: boolean) => {
        if (checked) {
            setSelectedWatchesToAdd(filteredAndSortedAvailableWatches.map((w) => String(w.id)));
        } else {
            setSelectedWatchesToAdd([]);
        }
    };

    const handleSelectWatch = (watchId: number, checked: boolean) => {
        if (checked) {
            setSelectedWatchesToAdd([...selectedWatchesToAdd, watchId]);
        } else {
            setSelectedWatchesToAdd(selectedWatchesToAdd.filter((id) => id !== watchId));
        }
    };

    return {
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
        selectedBatchForWatch,
        setSelectedBatchForWatch,
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
        setSelectedWatchesToAdd,
        availableWatches,
        batches,
        setBatches,
        showCreateForm,
        setShowCreateForm,
        newBatch,
        setNewBatch,
        editingBatchData,
        setEditingBatchData,
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
    };
};
