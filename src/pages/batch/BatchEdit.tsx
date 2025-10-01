import { Batch } from "@/app/models/Batch";
import Status from "@/app/models/Status";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "@/components/ui/Link";
import { useToast } from "@/components/ui/use-toast"; 

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
import { useState } from "react";

interface Location {
  id: number
  name: string
  country_code: string
}
interface Props {
    batch: BatchResource;
    watches: WatchResource[];
    locations: Location[];
}
export default function BatchEdit({ batch, watches, locations }: Props) {
    const [batchWatchSortField, setBatchWatchSortField] = useState<string>("name");
    const [batchWatchSortDirection, setBatchWatchSortDirection] = useState<"asc" | "desc">("asc");
        const { toast } = useToast();
    
    const { data, setData, put, processing, errors } = useForm({
        name: batch.name || "",
        tracking_number: batch.trackingNumber || "",
        origin: batch.origin,
        destination: batch?.destination || "",
        status: batch.status || Batch.STATUS_PREPARING,
        location: batch.location || "",
        notes: batch.notes || "",
        shipped_date: batch.shippedDate || "",
        estimated_delivery: batch.estimatedDelivery || "",
        actual_delivery: batch.actualDelivery || "",
    });  
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("batches.update", batch.id));
    };

    const onWatchRemove = (
        routeKey: BatchResource["routeKey"],
        watchKey: WatchResource["routeKey"],
        e,
    ) => { 
        console.log(routeKey);
        console.log(watchKey);
         console.log(batch.watches); 
    e.preventDefault(); // stop default navigation/reload

    if (window.confirm("Are you sure you want to remove this watch?")) {
      router.delete(route("batches.removeWatch", [routeKey, watchKey]), {
        preserveState: true,
        onSuccess: () => {            
            toast({ description: 'Watch removed successfully', variant: "default" });
          batch.watches = batch.watches.filter((w) => w.key !== watchKey)
        },
      })
    } 
    };

    // Sorting functions
    const onBatchWatchSort = (field: string) => {
        if (batchWatchSortField === field) {
            setBatchWatchSortDirection(batchWatchSortDirection === "asc" ? "desc" : "asc");
        } else {
            setBatchWatchSortField(field);
            setBatchWatchSortDirection("asc");
        }
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
        <Layout>
            <Dialog open={true} onOpenChange={() => router.visit(route("batches.index"))}>
                <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Batch: {batch.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                        {/* Batch Details Form */}
                        <form
                            onSubmit={onSubmit}
                            className="space-y-4 rounded-lg border bg-slate-50 p-4"
                        >
                            <h4 className="font-medium">Batch Details</h4>

                            {/* Form fields with validation */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Batch Name
                                    </label>
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
                                        onChange={(e) =>
                                            setData("estimated_delivery", e.target.value)
                                        }
                                        className={
                                            errors.estimated_delivery ? "border-red-500" : ""
                                        }
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
                                    <label className="mb-1 block text-sm font-medium">Location</label>
                                    <Select
                                        value={data.location}
                                        onValueChange={(value) => setData("location", value)}
                                    >
                                        <SelectTrigger
                                            className={errors.location ? "border-red-500" : ""}
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locations.map((loc) => (
                                                <SelectItem key={loc.name} value={loc.name}>
                                                    {loc.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.location && (
                                        <p className="mt-1 text-sm text-red-500">{errors.location}</p>
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
                            <Link
                                href={route("batches.watches.index", batch.routeKey)}
                                className="flex items-center gap-1"
                            >
                                <Plus className="h-3 w-3" />
                                Add Watch
                            </Link>
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
                                    {batch.watches.map((watch, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <img
                                                        src={
                                                            watch.image_urls.at(0) ||
                                                            "/placeholder.png"
                                                        }
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
                                                            watch?.status || "Draft"
                                                        )}
                                                    >
                                                        {Status.toHuman(watch?.status|| "Unknown") }
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {watch?.location || batch.destination}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) =>
                                                            onWatchRemove(
                                                                batch.routeKey,
                                                                watch.routeKey,
                                                                e,
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
        </Layout>
    );
}
