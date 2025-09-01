/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Batch } from "@/types/Batch";
import { WatchResource } from "@/types/resources/watch";
import { ChevronDown, ChevronUp, Edit, Plus, X } from "lucide-react";

interface EditBatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    batch: Batch | null;
    editingBatchData: Partial<Batch>;
    setEditingBatchData: (data: Partial<Batch>) => void;
    availableWatches: WatchResource[];
    batchWatchSortField: string;
    batchWatchSortDirection: "asc" | "desc";
    onBatchWatchSort: (field: string) => void;
    onUpdateBatchDetails: () => void;
    onAddWatchToBatch: (batchId: string) => void;
    onRemoveWatchFromBatch: (batchId: string, watchId: string) => void;
    getWatchStatusColor: (status: WatchResource["status"]) => string;
    getSortedBatchWatches: (watches: any[]) => any[];
}

export const EditBatchModal = ({
    isOpen,
    onClose,
    batch,
    editingBatchData,
    setEditingBatchData,
    availableWatches,
    batchWatchSortField,
    batchWatchSortDirection,
    onBatchWatchSort,
    onUpdateBatchDetails,
    onAddWatchToBatch,
    onRemoveWatchFromBatch,
    getWatchStatusColor,
    getSortedBatchWatches,
}: EditBatchModalProps) => {
    const getSortIcon = (field: string) => {
        if (batchWatchSortField !== field) return null;
        return batchWatchSortDirection === "asc" ? (
            <ChevronUp className="ml-1 inline h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 inline h-4 w-4" />
        );
    };

    if (!batch) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Batch: {batch.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {/* Batch Details Form */}
                    <div className="space-y-4 rounded-lg border bg-slate-50 p-4">
                        <h4 className="font-medium">Batch Details</h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Batch Name</label>
                                <Input
                                    value={editingBatchData.name || ""}
                                    onChange={(e) =>
                                        setEditingBatchData({
                                            ...editingBatchData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Tracking Number
                                </label>
                                <Input
                                    value={editingBatchData.trackingNumber || ""}
                                    onChange={(e) =>
                                        setEditingBatchData({
                                            ...editingBatchData,
                                            trackingNumber: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Origin</label>
                                <Input
                                    value={editingBatchData.origin || ""}
                                    onChange={(e) =>
                                        setEditingBatchData({
                                            ...editingBatchData,
                                            origin: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Destination
                                </label>
                                <Input
                                    value={editingBatchData.destination || ""}
                                    onChange={(e) =>
                                        setEditingBatchData({
                                            ...editingBatchData,
                                            destination: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Shipped Date
                                </label>
                                <Input
                                    type="date"
                                    value={editingBatchData.shippedDate || ""}
                                    onChange={(e) =>
                                        setEditingBatchData({
                                            ...editingBatchData,
                                            shippedDate: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Est. Delivery
                                </label>
                                <Input
                                    type="date"
                                    value={editingBatchData.estimatedDelivery || ""}
                                    onChange={(e) =>
                                        setEditingBatchData({
                                            ...editingBatchData,
                                            estimatedDelivery: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Notes</label>
                            <Textarea
                                value={editingBatchData.notes || ""}
                                onChange={(e) =>
                                    setEditingBatchData({
                                        ...editingBatchData,
                                        notes: e.target.value,
                                    })
                                }
                                rows={3}
                            />
                        </div>

                        <Button onClick={onUpdateBatchDetails} className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Update Batch Details
                        </Button>
                    </div>

                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                            Watches in this batch ({batch.watches.length})
                        </h4>
                        <Button
                            onClick={() => onAddWatchToBatch(batch.id)}
                            className="flex items-center gap-1"
                        >
                            <Plus className="h-3 w-3" />
                            Add Watch
                        </Button>
                    </div>

                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">Image</TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-slate-100"
                                        onClick={() => onBatchWatchSort("name")}
                                    >
                                        Name {getSortIcon("name")}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-slate-100"
                                        onClick={() => onBatchWatchSort("sku")}
                                    >
                                        SKU {getSortIcon("sku")}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-slate-100"
                                        onClick={() => onBatchWatchSort("brand")}
                                    >
                                        Brand {getSortIcon("brand")}
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead className="w-16">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {getSortedBatchWatches(batch.watches).map((watch) => {
                                    const fullWatch = availableWatches.find(
                                        (w) => w.id === watch.id,
                                    );
                                    return (
                                        <TableRow key={watch.id}>
                                            <TableCell>
                                                <img
                                                    src={watch.image}
                                                    alt={watch.name}
                                                    className="h-12 w-12 rounded object-cover"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {watch.name}
                                            </TableCell>
                                            <TableCell>{watch.sku}</TableCell>
                                            <TableCell>{watch.brand}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getWatchStatusColor(
                                                        fullWatch?.status || "Draft",
                                                    )}
                                                >
                                                    {fullWatch?.status || "Unknown"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {fullWatch?.location || batch.destination}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        onRemoveWatchFromBatch(batch.id, watch.id)
                                                    }
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
