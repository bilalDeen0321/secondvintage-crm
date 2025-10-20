import PlatformData from "@/app/models/PlatformData";
import Status from "@/app/models/Status";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSelectSearch } from "@/pages/watches/_search";
import { useForm } from "@inertiajs/react";
import { ChevronDown, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { saleSearchFilter } from "../_utils";

type Props = {
    batches: string[];
    brands: string[];
};

export function SaleSearchFilter({ batches, brands }: Props) {
    const { data, setData } = useForm({
        column: "",
        search: "",
        status: "All",
        brand: "All",
        batch: "All",
        location: "All",
        platform: "All",
        direction: "asc",
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        // Get all params from URL and remove null values
        const urlParams = {
            column: searchParams.get("column") || "",
            search: searchParams.get("search") || "",
            status: searchParams.get("status") || "All",
            brand: searchParams.get("brand") || "All",
            batch: searchParams.get("batch") || "All",
            location: searchParams.get("location") || "All",
            platform: searchParams.get("platform") || "All",
            direction: searchParams.get("direction") || "asc",
        };

        // Set data with URL params, filtering out null values
        setData(urlParams);
    }, []);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredBatches = ["All", ...batches].filter((batch) =>
        batch.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div className="mb-6 flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                        type="text"
                        placeholder="Search watches by name, brand, or SKU..."
                        value={data.search}
                        onChange={(e) => {
                            setData("search", e.target.value);
                            saleSearchFilter("search", getSelectSearch(e.target.value));
                        }}
                        className="pl-10"
                    />
                </div>
            </div>
            <div className="flex gap-4">
                {/* Status Selector */}
                <Select
                    value={data.status}
                    onValueChange={(value) => {
                        setData("status", value);
                        saleSearchFilter("status", getSelectSearch(value));
                    }}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status">
                            {data.status === "All" ? "Status" : data.status}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {["All", ...Status.allStatuses()].map((status) => (
                            <SelectItem key={status} value={status}>
                                {Status.toHuman(status)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>


                {/* Batch Selector */}
                <Select
                    value={data.batch === "All" ? undefined : data.batch} // placeholder when "All"
                    onValueChange={(value) => {
                        setData("batch", value);
                        saleSearchFilter("batch", getSelectSearch(value));
                        setSearchTerm(""); // reset search when selecting
                    }}
                >
                    <SelectTrigger className="w-40 font-normal">
                        <SelectValue placeholder="Batch">
                            {data.batch === "All" ? "Batch" : data.batch}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent className="font-normal">
                        {/* Search input */}
                        <div className="p-2 border-b">
                            <Input
                                placeholder="Search batches..."
                                className="h-8 font-normal"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                                // Only stop key events from closing the dropdown, allow typing
                                onKeyDown={(e) => e.stopPropagation()}
                                onFocus={(e) => e.stopPropagation()} // keep dropdown open
                            />
                        </div>

                        {/* Filtered batch list */}
                        <div className="max-h-48 overflow-y-auto font-normal">
                            {filteredBatches.length > 0 ? (
                                filteredBatches.map((batch) => (
                                    <SelectItem key={batch} value={batch}>
                                        {batch}
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="p-2 text-center text-sm text-muted-foreground font-normal">
                                    No batches found
                                </div>
                            )}
                        </div>
                    </SelectContent>
                </Select>


                {/* Brand Selector */}
                <Select
                    value={data.brand === "All" ? "" : data.brand} // placeholder when "All"
                    onValueChange={(value) => {
                        if (value === "All") {
                            setData("brand", "All");
                            saleSearchFilter("brand", null); // clear URL filter
                        } else {
                            setData("brand", value);
                            saleSearchFilter("brand", getSelectSearch(value));
                        }
                    }}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Brand">
                            {data.brand === "All" ? "Brand" : data.brand}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        {/* Search input */}
                        <div className="p-2">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={data.brandSearch || ""}
                                onChange={(e) => setData("brandSearch", e.target.value)}
                                className="w-full rounded border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                            />
                        </div>

                        {/* Always include "All" first */}
                        <SelectItem value="All">All</SelectItem>

                        {/* Filtered brands */}
                        {brands
                            .filter((b) =>
                                !data.brandSearch || b.toLowerCase().includes(data.brandSearch.toLowerCase())
                            )
                            .map((brand) => (
                                <SelectItem key={brand} value={brand}>
                                    {brand}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>


                {/* Platform Selector */}
                <Select
                    value={data.platform === "All" ? "" : data.platform} // placeholder when "All"
                    onValueChange={(val) => {
                        if (val === "All") {
                            setData("platform", "All");
                            saleSearchFilter("platform", null); // clear URL filter
                        } else {
                            setData("platform", val);
                            saleSearchFilter("platform", getSelectSearch(val));
                        }
                    }}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Platform">
                            {data.platform === "All" ? "Platform" : data.platform}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {/* Always include "All" first */}
                        <SelectItem value="All">All</SelectItem>
                        {PlatformData.allPlatforms().map((pitem, index) => (
                            <SelectItem key={index} value={pitem}>
                                {PlatformData.toLabel(pitem)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

            </div>
        </div>
    );
}
