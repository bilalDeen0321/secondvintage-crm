import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Check, ChevronLeft, ChevronRight, Save, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { getPlatformData, PlatformDataModalProps, PlatformField } from "./_actions";


const PlatformDataModal = (props: PlatformDataModalProps) => {
    const { watch, platform, isOpen, onClose } = props;
    const [platformData, setPlatformData] = useState<PlatformField[]>([]);
    const [isAIProcessing, setIsAIProcessing] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        if (!watch) return;

        const data = getPlatformData(watch, platform);
        setPlatformData(data);
        setSelectedImageIndex(0);
    }, [watch, platform]);

    if (!watch) return null;

    const handleFieldChange = (index: number, newValue: string) => {
        const updatedData = [...platformData];
        updatedData[index].value = newValue;
        setPlatformData(updatedData);
    };

    const handleFillWithAI = () => {
        setIsAIProcessing(true);
        console.log("Filling data with AI for platform:", platform);

        // Remove processing state after 3 seconds
        setTimeout(() => {
            setIsAIProcessing(false);
        }, 3000);
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

    const renderField = (field: PlatformField, index: number) => {
        switch (field.type) {
            case "select":
                return (
                    <Select
                        value={field.value}
                        onValueChange={(value) => handleFieldChange(index, value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case "textarea":
                return (
                    <Textarea
                        value={field.value}
                        onChange={(e) => handleFieldChange(index, e.target.value)}
                        className="min-h-[240px]"
                    />
                );
            case "number":
                return (
                    <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => handleFieldChange(index, e.target.value)}
                    />
                );
            default:
                return (
                    <Input
                        value={field.value}
                        onChange={(e) => handleFieldChange(index, e.target.value)}
                    />
                );
        }
    };

    const watchImages = watch.images || [];
    const hasImages = watchImages.length > 0;

    const onPrevious = props.onPrevious;
    const onNext = props.onNext;

    return (
        <>
            {/* Navigation arrows - positioned outside the modal */}
            {onPrevious && (
                <Button
                    onClick={handlePrevious}
                    size="icon"
                    variant="outline"
                    className="fixed left-8 top-1/2 z-[60] -translate-y-1/2 transform border-2 bg-white shadow-lg hover:bg-gray-50"
                    style={{ left: "calc(50vw - 600px - 60px)" }}
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
            )}

            {onNext && (
                <Button
                    onClick={handleNext}
                    size="icon"
                    variant="outline"
                    className="fixed right-8 top-1/2 z-[60] -translate-y-1/2 transform border-2 bg-white shadow-lg hover:bg-gray-50"
                    style={{ right: "calc(50vw - 600px - 60px)" }}
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            )}

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
                    <div className="mt-6">
                        <div className="overflow-hidden rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-1/3">Field</TableHead>
                                        <TableHead>Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {platformData.map((field, index) => (
                                        <TableRow key={index} className="hover:bg-slate-50">
                                            <TableCell className="py-2 align-top font-medium text-slate-900">
                                                {field.field}
                                            </TableCell>
                                            <TableCell className="py-1 text-slate-700">
                                                {renderField(field, index)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Platform Notes */}
                    <div className="mt-6 rounded-lg bg-slate-50 p-4">
                        <h4 className="mb-2 font-medium text-slate-900">
                            Platform-Specific Notes:
                        </h4>
                        <div className="text-sm text-slate-600">
                            {(platform === "Catawiki" || platform === "Catawiki (Auction)") && (
                                <p>
                                    • Catawiki specializes in luxury auctions. Ensure high-quality
                                    photos and detailed condition reports. All fields marked with
                                    "D:" are required for Catawiki's detailed specifications.
                                </p>
                            )}
                            {(platform === "Tradera" || platform === "Tradera (Auction)") && (
                                <p>
                                    • Tradera is popular in Sweden. Consider local preferences and
                                    Swedish krona pricing.
                                </p>
                            )}
                            {(platform === "eBay" || platform.includes("ebay")) && (
                                <p>
                                    • eBay requires detailed item specifics. Ensure all technical
                                    details are accurate.
                                </p>
                            )}
                            {(platform === "Chrono24" || platform === "Chrono24 (Fixed Price)") && (
                                <p>
                                    • Chrono24 is watch-specific. Include all technical
                                    specifications and authentication details.
                                </p>
                            )}
                            {![
                                "Catawiki",
                                "Catawiki (Auction)",
                                "Tradera",
                                "Tradera (Auction)",
                                "eBay",
                                "ebay (Fixed Price)",
                                "ebay (Auction)",
                                "Chrono24",
                                "Chrono24 (Fixed Price)",
                            ].includes(platform) && (
                                <p>
                                    • General platform data. Customize fields based on platform
                                    requirements.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer with action buttons */}
                    <div className="mt-6 flex items-center justify-end gap-2 border-t pt-4">
                        <Button
                            onClick={handleSave}
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Save
                        </Button>
                        <Button
                            onClick={handleApproveGoNext}
                            variant="default"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Approve - Go Next
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PlatformDataModal;
