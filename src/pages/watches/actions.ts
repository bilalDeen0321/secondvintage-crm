/* eslint-disable @typescript-eslint/no-explicit-any */
import { Watch as TWatch } from "@/types/watch";
import { router } from "@inertiajs/react";
import { initData } from "./create";

type SetData<K, V> = (key: K, value: V) => void;

export const handleEditBatches = () => {
    const newBatch = prompt("Enter new batch group name:");
    if (newBatch && newBatch.trim()) {
        console.log("Adding new batch group:", newBatch.trim());
        alert(
            `Batch group "${newBatch.trim()}" would be added to the list. This would be implemented with a proper modal in the real application.`,
        );
    }
};


type Watch = TWatch & {
    brand: string, status: any, location: string,
    images: (any)[]
}

export const handleApprove = (data: typeof initData, setData: SetData<'status', string>) => {

    setData('status', 'Approved')

    // Auto-save after approval

};


export const handleEditBrands = () => {
    const newBrand = prompt("Enter new brand name:");
    if (newBrand && newBrand.trim()) {
        console.log("Adding new brand:", newBrand.trim());
        alert(
            `Brand "${newBrand.trim()}" would be added to the list. This would be implemented with a proper modal in the real application.`,
        );
    }
};


export const handleEditLocations = () => {
    const newLocation = prompt("Enter new location name:");
    if (newLocation && newLocation.trim()) {
        console.log("Adding new location:", newLocation.trim());
        alert(
            `Location "${newLocation.trim()}" would be added to the list. This would be implemented with a proper modal in the real application.`,
        );
    }
};


export const handleAddBatchGroup = (batchGroups: string[], setData: SetData<'batch', string>) => {
    const newBatchGroup = prompt("Enter new batch group name:");
    if (newBatchGroup && newBatchGroup.trim()) {
        const trimmedBatch = newBatchGroup.trim();
        if (!batchGroups.includes(trimmedBatch)) {
            setData('batch', trimmedBatch)
            console.log("Added new batch group:", trimmedBatch);
        } else {
            alert("This batch group already exists.");
        }
    }
};


export const handleDeleteWatch = (id: string) => {
    if (window.confirm("Are you sure you want to delete this watch?")) {
        // setWatches(watches.filter((w) => w.id !== id));
    }
};


export const handlePreviousWatch = () => {
    // if (editingWatch) {
    //     const currentIndex = filteredAndSortedWatches.findIndex(
    //         (w) => w.id === editingWatch.id,
    //     );
    //     if (currentIndex > 0) {
    //         const previousWatch =
    //             filteredAndSortedWatches[currentIndex - 1];
    //         setEditingWatch(previousWatch);
    //         // Update URL with new SKU
    //         const newSearchParams = new URLSearchParams(searchParams);
    //         newSearchParams.set("sku", previousWatch.sku);
    //         setSearchParams(newSearchParams, { replace: true });
    //     }
    // }
};

export const handleEditWatch = (watch: Watch) => {
    // setEditingWatch(watch);
    // setShowForm(true);
    // // Update URL with SKU parameter for easy sharing
    // const newSearchParams = new URLSearchParams(searchParams);
    // newSearchParams.set("sku", watch.sku);
    // setSearchParams(newSearchParams, { replace: true });
};

export const handleSaveWatch = (watchData: Omit<Watch, "id">) => {
    // if (editingWatch) {
    //     // setWatches(
    //     //     watches.map((w) =>
    //     //         w.id === editingWatch.id
    //     //             ? { ...watchData, id: editingWatch.id }
    //     //             : w,
    //     //     ),
    //     // );
    // } else {
    //     const newWatch: Watch = {
    //         ...watchData,
    //         id: Date.now().toString(),
    //     };
    //     // setWatches([...watches, newWatch]);
    // }
    // setShowForm(false);
    // setEditingWatch(undefined);
    // // Clean up URL when closing form
    // const newSearchParams = new URLSearchParams(searchParams);
    // newSearchParams.delete("sku");
    // setSearchParams(newSearchParams, { replace: true });
};

export const handleNextWatch = () => {
    // if (editingWatch) {
    //     const currentIndex = filteredAndSortedWatches.findIndex(
    //         (w) => w.id === editingWatch.id,
    //     );
    //     if (currentIndex < filteredAndSortedWatches.length - 1) {
    //         const nextWatch = filteredAndSortedWatches[currentIndex + 1];
    //         setEditingWatch(nextWatch);
    //         // Update URL with new SKU
    //         const newSearchParams = new URLSearchParams(searchParams);
    //         newSearchParams.set("sku", nextWatch.sku);
    //         setSearchTerm(newSearchParams);
    //     }
    // }
};


export const getBatchGroup = (watchId: string) => {
    // Simple logic to assign batch groups based on watch ID
    const batchNumber = (parseInt(watchId) % 4) + 1;
    return `B00${batchNumber}`;
};


export const handleBulkBatchChange = (setSelectedWatches, batchGroup: string) => {
    // setWatches((prev) =>
    //     prev.map((watch) =>
    //         selectedWatches.includes(watch.id)
    //             ? { ...watch, batchGroup }
    //             : watch,
    //     ),
    // );
    setSelectedWatches([]);
};

export const handleBulkLocationChange = (setSelectedWatches, newLocation: string) => {
    // setWatches((prev) =>
    //     prev.map((watch) =>
    //         selectedWatches.includes(watch.id)
    //             ? { ...watch, location: newLocation }
    //             : watch,
    //     ),
    // );
    setSelectedWatches([]);
};

export const handleBulkStatusChange = (setSelectedWatches, newStatus: string) => {
    // setWatches((prev) =>
    //     prev.map((watch) =>
    //         selectedWatches.includes(watch.id)
    //             ? { ...watch, status: newStatus as Watch["status"] }
    //             : watch,
    //     ),
    // );
    setSelectedWatches([]);
};

export const handleStatusToggle = (status: string, setStatusFilters) => {
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
};

export const handleSort = (field: string, data, setData) => {
    if (data.sort === field) {
        setData('direction', data.direction === "asc" ? "desc" : "asc");
    } else {
        setData('sort', field);
        setData('direction', "asc");
    }

    router.get(route("watches.index"), withQuery('direction', data.direction), {
        preserveState: true,
        replace: true,
    });
};



export function withQuery(key: string, value: any) {
    const search = (new URLSearchParams(window.location.search)).get('search');
    return {
        search,
        [key]: value,
    }
}