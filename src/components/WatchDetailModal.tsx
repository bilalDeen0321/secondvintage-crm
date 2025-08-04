import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Edit, FileText, MapPin, Package } from "lucide-react";
import { Watch } from "../types/Watch";

interface WatchDetailModalProps {
    watch: Watch | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (watch: Watch) => void;
    showEditButton?: boolean;
}

const WatchDetailModal = ({
    watch,
    isOpen,
    onClose,
    onEdit,
    showEditButton = false,
}: WatchDetailModalProps) => {
    if (!watch) return null;

    const getStatusColor = (status: Watch["status"]) => {
        switch (status) {
            case "Draft":
                return "bg-gray-100 text-gray-800";
            case "Review":
                return "bg-yellow-100 text-yellow-800";
            case "Platform Review":
                return "bg-orange-100 text-orange-800";
            case "Ready for listing":
                return "bg-blue-100 text-blue-800";
            case "Listed":
                return "bg-green-100 text-green-800";
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

    const mainImage =
        watch.images && watch.images.length > 0
            ? watch.images[0].url
            : "/placeholder.svg";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-slate-900">
                                {watch.name}
                            </DialogTitle>
                            <div className="mt-2 flex items-center gap-4">
                                <span className="text-slate-600">
                                    SKU: {watch.sku}
                                </span>
                                <Badge className={getStatusColor(watch.status)}>
                                    {watch.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {showEditButton && onEdit && (
                                <Button
                                    onClick={() => {
                                        onEdit(watch);
                                        onClose();
                                    }}
                                    size="sm"
                                    variant="outline"
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Images */}
                    <div>
                        <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-slate-100">
                            <img
                                src={mainImage}
                                alt={watch.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        {watch.images && watch.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {watch.images
                                    .slice(1, 5)
                                    .map((image, index) => (
                                        <div
                                            key={image.id}
                                            className="aspect-square overflow-hidden rounded bg-slate-100"
                                        >
                                            <img
                                                src={image.url}
                                                alt={`${watch.name} ${index + 2}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                {watch.images.length > 5 && (
                                    <div className="flex aspect-square items-center justify-center rounded bg-slate-200 text-sm text-slate-600">
                                        +{watch.images.length - 5}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-3 text-lg font-semibold text-slate-900">
                                Details
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">
                                        Brand:
                                    </span>
                                    <span className="font-medium">
                                        {watch.brand}
                                    </span>
                                </div>
                                {watch.acquisitionCost && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-600">
                                            Acquisition Cost:
                                        </span>
                                        <span className="font-medium">
                                            €
                                            {watch.acquisitionCost.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">
                                        Location:
                                    </span>
                                    <span className="font-medium">
                                        {watch.location}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {watch.description && (
                            <div>
                                <div className="mb-3 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-slate-400" />
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        Description
                                    </h3>
                                </div>
                                <p className="leading-relaxed text-slate-700">
                                    {watch.description}
                                </p>
                            </div>
                        )}

                        {watch.aiInstructions && (
                            <div>
                                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                                    AI Instructions
                                </h3>
                                <p className="rounded-lg bg-slate-50 p-3 leading-relaxed text-slate-700">
                                    {watch.aiInstructions}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WatchDetailModal;
