/* eslint-disable @typescript-eslint/no-explicit-any */
import { Watch as TWatch } from "@/types/watch";
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


export const handleAddBatchGroup = (batchGroups: string[], setBatchGroups, setData: SetData<'batch', string>) => {
    const newBatchGroup = prompt("Enter new batch group name:");
    if (newBatchGroup && newBatchGroup.trim()) {
        const trimmedBatch = newBatchGroup.trim();
        if (!batchGroups.includes(trimmedBatch)) {
            setBatchGroups([...batchGroups, trimmedBatch]);
            setData('batch', trimmedBatch)
            console.log("Added new batch group:", trimmedBatch);
        } else {
            alert("This batch group already exists.");
        }
    }
};
