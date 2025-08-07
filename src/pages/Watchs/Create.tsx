import { generateSKU } from "@/app/utils";
import BatchSelector from "@/components/BatchSelector";
import BrandSelector from "@/components/BrandSelector";
import InputError from "@/components/InputError";
import LocationSelector from "@/components/LocationSelector";
import { Button } from "@/components/ui/button";
import Link from "@/components/ui/Link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Status, Watch as TWatch } from "@/types/watch";
import { useForm } from "@inertiajs/react";
import {
    CheckCircle,
    Loader2,
    Plus,
    RotateCcw,
    Sparkles,
    Tag,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Watch = TWatch & {
    brand: string;
    status: Status["name"];
    location: string;
    images: { id: string; url: string; useForAI: boolean }[];
};

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

const initData = {
    name: "",
    sku: "",
    brand: "",
    acquisitionCost: "",
    status: 'draft',
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
    currency: 'EUR',
    images: [] as Watch["images"],
};

const exchangeRates = {
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

export default function WatchForm() {
    const { data, post, processing, progress, errors, setData } = useForm(initData);

    useEffect(() => {
        setData('sku', generateSKU(data.name, data.brand))
    }, [data.name, data.brand, setData]);

    const [batchGroups, setBatchGroups] = useState([
        "B001",
        "B002",
        "B003",
        "B020",
    ]);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [isGeneratingDescription, setIsGeneratingDescription] =
        useState(false);

    const formRef = useRef<HTMLDivElement>(null);

    // Exchange rates relative to EUR



    const handleApprove = () => {
        // Auto-save after approval
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('watches.store'))
    };

    const handleResetAI = () => {
        if (
            window.confirm(
                "Are you sure you want to reset the AI instructions? This action cannot be undone.",
            )
        ) {
            setData("aiInstructions", "");
            console.log("AI thread reset for watch:", data.name);
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
                setData("batch", trimmedBatch);
                console.log("Added new batch group:", trimmedBatch);
            } else {
                alert("This batch group already exists.");
            }
        }
    };

    const aiSelectedCount = data.images.filter((img) => img.useForAI).length;

    const handlePrintSKULabel = () => {
        if (!data.sku) {
            alert("No SKU available to print");
            setData('sku', generateSKU(data.brand, data.name))
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div
                    ref={formRef}
                    tabIndex={-1}
                    className="flex max-h-[98vh] w-full max-w-[90vw] flex-col overflow-hidden rounded-xl bg-white shadow-xl"
                >
                    <div className="flex justify-between border-b border-slate-200 p-3">
                        <h2 className="text-lg font-bold text-slate-900">
                            Add New Watch
                        </h2>
                        <Link href={route("watches.index")}>
                            Back to watches
                        </Link>
                    </div>



                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-1 flex-col overflow-hidden"
                    >

                        <div className="flex-1 space-y-2.5 overflow-y-auto p-6">

                            <div className="">
                                {Object.keys(errors).map(key => <InputError message={String(errors[key])} />)}
                            </div>

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
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
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
                                        onValueChange={(value) =>
                                            setData("brand", value)
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
                                            value={data.acquisitionCost}
                                            onChange={(e) => {
                                                const rate = Number(e.target.value) * exchangeRates[data.currency]
                                                setData('acquisitionCost', e.target.value)
                                            }}
                                            placeholder="0.00"
                                            className="w-36 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                        <Select
                                            value={data.currency}
                                            onValueChange={(value) => setData('currency', value)}
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
                                            <InputError message={errors.currency} />
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
                                    <InputError message={errors.status} />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Location
                                    </label>
                                    <LocationSelector
                                        value={data.location}
                                        onValueChange={(value) =>
                                            setData("location", value)
                                        }
                                        locations={["All", ...locations]}
                                        onEditLocations={handleEditLocations}
                                    />
                                    <InputError message={errors.location} />
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
                                        value={data.batch}
                                        onValueChange={(value) =>
                                            setData("batch", value)
                                        }
                                        batches={batchGroups}
                                        onEditBatches={handleEditBatches}
                                    />
                                    <InputError message={errors.batch} />
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
                                            <InputError message={errors.images} />
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
                                        <div className="min-h-[200px] flex-1" onClick={() => alert('This feature is under development')}>
                                            {/* <ImageManager
                                                images={data.images}
                                                onChange={(images) =>
                                                    setData("images", images)
                                                }
                                            /> */}
                                            <InputError message={errors.images} />
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
                                                onChange={(e) =>
                                                    setData(
                                                        "serial",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                            <InputError message={errors.serial} />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                                Ref
                                            </label>
                                            <input
                                                type="text"
                                                name="ref"
                                                value={data.ref}
                                                onChange={(e) =>
                                                    setData(
                                                        "ref",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                            <InputError message={errors.ref} />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                                Case Size
                                            </label>
                                            <input
                                                type="text"
                                                name="caseSize"
                                                value={data.caseSize}
                                                onChange={(e) =>
                                                    setData(
                                                        "caseSize",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                            <InputError message={errors.caseSize} />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                                Caliber
                                            </label>
                                            <input
                                                type="text"
                                                name="caliber"
                                                value={data.caliber}
                                                onChange={(e) =>
                                                    setData(
                                                        "caliber",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />

                                            <InputError message={errors.caliber} />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                                Timegrapher
                                            </label>
                                            <input
                                                type="text"
                                                name="timegrapher"
                                                value={data.timegrapher}
                                                onChange={(e) =>
                                                    setData(
                                                        "timegrapher",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />

                                            <InputError message={errors.timegrapher} />
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
                                            onChange={(e) =>
                                                setData(
                                                    "aiInstructions",
                                                    e.target.value,
                                                )
                                            }
                                            rows={1}
                                            placeholder=""
                                            className="min-h-[40px] w-full resize-y"
                                        />
                                        <InputError message={errors.aiInstructions} />
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
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            className="min-h-[320px] w-full resize-y"
                                            disabled={isGeneratingDescription}
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Notes
                                        </label>
                                        <Textarea
                                            name="notes"
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData("notes", e.target.value)
                                            }
                                            rows={2}
                                            className="w-full resize-y"
                                        />
                                        <InputError message={errors.notes} />
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
                                className={`flex-1 ${processing ? "cursor-not-allowed bg-gray-400 text-gray-600" : ""}`}
                                disabled={processing}
                            >
                                {processing ? "Saving..." : "Save"}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => alert("save and closed")}
                                className={`flex-1 ${processing ? "cursor-not-allowed bg-gray-400 text-gray-600" : ""}`}
                                disabled={processing}
                            >
                                Save & Close
                            </Button>
                            <Link
                                href={route("watches.index")}
                                type="button"
                                variant="outline"
                                className="flex-1"
                            >
                                {!processing ? "Cancel & Close" : "Close"}
                            </Link>
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
                                onClick={() => alert("save and continue")}
                                className="flex-1"
                            >
                                Save & Continue
                            </Button>
                            <Button
                                onClick={() => alert("Discard")}
                                variant="outline"
                                className="flex-1"
                            >
                                Discard Changes
                            </Button>
                            <Link
                                href={route("watches.index")}
                                variant="ghost"
                                className="flex-1"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
