/* eslint-disable @typescript-eslint/no-explicit-any */

import { in_array } from "@/app/arr";
import { echo } from "@/app/echo";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WatchResource } from "@/types/resources/watch";
import { router } from "@inertiajs/react";
import { Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { watchInitData } from "../_utils";

type Props = {
    watch?: WatchResource | null;
    data: ReturnType<typeof watchInitData>;
    setData: (key: keyof ReturnType<typeof watchInitData>, value: any) => void;
};

export default function GenerateAiDescription(props: Props) {
    const { data, setData, watch = {} as WatchResource } = props;

    //state
    const [loading, setLoading] = useState(false);

    /**
     * Handle ai ai reset thread id in database
     */
    const onResestThread = () => {
        if (confirm("Are you sure want to reset the AI thread id? This action cannot be undone.")) {
            if (data.routeKey) {
                const reset_thread_url = route("api.make-hooks.ai-description.reset_thread");
                router.post(reset_thread_url, data, {
                    preserveScroll: true,
                    onSuccess: () => setData('ai_thread_id', '')
                });
            }
        }
    };

    // generate ai description
    const onGenerate = async () => {
        if (!data.images.some((i) => i.useForAI)) return;
        setLoading(true);
        router.post(route("api.make-hooks.ai-description.with-queue"), data, {
            forceFormData: true,
            fresh: true,
            onFinish: () => setLoading(false),
            onSuccess: (response) => {
                console.log(response);
                const aidata = response.props.flash.data;
                if (!aidata) return;
                const allow_keys = [
                    "routeKey",
                    "status",
                    "ai_thread_id",
                    "sku",
                    "description",
                    "ai_status",
                ];
                Object.keys(aidata)
                    .filter((i) => in_array(i, allow_keys))
                    .forEach((key) => {
                        const k = key as keyof typeof data;
                        if (aidata[k] !== data[k]) {
                            setData(k, aidata[k]);
                        }
                    });
            },
        });
    };

    useEffect(() => {
        if (data?.ai_status === "loading") {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [data.ai_status]);

    //listeners
    useEffect(() => {
        if (watch?.routeKey) {
            const channel = `watch.${watch.routeKey}`;
            const eventJob = "WatchAiDescriptionProcessedEvent";
            echo.listen(channel, eventJob, (event: WatchResource) => {

                if (event?.ai_status != 'loading') {
                    toast(event.ai_message, { type: event.ai_status as any });
                }

                setData("ai_status", event.ai_status);
                setData("status", event.status);
                setData("description", event.description);
                setData("ai_thread_id", event.ai_thread_id);

            });
            return () => echo.leave(`watch.${watch.routeKey}`);
        }
    }, [data.routeKey, setData, watch.routeKey]);

    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">AI Instructions</label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onResestThread}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    disabled={!data?.ai_thread_id}
                >
                    <RotateCcw className="mr-1 h-4 w-4" />
                    Reset AI
                </Button>
            </div>
            <Textarea
                name="ai_instructions"
                value={data.ai_instructions}
                onChange={(e) => setData("ai_instructions", e.target.value)}
                rows={1}
                placeholder=""
                className="min-h-[40px] w-full resize-y"
            />
            <div className="mt-3">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onGenerate}
                    disabled={!data.images.some((m) => m.useForAI) || loading}
                    className="text-amber-600 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            Processing
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-1 h-4 w-4" />
                            Generate Description
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
