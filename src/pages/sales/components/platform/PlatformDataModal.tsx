import Str from "@/app/support/Str";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlatformResource } from "@/types/resources/platform-data";
import { WatchResource } from "@/types/resources/watch";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { PlatformDataModalProps, PlatformField } from "./_actions";
import FillOutDataWithAi from "./FillOutDataWithAi";
import { PlatformDataModalImageSection } from "./PlatformDataModalImageSection";
import PlatformDataTable from "./PlatformDataTable";
import { PlatformFooterActions } from "./PlatformFooterActions";
import { PlatformNavigation } from "./PlatformNavigation";
import PlatformNotes from "./PlatformNotes";

type PlatformViewResponse = {
    platform: PlatformResource | null;
    nextItem: WatchResource | null;
    prevItem: WatchResource | null;
};

const PlatformDataModal = (props: PlatformDataModalProps) => {
    const { watch, platform, isOpen, onClose } = props;

    const platformItemInit = watch?.platforms?.find((p) => p.name === platform) || null;
    const [platformItem, setPlatformItem] = useState(platformItemInit);
    const [platformData, setPlatformData] = useState<PlatformField[]>(platformItemInit?.data || []);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const onNext = props.onNext;

    //use callback to fetch platform data when watch or platform changes
    useEffect(() => {
        const data = { platform: platform };
        router.get(route("platform-data.show", watch?.routeKey), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                const response = page.props.flash?.data as PlatformViewResponse | undefined;
                if (response?.platform) {
                    // You can now access:
                    setPlatformItem(response.platform);
                    setPlatformData(response.platform?.data || []);
                    // responseData.platform - the platform data
                    // responseData.nextItem - next watch item
                    // responseData.prevItem - previous watch item
                }
            },
        });
    }, [platform, watch?.routeKey]);

    if (!watch) return null;

    const handlePrevious = () => {
        alert("Going to previous item");
    };

    const handleNext = () => {
        console.log("Going to next item");
        if (onNext) {
            onNext();
        }
    };

    const watchImages = watch.images || [];
    const hasImages = watchImages.length > 0;

    return (
        <>
            {/* Navigation arrows - positioned outside the modal */}
            <PlatformNavigation handleNext={handleNext} handlePrevious={handlePrevious} onNext={props.onNext} onPrevious={props.onPrevious} />

            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <DialogTitle className="text-2xl font-bold text-slate-900">{Str.title(platform)} Platform Data</DialogTitle>
                            </div>

                            <FillOutDataWithAi watch={watch} platform={platformItem} />
                        </div>
                    </DialogHeader>

                    {/* Watch Images and Basic Info Section */}
                    {hasImages && <PlatformDataModalImageSection selectedImageIndex={selectedImageIndex} setSelectedImageIndex={setSelectedImageIndex} watch={watch} watchImages={watchImages} />}

                    {/* Platform Data Table */}
                    <PlatformDataTable setPlatformData={setPlatformData} platformData={platformData} />

                    {/* Platform Notes */}
                    <PlatformNotes platform={platform} />

                    {/* Footer with action buttons */}
                    <PlatformFooterActions platformData={platformData} watch={watch} platform={platform} />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PlatformDataModal;
