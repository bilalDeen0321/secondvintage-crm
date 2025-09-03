import { echo } from "@/app/echo";
import PlatformData from "@/app/models/PlatformData";
import { Button } from "@/components/ui/button";
import { ProcessPlatformEvent } from "@/types/events/laravel-events";
import { router } from "@inertiajs/react";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { PlatformDataModalProps } from "./_actions";
interface FillOutDataWithAiProps {
    isAIProcessing: boolean;
    setIsAIProcessing: React.Dispatch<React.SetStateAction<boolean>>;
    watch: PlatformDataModalProps["watch"];
    platform: PlatformDataModalProps["platform"];
}

export default function FillOutDataWithAi({ watch, platform }: FillOutDataWithAiProps) {
    const [loading, setLoading] = useState(false);

    // Initialize loading state based on isAIProcessing prop
    useEffect(() => {
        //the the current active platform item
        const pitem = watch?.platforms?.find((p) => p.name === platform);

        //set loading state based on the platform item status
        setLoading(pitem?.status === PlatformData.STATUS_LOADING);

        //cleanup function when component unmounts or platform/watch changes
        // return () => setLoading(false);
    }, [platform, watch?.platforms]);

    //hanlders
    const handleFillWithAI = () => {
        // prevent multiple clicks
        if (loading) return;

        //start processing
        setLoading(true);

        //generate query params for the request
        const rquestBody = {
            platform,
        };

        //make the request to fill out data with AI in background
        router.post(route("platform-data.ai-fill", watch?.routeKey), rquestBody, {
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
            // console.log("Received event from fill:", event);
            setLoading(event?.platform?.status === PlatformData.STATUS_LOADING);
        };

        echo.listen(channel, "ProcessPlatformEvent", handler);

        return () => {
            echo.leave(channel);
        };
    }, [watch?.routeKey]);

    if (!watch) return null;

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
