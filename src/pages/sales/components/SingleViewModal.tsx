import Status from "@/app/models/Status";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { WatchResource } from "@/types/resources/watch";
import { FileText, MapPin, Package } from "lucide-react";
import React from "react";

interface SingleViewModalProps {
    isOpen: boolean;
    watch: WatchResource | null;
    selectedImageIndex: number;
    onClose: () => void;
    onThumbnailClick: (index: number) => void;
}

const SingleViewModal: React.FC<SingleViewModalProps> = ({
    isOpen,
    watch,
    selectedImageIndex,
    onClose,
    onThumbnailClick,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[95vh] max-w-7xl overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-3xl font-bold text-slate-900">
                                {watch?.name}
                            </DialogTitle>
                            <div className="mt-2 flex items-center gap-4">
                                <span className="text-lg text-slate-600">
                                    SKU: {watch?.sku}
                                </span>
                                <Badge
                                    className={`px-3 py-1 text-sm ${watch ? Status.toColorClass(watch.status) : ""
                                        }`}
                                >
                                    {watch?.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {watch && (
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                        {/* Images Section */}
                        <div>
                            {/* Main Image - Larger */}
                            <div className="mb-6 aspect-square overflow-hidden rounded-lg bg-slate-100">
                                <img
                                    src={
                                        watch.images?.[selectedImageIndex]?.url ||
                                        "/placeholder.svg"
                                    }
                                    alt={watch.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Thumbnail Images Grid - Show more images */}
                            {watch.images && watch.images.length > 1 && (
                                <div className="grid grid-cols-6 gap-3">
                                    {watch.images.map((image, index) => (
                                        <div
                                            key={image.id}
                                            className={`aspect-square cursor-pointer overflow-hidden rounded-lg bg-slate-100 transition-all duration-200 hover:opacity-80 ${index === selectedImageIndex
                                                    ? "ring-3 ring-blue-500 ring-offset-2"
                                                    : "hover:ring-2 hover:ring-slate-300"
                                                }`}
                                            onClick={() => onThumbnailClick(index)}
                                        >
                                            <img
                                                src={image.url}
                                                alt={`${watch.name} ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Image Counter */}
                            {watch.images && watch.images.length > 1 && (
                                <div className="mt-4 text-center text-sm text-slate-600">
                                    Image {selectedImageIndex + 1} of{" "}
                                    {watch.images.length}
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-slate-900">
                                    Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Package className="h-5 w-5 text-slate-400" />
                                        <span className="text-slate-600">Brand:</span>
                                        <span className="text-lg font-medium">
                                            {watch.brand}
                                        </span>
                                    </div>
                                    {watch.current_cost && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-600">
                                                Acquisition Cost:
                                            </span>
                                            <span className="text-lg font-medium">
                                                €{watch.current_cost.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-slate-400" />
                                        <span className="text-slate-600">
                                            Location:
                                        </span>
                                        <span className="text-lg font-medium">
                                            {watch.location}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {watch.description && (
                                <div>
                                    <div className="mb-4 flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-slate-400" />
                                        <h3 className="text-xl font-semibold text-slate-900">
                                            Description
                                        </h3>
                                    </div>
                                    <p className="text-base leading-relaxed text-slate-700">
                                        {watch.description}
                                    </p>
                                </div>
                            )}

                            {watch.original_cost && (
                                <div>
                                    <h3 className="mb-4 text-xl font-semibold text-slate-900">
                                        AI Instructions
                                    </h3>
                                    <p className="rounded-lg bg-slate-50 p-4 text-base leading-relaxed text-slate-700">
                                        {watch.original_cost}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default SingleViewModal;