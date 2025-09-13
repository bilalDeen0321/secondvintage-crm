/* eslint-disable @typescript-eslint/no-explicit-any */
import { Batch } from "@/types/Batch";
import { BatchResource } from "@/types/resources/batch";
import { WatchResource } from "@/types/resources/watch";
import { router, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";



export const useBatchActions = (
    serverBatches: BatchResource[] = [],
    serverAvailableWatches: WatchResource[] = [],
    serverBatchStastistics: any = []
) => {

    // Custom hook for URL parameters (React best practice)
    const useUrlParams = () => {
        return useMemo(() => {
            const searchParams = new URLSearchParams(window.location.search);
            return {
                search: searchParams.get('search') || "",
                status: searchParams.get('status') || "all",
                page: parseInt(searchParams.get('page') || '1', 10)
            };
        }, []);
    };

    const urlParams = useUrlParams();

    // State management
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedWatch, setSelectedWatch] = useState<WatchResource | null>(null);
    const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<string | null>(null);
    const [isAddWatchModalOpen, setIsAddWatchModalOpen] = useState(false);
    const [selectedBatchForWatch, setSelectedBatchForWatch] = useState<string | null>(null);
    const { data, setData } = useForm({
        search: urlParams.search, status: urlParams.status, page: urlParams.page,
    });
    const [watchSearchTerm, setWatchSearchTerm] = useState("");
    const [watchStatusFilter, setWatchStatusFilter] = useState<string>("all");
    const [batchWatchSortField, setBatchWatchSortField] = useState<string>("name");
    const [batchWatchSortDirection, setBatchWatchSortDirection] = useState<"asc" | "desc">("asc");
    const [addWatchSortField, setAddWatchSortField] = useState<string>("name");
    const [addWatchSortDirection, setAddWatchSortDirection] = useState<"asc" | "desc">("asc");
    const [selectedWatchesToAdd, setSelectedWatchesToAdd] = useState<(number | string)[]>([]);
    const [availableWatches] = useState<WatchResource[]>(serverAvailableWatches);
    const [batches, setBatches] = useState<BatchResource[]>((serverBatches));
    const [batchStastistics, setBatchStastistics] = useState<any>(serverBatchStastistics);
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

    const currentEditingBatch = editingBatch ? batches.find((b) => String(b.id) === editingBatch) : null;

    // Computed values
    const filteredBatches = batches.filter((batch) => {
        const matchesSearch =
            data.search === "" ||
            batch.name.toLowerCase().includes(data.search.toLowerCase()) ||
            batch.trackingNumber.toLowerCase().includes(data.search.toLowerCase()) ||
            batch.origin.toLowerCase().includes(data.search.toLowerCase()) ||
            batch.destination.toLowerCase().includes(data.search.toLowerCase());

        const matchesStatus = data.status === "all" || batch.status === data.status;

        return matchesSearch && matchesStatus;
    });

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


    const updateBatchDetails = () => {
        if (editingBatch && editingBatchData) {
            router.patch(route('batches.updateDetails', editingBatch), {
                name: editingBatchData.name,
                tracking_number: editingBatchData.trackingNumber,
                origin: editingBatchData.origin,
                destination: editingBatchData.destination,
                status: editingBatchData.status,
                notes: editingBatchData.notes,
                shipped_date: editingBatchData.shippedDate,
                estimated_delivery: editingBatchData.estimatedDelivery,
                actual_delivery: editingBatchData.actualDelivery,
            }, {
                onSuccess: () => {
                    setEditingBatch(null);
                },
                preserveScroll: true,
            });
        }
    };

    const handleWatchClick = (watchKey: WatchResource['routeKey']) => {
        const findWatch = batches.flatMap(b => b.watches).find(w => w.routeKey === watchKey);
        if (findWatch) {
            setSelectedWatch(findWatch);
            setIsWatchModalOpen(true);
        }
    };


    const handleAddSelectedWatchesToBatch = () => {
        if (!selectedBatchForWatch || selectedWatchesToAdd.length === 0) return;

        router.post(route('batches.assignWatches', selectedBatchForWatch), {
            watch_ids: selectedWatchesToAdd
        }, {
            onSuccess: (page) => {
                // Update local state immediately
                const watchesToAdd = availableWatches
                    .filter(w => selectedWatchesToAdd.includes(String(w.id)))
                    .map(watch => ({
                        id: String(watch.id),
                        originalId: watch.id,
                        name: watch.name,
                        sku: watch.sku,
                        brand: watch.brand,
                        routeKey: watch.routeKey || watch.id.toString(),
                        image: watch.images?.[0]?.url || "/lovable-uploads/e4da5380-362e-422c-a981-6370f96719da.png"
                    }));

                setIsAddWatchModalOpen(false);
                setSelectedBatchForWatch(null);
                setSelectedWatchesToAdd([]);
            },
            preserveScroll: true,
        });
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
        alert('editing batch');
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
        filteredBatches,
        batchStastistics,
        // Functions
        getSortedBatchWatches,
        updateBatchDetails,
        handleWatchClick,
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
