/* eslint-disable @typescript-eslint/no-explicit-any */
import { countries, currencies } from "@/app/data";
import Status from "@/app/models/Status";
import BatchSelector from "@/components/BatchSelector";
import BrandSelector from "@/components/BrandSelector";
import ImageManager from "@/components/ImageManager";
import InputError from "@/components/InputError";
import Layout from "@/components/Layout";
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
import useKeyboard from "@/hooks/extarnals/useKeyboard";
import { useServerSku } from "@/hooks/extarnals/useServerSku";
import { WatchResource } from "@/types/resources/watch";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import {
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Plus,
    Sparkles
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { currencyExchange, watchEscapeCallback, watchInitData } from "./_utils";
import { handleApprove, handleEditBrands, handleEditLocations, hanldeBatchAction } from "./actions";
import AutoSkuGenerate from "./components/AutoSkuGenerate";
import GenerateAiDescription from "./components/GenerateAiDescription";

type Props = {
    watch: WatchResource;
    nextItem: WatchResource;
    previousItem: WatchResource;
    locations: typeof countries;
    batches: string[];
    brands: string[];
    statuses: string[];
};

export default function UpdateWatch(props: Props) {

    //server props
    const { locations = countries, batches = [], brands = [], statuses = [] } = props || {};
    const { watch, nextItem, previousItem } = (usePage().props) as unknown as Props;

    //utils    
    const formRef = useKeyboard<HTMLDivElement>("Escape", watchEscapeCallback);
    //local state
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [savedData, setSavedData] = useState<any>(watchInitData(watch));
    const [hasChanges, setHasChanges] = useState(false);

    //server state
    const { data, setData, put: updateServer, processing, errors } = useForm(watchInitData(watch));


    // Use the debounced server SKU hook
    const sku = useServerSku(data.name, data.brand);

    // Update the form state only when SKU changes
    useEffect(() => { if (data.sku !== sku) setData('sku', sku); }, [sku, setData, data.sku]);



    // Update display value when form data or currency changes
    useEffect(() => {
        currencyExchange(
            data.original_cost,
            data.currency,
            (value) => setData('current_cost', value)
        );
    }, [data.currency, data.original_cost, setData]);

    /**
     * unimproved scripts
     */
    // useEffect(() => {
    //     const savedDataString = JSON.stringify(savedData);
    //     const formDataString = JSON.stringify(data);
    //     if (!(formDataString === savedDataString)) {
    //         setHasChanges(true);
    //     }
    // }, [data, savedData]);


    const aiSelectedCount = data.images.filter((img) => img.useForAI).length;


    /**
     * All Handlers + server actions
     */

    const handleSave = () => {
        //save the data to server
        updateServer(route("watches.store"), {
            onSuccess: () => {
                // reset();
            },
        });

        setSavedData(data);
        setHasChanges(false);
    };

    const handleSaveAndClose = () => {
        handleSave();
        router.visit(route("watches.index"));
    };

    //Form handler with server reqeust
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSave();
    };


    return (
        <Layout>
            <Head title="Add New Watch" />

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div
                    ref={formRef}
                    tabIndex={-1}
                    className="flex max-h-[98vh] w-full max-w-[90vw] flex-col overflow-hidden rounded-xl bg-white shadow-xl"
                >
                    <div className="flex-shrink-0 border-b border-slate-200 p-3">
                        <h2 className="text-lg font-bold text-slate-900">{"Add New Watch"}</h2>
                    </div>
                    <div className="flex-shrink-0 border-b border-slate-200 p-3">
                        {Object.entries(errors).map(([, error]) => (
                            <InputError message={String(error)} />
                        ))}
                    </div>

                    {/* Navigation Arrows - Outside the box */}
                    {previousItem && (
                        <Link
                            type="button"
                            variant="outline"
                            size="sm"
                            href={route("watches.show", previousItem.routeKey)}
                            className="absolute left-8 top-1/2 z-10 -translate-y-1/2 transform bg-white shadow-lg hover:bg-gray-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    )}

                    {nextItem && (
                        <Link
                            type="button"
                            variant="outline"
                            size="sm"
                            href={route("watches.show", nextItem.routeKey)}
                            className="absolute right-8 top-1/2 z-10 -translate-y-1/2 transform bg-white shadow-lg hover:bg-gray-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    )}

                    <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
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
                                        onChange={(e) => setData("name", e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <AutoSkuGenerate
                                    value={data.sku}
                                    name={data.name}
                                    brand={data.brand}
                                    onChange={(value) => setData("sku", value)}
                                />

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
                                                setData("original_cost", e.target.value)
                                            }
                                            placeholder="1.00"
                                            className="w-36 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                        <Select
                                            value={data.currency}
                                            onValueChange={(value) => setData("currency", value)}
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
                                                        {currency.symbol} {currency.name}
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
                                        onChange={(e) => setData("status", e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        {statuses.map((status, index) => (
                                            <option key={index} value={status}>
                                                {Status.toHuman(status)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Location
                                    </label>
                                    <LocationSelector
                                        value={data.location}
                                        onValueChange={(value) => setData("location", value)}
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
                                                <span>{data.images.length}/40 images</span>
                                                <span className="flex items-center space-x-1">
                                                    <Sparkles className="h-4 w-4 text-amber-500" />
                                                    <span>{aiSelectedCount}/10 AI selected</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="min-h-[200px] flex-1">
                                            <ImageManager
                                                images={data.images}
                                                onChange={(images) => setData("images", images)}
                                            />
                                        </div>
                                        {/* Created by line */}
                                        <div className="mt-2 text-xs text-slate-500">
                                            Edited by <strong>Admin</strong> on 6/23/2025 | Seller:{" "}
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
                                                    setData("serial_number", e.target.value)
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
                                                    setData("reference", e.target.value)
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
                                                    setData("case_size", e.target.value)
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
                                                onChange={(e) => setData("caliber", e.target.value)}
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
                                                    setData("timegrapher", e.target.value)
                                                }
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <GenerateAiDescription
                                        data={data}
                                        setData={setData}
                                    />

                                    <div className="flex flex-col">
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            <span className="font-bold">Description</span>{" "}
                                            <span className="font-normal">
                                                (Remember to check Model, Case size, Serial,
                                                Reference, Timegrapher result)
                                            </span>
                                        </label>
                                        <Textarea
                                            name="description"
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            className="min-h-[320px] w-full resize-y"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Notes
                                        </label>
                                        <Textarea
                                            name="notes"
                                            value={data.notes}
                                            onChange={(e) => setData("notes", e.target.value)}
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
                                onClick={() => router.visit(route("watches.index"))}
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
                        <h3 className="mb-4 text-lg font-semibold">Unsaved Changes</h3>
                        <p className="mb-6 text-gray-600">
                            You have unsaved changes. Do you want to save them before navigating to
                            the next watch?
                        </p>
                        <div className="flex gap-3">
                            <Button onClick={() => alert('Save and continue is under development')} className="flex-1">
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
        </Layout>
    );
}
