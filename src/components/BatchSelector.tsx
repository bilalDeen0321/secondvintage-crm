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

interface BatchSelectorProps {
    value: string;
    onValueChange: (value: string) => void;
    batches: string[];
    onEditBatches?: () => void;
}

const BatchSelector = ({
    value,
    onValueChange,
    batches,
    onEditBatches,
}: BatchSelectorProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const filteredBatches = batches.filter((batch) =>
        batch.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <Select
            value={value}
            onValueChange={onValueChange}
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select batch group" />
            </SelectTrigger>
            <SelectContent
             onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
            if (e.target.closest("input")) e.preventDefault();
            }}>
                <div className="flex items-center space-x-2 border-b p-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search batch groups..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                            autoFocus
                            onPointerDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            onKeyUp={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    {onEditBatches && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                 e.stopPropagation();
                                onEditBatches();
                                setIsOpen(false);
                            }}
                        >
                            <Edit3 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <div className="max-h-48 overflow-y-auto">
                    {filteredBatches.map((batch) => (
                        <SelectItem key={batch} value={batch}>
                            {batch}
                        </SelectItem>
                    ))}
                    {filteredBatches.length === 0 && (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                            No batch groups found
                        </div>
                    )}
                </div>
            </SelectContent>
        </Select>
    );
};

export default BatchSelector;
