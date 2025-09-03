import PlatformData from "@/app/models/PlatformData";
import Status from "@/app/models/Status";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSelectSearch } from "@/pages/watches/_search";
import { useForm } from "@inertiajs/react";
import { ChevronDown, Search } from "lucide-react";
import { useEffect } from "react";
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
    }, [setData]);

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
                <Select
                    value={data.status}
                    onValueChange={(value) => {
                        setData("status", value);
                        saleSearchFilter("status", getSelectSearch(value));
                    }}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {["All", ...Status.allStatuses()].map((status) => (
                            <SelectItem key={status} value={status}>
                                {Status.toHuman(status)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-40 justify-between">
                            {data.batch === "All" ? "Batch" : data.batch}
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 bg-white">
                        <div className="p-2">
                            <Input placeholder="Search batches..." className="h-8" />
                        </div>
                        {["All", ...batches].map((batch) => (
                            <DropdownMenuItem
                                key={batch}
                                onClick={() => {
                                    setData("batch", batch);
                                    saleSearchFilter("batch", getSelectSearch(batch));
                                }}
                            >
                                {batch}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Select
                    value={data.brand}
                    onValueChange={(value) => {
                        setData("brand", value);
                        saleSearchFilter("brand", getSelectSearch(value));
                    }}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Brand" />
                    </SelectTrigger>
                    <SelectContent>
                        {["All", ...brands].map((brand) => (
                            <SelectItem key={brand} value={brand}>
                                {brand}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={data.platform}
                    onValueChange={(val) => {
                        setData("platform", val);
                        saleSearchFilter("platform", getSelectSearch(val));
                    }}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                        {["All", ...PlatformData.allPlatforms()].map((pitem, index) => (
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
