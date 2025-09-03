import { TableAlertBox } from "@/components/table/cols/TableAlertBox";
import { WatchResource } from "@/types/resources/watch";
import { Eye } from "lucide-react";
import { SaleTableWatchItemProps } from "./SaleTableWatchItem";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SaleTablePlatformItemProps {
    onViewPlatformData: SaleTableWatchItemProps["onViewPlatformData"];
    platform: string;
    processing: boolean;
    watch: WatchResource;
}

export function SaleTablePlatformItem({
    onViewPlatformData,
    platform,
    processing,
    watch,
}: SaleTablePlatformItemProps) {
    const [error, setError] = useState("");

    return (
        <td className="p-2">
            {processing ? (
                <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
                </div>
            ) : error ? (
                // Show red exclamation mark for Hamilton Khaki Field

                <TableAlertBox title="Platform Data Error" message="There was an error" />
            ) : (
                platform &&
                platform !== "None" && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewPlatformData(watch, platform)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <Eye className="mr-1 h-4 w-4" />
                        Data
                    </Button>
                )
            )}
        </td>
    );
}
