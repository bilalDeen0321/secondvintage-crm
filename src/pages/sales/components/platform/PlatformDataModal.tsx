import Str from "@/app/support/Str";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { PlatformDataModalProps, PlatformField } from "./_actions";
import { fetchPlatformData } from "./fetch";
import FillOutDataWithAi from "./FillOutDataWithAi";
import { PlatformDataModalImageSection } from "./PlatformDataModalImageSection";
import PlatformDataTable from "./PlatformDataTable";
import { PlatformFooterActions } from "./PlatformFooterActions";
import { PlatformNavigation } from "./PlatformNavigation";
import PlatformNotes from "./PlatformNotes";

const PlatformDataModal = (props: PlatformDataModalProps) => {
    const { watch, platform, isOpen, onClose } = props;
    const [platformData, setPlatformData] = useState<PlatformField[]>([]);
    const [isAIProcessing, setIsAIProcessing] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const onNext = props.onNext;

    //use callback to fetch platform data when watch or platform changes

    useEffect(() => {
        (async () => {
            if (!watch?.routeKey) return;
            // const data = getPlatformData(watch, platform);
            const data = await fetchPlatformData(watch.routeKey, platform);
            if (data && data?.length > 0) setPlatformData(data);
            // setSelectedImageIndex(0);
        })();
    }, [platform, watch]);

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

                            <FillOutDataWithAi isAIProcessing={isAIProcessing} setIsAIProcessing={setIsAIProcessing} watch={watch} platform={platform} />
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
