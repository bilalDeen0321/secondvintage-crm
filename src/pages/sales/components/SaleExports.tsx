import { Button } from "@/components/ui/button";
import { WatchResource } from "@/types/resources/watch";
import { Download } from "lucide-react";

type SortField =
    | "name"
    | "sku"
    | "brand"
    | "acquisitionCost"
    | "batchGroup"
    | "status"
    | "location";
type SortDirection = "asc" | "desc";

type Props = {
    watches: WatchResource[];
    selectedWatches: string[];
    watchPlatforms: Record<string, string>;
};

export default function SaleExports({ watches, selectedWatches, watchPlatforms }: Props) {
    const handleExport = (platform: string) => {
        const selectedWatchData = watches.filter((w) => selectedWatches.includes(String(w.id)));

        // Create CSV content
        const headers = [
            "Name",
            "SKU",
            "Brand",
            "Status",
            "Acquisition Cost",
            "Platform",
            "Description",
        ];
        const csvContent = [
            headers.join(","),
            ...selectedWatchData.map((watch) =>
                [
                    `"${watch.name}"`,
                    watch.sku,
                    watch.brand,
                    watch.status,
                    watch.original_cost || "",
                    watchPlatforms[watch.id] || "None",
                    `"${watch.description || ""}"`,
                ].join(","),
            ),
        ].join("\n");

        // Download CSV
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${platform}_export_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    if (!selectedWatches.length) return null;

    return <div className="mb-6 flex gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
                {selectedWatches.length} watches selected - Export to:
            </span>
        </div>
        <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("Catawiki")}
            className="border-amber-300 text-amber-600 hover:bg-amber-100"
        >
            Catawiki
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("Tradera")}
            className="border-amber-300 text-amber-600 hover:bg-amber-100"
        >
            Tradera
        </Button>
        <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("General")}
            className="border-amber-300 text-amber-600 hover:bg-amber-100"
        >
            General CSV
        </Button>
    </div>;
}
