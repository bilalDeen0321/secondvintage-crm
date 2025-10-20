/* eslint-disable @typescript-eslint/no-explicit-any */
import { Currency, CurrencyAttributes } from "@/app/models/Currency";
import Status from "@/app/models/Status";
import { sliceObject } from "@/app/utils";
import BatchSelector from "@/components/BatchSelector";
import BrandSelector from "@/components/BrandSelector";
import InputError from "@/components/InputError";
import Layout from "@/components/Layout";
import LocationSelector from "@/components/LocationSelector";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import UploadManager from "@/components/UploadManager";
import useKeyboard from "@/hooks/extarnals/useKeyboard";
import { useServerSku } from "@/hooks/extarnals/useServerSku";
import { WatchResource } from "@/types/resources/watch";
import { Page } from "@inertiajs/core";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { CheckCircle, Plus, Sparkles } from "lucide-react";
import { PageProps } from "node_modules/@inertiajs/core/types/types";
import React, { useEffect, useMemo, useState } from "react";
import { handleEditBrands, handleEditLocations, hanldeBatchAction } from "./_actions";
import { watchEscapeCallback, watchInitData } from "./_utils";
import AutoSkuGenerate from "./components/AutoSkuGenerate";
import GenerateAiDescription from "./components/GenerateAiDescription";
import WatchFormNavigation from "./components/WatchFormNavigation";
import WatchWatermark from "./components/WatchWatermark";
import { toast } from "react-toastify";  

 
type Props = {
    watch?: WatchResource;
    locations: string[];
    batches: string[];
    brands: string[];
    statuses: string[];
    currencies: CurrencyAttributes[];
} & PageProps;

export default function CreateWatch({ watch, auth, ...props }: Props) {
    const { url } = usePage();
    const queryString = url.includes("?") ? url.substring(url.indexOf("?")) : "";


    //server props
    const { locations = [], batches = [], brands = [], statuses = [], currencies = [] } = props || {};
    const [aiProcessing, setAiProcessing] = useState(false);
    const formRef = useKeyboard<HTMLDivElement>("Escape", watchEscapeCallback);

    //local states
    const [loadName, setLoadName] = useState<"save_and_close" | "save">("save");
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    //server states
    const { data, setData, post, processing, errors } = useForm(watchInitData(watch, auth?.user));
    const [savedData, setSavedData] = useState<any>(watchInitData(watch, auth?.user));

    
    const [loadingDescription, setLoadingDescription] = useState(false); 
    
    // Use the debounced server SKU hook
    const sku = useServerSku(data.name, data.brand, watch?.sku);
    
    // Only update SKU if NOT in edit mode (i.e., creating a new watch)
    useEffect(() => {
        if (!watch && data.sku !== sku) setData("sku", sku);
    }, [sku, setData, data.sku, watch]);

    const hasChanges = useMemo(() => {
        const excludeKeys = ['ai_status', 'ai_message']; // any technical keys you want ignored
        const clean = (obj: any) => {
            if (!obj) return obj;
            const copy = { ...obj };
            excludeKeys.forEach(k => delete copy[k]);
            return copy;
        };
        console.log('clean(data): ', clean(data), 'clean(savedData): ', clean(savedData));
        return JSON.stringify(clean(data)) !== JSON.stringify(clean(savedData));
    }, [data, savedData]);

    
    // const hasChanges = useMemo(() => JSON.stringify(data) !== JSON.stringify(savedData), [data, savedData]);

    console.log('create wawtch: ', data, savedData, hasChanges);

    // Update display value when form data or currency changes
    useEffect(() => {
        if (data.original_cost) {
            Currency.init().exchange(data.original_cost, data.currency, currencies, (value) => setData("current_cost", value));
        }
    }, [currencies, data.currency, data.original_cost, setData]);

    const aiSelectedCount = data.images.filter((img) => img.useForAI).length;

     const onSave = (handler?: ((res?: any) => void) | string) => {
           const successcallback = (res: Page<PageProps>) => {
               setSavedData(data);
   
               // Force update of watch data in the parent component/list
               if (res.props?.flash?.data) {
                   // Update any parent state or cache with the new watch data
                   const updatedWatch = res.props.flash.data;
   
                   // If this is an update operation, ensure the list view gets fresh data
                   if (watch?.routeKey && updatedWatch) {
                       // Trigger a partial reload or state update to refresh the list
                      // router.reload({ only: ["watches"] });
                   }
               }
   
               if (typeof handler === "function") {
                   handler(res.props?.flash?.data);
               } else if (typeof handler === "string") {
                   router.visit(handler);
               }
           };
   
           //handle update watch
           if (watch?.routeKey) {
               const putDate = sliceObject(data, ["sku", "id"]);
   
               router.post(
                   route(`watches.update`, watch.routeKey),
                   { ...putDate, _method: "put" },
                   {
                       forceFormData: true,
                       preserveState: false, // Changed to false to ensure fresh data
                       onSuccess: successcallback,
                   }
               );
   
               return;
           }
   
           post(route(`watches.store`), {
               forceFormData: true,
               onSuccess: successcallback,
           });
       };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        setLoadName("save");
          onSave((res) => router.visit(route("watches.show", res?.routeKey || ""))); 
    };

    const onSaveAndClose = () => { 
        setLoadName("save_and_close"); 
         const destination = queryString ? `${route("watches.index")}${queryString}` : route("watches.index");
          onSave(destination);
    };

    const onClose = () => { 
        if (hasChanges) {
            setShowSaveDialog(true);
            return;
        } 
         const destination = queryString ? `${route("watches.index")}${queryString}` : route("watches.index");
        router.visit(destination);
        //router.visit(route("watches.index"));
    };

    // Handle browser close / refresh
    useEffect(() => {
        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [hasChanges]);

    // Handle browser back/forward navigation
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            if (hasChanges) {
                event.preventDefault();
                event.stopPropagation();
                setShowSaveDialog(true);
            }
        };
  
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [hasChanges]);
    
    
    return (
        <Layout>
            <Head title={watch?.routeKey ? "Update the Watch" : "Add New Watch"} />
            {processing && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-white/70 cursor-not-allowed">
                    <div className="flex flex-col items-center space-y-3">
                        <svg className="h-8 w-8 animate-spin text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span className="text-slate-700 font-medium">Saving...</span>
                    </div>
                </div>
            )}

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div ref={formRef} tabIndex={-1} className="flex max-h-[98vh] w-full max-w-[90vw] flex-col overflow-hidden rounded-xl bg-white shadow-xl">
                    <div className="flex-shrink-0 border-b border-slate-200 p-3">
                        <h2 className="text-lg font-bold text-slate-900">{watch?.routeKey ? "Update the Watch" : "Add New Watch"}</h2>
                    </div>
                    {Object.keys(errors).length > 0 && (
                        <div className="flex-shrink-0 border-b border-slate-200 p-3">
                            {Object.entries(errors).map(([, error], index) => (
                                <InputError key={index} message={String(error)} />
                            ))}
                        </div>
                    )}

                    <WatchFormNavigation />

                    <form onSubmit={onSubmit} className="flex flex-1 flex-col overflow-hidden">
                        <div className="flex-1 space-y-2.5 overflow-y-auto p-6">
                            {/* First row: Name | SKU | Brand | Original Cost + Currency dropdown */}
                            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <AutoSkuGenerate value={data.sku} name={data.name} brand={data.brand} onChange={(value) => setData("sku", value)} />

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Brand *</label>
                                    <BrandSelector value={data.brand} onValueChange={(value) => setData("brand", value)} disabled={!!watch?.id} brands={brands} onEditBrands={handleEditBrands} />
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center space-x-2">
                                        <label className="text-sm font-medium text-slate-700">Original Cost</label>
                                        <label className="text-sm font-medium text-slate-700">Currency dropdown</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            value={data.original_cost}
                                            onChange={(e) => setData("original_cost", e.target.value)}
                                            placeholder="1.00"
                                            className="w-36 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                        <Select value={data.currency} onValueChange={(value) => setData("currency", value)}>
                                            <SelectTrigger className="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {currencies.map((currency) => (
                                                    <SelectItem key={currency.code} value={currency.code}>
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
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Status *</label>
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
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
                                    <LocationSelector value={data.location} onValueChange={(value) => setData("location", value)} locations={locations} onEditLocations={handleEditLocations} />
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <label className="block text-sm font-medium text-slate-700">Batch Group</label>
                                        <Button type="button" variant="outline" size="sm" onClick={hanldeBatchAction} className="h-6 w-6 p-0">
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <BatchSelector value={data.batch} onValueChange={(value) => setData("batch", value)} batches={batches} onEditBatches={hanldeBatchAction} />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Cost (€)</label>
                                    <div className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-medium text-slate-900">
                                        {data.current_cost ? `€${parseFloat(data.current_cost).toFixed(2)}` : "€0.00"}
                                    </div>
                                </div>
                            </div>

                            <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 lg:grid-cols-2">
                                <div className="flex min-h-0 flex-col space-y-2.5">
                                    <div className="flex min-h-0 flex-1 flex-col">
                                        <div className="mb-2 flex items-center justify-between">
                                            <label className="block text-sm font-medium text-slate-700">Images (up to 40)</label>
                                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                                                <span>{data.images.length}/40 images</span>
                                                <span className="flex items-center space-x-1">
                                                    <Sparkles className="h-4 w-4 text-amber-500" />
                                                    <span>{aiSelectedCount}/9 AI selected</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="min-h-[200px] flex-1">
                                            <UploadManager images={data.images} onChange={(images) => setData("images", images)} />
                                        </div>
                                        {/* Created by line */}
                                        <WatchWatermark watch={watch} />
                                    </div>
                                </div>

                                <div className="flex min-h-0 flex-col space-y-2.5">
                                    {/* Watch Details Section */}
                                    <div className="grid grid-cols-6 gap-2">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">Serial</label>
                                            <input
                                                type="text"
                                                name="serial"
                                                value={data.serial_number}
                                                onChange={(e) => setData("serial_number", e.target.value)}
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">Ref</label>
                                            <input
                                                type="text"
                                                name="ref"
                                                value={data.reference}
                                                onChange={(e) => setData("reference", e.target.value)}
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">Case Size</label>
                                            <input
                                                type="text"
                                                name="case_size"
                                                value={data.case_size}
                                                onChange={(e) => setData("case_size", e.target.value)}
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">Wrist Size</label>
                                            <input
                                                type="text"
                                                name="wrist_size"
                                                value={data.wrist_size}
                                                onChange={(e) => setData("wrist_size", e.target.value)}
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">Caliber</label>
                                            <input
                                                type="text"
                                                name="caliber"
                                                value={data.caliber}
                                                onChange={(e) => setData("caliber", e.target.value)}
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-700">Timegrapher</label>
                                            <input
                                                type="text"
                                                name="timegrapher"
                                                value={data.timegrapher}
                                                onChange={(e) => setData("timegrapher", e.target.value)}
                                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>
                                    </div>
                                    
                                    <GenerateAiDescription watch={watch} data={data} setData={setData} setSavedData={setSavedData} setAiProcessing={setAiProcessing}/>
                                      
                                    <div className="flex flex-col">
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            <span className="font-bold">Description</span>{" "}
                                            <span className="font-normal">(Remember to check Model, Case size, Serial, Reference, Timegrapher result)</span>
                                        </label>
                                        <Textarea
                                            value={data.description}
                                            name="description"
                                            onChange={(e) => setData("description", e.target.value)}
                                            className="min-h-[320px] w-full resize-y"
                                            disabled={data.ai_status === "loading"}
                                        ></Textarea>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">Notes</label>
                                        <Textarea name="notes" value={data.notes} onChange={(e) => setData("notes", e.target.value)} rows={2} className="w-full resize-y" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-shrink-0 gap-3 border-t border-slate-200 p-6 pt-4">
                            <Button
                                type="button"
                                disabled={watch?.status === Status.APPROVED || !watch?.routeKey}
                                onClick={() => {
                                    if (!watch?.routeKey) return;
                                    router.post(
                                        route("watches.approve", watch?.routeKey),
                                        {},
                                        {
                                            preserveState: false,
                                            preserveScroll: true,
                                        }
                                    );
                                }}
                                className="flex-1 bg-green-600 text-white hover:bg-green-700"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                            </Button>
                            <Button type="submit" className={`flex-1 ${!hasChanges ? "cursor-not-allowed bg-gray-400 text-gray-600" : ""}`} disabled={processing || aiProcessing || !hasChanges}>
                                {loadName === "save" && processing ? "Saving..." : hasChanges ? "Save" : "Saved"}
                            </Button>
                            <Button
                                type="button"
                                onClick={onSaveAndClose}
                                className={`flex-1 ${!hasChanges ? "cursor-not-allowed bg-gray-400 text-gray-600" : ""}`} disabled={processing || aiProcessing || !hasChanges}
                            >
                                {loadName === "save_and_close" && processing ? "Saving..." : "Save & Close"}
                            </Button>
                            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
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
                        <p className="mb-6 text-gray-600">You have unsaved changes. Do you want to save them before navigating to the next watch?</p>
                        <div className="flex gap-3">
                            <Button onClick={onSaveAndClose} className="flex-1">
                                Save & Continue
                            </Button>
                            <Button onClick={() => {
                                    const destination = queryString ? `${route("watches.index")}${queryString}` : route("watches.index");
                                    router.visit(destination);
                            }} variant="outline" className="flex-1">
                                Discard Changes
                            </Button>
                            <Button onClick={() => setShowSaveDialog(false)} variant="ghost" className="flex-1">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
