import { echo } from "@/app/echo";
import PlatformData from "@/app/models/PlatformData";
import { Button } from "@/components/ui/button";
import { ProcessPlatformEvent } from "@/types/events/laravel-events";
import { PlatformResource } from "@/types/resources/platform-data";
import { router } from "@inertiajs/react";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { PlatformDataModalProps } from "./_actions";
import { TableAlertBox } from "@/components/table/cols/TableAlertBox";
interface FillOutDataWithAiProps {
    watch: PlatformDataModalProps["watch"];
    platform: PlatformResource;
}

export default function FillOutDataWithAi({ watch, platform: initialPlatform }: FillOutDataWithAiProps) {
    //states
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [platform, setPlatform] = useState<PlatformResource>(initialPlatform);

    useEffect(() => {
        setPlatform(initialPlatform);
    }, [initialPlatform]);

    useEffect(() => {
        setLoading(platform?.status === PlatformData.STATUS_LOADING);
        if (platform?.status === PlatformData.STATUS_FAILED) {
            setMessage(platform?.message || "There was an error");
        }
    }, [platform]);

    //listeners
    useEffect(() => {
        if (watch?.routeKey) {
            const channel = `platform.fill.${watch.routeKey}`;
            echo.listen(channel, "ProcessPlatformEvent", (event: ProcessPlatformEvent) => {
                console.log("ProcessPlatformEvent", event);
                // setLoading(event?.platform?.status === PlatformData.STATUS_LOADING);
                // if (event?.platform?.status === PlatformData.STATUS_FAILED) {
                //     setMessage(event?.platform?.message || "There was an error");
                // }

                // update local state with new platform data
                setPlatform(prev => ({
                    ...prev,
                    ...event.platform, // merge new platform info into old one
                }));
            });
            return () => {
                echo.leave(channel);
            };
        }
    }, [watch?.routeKey]);

    //hanlders
    const onAiAction = () => {
        if (loading) return;
        // clear old error state
        setMessage("");
        setPlatform(prev => ({
            ...prev,
            status: PlatformData.STATUS_LOADING, // optional, just to reflect UI
        }));

        setLoading(true);
        const data = { platform: watch.platform };
        //make the request to fill out data with AI in background
        router.post(route("platform-data.ai-fill", watch?.routeKey), data, {
            preserveState: true,
            preserveScroll: true,
            // onFinish: () => setLoading(false),
        });
    };

    return (
        <div className="flex gap-2">
            {platform?.status === PlatformData.STATUS_FAILED && (
                <TableAlertBox title="Platform Data Error" message={message} />
            )}

            <Button onClick={onAiAction} size="sm" disabled={loading} className="border border-orange-500 bg-white text-orange-500 hover:border-orange-600 hover:bg-gray-50 disabled:opacity-50">
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
