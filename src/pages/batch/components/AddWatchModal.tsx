import Status from "@/app/models/Status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BatchResource } from "@/types/resources/batch";
import { WatchResource } from "@/types/resources/watch";
import { router } from "@inertiajs/react";
import { ChevronDown, ChevronUp, Plus, Search } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    batch: BatchResource;
    watchSearchTerm: string;
    setWatchSearchTerm: (term: string) => void;
    watchStatusFilter: string;
    setWatchStatusFilter: (status: string) => void;
    filteredAndSortedWatches: WatchResource[];
    addWatchSortField: string;
    addWatchSortDirection: "asc" | "desc";
    onAddWatchSort: (field: string) => void;
    selectedWatchesToAdd: (number | string)[];
    onSelectAllWatches: (checked: boolean) => void;
    onSelectWatch: (watchId: number, checked: boolean) => void;
    onAddSelectedWatches: () => void;
}

export const AddWatchModal = (props: Props) => {
    const {
        isOpen,
        onClose,
        batch,
        watchSearchTerm,
        setWatchSearchTerm,
        watchStatusFilter,
        setWatchStatusFilter,
        filteredAndSortedWatches,
        addWatchSortField,
        addWatchSortDirection,
        onAddWatchSort,
        selectedWatchesToAdd,
        onSelectAllWatches,
        onSelectWatch,
    } = props;
    const getSortIcon = (field: string) => {
        if (addWatchSortField !== field) return null;
        return addWatchSortDirection === "asc" ? <ChevronUp className="ml-1 inline h-4 w-4" /> : <ChevronDown className="ml-1 inline h-4 w-4" />;
    };

    const onAssignWatches = () => {
        const data = { ids: selectedWatchesToAdd };
        router.post(route("batches.assignWatches", batch?.routekey), data, {
            preserveState: false,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Watch to Batch</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Filters for watches */}
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                            <Input placeholder="Search watches..." value={watchSearchTerm} onChange={(e) => setWatchSearchTerm(e.target.value)} className="pl-10" />
                        </div>
                        <Select value={watchStatusFilter} onValueChange={setWatchStatusFilter}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {Status.allStatuses().map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {Status.toHuman(status)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Multi-select actions */}
                    {selectedWatchesToAdd.length > 0 && (
                        <div className="flex items-center gap-4 rounded-lg bg-blue-50 p-3">
                            <span className="text-sm text-blue-800">
                                {selectedWatchesToAdd.length} watch
                                {selectedWatchesToAdd.length !== 1 ? "es" : ""} selected
                            </span>
                            <Button onClick={onAssignWatches} className="flex items-center gap-1" size="sm">
                                <Plus className="h-3 w-3" />
                                Add Selected
                            </Button>
                            <Button onClick={() => onSelectAllWatches(false)} variant="outline" size="sm">
                                Clear Selection
                            </Button>
                        </div>
                    )}

                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedWatchesToAdd.length === filteredAndSortedWatches.length && filteredAndSortedWatches.length > 0}
                                            onCheckedChange={onSelectAllWatches}
                                        />
                                    </TableHead>
                                    <TableHead className="w-16">Image</TableHead>
                                    <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => onAddWatchSort("name")}>
                                        Name {getSortIcon("name")}
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => onAddWatchSort("sku")}>
                                        SKU {getSortIcon("sku")}
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => onAddWatchSort("brand")}>
                                        Brand {getSortIcon("brand")}
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => onAddWatchSort("status")}>
                                        Status {getSortIcon("status")}
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:bg-slate-100" onClick={() => onAddWatchSort("location")}>
                                        Location {getSortIcon("location")}
                                    </TableHead>
                                    <TableHead className="w-16">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedWatches.map((watch) => (
                                    <TableRow key={watch.id}>
                                        <TableCell>
                                            <Checkbox checked={selectedWatchesToAdd.includes(watch.id)} onCheckedChange={(checked) => onSelectWatch(watch.id, checked as boolean)} />
                                        </TableCell>
                                        <TableCell>
                                            <img
                                                src={watch.images?.[0]?.url || "/lovable-uploads/e4da5380-362e-422c-a981-6370f96719da.png"}
                                                alt={watch.name}
                                                className="h-12 w-12 rounded object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{watch.name}</TableCell>
                                        <TableCell>{watch.sku}</TableCell>
                                        <TableCell>{watch.brand}</TableCell>
                                        <TableCell>
                                            <Badge className={Status.toHuman(watch.status)}>{watch.status}</Badge>
                                        </TableCell>
                                        <TableCell>{watch.location}</TableCell>
                                        <TableCell>
                                            <Button size="sm" onClick={() => onSelectWatch(watch.id, true)} className="flex items-center gap-1">
                                                <Plus className="h-3 w-3" />
                                                Add
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
