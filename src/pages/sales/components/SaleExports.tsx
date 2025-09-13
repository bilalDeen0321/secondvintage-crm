import PlatformData, { PlatformTypes } from "@/app/models/PlatformData";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { WatchResource } from "@/types/resources/watch";
import { Download } from "lucide-react";
import { useState } from "react";

type Props = {
    watch_ids: WatchResource["id"][];
};

export default function SaleExports({ watch_ids }: Props) {
    //
    const [loading, setLoading] = useState(false);

    if (!watch_ids.length) return null;

    const onExport = (platform: PlatformTypes) => {
        setLoading(true);
        const url = platform === PlatformData.CATAWIKI ? route("sales.exports.catawiki") : route("sales.exports.tradera");
        const form = document.createElement("form");
        form.method = "POST";
        form.action = url;

        // Add CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
        if (csrfToken) {
            const csrfInput = document.createElement("input");
            csrfInput.type = "hidden";
            csrfInput.name = "_token";
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        }

        // Add each ID as a separate input for array handling
        watch_ids.forEach((id, index) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = `ids[${index}]`;
            input.value = id.toString();
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        setLoading(false);
    };

    return (
        <div className="mb-6 flex gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">{watch_ids?.length} watches selected - Export to:</span>
            </div>
            <Button disabled={loading} variant="outline" size="sm" onClick={() => onExport(PlatformData.CATAWIKI)} className="border-amber-300 text-amber-600 hover:bg-amber-100">
                {loading ? <Loading text="Exporting.." /> : "Catawiki"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => onExport(PlatformData.TRADERA)} className="border-amber-300 text-amber-600 hover:bg-amber-100">
                Tradera
            </Button>
            {/* <Button variant="outline" size="sm" onClick={() => alert("disabled")} className="border-amber-300 text-amber-600 hover:bg-amber-100">
                General CSV
            </Button> */}
        </div>
    );
}
