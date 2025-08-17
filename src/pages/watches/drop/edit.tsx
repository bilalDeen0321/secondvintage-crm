/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { brands, currencies } from "@/app/data";
import BatchSelector from "@/components/BatchSelector";
import BrandSelector from "@/components/BrandSelector";
import ImageManager from "@/components/ImageManager";
import LocationSelector from "@/components/LocationSelector";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Watch as TWatch } from "@/types/watch";
import { Head, router, useForm } from "@inertiajs/react";
import {
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Plus,
    RotateCcw,
    Sparkles,
    Tag,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { handleAddBatchGroup, handleApprove, handleEditBatches, handleEditBrands, handleEditLocations } from "../actions";

type Watch = TWatch & {
    brand: string, status: any, location: string,
    images: (any)[]
}

interface Props {
    watch?: Watch;
    onSave: (watch: Omit<Watch, "id">) => void;
    onNext?: () => void;
    onPrevious?: () => void;
    hasNext?: boolean;
    hasPrevious?: boolean;
}

export const initData = {
    name: "",
    sku: "",
    brand: "",
    acquisitionCost: "",
    status: "Draft" as Watch["status"],
    location: "",
    batch: "",
    description: "",
    notes: "",
    serial: "",
    ref: "",
    caseSize: "",
    caliber: "",
    timegrapher: "",
    aiInstructions: "",
    images: [] as Watch["images"],
}

export default function AddNewWatch({ watch, onSave, onNext, onPrevious, hasNext, hasPrevious }: Props) {
    const { data, setData } = useForm(initData);

    const [originalData, setOriginalData] = useState<any>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [batchGroups, setBatchGroups] = useState(["B001", "B002", "B003", "B020"]);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<"next" | "previous" | null>(null);
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState("EUR");
    const [displayCostValue, setDisplayCostValue] = useState(""); // New state for display value
    const formRef = useRef<HTMLDivElement>(null);


    const locations = ["Denmark", "Vietnam", "Japan", "In Transit"];

    // Helper function to create a comparable version of form data
    const createComparableData = (data: any) => {
        return {
            name: data.name || "",
            sku: data.sku || "",
            brand: data.brand || "",
            acquisitionCost: data.acquisitionCost?.toString() || "",
            status: data.status || "Draft",
            location: data.location || "",
            description: data.description || "",
            notes: data.notes || "",
            serial: data.serial || "",
            ref: data.ref || "",
            caseSize: data.caseSize || "",
            caliber: data.caliber || "",
            timegrapher: data.timegrapher || "",
            aiInstructions: data.aiInstructions || "",
            images: (data.images || [])
                .map((img: any) => ({
                    id: img.id,
                    url: img.url,
                    useForAI: Boolean(img.useForAI),
                }))
                .sort((a: any, b: any) => a.id.localeCompare(b.id)),
        };
    };

    // Update display value when form data or currency changes
    useEffect(() => {
        if (data.acquisitionCost) {
            const eurValue = parseFloat(data.acquisitionCost);
            if (selectedCurrency === "EUR") {
                setDisplayCostValue(data.acquisitionCost);
            } else {
                const convertedValue = (
                    eurValue * currencies.map(c => c.rate)[selectedCurrency]
                ).toFixed(2);
                setDisplayCostValue(convertedValue);
            }
        } else {
            setDisplayCostValue("");
        }
    }, [data.acquisitionCost, selectedCurrency]);



    // Check for changes with improved comparison
    useEffect(() => {
        if (originalData) {
            const currentComparable = createComparableData(data);
            const hasDataChanged =
                JSON.stringify(currentComparable) !==
                JSON.stringify(originalData);
            setHasChanges(hasDataChanged);

            // Debug logging to help identify comparison issues
            console.log("Change detection:", {
                watchId: watch?.id,
                watchName: watch?.name,
                hasDataChanged,
                originalData,
                currentComparable,
            });
        }
    }, [data, originalData, watch?.id, watch?.name]);

    // Keyboard navigation and ESC handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (!hasChanges) {
                    router.visit(route('watches.index'))
                }
                return;
            }

            if (e.key === "ArrowLeft" && hasPrevious && onPrevious) {
                e.preventDefault();
                handleNavigation("previous");
            } else if (e.key === "ArrowRight" && hasNext && onNext) {
                e.preventDefault();
                handleNavigation("next");
            }
        };

        if (formRef.current) {
            formRef.current.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            if (formRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                formRef.current.removeEventListener("keydown", handleKeyDown);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasNext, hasPrevious, onNext, onPrevious, hasChanges]);

    const handleNavigation = (direction: "next" | "previous") => {
        if (hasChanges) {
            setPendingNavigation(direction);
            setShowSaveDialog(true);
        } else {
            if (direction === "next" && onNext) {
                onNext();
            } else if (direction === "previous" && onPrevious) {
                onPrevious();
            }
        }
    };



    const handleSave = () => {
        onSave({
            name: data.name,
            sku: data.sku,
            brand: data.brand,
            acquisitionCost: parseFloat(data.acquisitionCost) || 0,
            status: data.status,
            location: data.location,
            description: data.description,
            notes: data.notes,
            aiInstructions: data.aiInstructions,
            images: data.images,
            batchGroup: data.batch,
            serial: data.serial,
            ref: data.ref,
            caseSize: data.caseSize,
            caliber: data.caliber,
            timegrapher: data.timegrapher,
        } as any);

        // Update original data after successful save
        const newOriginalData = createComparableData(data);
        setOriginalData(newOriginalData);
        setHasChanges(false);
    };

    const handleSaveAndClose = () => {
        handleSave();
        setTimeout(() => {
            router.visit(route('watches.index'))
        }, 100);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    };


    const handleResetAI = () => {
        if (
            window.confirm(
                "Are you sure you want to reset the AI instructions? This action cannot be undone.",
            )
        ) {

            setData('aiInstructions', '')

            alert("AI thread reset for watch:" + data.name);
        }
    };

    const handleGenerateDescription = async () => {
        setIsGeneratingDescription(true);
        console.log("Generating description for watch:", data.name);
        console.log("Using AI instructions:", data.aiInstructions);
        console.log(
            "Using images marked for AI:",
            data.images.filter((img) => img.useForAI),
        );

        // Simulate API call with timeout
        setTimeout(() => {
            alert(
                "Description generation would be implemented here using the AI instructions and selected images.",
            );
            setIsGeneratingDescription(false);
        }, 2000);
    };

    const handleCurrencyConversion = (newValue: string) => {
        setDisplayCostValue(newValue);

        if (selectedCurrency === "EUR") {
            setData('acquisitionCost', newValue)
        } else {
            // Convert from selected currency to EUR
            const eurValue =
                parseFloat(newValue) / currencies.map(c => c.rate)[selectedCurrency];

            setData('acquisitionCost', eurValue.toFixed(2))
        }
    };







    const aiSelectedCount = data.images.filter(
        (img) => img.useForAI,
    ).length;

    const handleSaveAndNavigate = () => {
        handleSave();
        setShowSaveDialog(false);

        setTimeout(() => {
            if (pendingNavigation === "next" && onNext) {
                onNext();
            } else if (pendingNavigation === "previous" && onPrevious) {
                onPrevious();
            }
            setPendingNavigation(null);
        }, 100);
    };

    const handleDiscardAndNavigate = () => {
        setShowSaveDialog(false);
        if (pendingNavigation === "next" && onNext) {
            onNext();
        } else if (pendingNavigation === "previous" && onPrevious) {
            onPrevious();
        }
        setPendingNavigation(null);
    };

    const handlePrintSKULabel = () => {
        if (!data.sku) {
            alert("No SKU available to print");
            return;
        }

        // Create a simple print dialog with formatted SKU label
        const printWindow = window.open("", "_blank", "width=400,height=300");
        if (printWindow) {
            printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>SKU Label - ${data.sku}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                text-align: center;
                background: white;
              }
              .label {
                border: 2px solid #000;
                padding: 20px;
                margin: 20px auto;
                width: 300px;
                background: white;
              }
              .sku {
                font-size: 24px;
                font-weight: bold;
                margin: 10px 0;
              }
              .watch-name {
                font-size: 16px;
                margin: 10px 0;
              }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="label">
              <div class="sku">${data.sku}</div>
              <div class="watch-name">${data.name || "Watch"}</div>
              <div>${data.brand || ""}</div>
            </div>
            <div class="no-print">
              <button onclick="window.print()">Print</button>
              <button onclick="window.close()">Close</button>
            </div>
          </body>
        </html>
      `);
            printWindow.document.close();
        }
    };

    return (
        <>
            <Head title="Add New Watch" />
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                {/* Navigation Arrows - Outside the box */}
                {hasPrevious && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavigation("previous")}
                        className="absolute left-8 top-1/2 z-10 -translate-y-1/2 transform bg-white shadow-lg hover:bg-gray-50"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}

                {hasNext && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavigation("next")}
                        className="absolute right-8 top-1/2 z-10 -translate-y-1/2 transform bg-white shadow-lg hover:bg-gray-50"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}

                <div
                    ref={formRef}
                    tabIndex={-1}
                    className="flex max-h-[98vh] w-full max-w-[90vw] flex-col overflow-hidden rounded-xl bg-white shadow-xl"
                >
                    <div className="flex-shrink-0 border-b border-slate-200 p-3">
                        <h2 className="text-lg font-bold text-slate-900">
                            {watch ? "Edit Watch" : "Add New Watch"}
                        </h2>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-1 flex-col overflow-hidden"
                    >
                        <div className="flex-1 space-y-2.5 overflow-y-auto p-6">
                            {/* First row: Name | SKU | Brand | Original Cost + Currency dropdown */}
                            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        SKU (Auto-generated)
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            name="sku"
                                            value={data.sku}
                                            readOnly
                                            className="flex-1 cursor-not-allowed rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-600"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handlePrintSKULabel}
                                            className="p-2"
                                            title="Print SKU Label"
                                        >
                                            <Tag className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Brand *
                                    </label>
                                    <BrandSelector
                                        value={data.brand}
                                        onValueChange={(value) => setData('brand', value)}
                                        brands={["All", ...brands]}
                                        onEditBrands={handleEditBrands}
                                    />
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center space-x-2">
                                        <label className="text-sm font-medium text-slate-700">
                                            Original Cost
                                        </label>
                                        <label className="text-sm font-medium text-slate-700">
                                            Currency dropdown
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            value={displayCostValue}
                                            onChange={(e) =>
                                                handleCurrencyConversion(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="0.00"
                                            className="w-36 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                        <Select
                                            value={selectedCurrency}
                                            onValueChange={setSelectedCurrency}
                                        >
                                            <SelectTrigger className="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {currencies.map((currency) => (
                                                    <SelectItem
                                                        key={currency.code}
                                                        value={currency.code}
                                                    >
                                                        {currency.symbol}{" "}
                                                        {currency.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Second row: Status | Location | Batch | Cost (€) */}
                            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Status *
                                    </label>
                                    <select
                                        name="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Review">Review</option>
                                        <option value="Approved">
                                            Approved
                                        </option>
                                        <option value="Platform Review">
                                            Platform Review
                                        </option>
                                        <option value="Ready for listing">
                                            Ready for listing
                                        </option>
                                        <option value="Listed">Listed</option>
                                        <option value="Reserved">
                                            Reserved
                                        </option>
                                        <option value="Sold">Sold</option>
                                        <option value="Defect/Problem">
                                            Defect/Problem
                                        </option>
                                        <option value="Standby">Standby</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Location
                                    </label>
                                    <LocationSelector
                                        value={data.location}
                                        onValueChange={(value) => setData('location', value)}
                                        locations={["All", ...locations]}
                                        onEditLocations={handleEditLocations}
                                    />
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label className="block text-sm font-medium text-slate-700">
                                            Batch Group
                                        </label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleAddBatchGroup(batchGroups, setData)}
                                            className="h-6 w-6 p-0"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <BatchSelector
                                        value={data.batch}
                                        onValueChange={(value) => setData('batch', value)}
                                        batches={batchGroups}
                                        onEditBatches={handleEditBatches}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Cost (€)
                                    </label>
                                    <div className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-medium text-slate-900">
                                        {data.acquisitionCost
                                            ? `€${parseFloat(data.acquisitionCost).toFixed(2)}`
                                            : "€0.00"}
                                    </div>
                                </div>
                            </div>

                            <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 lg:grid-cols-2">
                                <div className="flex min-h-0 flex-col space-y-2.5">
                                    <div className="flex min-h-0 flex-1 flex-col">
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="block text-sm font-medium text-slate-700">
                                                Images (up to 40)
                                            </label>
                                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                                                <span>
                                                    {data.images.length}/40
                                                    images
                                                </span>
                                                <span className="flex items-center space-x-1">
                                                    <Sparkles className="h-4 w-4 text-amber-500" />
                                                    <span>
                                                        {aiSelectedCount}/10 AI
                                                        selected
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="min-h-[200px] flex-1">
                                            <ImageManager
                                                images={data.images}
                                                onChange={(images) => setData('images', images)}
                                            />
                                        </div>
                                        {/* Created by line */}
                                        <div className="mt-2 text-xs text-slate-500">
                                            Edited by <strong>Admin</strong> on
                                            6/23/2025 | Seller:{" "}
                                            <strong>John Doe</strong> | Agent:{" "}
                                            <strong>Mike Smith</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex min-h-0 flex-col space-y-2.5">
                                    {/* Watch Details Section */}
                                    <div className="grid grid-cols-5 gap-2">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                                Serial
                                            </label>
                                            <input
                                                type="text"
                                                name="serial"
                                                value={data.serial}
                                                onChange={(e) => setData('serial', e.target.value)}
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                                Ref
                                            </label>
                                            <input
                                                type="text"
                                                name="ref"
                                                value={data.ref}
                                                onChange={(e) => setData('ref', e.target.value)}
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                                Case Size
                                            </label>
                                            <input
                                                type="text"
                                                name="caseSize"
                                                value={data.caseSize}
                                                onChange={(e) => setData('caseSize', e.target.value)}
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                                Caliber
                                            </label>
                                            <input
                                                type="text"
                                                name="caliber"
                                                value={data.caliber}
                                                onChange={(e) => setData('caliber', e.target.value)}
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                                Timegrapher
                                            </label>
                                            <input
                                                type="text"
                                                name="timegrapher"
                                                value={data.timegrapher}
                                                onChange={(e) => setData('timegrapher', e.target.value)}
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="block text-sm font-medium text-slate-700">
                                                AI Instructions
                                            </label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleResetAI}
                                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <RotateCcw className="mr-1 h-4 w-4" />
                                                Reset AI
                                            </Button>
                                        </div>
                                        <Textarea
                                            name="aiInstructions"
                                            value={data.aiInstructions}
                                            onChange={(e) => setData('aiInstructions', e.target.value)}
                                            rows={1}
                                            placeholder=""
                                            className="min-h-[40px] w-full resize-y"
                                        />
                                        <div className="mt-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={
                                                    handleGenerateDescription
                                                }
                                                disabled={
                                                    isGeneratingDescription
                                                }
                                                className="text-amber-600 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isGeneratingDescription ? (
                                                    <>
                                                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                                        Processing
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="mr-1 h-4 w-4" />
                                                        Generate Description
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            <span className="font-bold">
                                                Description
                                            </span>{" "}
                                            <span className="font-normal">
                                                (Remember to check Model, Case
                                                size, Serial, Reference,
                                                Timegrapher result)
                                            </span>
                                        </label>
                                        <Textarea
                                            name="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="min-h-[320px] w-full resize-y"
                                            disabled={isGeneratingDescription}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Notes
                                        </label>
                                        <Textarea
                                            name="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            rows={2}
                                            className="w-full resize-y"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-shrink-0 gap-3 border-t border-slate-200 p-6 pt-4">
                            <Button
                                type="button"
                                onClick={() => handleApprove(data, setData)}
                                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                            </Button>
                            <Button
                                type="submit"
                                className={`flex-1 ${!hasChanges ? "cursor-not-allowed bg-gray-400 text-gray-600" : ""}`}
                                disabled={!hasChanges}
                            >
                                {hasChanges ? "Save" : "Saved"}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSaveAndClose}
                                className={`flex-1 ${!hasChanges ? "cursor-not-allowed bg-gray-400 text-gray-600" : ""}`}
                                disabled={!hasChanges}
                            >
                                Save & Close
                            </Button>
                            <Button
                                type="button"
                                onClick={() => router.visit(route('watches.index'))}
                                variant="outline"
                                className="flex-1"
                            >
                                {hasChanges ? "Cancel & Close" : "Close"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Save Confirmation Dialog */}
            {showSaveDialog && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6">
                        <h3 className="mb-4 text-lg font-semibold">
                            Unsaved Changes
                        </h3>
                        <p className="mb-6 text-gray-600">
                            You have unsaved changes. Do you want to save them
                            before navigating to the next watch?
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleSaveAndNavigate}
                                className="flex-1"
                            >
                                Save & Continue
                            </Button>
                            <Button
                                onClick={handleDiscardAndNavigate}
                                variant="outline"
                                className="flex-1"
                            >
                                Discard Changes
                            </Button>
                            <Button
                                onClick={() => setShowSaveDialog(false)}
                                variant="ghost"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};