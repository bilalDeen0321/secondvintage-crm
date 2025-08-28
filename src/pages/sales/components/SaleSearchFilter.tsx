import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronDown,
    Search
} from "lucide-react";
import { useState } from "react";
import { getuniquePlatforms } from "../_actionSchema";


type Props = {
    batches: string[];
    brands: string[];
    watchPlatforms: Record<string, string>
};


export function SaleSearchFilter({ batches, brands, watchPlatforms }: Props) {

    const [statusFilter, setStatusFilter] = useState<string>("Approved & Platform Review");
    const [brandFilter, setBrandFilter] = useState<string>("All");
    const [platformFilter, setPlatformFilter] = useState<string>("All");
    const [batchFilter, setBatchFilter] = useState<string>("All");
    const [batchSearchTerm, setBatchSearchTerm] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");


    return <div className="mb-6 flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                    type="text"
                    placeholder="Search watches by name, brand, or SKU..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="pl-10"
                />
            </div>
        </div>
        <div className="flex gap-4">
            <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
            >
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    {[
                        "Approved & Platform Review",
                        "Approved",
                        "Platform Review",
                        "Ready for listing",
                        "Listed",
                    ].map((status) => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-40 justify-between"
                    >
                        {batchFilter === "All"
                            ? "Batch"
                            : batchFilter}
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 bg-white">
                    <div className="p-2">
                        <Input
                            placeholder="Search batches..."
                            value={batchSearchTerm}
                            onChange={(e) =>
                                setBatchSearchTerm(
                                    e.target.value,
                                )
                            }
                            className="h-8"
                        />
                    </div>
                    {batches.map((batch) => (
                        <DropdownMenuItem
                            key={batch}
                            onClick={() =>
                                setBatchFilter(batch)
                            }
                        >
                            {batch}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Select
                value={brandFilter}
                onValueChange={setBrandFilter}
            >
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                    {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                            {brand}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={platformFilter}
                onValueChange={setPlatformFilter}
            >
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                    {getuniquePlatforms(watchPlatforms).map((platform) => (
                        <SelectItem
                            key={platform}
                            value={platform}
                        >
                            {platform}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    </div>
}