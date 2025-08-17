/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { WatchResource } from "@/types/resources/watch";
import axios, { AxiosError } from "axios";
import {
    Loader2,
    RotateCcw,
    Sparkles
} from "lucide-react";
import { useState } from "react";
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
    const [processing, setLoading] = useState(false);

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

    // generate ai description
    const onGenerate = async () => {

        if (!data.images.some(i => i.useForAI)) return;

        setLoading(true);

        try {
            // Make the server request
            const response = await axios.post(route("api.make-hooks.ai-description.generate"), data);


            // Success check
            if (response.data?.status === "success") {
                toast.success("Watch AI description generated");
                setData('ai_thread_id', response?.data?.ai_thread_id)
                setData('description', response?.data?.description)
                setData('status', response?.data?.status_selected)
            } else {
                toast.error(response.data?.message || "Failed to generate description");
            }

        } catch (error) {
            const err = error as AxiosError<any>;

            // Server returned a response with error status (4xx, 5xx)
            if (err.response) {
                toast.error(err.response.data?.message || "Server error occurred");
                console.error("Error details:", err.response.data);
            }
            // Request was made but no response
            else if (err.request) {
                toast.error("No response from server");
                console.error("No response:", err.request);
            }
            // Something else happened
            else {
                toast.error(err.message || "Unknown error");
            }

        } finally {
            setLoading(false);
        }
    };

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
                disabled={!data.images.some(m => m.useForAI) || processing}
                className="text-amber-600 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {processing ? (
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