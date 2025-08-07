/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
import { Status, Watch as TWatch } from "../types/watch";
import BatchSelector from "./BatchSelector";
import BrandSelector from "./BrandSelector";
import ImageManager from "./ImageManager";
import LocationSelector from "./LocationSelector";

type Watch = TWatch & {
    brand: string, status: Status['name'], location: string,
    images: ({ id: string, url: string, useForAI: boolean })[]
}

interface WatchFormProps {
    watch?: Watch;
    onSave: (watch: Omit<Watch, "id">) => void;
    onCancel: () => void;
    onNext?: () => void;
    onPrevious?: () => void;
    hasNext?: boolean;
    hasPrevious?: boolean;
}

const WatchForm = ({
    watch,
    onSave,
    onCancel,
    onNext,
    onPrevious,
    hasNext,
    hasPrevious,
}: WatchFormProps) => {
    const [formData, setFormData] = useState({
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
    });

    const [originalData, setOriginalData] = useState<any>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [batchGroups, setBatchGroups] = useState([
        "B001",
        "B002",
        "B003",
        "B020",
    ]);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<
        "next" | "previous" | null
    >(null);
    const [isGeneratingDescription, setIsGeneratingDescription] =
        useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState("EUR");
    const [displayCostValue, setDisplayCostValue] = useState(""); // New state for display value
    const formRef = useRef<HTMLDivElement>(null);

    const brands = [
        "Rolex",
        "Omega",
        "TAG Heuer",
        "Breitling",
        "Patek Philippe",
        "Audemars Piguet",
        "Cartier",
        "IWC",
        "Panerai",
        "Tudor",
        "Seiko",
    ];
    const locations = ["Denmark", "Vietnam", "Japan", "In Transit"];

    const currencies = [
        { code: "EUR", name: "Euro", symbol: "€" },
        { code: "USD", name: "US Dollar", symbol: "$" },
        { code: "GBP", name: "British Pound", symbol: "£" },
        { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
        { code: "JPY", name: "Japanese Yen", symbol: "¥" },
        { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
        { code: "AUD", name: "Australian Dollar", symbol: "A$" },
        { code: "SEK", name: "Swedish Krona", symbol: "kr" },
        { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
        { code: "DKK", name: "Danish Krone", symbol: "kr" },
        { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
        { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
        { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
        { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
    ];

    // Exchange rates relative to EUR
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const exchangeRates: Record<string, number> = {
        EUR: 1.0,
        USD: 1.1,
        GBP: 0.85,
        CHF: 0.95,
        JPY: 165.0,
        CAD: 1.45,
        AUD: 1.65,
        SEK: 11.5,
        NOK: 11.8,
        DKK: 7.45,
        CNY: 7.85,
        SGD: 1.48,
        HKD: 8.6,
        VND: 26850.0,
    };

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
        if (formData.acquisitionCost) {
            const eurValue = parseFloat(formData.acquisitionCost);
            if (selectedCurrency === "EUR") {
                setDisplayCostValue(formData.acquisitionCost);
            } else {
                const convertedValue = (
                    eurValue * exchangeRates[selectedCurrency]
                ).toFixed(2);
                setDisplayCostValue(convertedValue);
            }
        } else {
            setDisplayCostValue("");
        }
    }, [exchangeRates, formData.acquisitionCost, selectedCurrency]);

    useEffect(() => {
        if (watch) {
            console.log("Loading watch data:", watch);
            const initialData = {
                name: watch.name || "",
                sku: watch.sku || "",
                brand: watch.brand || "",
                acquisitionCost: watch.ai_instructions?.toString() || "",
                status: watch.status || "Draft",
                location: watch.location || "",
                batch: (watch as any).batchGroup || "",
                description: watch.description || "",
                notes: watch.notes || "",
                serial: (watch as any).serial || "",
                ref: (watch as any).ref || "",
                caseSize: (watch as any).caseSize || "",
                caliber: (watch as any).caliber || "",
                timegrapher: (watch as any).timegrapher || "",
                aiInstructions: watch.ai_instructions || "",
                images: watch.images || [],
            };
            console.log("Initial form data:", initialData);
            setFormData(initialData);
            setOriginalData(createComparableData(initialData));
            setHasChanges(false);
        } else {
            // Reset for new watch
            const emptyData = {
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
                images: [],
            };
            setFormData(emptyData);
            setOriginalData(createComparableData(emptyData));
            setHasChanges(false);
        }
    }, [watch]);

    // Check for changes with improved comparison
    useEffect(() => {
        if (originalData) {
            const currentComparable = createComparableData(formData);
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
    }, [formData, originalData, watch?.id, watch?.name]);

    // Keyboard navigation and ESC handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (!hasChanges) {
                    onCancel();
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
                formRef.current.removeEventListener("keydown", handleKeyDown);
            }
        };
    }, [hasNext, hasPrevious, onNext, onPrevious, hasChanges, onCancel]);

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

    const handleApprove = () => {
        setFormData({ ...formData, status: "Approved" });

        // Auto-save after approval
        setTimeout(() => {
            onSave({
                name: formData.name,
                sku: formData.sku,
                brand: formData.brand,
                acquisitionCost: parseFloat(formData.acquisitionCost) || 0,
                status: "Approved",
                location: formData.location,
                description: formData.description,
                notes: formData.notes,
                aiInstructions: formData.aiInstructions,
                images: formData.images,
                batchGroup: formData.batch,
                serial: formData.serial,
                ref: formData.ref,
                caseSize: formData.caseSize,
                caliber: formData.caliber,
                timegrapher: formData.timegrapher,
            } as any);
        }, 100);
    };

    const handleSave = () => {
        onSave({
            name: formData.name,
            sku: formData.sku,
            brand: formData.brand,
            acquisitionCost: parseFloat(formData.acquisitionCost) || 0,
            status: formData.status,
            location: formData.location,
            description: formData.description,
            notes: formData.notes,
            aiInstructions: formData.aiInstructions,
            images: formData.images,
            batchGroup: formData.batch,
            serial: formData.serial,
            ref: formData.ref,
            caseSize: formData.caseSize,
            caliber: formData.caliber,
            timegrapher: formData.timegrapher,
        } as any);

        // Update original data after successful save
        const newOriginalData = createComparableData(formData);
        setOriginalData(newOriginalData);
        setHasChanges(false);
    };

    const handleSaveAndClose = () => {
        handleSave();
        setTimeout(() => {
            onCancel();
        }, 100);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleResetAI = () => {
        if (
            window.confirm(
                "Are you sure you want to reset the AI instructions? This action cannot be undone.",
            )
        ) {
            setFormData({ ...formData, aiInstructions: "" });
            console.log("AI thread reset for watch:", formData.name);
        }
    };

    const handleGenerateDescription = async () => {
        setIsGeneratingDescription(true);
        console.log("Generating description for watch:", formData.name);
        console.log("Using AI instructions:", formData.aiInstructions);
        console.log(
            "Using images marked for AI:",
            formData.images.filter((img) => img.useForAI),
        );

        // Simulate API call with timeout
        setTimeout(() => {
            alert(
                "Description generation would be implemented here using the AI instructions and selected images.",
            );
            setIsGeneratingDescription(false);
        }, 2000);
    };

    const handleCostChange = (value: string) => {
        setFormData({ ...formData, acquisitionCost: value });
    };

    const handleCurrencyConversion = (newValue: string) => {
        setDisplayCostValue(newValue);

        if (selectedCurrency === "EUR") {
            setFormData({ ...formData, acquisitionCost: newValue });
        } else {
            // Convert from selected currency to EUR
            const eurValue =
                parseFloat(newValue) / exchangeRates[selectedCurrency];
            setFormData({ ...formData, acquisitionCost: eurValue.toFixed(2) });
        }
    };

    const handleEditBrands = () => {
        const newBrand = prompt("Enter new brand name:");
        if (newBrand && newBrand.trim()) {
            console.log("Adding new brand:", newBrand.trim());
            alert(
                `Brand "${newBrand.trim()}" would be added to the list. This would be implemented with a proper modal in the real application.`,
            );
        }
    };

    const handleEditLocations = () => {
        const newLocation = prompt("Enter new location name:");
        if (newLocation && newLocation.trim()) {
            console.log("Adding new location:", newLocation.trim());
            alert(
                `Location "${newLocation.trim()}" would be added to the list. This would be implemented with a proper modal in the real application.`,
            );
        }
    };

    const handleEditBatches = () => {
        const newBatch = prompt("Enter new batch group name:");
        if (newBatch && newBatch.trim()) {
            console.log("Adding new batch group:", newBatch.trim());
            alert(
                `Batch group "${newBatch.trim()}" would be added to the list. This would be implemented with a proper modal in the real application.`,
            );
        }
    };

    const handleAddBatchGroup = () => {
        const newBatchGroup = prompt("Enter new batch group name:");
        if (newBatchGroup && newBatchGroup.trim()) {
            const trimmedBatch = newBatchGroup.trim();
            if (!batchGroups.includes(trimmedBatch)) {
                setBatchGroups([...batchGroups, trimmedBatch]);
                setFormData({ ...formData, batch: trimmedBatch });
                console.log("Added new batch group:", trimmedBatch);
            } else {
                alert("This batch group already exists.");
            }
        }
    };

    const aiSelectedCount = formData.images.filter(
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
        if (!formData.sku) {
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
            <title>SKU Label - ${formData.sku}</title>
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
              <div class="sku">${formData.sku}</div>
              <div class="watch-name">${formData.name || "Watch"}</div>
              <div>${formData.brand || ""}</div>
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
                                        value={formData.name}
                                        onChange={handleChange}
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
                                            value={formData.sku}
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
                                        value={formData.brand}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                brand: value,
                                            })
                                        }
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
                                        value={formData.status}
                                        onChange={handleChange}
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
                                        value={formData.location}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                location: value,
                                            })
                                        }
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
                                            onClick={handleAddBatchGroup}
                                            className="h-6 w-6 p-0"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <BatchSelector
                                        value={formData.batch}
                                        onValueChange={(value) =>
                                            setFormData({
                                                ...formData,
                                                batch: value,
                                            })
                                        }
                                        batches={batchGroups}
                                        onEditBatches={handleEditBatches}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Cost (€)
                                    </label>
                                    <div className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-medium text-slate-900">
                                        {formData.acquisitionCost
                                            ? `€${parseFloat(formData.acquisitionCost).toFixed(2)}`
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
                                                    {formData.images.length}/40
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
                                                images={formData.images}
                                                onChange={(images) =>
                                                    setFormData({
                                                        ...formData,
                                                        images,
                                                    })
                                                }
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
                                                value={formData.serial}
                                                onChange={handleChange}
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
                                                value={formData.ref}
                                                onChange={handleChange}
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
                                                value={formData.caseSize}
                                                onChange={handleChange}
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
                                                value={formData.caliber}
                                                onChange={handleChange}
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
                                                value={formData.timegrapher}
                                                onChange={handleChange}
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
                                            value={formData.aiInstructions}
                                            onChange={handleChange}
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
                                            value={formData.description}
                                            onChange={handleChange}
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
                                            value={formData.notes}
                                            onChange={handleChange}
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
                                onClick={handleApprove}
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
                                onClick={onCancel}
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

export default WatchForm;
