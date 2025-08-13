/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { countries, currencies, exchangeRates } from "@/app/data";
import Status from "@/app/models/Status";
import { generateSKU } from "@/app/utils";
import BatchSelector from "@/components/BatchSelector";
import BrandSelector from "@/components/BrandSelector";
import ImageManager from "@/components/ImageManager";
import InputError from "@/components/InputError";
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
import useKeyboard from "@/hooks/extarnals/useKeyboard";
import { Watch as TWatch } from "@/types/watch";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
    CheckCircle,
    Loader2,
    Plus,
    RotateCcw,
    Sparkles,
    Tag,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { handlePrintSKULabel } from "./_create-actions";
import {
    handleApprove,
    handleEditBrands,
    handleEditLocations,
    hanldeBatchAction
} from "./actions";

type Watch = TWatch & {
    brand: string;
    status: any;
    location: string;
    images: any[];
};

export const initData = {
    name: "",
    sku: "",
    brand: "",
    status: Status.DRAFT,
    serial_number: "",
    reference: "",
    case_size: "",
    caliber: "",
    timegrapher: "",
    original_cost: "",
    current_cost: "",
    ai_instructions: "",
    location: "",
    batch: "",
    description: "",
    currency: "DKK",
    notes: "",
    images: [] as Watch["images"],
};

export default function AddNewWatch() {

    const formRef = useKeyboard<HTMLDivElement>("Escape", () => router.visit(route("watches.index")));

    const {
        locations = countries,
        batches = [],
        brands = [],
        statuses = [],
        watch_skus = []
    } = (usePage().props as any) || {};

    const [showSaveDialog, setShowSaveDialog] = useState(false);


    const {
        data,
        setData,
        post: storeServer,
        processing,
        errors,
    } = useForm(initData);

    const [savedData, setSavedData] = useState<any>(initData);
    const [hasChanges, setHasChanges] = useState(false);
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

    //generate sku and display
    useEffect(() => {
        if (data.name && data.brand) {
            setData("sku", generateSKU(data.brand, data.name, watch_skus));
        }
    }, [data.name, data.brand, setData, watch_skus]);

    // Update display value when form data or currency changes
    useEffect(() => {
        const originalCost = Number(data.original_cost);
        const rate = Number(exchangeRates[data.currency]);

        if (!isNaN(originalCost) && !isNaN(rate)) {
            // Store as string for form state
            setData("current_cost", (originalCost * rate).toFixed(2));
        } else {
            // Fallback to original cost as string (2 decimals)
            setData("current_cost", originalCost.toFixed(2));
        }
    }, [data.currency, data.original_cost, setData]);

    /**
     * unimproved scripts
     */
    useEffect(() => {
        const savedDataString = JSON.stringify(savedData);
        const formDataString = JSON.stringify(data);
        if (!(formDataString === savedDataString)) {
            setHasChanges(true);
        }
    }, [data, savedData]);


    const handleSave = () => {
        //save the data to server
        storeServer(route("watches.store"), {
            onSuccess: () => {
                // reset();
            },
        });

        setSavedData(data);
        // setHasChanges(false);
    };

    const handleSaveAndClose = () => {
        handleSave();
        setTimeout(() => {
            router.visit(route("watches.index"));
        }, 100);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    };

    const handleSaveAndNavigate = (e) => { };

    const handleResetAI = () => {
        if (
            window.confirm(
                "Are you sure you want to reset the AI instructions? This action cannot be undone.",
            )
        ) {
            setData("ai_instructions", "");

            alert("AI thread reset for watch:" + data.name);
        }
    };

    const handleGenerateDescription = async () => {
        setIsGeneratingDescription(true);
        console.log("Generating description for watch:", data.name);
        console.log("Using AI instructions:", data.ai_instructions);
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

    const aiSelectedCount = data.images.filter((img) => img.useForAI).length;

    return (
        <>
            <Head title="Add New Watch" />
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div
                    ref={formRef}
                    tabIndex={-1}
                    className="flex max-h-[98vh] w-full max-w-[90vw] flex-col overflow-hidden rounded-xl bg-white shadow-xl"
                >
                    <div className="flex-shrink-0 border-b border-slate-200 p-3">
                        <h2 className="text-lg font-bold text-slate-900">
                            {"Add New Watch"}
                        </h2>
                    </div>
                    <div className="flex-shrink-0 border-b border-slate-200 p-3">
                        {Object.entries(errors).map(([, error]) => <InputError message={String(error)} />)}
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
                                            onClick={() =>
                                                handlePrintSKULabel(data.name, data.brand, data.sku)
                                            }
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
                                        onValueChange={(value) => setData("brand", value)}
                                        brands={brands}
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
                                            value={data.original_cost}
                                            onChange={(e) =>
                                                setData(
                                                    "original_cost",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="1.00"
                                            className="w-36 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                        <Select
                                            value={data.currency}
                                            onValueChange={(value) =>
                                                setData("currency", value)
                                            }
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
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        {(statuses).map((status, index) => (
                                            <option
                                                key={index}
                                                value={status}
                                            >
                                                {Status.toHuman(status)}
                                            </option>
                                        ),
                                        )}
                                    </select>
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
                                        locations={locations}
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
                                            onClick={hanldeBatchAction}
                                            className="h-6 w-6 p-0"
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <BatchSelector
                                        value={data.batch}
                                        onValueChange={(value) => setData("batch", value)}
                                        batches={batches}
                                        onEditBatches={hanldeBatchAction}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Cost (€)
                                    </label>
                                    <div className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-medium text-slate-900">
                                        {data.current_cost
                                            ? `€${parseFloat(data.current_cost).toFixed(2)}`
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
                                                onChange={(images) =>
                                                    setData("images", images)
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
                                                value={data.serial_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "serial_number",
                                                        e.target.value,
                                                    )
                                                }
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
                                                value={data.reference}
                                                onChange={(e) =>
                                                    setData(
                                                        "reference",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                                Case Size
                                            </label>
                                            <input
                                                type="text"
                                                name="case_size"
                                                value={data.case_size}
                                                onChange={(e) =>
                                                    setData(
                                                        "case_size",
                                                        e.target.value,
                                                    )
                                                }
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
                                                onChange={(e) =>
                                                    setData(
                                                        "caliber",
                                                        e.target.value,
                                                    )
                                                }
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
                                                onChange={(e) =>
                                                    setData(
                                                        "timegrapher",
                                                        e.target.value,
                                                    )
                                                }
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
                                            name="ai_instructions"
                                            value={data.ai_instructions}
                                            onChange={(e) =>
                                                setData(
                                                    "ai_instructions",
                                                    e.target.value,
                                                )
                                            }
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
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
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
                                            onChange={(e) =>
                                                setData("notes", e.target.value)
                                            }
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
                                disabled={processing || !hasChanges}
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
                                onClick={() =>
                                    router.visit(route("watches.index"))
                                }
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
                                onClick={handleSaveAndClose}
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
}
