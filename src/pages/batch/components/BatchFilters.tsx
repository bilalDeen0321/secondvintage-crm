import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Grid3x3, List, Plus, Search } from "lucide-react";

interface BatchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
    onCreateBatch: () => void;
}

export const BatchFilters = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    onCreateBatch,
}: BatchFiltersProps) => {
    return (
        <div className="mb-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Batch Management</h1>
                    <p className="mt-1 text-slate-600">
                        Track watch shipments from Vietnam to Denmark
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <ToggleGroup
                        type="single"
                        value={viewMode}
                        onValueChange={(value) => value && setViewMode(value as "grid" | "list")}
                    >
                        <ToggleGroupItem value="list" aria-label="List view">
                            <List className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="grid" aria-label="Grid view">
                            <Grid3x3 className="h-4 w-4" />
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Button onClick={onCreateBatch} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create New Batch
                    </Button>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="relative max-w-md flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                    <Input
                        placeholder="Search batches..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Preparing">Preparing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="In Transit">In Transit</SelectItem>
                        <SelectItem value="Customs">Customs</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
