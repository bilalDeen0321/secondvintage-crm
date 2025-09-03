import PlatformData, { PlatformTypes } from "@/app/models/PlatformData";
import { Button } from "@/components/ui/button";
import { WatchResource } from "@/types/resources/watch";
import { Download } from "lucide-react";
import { useState } from "react";

type SortField = "name" | "sku" | "brand" | "acquisitionCost" | "batchGroup" | "status" | "location";
type SortDirection = "asc" | "desc";

type Props = {
    watch_ids: WatchResource["id"][];
};

export default function SaleExports({ watch_ids }: Props) {
    //
    const [loading, setLoading] = useState(false);

    if (!watch_ids.length) return null;

    const onExport = (platform: PlatformTypes) => {
        setLoading(true);
    };

    return (
        <div className="mb-6 flex gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">{watch_ids?.length} watches selected - Export to:</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => onExport(PlatformData.CATAWIKI)} className="border-amber-300 text-amber-600 hover:bg-amber-100">
                Catawiki
            </Button>
            <Button variant="outline" size="sm" onClick={() => onExport(PlatformData.TRADERA)} className="border-amber-300 text-amber-600 hover:bg-amber-100">
                Tradera
            </Button>
            <Button variant="outline" size="sm" onClick={() => alert("disabled")} className="border-amber-300 text-amber-600 hover:bg-amber-100">
                General CSV
            </Button>
        </div>
    );
}
