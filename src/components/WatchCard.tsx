/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { WatchResource } from "@/types/resources/watch";
import { Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";
import ImageViewer from "./ImageViewer";

interface WatchCardProps {
    watch: WatchResource;
    onEdit: (watch: WatchResource) => void;
    onDelete: (id: string | number) => void;
}

const WatchCard = ({ watch, onEdit, onDelete }: WatchCardProps) => {
    const [imageViewer, setImageViewer] = useState<{
        isOpen: boolean;
        images: never[];
        currentIndex: number;
    }>({
        isOpen: false,
        images: [],
        currentIndex: 0,
    });

    const getStatusColor = (status: WatchResource["status"]) => {
        switch (status) {
            case "Draft":
                return "bg-gray-100 text-gray-800";
            case "Review":
                return "bg-blue-100 text-blue-800";
            case "Approved":
                return "bg-green-100 text-green-800";
            case "Platform Review":
                return "bg-blue-600 text-white";
            case "Ready for listing":
                return "bg-green-100 text-green-800";
            case "Listed":
                return "bg-green-600 text-white";
            case "Reserved":
                return "bg-purple-100 text-purple-800";
            case "Sold":
                return "bg-slate-100 text-slate-800";
            case "Defect/Problem":
                return "bg-red-100 text-red-800";
            case "Standby":
                return "bg-amber-100 text-amber-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (watch.images && watch.images.length > 0) {
            setImageViewer({
                isOpen: true,
                images: watch.images as any,
                currentIndex: 0,
            });
        }
    };

    const handleCloseImageViewer = () => {
        setImageViewer({
            isOpen: false,
            images: [],
            currentIndex: 0,
        });
    };

    const handlePreviousImage = () => {
        setImageViewer((prev) => ({
            ...prev,
            currentIndex: Math.max(0, prev.currentIndex - 1),
        }));
    };

    const handleNextImage = () => {
        setImageViewer((prev) => ({
            ...prev,
            currentIndex: Math.min(
                prev.images.length - 1,
                prev.currentIndex + 1,
            ),
        }));
    };

    const handleCardClick = () => {
        onEdit(watch);
    };

    const handleNameClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(watch);
    };

    return (
        <>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md">
                {/* Image */}
                <div
                    className="relative aspect-square cursor-pointer overflow-hidden bg-slate-100 transition-opacity hover:opacity-90"
                    onClick={handleImageClick}
                >
                    {watch.images && watch.images.length > 0 ? (
                        <img
                            src={watch.images[0].url}
                            alt={watch.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <img
                            src="/lovable-uploads/e4da5380-362e-422c-a981-6370f96719da.png"
                            alt="Watch placeholder"
                            className="h-full w-full object-cover opacity-50"
                        />
                    )}
                    {watch.images && watch.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 rounded bg-black bg-opacity-60 px-2 py-1 text-xs text-white">
                            +{watch.images.length - 1}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                        <h3
                            className="line-clamp-2 cursor-pointer font-medium text-slate-900 transition-colors hover:text-blue-600"
                            onClick={handleNameClick}
                        >
                            {watch.name}
                        </h3>
                        <span
                            className={`ml-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(watch.status)}`}
                        >
                            {watch.status}
                        </span>
                    </div>

                    <div className="mb-3 space-y-1">
                        <p className="text-sm text-slate-600">
                            SKU: {watch.sku}
                        </p>
                        <p className="text-sm text-slate-600">
                            Brand: {watch.brand}
                        </p>
                        {watch.original_cost && (
                            <p className="text-sm font-medium text-slate-900">
                                €{watch.original_cost.toLocaleString()}
                            </p>
                        )}
                        <p className="text-sm text-slate-600">
                            Location: {watch.location}
                        </p>
                    </div>

                    {watch.description && (
                        <p className="mb-3 line-clamp-2 text-xs text-slate-600">
                            {watch.description}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(watch)}
                            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(watch.routeKey)}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {imageViewer.isOpen && (
                <ImageViewer
                    images={imageViewer.images}
                    currentIndex={imageViewer.currentIndex}
                    onClose={handleCloseImageViewer}
                    onPrevious={handlePreviousImage}
                    onNext={handleNextImage}
                />
            )}
        </>
    );
};

export default WatchCard;
