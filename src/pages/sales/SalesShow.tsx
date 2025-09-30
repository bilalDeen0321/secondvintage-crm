import { PlatformResource } from "@/types/resources/platform-data";
import { SaleWatchResource } from "@/types/resources/watch";
import { useState } from "react";
import { PlatformField } from "./components/platform/_actions";
import { PlatformDataModalImageSection } from "./components/platform/PlatformDataModalImageSection";
import PlatformDataTable from "./components/platform/PlatformDataTable";
import { PlatformFooterActions } from "./components/platform/PlatformFooterActions";
import { PlatformNavigation } from "./components/platform/PlatformNavigation";
import PlatformNotes from "./components/platform/PlatformNotes";

import Str from "@/app/support/Str";
import Layout from "@/components/Layout";
import { router } from "@inertiajs/react";
import { X } from "lucide-react";
import FillOutDataWithAi from "./components/platform/FillOutDataWithAi";

type Props = {
    watch: SaleWatchResource;
    platform: PlatformResource;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params?: Record<string, any>;
};
export default function SalesShow({ watch, platform, params = {} }: Props) {
    const [platformData, setPlatformData] = useState<PlatformField[]>(platform?.data || []);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const watchImages = watch.images || [];
    const hasImages = watchImages.length > 0;

    const handleBackToIndex = () => {
        router.visit(route("sales.index"), {
            data: params,
            preserveState: false,
            preserveScroll: true,
        });
    };

    return (
        <Layout>
            {/* Navigation arrows - positioned outside the modal */}
            <PlatformNavigation />

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
                    {/* Header section */}
                    <div className="flex-shrink-0 border-b border-slate-200 p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{Str.title(platform.name)} Platform Data</h2>
                            </div>

                            <div className="flex items-center space-x-3">
                                <FillOutDataWithAi watch={watch} platform={platform} />
                                <button onClick={handleBackToIndex} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content section */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Watch Images and Basic Info Section */}
                        {hasImages && <PlatformDataModalImageSection selectedImageIndex={selectedImageIndex} setSelectedImageIndex={setSelectedImageIndex} watch={watch} watchImages={watchImages} />}

                        {/* Platform Data Table */}
                        <PlatformDataTable setPlatformData={setPlatformData} platformData={platformData} />

                        {/* Platform Notes */}
                        {/* <PlatformNotes platform={platform?.name} /> */}

                        {/* Footer with action buttons */}
                        <PlatformFooterActions platformData={platformData} watch={watch} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
