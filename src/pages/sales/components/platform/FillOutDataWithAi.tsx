import { echo } from "@/app/echo";
import PlatformData from "@/app/models/PlatformData";
import { Button } from "@/components/ui/button";
import { ProcessPlatformEvent } from "@/types/events/laravel-events";
import { PlatformResource } from "@/types/resources/platform-data";
import { router } from "@inertiajs/react";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { PlatformDataModalProps } from "./_actions";
interface FillOutDataWithAiProps {
    watch: PlatformDataModalProps["watch"];
    platform: PlatformResource;
}

export default function FillOutDataWithAi({ watch, platform }: FillOutDataWithAiProps) {
    //states
    const [loading, setLoading] = useState(platform.status === PlatformData.STATUS_LOADING);

    //hanlders
    const handleFillWithAI = () => {
        // prevent multiple clicks
        if (loading) return;
        setLoading(true);
        const data = { platform: watch.platform };
        //make the request to fill out data with AI in background
        router.post(route("platform-data.ai-fill", watch?.routeKey), data, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    //listeners
    useEffect(() => {
        //
        if (!watch?.routeKey) return;
        const channel = `platform.fill.${watch.routeKey}`;
        const handler = (event: ProcessPlatformEvent) => {
            setLoading(event?.platform?.status === PlatformData.STATUS_LOADING);
        };
        echo.listen(channel, "ProcessPlatformEvent", handler);
        return () => {
            echo.leave(channel);
        };
    }, [watch?.routeKey]);

    return (
        <div className="flex gap-2">
            <Button onClick={handleFillWithAI} size="sm" disabled={loading} className="border border-orange-500 bg-white text-orange-500 hover:border-orange-600 hover:bg-gray-50 disabled:opacity-50">
                {loading ? (
                    <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Fill out data with AI
                    </>
                )}
            </Button>
        </div>
    );
}
