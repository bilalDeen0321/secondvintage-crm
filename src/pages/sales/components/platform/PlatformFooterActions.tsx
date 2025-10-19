import { PlatformTypes } from "@/app/models/PlatformData";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { SaleWatchResource, WatchResource } from "@/types/resources/watch";
import { router, usePage } from "@inertiajs/react";
import { Check, Save } from "lucide-react";
import { useState } from "react";
import { PlatformField } from "./_actions";

type Props = {
    platformData: PlatformField[];
    watch: SaleWatchResource;
    platform?: PlatformTypes;
    position?: "head" | "footer"; 
};

export function PlatformFooterActions({ platformData, watch, platform ,position = "footer"}: Props) {
    const { url } = usePage();
    const queryString = url.includes("?") ? url.substring(url.indexOf("?")) : "";

    // Start hooks and states
    const [loading, setLoading] = useState(false);
    const [process, setProcess] = useState(false);
    const nexItem = usePage().props?.nextItem as Pick<WatchResource, "id" | "routeKey"> | null;

    //handler on save
    const onSave = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = { platform: platform, data: platformData as any[] };
        router.post(route("platform-data.save", watch.routeKey), data, {
            // forceFormData: true,
            onStart: () => setProcess(true),
            onFinish: () => setProcess(false),
        });
    };

    const handleApproveGoNext = () => {
        router.put(route("platform-data.listing", watch.routeKey), null, {
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
            onSuccess: () => {
                if (nexItem?.routeKey) {
                    const saveRoute = route("sales.show", nexItem.routeKey);
                    const destination = queryString ? `${saveRoute}?${queryString}` : saveRoute;
                    router.visit(destination);
                } else {
                     const indexRoute = route("sales.index");
                    const destination = queryString ? `${indexRoute}?${queryString}` : indexRoute;
                    router.visit(destination); 
                }
            },
        });
    };

  const containerClass = position == "head"
      ? "flex items-center justify-end gap-2" // header style
      : "mt-6 flex items-center justify-end gap-2 border-t pt-4"; // footer style

    return (
        <div className={containerClass}>
            <Button disabled={process} onClick={onSave} variant="default" className="bg-green-600 hover:bg-green-700">
                <Save className="mr-2 h-4 w-4" />
                {process && <Loading />} Save
            </Button>
            <Button disabled={loading} onClick={handleApproveGoNext} variant="default" className="bg-blue-600 hover:bg-blue-700">
                <Check className="mr-2 h-4 w-4" />
                {loading && <Loading />} Ready for listing - Go Next
            </Button>
        </div>
    );
}
