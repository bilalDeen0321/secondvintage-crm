import Status from "@/app/models/Status";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import { onBulkAction } from "../_actions";

export default function WatchBulkActions({
    selectedWatches,
    locations,
    batches,
    setSelectedWatches,
}) {
    return (
        selectedWatches.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                        {selectedWatches.length} watches selected - Bulk Actions:
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-700">Status:</span>
                    <Select
                        onValueChange={(value) => {
                            onBulkAction("status", value, selectedWatches);
                        }}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {Status.allStatuses().map((status, index) => (
                                <SelectItem key={index} value={status}>
                                    {Status.toHuman(status)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-700">Location:</span>
                    <Select
                        onValueChange={(value) => onBulkAction("location", value, selectedWatches)}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Change Location" />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map((location, index) => (
                                <SelectItem key={index} value={location}>
                                    {location}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-700">Batch Group:</span>
                    <Select
                        onValueChange={(value) => onBulkAction("batch", value, selectedWatches)}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Change Batch" />
                        </SelectTrigger>
                        <SelectContent>
                            {batches.map((batch, index) => (
                                <SelectItem key={index} value={batch}>
                                    {batch}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedWatches([])}
                    className="border-blue-300 text-blue-600 hover:bg-blue-100"
                >
                    Clear Selection
                </Button>
            </div>
        )
    );
}
