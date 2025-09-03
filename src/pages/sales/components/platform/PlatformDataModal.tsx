import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { router, usePage } from "@inertiajs/react";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getPlatformData, PlatformDataModalProps, PlatformField } from "./_actions";
import PlatformDataTable from "./PlatformDataTable";
import { PlatformFooterActions } from "./PlatformFooterActions";
import { PlatformNavigation } from "./PlatformNavigation";
import PlatformNotes from "./PlatformNotes";

const PlatformDataModal = (props: PlatformDataModalProps) => {
    const page = usePage();
    const { watch, platform, isOpen, onClose } = props;
    const [platformData, setPlatformData] = useState<PlatformField[]>([]);
    const [isAIProcessing, setIsAIProcessing] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const onNext = props.onNext;

    useEffect(() => {
        if (!watch) return;
        const data = getPlatformData(watch, platform);
        setPlatformData(data);
        setSelectedImageIndex(0);

        console.log(platform, data);
    }, [watch, platform]);

    // useEffect(() => {
    //     const { success, error, aiData, platform: responsePlatform } = page.props as any;

    //     if (success && aiData && responsePlatform === platform.toLowerCase()) {
    //         console.log("AI Fill success:", aiData);
    //         const updatedData = platformData.map((field) => {
    //             if (aiData[field.field]) {
    //                 return { ...field, value: aiData[field.field] };
    //             }
    //             return field;
    //         });
    //         setPlatformData(updatedData);
    //         setIsAIProcessing(false);
    //     }

    //     if (error) {
    //         console.error("AI Fill error:", error);
    //         setIsAIProcessing(false);
    //     }
    // }, [pageProps, platform, platformData]);

    if (!watch) return null;

    const handleFillWithAI = () => {
        if (isAIProcessing) return;
        setIsAIProcessing(true);
        const url = route("platform-data.ai-fill", watch.routeKey);
        router.post(
            url,
            { platform: "catawiki" },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setIsAIProcessing(false),
            },
        );
    };

    const handleSave = () => {
        console.log("Saving platform data:", platformData);
        // In real implementation, this would save the data to your backend
        // You could also show a toast notification here
    };

    const handleApproveGoNext = () => {
        console.log("Approving and going to next:", platformData);
        // In real implementation, this would approve the watch
        handleSave();
        // Navigate to next watch without closing modal
        if (onNext) {
            onNext();
        }
    };

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
            <PlatformNavigation
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                onNext={props.onNext}
                onPrevious={props.onPrevious}
            />

            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <DialogTitle className="text-2xl font-bold text-slate-900">
                                    {platform} Platform Data
                                </DialogTitle>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleFillWithAI}
                                    size="sm"
                                    disabled={isAIProcessing}
                                    className="border border-orange-500 bg-white text-orange-500 hover:border-orange-600 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    {isAIProcessing ? (
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
                        </div>
                    </DialogHeader>

                    {/* Watch Images and Basic Info Section */}
                    {hasImages && (
                        <div className="mt-6 border-b pb-6">
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                {/* Images Section */}
                                <div className="space-y-4 lg:col-span-1">
                                    {/* Main Image - Made larger and square */}
                                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                                        <img
                                            src={watchImages[selectedImageIndex]?.url}
                                            alt={`${watch.name} - Main view`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Thumbnail Grid - Below main image */}
                                    <div className="grid grid-cols-6 gap-2">
                                        {watchImages.map((image, index) => (
                                            <button
                                                key={image.id}
                                                onClick={() => setSelectedImageIndex(index)}
                                                className={`aspect-square overflow-hidden rounded-md border-2 bg-gray-100 transition-colors ${
                                                    selectedImageIndex === index
                                                        ? "border-blue-500"
                                                        : "border-transparent hover:border-gray-300"
                                                }`}
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={`${watch.name} - View ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Basic Info Section - Now 2 columns with specified layout */}
                                <div className="lg:col-span-2">
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                                        {/* Column 1 */}
                                        <div>
                                            <span className="text-slate-500">Name:</span>
                                            <div className="font-medium text-slate-900">
                                                {watch.name}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">Serial:</span>
                                            <div className="font-medium text-slate-900">
                                                {watch.serial_number || "N/A"}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-slate-500">SKU:</span>
                                            <div className="font-medium text-slate-900">
                                                {watch.sku}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">Ref:</span>
                                            <div className="font-medium text-slate-900">
                                                {watch.reference || "N/A"}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-slate-500">Brand:</span>
                                            <div className="font-medium text-slate-900">
                                                {watch.brand}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">Case Size:</span>
                                            <div className="font-medium text-slate-900">
                                                {watch.case_size || "N/A"}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-slate-500">Location:</span>
                                            <div className="font-medium text-slate-900">
                                                {watch.location || "N/A"}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">Caliber:</span>
                                            <div className="font-medium text-slate-900">
                                                {watch.caliber || "N/A"}
                                            </div>
                                        </div>

                                        {watch.batch && (
                                            <div>
                                                <span className="text-slate-500">Batch:</span>
                                                <div className="font-medium text-slate-900">
                                                    {watch.batch}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-slate-500">Timegrapher:</span>
                                            <div className="font-medium text-slate-900">
                                                {watch.timegrapher || "N/A"}
                                            </div>
                                        </div>

                                        {watch.current_cost && (
                                            <div>
                                                <span className="text-slate-500">Cost:</span>
                                                <div className="font-medium text-slate-900">
                                                    €{watch.current_cost.toLocaleString()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Platform Data Table */}
                    <PlatformDataTable
                        setPlatformData={setPlatformData}
                        platformData={platformData}
                    />

                    {/* Platform Notes */}
                    <PlatformNotes platform={platform} />

                    {/* Footer with action buttons */}
                    <PlatformFooterActions
                        handleApproveGoNext={handleApproveGoNext}
                        handleSave={handleSave}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PlatformDataModal;
