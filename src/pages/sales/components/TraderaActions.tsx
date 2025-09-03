import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { WatchResource } from "@/types/resources/watch";
import { router } from "@inertiajs/react";
import { Loader2, RefreshCw, Upload } from "lucide-react";
import { useState } from "react";

interface Props {
    selectedWatches: WatchResource["id"][];
    watches: WatchResource[];
    watchPlatforms: Record<string, string>;
}

export default function TraderaActions({ selectedWatches, watches, watchPlatforms }: Props) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const { toast } = useToast();

    const handleTraderaListing = async () => {
        if (selectedWatches.length === 0) {
            toast({
                title: "No watches selected",
                description: "Please select watches to list on Tradera",
                variant: "destructive",
            });
            return;
        }

        // Filter watches that are set to Tradera platform
        const traderaWatches = selectedWatches.filter((watchId) => watchPlatforms[watchId] === "Tradera (Auction)");

        if (traderaWatches.length === 0) {
            toast({
                title: "No Tradera watches selected",
                description: "Please select watches that are set to Tradera platform",
                variant: "destructive",
            });
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch("/api/tradera/bulk-create-listings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
                },
                body: JSON.stringify({
                    watch_ids: traderaWatches,
                    platform: "Tradera (Auction)",
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast({
                    title: "Success!",
                    description: result.message,
                });

                // Refresh the page to show updated statuses
                router.reload();
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to create Tradera listings",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Tradera listing error:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSyncOrders = async () => {
        setIsSyncing(true);

        try {
            const response = await fetch("/api/tradera/sync-orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "",
                },
            });

            const result = await response.json();

            if (result.success) {
                toast({
                    title: "Sync Complete!",
                    description: `${result.processed_count || 0} orders processed successfully`,
                });
            } else {
                toast({
                    title: "Sync Failed",
                    description: result.message || "Failed to sync Tradera orders",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Tradera sync error:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred during sync",
                variant: "destructive",
            });
        } finally {
            setIsSyncing(false);
        }
    };

    // Only show if any selected watches are set to Tradera
    const hasTraderaWatches = selectedWatches.some((watchId) => watchPlatforms[watchId] === "Tradera (Auction)");

    if (!hasTraderaWatches) {
        return null;
    }

    const traderaCount = selectedWatches.filter((watchId) => watchPlatforms[watchId] === "Tradera (Auction)").length;

    return (
        <div className="mb-6 flex gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Tradera Actions ({traderaCount} watches):</span>
            </div>

            <Button variant="outline" size="sm" onClick={handleTraderaListing} disabled={isProcessing} className="border-blue-300 text-blue-600 hover:bg-blue-100">
                {isProcessing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Listings...
                    </>
                ) : (
                    <>
                        <Upload className="mr-2 h-4 w-4" />
                        Create Tradera Listings
                    </>
                )}
            </Button>

            <Button variant="outline" size="sm" onClick={handleSyncOrders} disabled={isSyncing} className="border-green-300 text-green-600 hover:bg-green-100">
                {isSyncing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Syncing Orders...
                    </>
                ) : (
                    <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Tradera Orders
                    </>
                )}
            </Button>
        </div>
    );
}
