import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Download,
    Save,
    Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Watch } from "../types/Watch";

interface PlatformDataModalProps {
    watch: Watch | null;
    platform: string;
    isOpen: boolean;
    onClose: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
}

interface PlatformField {
    field: string;
    value: string;
    type: "input" | "select" | "textarea" | "number";
    options?: string[];
}

// Platform-specific data configurations
const getPlatformData = (watch: Watch, platform: string): PlatformField[] => {
    const statusField = {
        field: "Status",
        value: watch.status,
        type: "select" as const,
        options: [
            "Draft",
            "Review",
            "Approved",
            "Platform Review",
            "Ready for listing",
            "Listed",
            "Reserved",
            "Sold",
            "Defect/Problem",
            "Standby",
        ],
    };
    const descriptionField = {
        field: "Description",
        value: watch.description || "",
        type: "textarea" as const,
    };

    switch (platform) {
        case "Catawiki (Auction)":
        case "Catawiki":
            return [
                statusField,
                descriptionField,
                {
                    field: "Catawiki - Your Reference Number (optional)",
                    value: watch.sku,
                    type: "input",
                },
                {
                    field: "Catawiki - Your Reference Colour (optional)",
                    value: "",
                    type: "input",
                },
                {
                    field: "Catawiki - Auction Type (333) (optional)",
                    value: "333",
                    type: "select",
                    options: ["333", "334", "335"],
                },
                {
                    field: "Catawiki - Object type (18127)",
                    value: "18127",
                    type: "select",
                    options: ["18127", "18128", "18129"],
                },
                {
                    field: "Catawiki - Language",
                    value: "English",
                    type: "select",
                    options: ["English", "Dutch", "German", "French"],
                },
                {
                    field: "Catawiki - Description",
                    value: watch.description || "",
                    type: "textarea",
                },
                {
                    field: "Catawiki - D: Brand",
                    value: watch.brand,
                    type: "input",
                },
                {
                    field: "Catawiki - D: Model (optional)",
                    value: "",
                    type: "input",
                },
                {
                    field: "Catawiki - D: Reference Number (optional)",
                    value: watch.sku,
                    type: "input",
                },
                {
                    field: "Catawiki - D: Shipped Insured",
                    value: "Yes",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - D: Period",
                    value: "2020s",
                    type: "select",
                    options: [
                        "1950s",
                        "1960s",
                        "1970s",
                        "1980s",
                        "1990s",
                        "2000s",
                        "2010s",
                        "2020s",
                    ],
                },
                {
                    field: "Catawiki - D: Movement",
                    value: "Automatic",
                    type: "select",
                    options: ["Automatic", "Manual", "Quartz"],
                },
                {
                    field: "Catawiki - D: Case material",
                    value: "Stainless Steel",
                    type: "select",
                    options: [
                        "Stainless Steel",
                        "Gold",
                        "Rose Gold",
                        "Titanium",
                        "Ceramic",
                    ],
                },
                {
                    field: "Catawiki - D: Case diameter",
                    value: "40mm",
                    type: "input",
                },
                {
                    field: "Catawiki - D: Condition",
                    value: "Very Good",
                    type: "select",
                    options: ["New", "Very Good", "Good", "Fair", "Poor"],
                },
                {
                    field: "Catawiki - D: Gender",
                    value: "Men",
                    type: "select",
                    options: ["Men", "Women", "Unisex"],
                },
                {
                    field: "Catawiki - D: Band material",
                    value: "Stainless Steel",
                    type: "select",
                    options: [
                        "Stainless Steel",
                        "Leather",
                        "Rubber",
                        "Gold",
                        "Ceramic",
                    ],
                },
                {
                    field: "Catawiki - D: Band length (optional)",
                    value: "",
                    type: "input",
                },
                {
                    field: "Catawiki - D: Repainted dial",
                    value: "No",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - D: Dial colour (optional)",
                    value: "Black",
                    type: "input",
                },
                {
                    field: "Catawiki - D: Original box included",
                    value: "Yes",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - D: Original papers included",
                    value: "Yes",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - D: Original warranty included",
                    value: "No",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - D: Year (optional)",
                    value: "2020",
                    type: "input",
                },
                { field: "Catawiki - D: Weight", value: "150g", type: "input" },
                {
                    field: "Catawiki - D: Width lug/ watch band",
                    value: "20mm",
                    type: "input",
                },
                {
                    field: "Catawiki - D: In working order (optional)",
                    value: "Yes",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - Public photo URL",
                    value: watch.images?.[0]?.url || "",
                    type: "input",
                },
                {
                    field: "Catawiki - Estimated lot value",
                    value: watch.acquisitionCost
                        ? `€${Math.round(watch.acquisitionCost * 1.2)}`
                        : "",
                    type: "input",
                },
                {
                    field: "Catawiki - Reserve price (optional)",
                    value: watch.acquisitionCost
                        ? `€${Math.round(watch.acquisitionCost * 0.9)}`
                        : "",
                    type: "input",
                },
                {
                    field: "Catawiki - Start bidding from (optional)",
                    value: watch.acquisitionCost
                        ? `€${Math.round(watch.acquisitionCost * 0.7)}`
                        : "",
                    type: "input",
                },
                {
                    field: "Catawiki - Pick up (optional)",
                    value: "No",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - Combined shipping (optional)",
                    value: "Yes",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Catawiki - Shipping costs",
                    value: "€0",
                    type: "input",
                },
                {
                    field: "Catawiki - Shipping costs - Europe",
                    value: "€15",
                    type: "input",
                },
                {
                    field: "Catawiki - Shipping costs - Rest of World",
                    value: "€25",
                    type: "input",
                },
                {
                    field: "Catawiki - Country specific shipping price (optional)",
                    value: "",
                    type: "input",
                },
                {
                    field: "Catawiki - Shipping profile (optional)",
                    value: "",
                    type: "input",
                },
                {
                    field: "Catawiki - Message to Expert (optional)",
                    value: "",
                    type: "textarea",
                },
            ];
        case "Tradera":
        case "Tradera (Auction)":
            return [
                statusField,
                descriptionField,
                { field: "Name", value: watch.name, type: "input" },
                { field: "SKU", value: watch.sku, type: "input" },
                { field: "Brand", value: watch.brand, type: "input" },
                { field: "Location", value: watch.location, type: "input" },
                {
                    field: "Buy It Now Price",
                    value: watch.acquisitionCost
                        ? `€${Math.round(watch.acquisitionCost * 1.3)}`
                        : "",
                    type: "number",
                },
                {
                    field: "Starting Bid",
                    value: watch.acquisitionCost
                        ? `€${Math.round(watch.acquisitionCost * 0.8)}`
                        : "",
                    type: "number",
                },
                {
                    field: "Listing Duration",
                    value: "10 days",
                    type: "select",
                    options: ["3 days", "5 days", "7 days", "10 days"],
                },
                {
                    field: "Payment Methods",
                    value: "PayPal, Bank Transfer",
                    type: "input",
                },
                { field: "Shipping Cost", value: "€15", type: "number" },
                { field: "Listing Fee", value: "€2.50", type: "number" },
                { field: "Final Value Fee", value: "8%", type: "input" },
                { field: "Category ID", value: "1234567", type: "input" },
            ];
        case "eBay":
        case "ebay (Fixed Price)":
        case "ebay (Auction)":
            return [
                statusField,
                descriptionField,
                { field: "Name", value: watch.name, type: "input" },
                { field: "SKU", value: watch.sku, type: "input" },
                { field: "Brand", value: watch.brand, type: "input" },
                { field: "Location", value: watch.location, type: "input" },
                {
                    field: "Starting Price",
                    value: watch.acquisitionCost
                        ? `€${Math.round(watch.acquisitionCost * 0.75)}`
                        : "",
                    type: "number",
                },
                {
                    field: "Buy It Now Price",
                    value: watch.acquisitionCost
                        ? `€${Math.round(watch.acquisitionCost * 1.35)}`
                        : "",
                    type: "number",
                },
                {
                    field: "Listing Format",
                    value: "Auction with BIN",
                    type: "select",
                    options: ["Auction", "Buy It Now", "Auction with BIN"],
                },
                {
                    field: "Listing Duration",
                    value: "7 days",
                    type: "select",
                    options: ["1 day", "3 days", "5 days", "7 days", "10 days"],
                },
                {
                    field: "International Shipping",
                    value: "Worldwide",
                    type: "select",
                    options: ["None", "Europe", "Worldwide"],
                },
                {
                    field: "Handling Time",
                    value: "1 business day",
                    type: "select",
                    options: [
                        "Same day",
                        "1 business day",
                        "2 business days",
                        "3 business days",
                    ],
                },
                {
                    field: "Return Period",
                    value: "30 days",
                    type: "select",
                    options: ["No returns", "14 days", "30 days", "60 days"],
                },
                {
                    field: "Item Specifics Required",
                    value: "Yes",
                    type: "select",
                    options: ["Yes", "No"],
                },
                {
                    field: "Store Category",
                    value: "Luxury Timepieces",
                    type: "input",
                },
            ];
        case "Chrono24":
        case "Chrono24 (Fixed Price)":
            return [
                statusField,
                descriptionField,
                { field: "Name", value: watch.name, type: "input" },
                { field: "SKU", value: watch.sku, type: "input" },
                { field: "Brand", value: watch.brand, type: "input" },
                { field: "Location", value: watch.location, type: "input" },
                {
                    field: "Asking Price",
                    value: watch.acquisitionCost
                        ? `€${Math.round(watch.acquisitionCost * 1.4)}`
                        : "",
                    type: "number",
                },
                { field: "Reference Number", value: watch.sku, type: "input" },
                { field: "Year of Production", value: "2020", type: "input" },
                {
                    field: "Case Material",
                    value: "Stainless Steel",
                    type: "select",
                    options: [
                        "Stainless Steel",
                        "Gold",
                        "Rose Gold",
                        "Titanium",
                        "Ceramic",
                    ],
                },
                {
                    field: "Bracelet Material",
                    value: "Stainless Steel",
                    type: "select",
                    options: [
                        "Stainless Steel",
                        "Leather",
                        "Rubber",
                        "Gold",
                        "Ceramic",
                    ],
                },
                {
                    field: "Dial Color",
                    value: "Black",
                    type: "select",
                    options: ["Black", "White", "Blue", "Silver", "Grey"],
                },
                {
                    field: "Movement",
                    value: "Automatic",
                    type: "select",
                    options: ["Automatic", "Manual", "Quartz"],
                },
                { field: "Case Diameter", value: "40mm", type: "input" },
                { field: "Water Resistance", value: "300m", type: "input" },
                {
                    field: "Warranty",
                    value: "2 years",
                    type: "select",
                    options: ["No warranty", "1 year", "2 years", "3 years"],
                },
                {
                    field: "Box & Papers",
                    value: "Yes",
                    type: "select",
                    options: ["Yes", "No", "Box only", "Papers only"],
                },
            ];
        default:
            const baseData: PlatformField[] = [
                statusField,
                descriptionField,
                { field: "Name", value: watch.name, type: "input" },
                { field: "SKU", value: watch.sku, type: "input" },
                { field: "Brand", value: watch.brand, type: "input" },
                { field: "Location", value: watch.location, type: "input" },
            ];
            return baseData;
    }
};

const PlatformDataModal = ({
    watch,
    platform,
    isOpen,
    onClose,
    onNext,
    onPrevious,
}: PlatformDataModalProps) => {
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
        console.log("Going to previous item");
        if (onPrevious) {
            onPrevious();
        }
    };

    const handleNext = () => {
        console.log("Going to next item");
        if (onNext) {
            onNext();
        }
    };

    const handleCopyData = () => {
        const csvContent = platformData
            .map((row) => `${row.field},${row.value}`)
            .join("\n");
        navigator.clipboard.writeText(csvContent);
    };

    const handleExportData = () => {
        const csvContent = [
            "Field,Value",
            ...platformData.map((row) => `"${row.field}","${row.value}"`),
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${watch.name}_${platform}_data.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const renderField = (field: PlatformField, index: number) => {
        switch (field.type) {
            case "select":
                return (
                    <Select
                        value={field.value}
                        onValueChange={(value) =>
                            handleFieldChange(index, value)
                        }
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
                        onChange={(e) =>
                            handleFieldChange(index, e.target.value)
                        }
                        className="min-h-[240px]"
                    />
                );
            case "number":
                return (
                    <Input
                        type="number"
                        value={field.value}
                        onChange={(e) =>
                            handleFieldChange(index, e.target.value)
                        }
                    />
                );
            default:
                return (
                    <Input
                        value={field.value}
                        onChange={(e) =>
                            handleFieldChange(index, e.target.value)
                        }
                    />
                );
        }
    };

    const watchImages = watch.images || [];
    const hasImages = watchImages.length > 0;

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
                                <Button
                                    onClick={handleExportData}
                                    size="sm"
                                    variant="outline"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Export CSV
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
                                            src={
                                                watchImages[selectedImageIndex]
                                                    ?.url
                                            }
                                            alt={`${watch.name} - Main view`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Thumbnail Grid - Below main image */}
                                    <div className="grid grid-cols-6 gap-2">
                                        {watchImages.map((image, index) => (
                                            <button
                                                key={image.id}
                                                onClick={() =>
                                                    setSelectedImageIndex(index)
                                                }
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
                                            <span className="text-slate-500">
                                                Name:
                                            </span>
                                            <div className="font-medium text-slate-900">
                                                {watch.name}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">
                                                Serial:
                                            </span>
                                            <div className="font-medium text-slate-900">
                                                {watch.serial || "N/A"}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-slate-500">
                                                SKU:
                                            </span>
                                            <div className="font-medium text-slate-900">
                                                {watch.sku}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">
                                                Ref:
                                            </span>
                                            <div className="font-medium text-slate-900">
                                                {watch.ref || "N/A"}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-slate-500">
                                                Brand:
                                            </span>
                                            <div className="font-medium text-slate-900">
                                                {watch.brand}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">
                                                Case Size:
                                            </span>
                                            <div className="font-medium text-slate-900">
                                                {watch.caseSize || "N/A"}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-slate-500">
                                                Location:
                                            </span>
                                            <div className="font-medium text-slate-900">
                                                {watch.location || "N/A"}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">
                                                Caliber:
                                            </span>
                                            <div className="font-medium text-slate-900">
                                                {watch.caliber || "N/A"}
                                            </div>
                                        </div>

                                        {watch.batchGroup && (
                                            <div>
                                                <span className="text-slate-500">
                                                    Batch:
                                                </span>
                                                <div className="font-medium text-slate-900">
                                                    {watch.batchGroup}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-slate-500">
                                                Timegrapher:
                                            </span>
                                            <div className="font-medium text-slate-900">
                                                {watch.timegrapher || "N/A"}
                                            </div>
                                        </div>

                                        {watch.acquisitionCost && (
                                            <div>
                                                <span className="text-slate-500">
                                                    Cost:
                                                </span>
                                                <div className="font-medium text-slate-900">
                                                    €
                                                    {watch.acquisitionCost.toLocaleString()}
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
                                        <TableHead className="w-1/3">
                                            Field
                                        </TableHead>
                                        <TableHead>Value</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {platformData.map((field, index) => (
                                        <TableRow
                                            key={index}
                                            className="hover:bg-slate-50"
                                        >
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
                            {(platform === "Catawiki" ||
                                platform === "Catawiki (Auction)") && (
                                <p>
                                    • Catawiki specializes in luxury auctions.
                                    Ensure high-quality photos and detailed
                                    condition reports. All fields marked with
                                    "D:" are required for Catawiki's detailed
                                    specifications.
                                </p>
                            )}
                            {(platform === "Tradera" ||
                                platform === "Tradera (Auction)") && (
                                <p>
                                    • Tradera is popular in Sweden. Consider
                                    local preferences and Swedish krona pricing.
                                </p>
                            )}
                            {(platform === "eBay" ||
                                platform.includes("ebay")) && (
                                <p>
                                    • eBay requires detailed item specifics.
                                    Ensure all technical details are accurate.
                                </p>
                            )}
                            {(platform === "Chrono24" ||
                                platform === "Chrono24 (Fixed Price)") && (
                                <p>
                                    • Chrono24 is watch-specific. Include all
                                    technical specifications and authentication
                                    details.
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
                                    • General platform data. Customize fields
                                    based on platform requirements.
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
