/* eslint-disable @typescript-eslint/no-explicit-any */
import { Batch } from "@/app/models/Batch";
import Status from "@/app/models/Status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { BatchResource } from "@/types/resources/batch";
import { WatchResource } from "@/types/resources/watch";
import { router, useForm } from "@inertiajs/react";
import { ChevronDown, ChevronUp, Edit, Plus, X } from "lucide-react";
import { useEffect } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    batch: BatchResource;
    editingBatchData: Partial<Batch>;
    setEditingBatchData: (data: Partial<Batch>) => void;
    availableWatches: WatchResource[];
    batchWatchSortField: string;
    batchWatchSortDirection: "asc" | "desc";
    onBatchWatchSort: (field: string) => void;
    onUpdateBatchDetails: () => void;
    onAddWatchToBatch: (routeKey: BatchResource["routekey"]) => void;
    getSortedBatchWatches: (watches: any[]) => any[];
}

export const EditBatchModal = ({
    isOpen,
    onClose,
    batch,
    availableWatches,
    batchWatchSortField,
    batchWatchSortDirection,
    onBatchWatchSort,
    onAddWatchToBatch,
    getSortedBatchWatches,
}: Props) => {
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        name: "",
        tracking_number: "",
        origin: "",
        destination: "",
        status: "",
        notes: "",
        shipped_date: "",
        estimated_delivery: "",
        actual_delivery: "",
    });

    useEffect(() => {
        if (batch) {
            setData({
                name: batch.name || "",
                tracking_number: batch.trackingNumber || "",
                origin: batch.origin || "",
                destination: batch.destination || "",
                status: batch.status || "",
                notes: batch.notes || "",
                shipped_date: batch.shippedDate || "",
                estimated_delivery: batch.estimatedDelivery || "",
                actual_delivery: batch.actualDelivery || "",
            });
            clearErrors();
        }
    }, [batch, setData, clearErrors]);

    const handleUpdateBatchDetails = (e: React.FormEvent) => {
        e.preventDefault();
        if (batch) {
            put(route("batches.update", batch.id), {
                onSuccess: () => onClose(),
                preserveScroll: true,
                preserveState: false,
            });
        }
    };

    const onWatchRemove = (
        routeKey: BatchResource["routekey"],
        watchKey: WatchResource["routeKey"]
    ) => {
        router.delete(route("batches.removeWatch", [routeKey, watchKey]), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    const getSortIcon = (field: string) => {
        if (batchWatchSortField !== field) return null;
        return batchWatchSortDirection === "asc" ? (
            <ChevronUp className="ml-1 inline h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 inline h-4 w-4" />
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Batch: {batch.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {/* Batch Details Form */}
                    <form
                        onSubmit={handleUpdateBatchDetails}
                        className="space-y-4 rounded-lg border bg-slate-50 p-4"
                    >
                        <h4 className="font-medium">Batch Details</h4>

                        {/* Form fields with validation */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Batch Name</label>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Tracking Number
                                </label>
                                <Input
                                    value={data.tracking_number}
                                    onChange={(e) => setData("tracking_number", e.target.value)}
                                    className={errors.tracking_number ? "border-red-500" : ""}
                                />
                                {errors.tracking_number && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.tracking_number}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Origin</label>
                                <Input
                                    value={data.origin}
                                    onChange={(e) => setData("origin", e.target.value)}
                                    className={errors.origin ? "border-red-500" : ""}
                                />
                                {errors.origin && (
                                    <p className="mt-1 text-sm text-red-500">{errors.origin}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Destination
                                </label>
                                <Input
                                    value={data.destination}
                                    onChange={(e) => setData("destination", e.target.value)}
                                    className={errors.destination ? "border-red-500" : ""}
                                />
                                {errors.destination && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.destination}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Shipped Date
                                </label>
                                <Input
                                    type="date"
                                    value={data.shipped_date}
                                    onChange={(e) => setData("shipped_date", e.target.value)}
                                    className={errors.shipped_date ? "border-red-500" : ""}
                                />
                                {errors.shipped_date && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.shipped_date}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Est. Delivery
                                </label>
                                <Input
                                    type="date"
                                    value={data.estimated_delivery}
                                    onChange={(e) => setData("estimated_delivery", e.target.value)}
                                    className={errors.estimated_delivery ? "border-red-500" : ""}
                                />
                                {errors.estimated_delivery && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.estimated_delivery}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Status</label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData("status", value)}
                                >
                                    <SelectTrigger
                                        className={errors.status ? "border-red-500" : ""}
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Batch.allStatuses().map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {Batch.toHuman(status)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Actual Delivery
                                </label>
                                <Input
                                    type="date"
                                    value={data.actual_delivery}
                                    onChange={(e) => setData("actual_delivery", e.target.value)}
                                    className={errors.actual_delivery ? "border-red-500" : ""}
                                />
                                {errors.actual_delivery && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.actual_delivery}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Notes</label>
                            <Textarea
                                value={data.notes}
                                onChange={(e) => setData("notes", e.target.value)}
                                rows={3}
                                className={errors.notes ? "border-red-500" : ""}
                            />
                            {errors.notes && (
                                <p className="mt-1 text-sm text-red-500">{errors.notes}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            {processing ? "Updating..." : "Update Batch Details"}
                        </Button>
                    </form>

                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                            Watches in this batch ({batch.watches.length})
                        </h4>
                        <Button
                            onClick={() => onAddWatchToBatch(batch.routekey)}
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
                                        (w) => w.id === Number(watch.originalId || watch.id)
                                    );

                                    return (
                                        <TableRow key={`${batch.id}-${watch.id}`}>
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
                                                    className={Status.toColorClass(
                                                        fullWatch?.status || "Draft"
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
                                                        onWatchRemove(
                                                            batch.routekey,
                                                            watch.routekey
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {batch.watches.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No watches assigned to this batch yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
