import Status from "@/app/models/Status";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { BatchResource } from "@/types/resources/batch";
import { WatchResource } from "@/types/resources/watch";
import { router } from "@inertiajs/react";
import { useToast } from "@/components/ui/use-toast"; 
import { ChevronDown, ChevronUp, Plus, Search } from "lucide-react";

interface LocationResource {
  name: string;
  country_code: string;
}
interface Props {
    batch: BatchResource;
    watches: WatchResource[];
     locations: LocationResource[];
}

export default function BatchWatches(props: Props) {
    const { batch, watches, locations  } = props;
    const { toast } = useToast();
     const flash = props.flash;
       useEffect(() => {
        if (flash?.success) {
        toast({ description: flash.success, variant: "default" });
        }
        if (flash?.error) {
        toast({ description: flash.error, variant: "destructive" });
        }
    }, [flash]);
    // State management

    const [watchSearchTerm, setWatchSearchTerm] = useState("");
    const [watchStatusFilter, setWatchStatusFilter] = useState<string>("all");
   const [watchLocationFilter, setWatchLocationFilter] = useState<string>("all");

    const [batchWatchSortField, setBatchWatchSortField] = useState<string>("name");
    const [batchWatchSortDirection, setBatchWatchSortDirection] = useState<"asc" | "desc">("asc");
    const [addWatchSortField, setAddWatchSortField] = useState<string>("name");
    const [addWatchSortDirection, setAddWatchSortDirection] = useState<"asc" | "desc">("asc");
    const [selectedWatchesToAdd, setSelectedWatchesToAdd] = useState<(number | string)[]>([]);
    const [batches, setBatches] = useState<BatchResource[]>([]);
const [assigning, setAssigning] = useState(false);

     // Filtering logic
  const filteredWatches = watches
    .filter((watch) => {
      // Search filter
      if (watchSearchTerm.trim()) {
        const term = watchSearchTerm.toLowerCase();
        const match =
          watch.name?.toLowerCase().includes(term) ||
          watch.brand?.toLowerCase().includes(term) ||
          watch.sku?.toLowerCase().includes(term) ||
          watch.description?.toLowerCase().includes(term);
        if (!match) return false;
      }

      // Location filter
      if (watchLocationFilter !== "all" && watch.location !== watchLocationFilter) {
        return false;
      }

      // Status filter
      if (watchStatusFilter !== "all" && watch.status !== watchStatusFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const fieldA = (a as any)[addWatchSortField];
      const fieldB = (b as any)[addWatchSortField];
      if (fieldA < fieldB) return addWatchSortDirection === "asc" ? -1 : 1;
      if (fieldA > fieldB) return addWatchSortDirection === "asc" ? 1 : -1;
      return 0;
    });

    const onAddWatchSort = (field: string) => {
        if (addWatchSortField === field) {
            setAddWatchSortDirection(addWatchSortDirection === "asc" ? "desc" : "asc");
        } else {
            setAddWatchSortField(field);
            setAddWatchSortDirection("asc");
        }
    };

    const getSortIcon = (field: string) => {
        if (addWatchSortField !== field) return null;
        return addWatchSortDirection === "asc" ? (
            <ChevronUp className="ml-1 inline h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 inline h-4 w-4" />
        );
    };

    const onSelectWatch = (watchId: number, checked: boolean) => {
        if (checked) {
            setSelectedWatchesToAdd([...selectedWatchesToAdd, watchId]);
        } else {
            setSelectedWatchesToAdd(selectedWatchesToAdd.filter((id) => id !== watchId));
        }
    };

    // Multi-select functions
    const onSelectAllWatches = (checked: boolean) => {
        if (checked) {
            setSelectedWatchesToAdd(watches.map((w) => w.id));
        } else {
            setSelectedWatchesToAdd([]);
        }
    };
const [open, setOpen] = useState(true);

    const onAssignWatches = () => { 
        setAssigning(true);
        const data = { ids: selectedWatchesToAdd };
        router.post(route("batches.assignWatches", batch?.routeKey), data, {
            preserveState: false,
             onSuccess: (flash) => { 
             toast({ description: 'success', variant: "default" });
             setOpen(false);
                setTimeout(() => {
                    router.visit(route("batches.show", batch?.routeKey), { preserveScroll: true });
                }, 200);
            },
            onError: (errors) => {
                setAssigning(false);
            // handle validation errors
            },
             onFinish: () => {
            setAssigning(false); // cleanup after request
            }
        });
    };

    return (
        <Dialog
            open={true}
            onOpenChange={() => router.visit(route("batches.show", batch?.routeKey))}
        >
            <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Watch to Batch</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {/* Filters for watches */}
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                            <Input
                                placeholder="Search watches..."
                                value={watchSearchTerm}
                                onChange={(e) => setWatchSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                       <Select value={watchLocationFilter} onValueChange={setWatchLocationFilter}>

                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {locations.map((loc) => (
                                    <SelectItem key={loc.name} value={loc.name}>
                                    {loc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

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
                            <Button
                                onClick={onAssignWatches}
                                className="flex items-center gap-1"
                                size="sm"
                                disabled={assigning}
                                   >
                                    {assigning ? (
                                    <span className="flex items-center gap-2">
                                    <svg className="h-4 w-4 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        ></circle>
                                        <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    Assigning...
                                    </span>
                                ) : (
                                    <>
                                    <Plus className="h-3 w-3" />
                                    Add Selected
                                    </>
                                )}
                                </Button>

                                 
                            <Button
                                onClick={() => onSelectAllWatches(false)}
                                variant="outline"
                                size="sm"
                            >
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
                                            checked={
                                                selectedWatchesToAdd.length === watches.length &&
                                                watches.length > 0
                                            }
                                            onCheckedChange={onSelectAllWatches}
                                        />
                                    </TableHead>
                                    <TableHead className="w-16">Image</TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-slate-100"
                                        onClick={() => onAddWatchSort("name")}
                                    >
                                        Name {getSortIcon("name")}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-slate-100"
                                        onClick={() => onAddWatchSort("sku")}
                                    >
                                        SKU {getSortIcon("sku")}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-slate-100"
                                        onClick={() => onAddWatchSort("brand")}
                                    >
                                        Brand {getSortIcon("brand")}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-slate-100"
                                        onClick={() => onAddWatchSort("status")}
                                    >
                                        Status {getSortIcon("status")}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-slate-100"
                                        onClick={() => onAddWatchSort("location")}
                                    >
                                        Location {getSortIcon("location")}
                                    </TableHead>
                                    <TableHead className="w-16">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredWatches.map((watch) => (
                                    <TableRow key={watch.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedWatchesToAdd.includes(watch.id)}
                                                onCheckedChange={(checked) =>
                                                    onSelectWatch(watch.id, checked as boolean)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <img
                                                src={
                                                    watch.images?.[0]?.url ||
                                                    "/lovable-uploads/e4da5380-362e-422c-a981-6370f96719da.png"
                                                }
                                                alt={watch.name}
                                                className="h-12 w-12 rounded object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{watch.name}</TableCell>
                                        <TableCell>{watch.sku}</TableCell>
                                        <TableCell>{watch.brand}</TableCell>
                                        <TableCell>
                                            <Badge className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${Status.toColorClass(watch.status)}`}>
                                                 {Status.toHuman(watch.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{watch.location}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="sm"
                                                 disabled={selectedWatchesToAdd.includes(watch.id)}
                                                onClick={() => onSelectWatch(watch.id, true)}
                                                className="flex items-center gap-1"
                                            >
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
}
