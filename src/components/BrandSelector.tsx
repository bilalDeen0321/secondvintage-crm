import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Edit3, Search } from "lucide-react";
import { useState } from "react";

interface BrandSelectorProps {
    value: string;
    onValueChange: (value: string) => void;
    brands: string[];
    onEditBrands?: () => void;
}

const BrandSelector = ({
    value,
    onValueChange,
    brands,
    onEditBrands,
}: BrandSelectorProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const filteredBrands = brands.filter((brand) =>
        brand.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <Select
            value={value}
            onValueChange={onValueChange}
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
                <div className="flex items-center space-x-2 border-b p-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search brands..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    {onEditBrands && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                onEditBrands();
                                setIsOpen(false);
                            }}
                        >
                            <Edit3 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <div className="max-h-48 overflow-y-auto">
                    {filteredBrands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                            {brand}
                        </SelectItem>
                    ))}
                    {filteredBrands.length === 0 && (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                            No brands found
                        </div>
                    )}
                </div>
            </SelectContent>
        </Select>
    );
};

export default BrandSelector;
