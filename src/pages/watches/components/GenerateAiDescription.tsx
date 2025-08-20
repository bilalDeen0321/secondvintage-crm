/* eslint-disable @typescript-eslint/no-explicit-any */

import { echo } from "@/app/echo";
import { getError } from "@/app/errors";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WatchResource } from "@/types/resources/watch";
import axios from "axios";
import {
    Loader2,
    RotateCcw,
    Sparkles
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { watchInitData } from "../_utils";

type Props = {
    watch?: WatchResource | null;
    data: ReturnType<typeof watchInitData>
    setData: (key: keyof ReturnType<typeof watchInitData>, value: any) => void;
}


export default function GenerateAiDescription(props: Props) {

    const { data, setData, watch = {} as WatchResource } = props;

    //state
    const [loading, setLoading] = useState(false);

    /**
     * Handlers
     */
    const handleRest = () => {
        const reset_confirm = confirm(
            'Are you sure want to reset the AI thread id? This action cannot be undone.'
        );

        if (reset_confirm) {
            setData('ai_thread_id', '')

            if (watch.routeKey) {
                axios.post(route('api.make-hooks.ai-description.reset_thread'), { routeKey: watch.routeKey }).then(function () {
                    toast.success("AI thread reset for this watch");
                }).catch(error => {
                    toast.error(error?.message)
                })
            }
        }
    }

    // // generate ai description
    // const onGenerate = async () => {

    //     if (!data.images.some(i => i.useForAI)) return;

    //     setLoading(true);

    //     axios.post(route("api.make-hooks.ai-description.generate"), data, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data'
    //         }
    //     }).then(function (response) {

    //         console.log(response.data.watch);
    //         if (!response.data?.watch) {
    //             toast.error(response.data?.message || "Failed to generate description");
    //             return;
    //         }

    //         const resWatch = (response.data?.watch || {}) as WatchResource | null;

    //         Object.keys(resWatch).forEach((key: keyof typeof data) => {
    //             setData(key, resWatch[key] || '')
    //         });

    //         window.sessionStorage.setItem('watch_draft_route_key', String(resWatch.routeKey))

    //     }).finally(() => setLoading(false)).catch(err => toast.error(getError(err)))


    // };

    // generate ai description
    const onGenerate = async () => {

        if (!data.images.some(i => i.useForAI)) return;

        setLoading(true);

        axios.post(route("api.make-hooks.ai-description.generate"), data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((response) => {
            console.log('response: ', response)
            // Success check
            if (response.data?.status === "success") {
                toast.success("Watch AI description generated");
                setData('ai_thread_id', response?.data?.ai_thread_id)
                setData('description', response?.data?.description)
                setData('status', response?.data?.status_selected)
            } else {
                toast.error(response.data?.message || "Failed to generate description");
            }

        }).catch(error => toast.error(getError(error)))
            .finally(() => setLoading(false))
    };

    //listeners
    useEffect(() => {

        const routeKey = watch?.routeKey || data.routeKey;

        if (routeKey) {

            const channel = `watch.${watch.routeKey}`;

            echo.listen(channel, 'WatchAiDescriptionProcessed', (event: WatchResource) => {

                console.log(event);

                if (event.ai_status === 'loading') {
                    setLoading(true);
                    return;
                }

                setLoading(false);

            })
        }

    }, [data.routeKey, watch.routeKey])

    return <div>
        <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">
                AI Instructions
            </label>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRest}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={!watch?.ai_thread_id}
            >
                <RotateCcw className="mr-1 h-4 w-4" />
                Reset AI
            </Button>
        </div>
        <Textarea
            name="ai_instructions"
            value={data.ai_instructions}
            onChange={(e) => setData('ai_instructions', e.target.value)}
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
                disabled={!data.images.some(m => m.useForAI) || loading}
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
}