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
    setSavedData?: (data: any) => void;
    setAiProcessing?: (state: boolean) => void;
    
};

export default function GenerateAiDescription(props: Props) {
    const { data, setData, watch = {} as WatchResource, setSavedData, setAiProcessing  } = props; 
    //state
    const [loading, setLoading] = useState(false);
   const COOLDOWN_TIME = 90; // seconds
  const STORAGE_KEY = `generateCooldown_${watch.routeKey}`;
  const [cooldown, setCooldown] = useState(0);

    /**
     * Handle ai ai reset thread id in database
     */
    const onResestThread = () => {
        if (confirm("Are you sure want to reset the AI thread id? This action cannot be undone.")) {
            if (data.routeKey) {
                const reset_thread_url = route("api.make-hooks.ai-description.reset_thread");
                router.post(reset_thread_url, data, {
                    preserveScroll: true,
                    onSuccess: () => setData("ai_thread_id", ""),
                });
            }
        }
    };

    // generate ai description
    const onGenerate = async () => {
        if (!data.images.some((i) => i.useForAI)) return;
           setLoading(true);
           setAiProcessing?.(true);
        router.post(route("api.make-hooks.ai-description.with-queue"), data, {
            forceFormData: true,
            preserveScroll: true,
            preserveState: !watch?.routeKey,
           onFinish: () => {
                    setLoading(false);
                    setAiProcessing?.(false);
                },
            onSuccess: (response) => {
                const aidata = response?.props?.flash?.data;
                if (!aidata) return;
                const allow_keys = ["routeKey", "status", "ai_thread_id", "sku", "description", "ai_status"];
                Object.keys(aidata)
                    .filter((i) => in_array(i, allow_keys))
                    .forEach((key) => {
                        const k = key as keyof typeof data;
                        if (aidata[k] !== data[k]) {
                            setData(k, aidata[k]);
                        }
                    });

                // Update savedData to reflect that changes have been saved
                if (setSavedData && watch?.routeKey) {
                    setSavedData({ ...data, ...aidata });
                }
                //set cooldown
                const expiry = Date.now() + COOLDOWN_TIME * 1000;
                localStorage.setItem(STORAGE_KEY, expiry.toString());
                setCooldown(COOLDOWN_TIME); 
            },
        });
    };

    useEffect(() => {
        if (data?.ai_status === "loading") {
            setLoading(true);
            setAiProcessing?.(true);
        } else {
            setLoading(false);
            setAiProcessing?.(false);
        }
    }, [data.ai_status, setAiProcessing]);

    //listeners
    useEffect(() => {
        if (watch?.routeKey) {
            const channel = `watch.${watch.routeKey}`;
            const eventJob = "WatchAiDescriptionProcessedEvent";
            echo.listen(channel, eventJob, (event: WatchResource) => {
                if (event?.ai_status != "loading") {
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


  //Cooldown button
  useEffect(() => {
    if (!watch.routeKey) return;
    const storedEnd = localStorage.getItem(STORAGE_KEY);
    if (storedEnd) {
      const remaining = Math.floor((parseInt(storedEnd) - Date.now()) / 1000);
      if (remaining > 0) setCooldown(remaining);
    }
  }, [watch.routeKey]);

  // 🔹 Countdown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            localStorage.removeItem(STORAGE_KEY);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);
  //EndCooldown button

  
  const isDisabled =
    !data.images.some((m) => m.useForAI) || loading || cooldown > 0;

    return (
        <div>
            <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">AI Instructions</label>
                <Button type="button" variant="outline" size="sm" onClick={onResestThread} className="text-red-600 hover:bg-red-50 hover:text-red-700" disabled={!data?.ai_thread_id}>
                    <RotateCcw className="mr-1 h-4 w-4" />
                    Reset AI
                </Button>
            </div>
            <Textarea name="ai_instructions" value={data.ai_instructions} onChange={(e) => setData("ai_instructions", e.target.value)} rows={1} placeholder="" className="min-h-[40px] w-full resize-y" />
            <div className="mt-3">
                <Button type="button" variant="outline" size="sm" onClick={onGenerate}   disabled={!data.images.some((m) => m.useForAI) || loading || isDisabled} className="text-amber-600 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50">
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
