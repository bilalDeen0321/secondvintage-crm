import { TableAlertBox } from "@/components/table/cols/TableAlertBox";
import { SaleWatchResource } from "@/types/resources/watch";
import { Eye } from "lucide-react";
import { SaleTableWatchItemProps } from "./SaleTableWatchItem";

import { echo } from "@/app/echo";
import PlatformData from "@/app/models/PlatformData";
import { Button } from "@/components/ui/button";
import { ProcessPlatformEvent } from "@/types/events/laravel-events";
import { useEffect, useState } from "react";

interface SaleTablePlatformItemProps {
    onViewPlatformData: SaleTableWatchItemProps["onViewPlatformData"];
    platform: string;
    processing: boolean;
    watch: SaleWatchResource;
}

export function SaleTablePlatformItem({ onViewPlatformData, platform, watch }: SaleTablePlatformItemProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Initialize loading state based on isAIProcessing prop
    useEffect(() => {
        //the the current active platform item
        const pitem = watch?.platforms?.find((p) => p.name === platform);

        //detarmine if the platform is currently has an error accured
        if (pitem?.status === PlatformData.STATUS_FAILED) {
            setMessage(pitem.message || "There was an error");
        }

        //set loading state based on the platform item status
        setLoading(pitem?.status === PlatformData.STATUS_LOADING);

        //cleanup function when component unmounts or platform/watch changes
        // return () => setLoading(false);
    }, [platform, watch?.platforms]);

    //listeners
    useEffect(() => {
        //
        if (!watch?.routeKey) return;
        const channel = `platform.${watch.routeKey}`;
        const handler = (event: ProcessPlatformEvent) => {
            console.log("Received event from table:", event);
            setLoading(event?.platform?.status === PlatformData.STATUS_LOADING);
            if (event?.platform?.status === PlatformData.STATUS_FAILED) {
                setMessage(event?.platform?.message || "There was an error");
            }
        };

        echo.listen(channel, "ProcessPlatformEvent", handler);

        return () => {
            echo.leave(channel);
        };
    }, [watch?.routeKey]);

    if (!watch) return null;

    if (loading) {
        return (
            <td className="p-2">
                <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
                </div>{" "}
            </td>
        );
    }

    if (message) {
        return (
            <td className="p-2">
                <TableAlertBox title="Platform Data Error" message={message} />
            </td>
        );
    }

    return (
        <td className="p-2">
            {platform && platform !== "None" && (
                <Button variant="ghost" size="sm" onClick={() => onViewPlatformData(watch, platform)} className="text-blue-600 hover:text-blue-800">
                    <Eye className="mr-1 h-4 w-4" />
                    Data
                </Button>
            )}
        </td>
    );
}
