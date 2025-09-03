import { ArrowDown, ArrowUp, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface Watch {
    id: string;
    image: string;
    name: string;
    sku?: string;
    brand: string;
    status: string;
    seller: string;
    notes: string;
    price: number;
}

interface AddWatchToPaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddWatches: (watches: Watch[]) => void;
    existingWatches: Watch[];
}

const AddWatchToPaymentDialog = ({ open, onOpenChange, onAddWatches, existingWatches }: AddWatchToPaymentDialogProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedWatches, setSelectedWatches] = useState<string[]>([]);
    const [sortField, setSortField] = useState<keyof Watch>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    // Sample watches data - only showing unpaid watches with 20+ examples
    const allWatches: Watch[] = [
        {
            id: "ITEM-001",
            image: "/lovable-uploads/6902d75d-7bb8-43ee-93eb-56d642c25393.png",
            name: "Vintage Rolex Submariner",
            sku: "RLX-SUB-001",
            brand: "Rolex",
            status: "Pending Payment",
            seller: "WatchCorp Ltd",
            notes: "Excellent condition, original box and papers",
            price: 15000,
        },
        {
            id: "ITEM-003",
            image: "/lovable-uploads/0464203d-f5d6-4f95-8d96-7ac6a8a62fba.png",
            name: "Daytona",
            sku: "RLX-DAY-003",
            brand: "Rolex",
            status: "Pending Payment",
            seller: "WatchCorp Ltd",
            notes: "White dial, steel case",
            price: 12000,
        },
        {
            id: "ITEM-004",
            image: "/lovable-uploads/514150da-8678-460a-bcbc-ee548d8d6098.png",
            name: "Omega Speedmaster",
            sku: "OMG-SPD-004",
            brand: "Omega",
            status: "Pending Payment",
            seller: "TimeKeepers Inc",
            notes: "Moon watch, manual wind",
            price: 4500,
        },
        {
            id: "ITEM-005",
            image: "/lovable-uploads/52231a31-d92b-4dc7-ab75-1e37c3104e6c.png",
            name: "Patek Philippe Calatrava",
            sku: "PP-CAL-005",
            brand: "Patek Philippe",
            status: "Pending Payment",
            seller: "Luxury Timepieces",
            notes: "White gold, leather strap",
            price: 35000,
        },
        {
            id: "ITEM-014",
            image: "/lovable-uploads/c3abfafa-8986-4b30-bd89-3d163701cb64.png",
            name: "Audemars Piguet Royal Oak Offshore",
            sku: "AP-ROO-014",
            brand: "Audemars Piguet",
            status: "Pending Payment",
            seller: "Swiss Luxury",
            notes: "Chronograph, rubber strap",
            price: 32000,
        },
        {
            id: "ITEM-015",
            image: "/lovable-uploads/7130fbd8-0c96-4588-a7a8-c2ba32b3a07f.png",
            name: "Cartier Tank Solo",
            sku: "CAR-TAN-015",
            brand: "Cartier",
            status: "Pending Payment",
            seller: "French Elegance",
            notes: "Stainless steel, rectangular case",
            price: 2800,
        },
        {
            id: "ITEM-016",
            image: "/lovable-uploads/1f4e1ffe-7868-4e62-bbbe-9b6aba3835d7.png",
            name: "TAG Heuer Formula 1",
            sku: "TAG-F1-016",
            brand: "TAG Heuer",
            status: "Pending Payment",
            seller: "Sports Timing",
            notes: "Quartz movement, racing inspired",
            price: 1200,
        },
        {
            id: "ITEM-017",
            image: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
            name: "Breitling Superocean",
            sku: "BRE-SUP-017",
            brand: "Breitling",
            status: "Pending Payment",
            seller: "Ocean Watches",
            notes: "Diving watch, 500m water resistance",
            price: 4200,
        },
        {
            id: "ITEM-018",
            image: "/lovable-uploads/27ec6583-00c5-4c9f-bf57-429e50240830.png",
            name: "IWC Big Pilot",
            sku: "IWC-BP-018",
            brand: "IWC",
            status: "Pending Payment",
            seller: "Aviation Classics",
            notes: "46mm case, big crown",
            price: 8500,
        },
        {
            id: "ITEM-019",
            image: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
            name: "Panerai Radiomir",
            sku: "PAN-RAD-019",
            brand: "Panerai",
            status: "Pending Payment",
            seller: "Italian Heritage",
            notes: "Manual wind, vintage design",
            price: 7200,
        },
        {
            id: "ITEM-020",
            image: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
            name: "Jaeger-LeCoultre Master Control",
            sku: "JLC-MC-020",
            brand: "Jaeger-LeCoultre",
            status: "Pending Payment",
            seller: "Swiss Mastery",
            notes: "Automatic, date display",
            price: 6800,
        },
        {
            id: "ITEM-021",
            image: "/lovable-uploads/c5705a12-d674-4b2c-93d3-566cbb3757fa.png",
            name: "Tudor Pelagos",
            sku: "TUD-PEL-021",
            brand: "Tudor",
            status: "Pending Payment",
            seller: "Dive Specialists",
            notes: "Titanium case, 500m diving",
            price: 3800,
        },
        {
            id: "ITEM-022",
            image: "/lovable-uploads/a8c00d5a-b861-49cb-a3f7-d2cb8ef864de.png",
            name: "Rolex Explorer II",
            sku: "RLX-EXP-022",
            brand: "Rolex",
            status: "Pending Payment",
            seller: "Adventure Watches",
            notes: "GMT function, orange hand",
            price: 11000,
        },
        {
            id: "ITEM-023",
            image: "/lovable-uploads/514150da-8678-460a-bcbc-ee548d8d6098.png",
            name: "Omega Seamaster Planet Ocean",
            sku: "OMG-PO-023",
            brand: "Omega",
            status: "Pending Payment",
            seller: "Ocean Time",
            notes: "Co-axial movement, orange bezel",
            price: 5200,
        },
        {
            id: "ITEM-024",
            image: "/lovable-uploads/52231a31-d92b-4dc7-ab75-1e37c3104e6c.png",
            name: "Patek Philippe Aquanaut",
            sku: "PP-AQU-024",
            brand: "Patek Philippe",
            status: "Pending Payment",
            seller: "Elite Timepieces",
            notes: "Rubber strap, travel time",
            price: 42000,
        },
        {
            id: "ITEM-025",
            image: "/lovable-uploads/c3abfafa-8986-4b30-bd89-3d163701cb64.png",
            name: "Audemars Piguet Code 11.59",
            sku: "AP-C59-025",
            brand: "Audemars Piguet",
            status: "Pending Payment",
            seller: "Modern Luxury",
            notes: "Contemporary design, automatic",
            price: 28000,
        },
        {
            id: "ITEM-026",
            image: "/lovable-uploads/7130fbd8-0c96-4588-a7a8-c2ba32b3a07f.png",
            name: "Cartier Ballon Bleu",
            sku: "CAR-BB-026",
            brand: "Cartier",
            status: "Pending Payment",
            seller: "Parisian Style",
            notes: "Blue hands, crown guard",
            price: 3500,
        },
        {
            id: "ITEM-027",
            image: "/lovable-uploads/1f4e1ffe-7868-4e62-bbbe-9b6aba3835d7.png",
            name: "TAG Heuer Carrera",
            sku: "TAG-CAR-027",
            brand: "TAG Heuer",
            status: "Pending Payment",
            seller: "Racing Heritage",
            notes: "Chronograph, tachymeter",
            price: 2800,
        },
        {
            id: "ITEM-028",
            image: "/lovable-uploads/42d61632-8522-4f3e-9f7f-712379b47422.png",
            name: "Breitling Chronomat",
            sku: "BRE-CHR-028",
            brand: "Breitling",
            status: "Pending Payment",
            seller: "Pilot Watches",
            notes: "GMT function, rotating bezel",
            price: 6500,
        },
        {
            id: "ITEM-029",
            image: "/lovable-uploads/27ec6583-00c5-4c9f-bf57-429e50240830.png",
            name: "IWC Aquatimer",
            sku: "IWC-AQU-029",
            brand: "IWC",
            status: "Pending Payment",
            seller: "Water Sports",
            notes: "Internal rotating bezel, 300m",
            price: 4800,
        },
        {
            id: "ITEM-030",
            image: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
            name: "Panerai Luminor Due",
            sku: "PAN-DUE-030",
            brand: "Panerai",
            status: "Pending Payment",
            seller: "Slim Italian",
            notes: "Thinner case, elegant design",
            price: 5800,
        },
        {
            id: "ITEM-031",
            image: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
            name: "Jaeger-LeCoultre Polaris",
            sku: "JLC-POL-031",
            brand: "Jaeger-LeCoultre",
            status: "Pending Payment",
            seller: "Arctic Time",
            notes: "GMT complication, blue dial",
            price: 7800,
        },
        {
            id: "ITEM-032",
            image: "/lovable-uploads/c5705a12-d674-4b2c-93d3-566cbb3757fa.png",
            name: "Tudor GMT",
            sku: "TUD-GMT-032",
            brand: "Tudor",
            status: "Pending Payment",
            seller: "Travel Time",
            notes: "Pepsi bezel, GMT hand",
            price: 3200,
        },
        {
            id: "ITEM-033",
            image: "/lovable-uploads/a8c00d5a-b861-49cb-a3f7-d2cb8ef864de.png",
            name: "Rolex Sea-Dweller",
            sku: "RLX-SD-033",
            brand: "Rolex",
            status: "Pending Payment",
            seller: "Deep Sea",
            notes: "Helium escape valve, 1220m",
            price: 13500,
        },
    ];

    // Filter for unpaid watches only
    const unpaidWatches = allWatches.filter((watch) => watch.status === "Pending Payment");

    const existingWatchIds = existingWatches.map((w) => w.id);
    const availableWatches = unpaidWatches.filter((watch) => !existingWatchIds.includes(watch.id));

    const filteredWatches = availableWatches.filter((watch) => watch.name.toLowerCase().includes(searchTerm.toLowerCase()) || watch.brand.toLowerCase().includes(searchTerm.toLowerCase()) || watch.seller.toLowerCase().includes(searchTerm.toLowerCase()) || (watch.sku && watch.sku.toLowerCase().includes(searchTerm.toLowerCase())));

    // Sort watches
    const sortedWatches = [...filteredWatches].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        let comparison = 0;
        if (typeof aValue === "string" && typeof bValue === "string") {
            comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === "number" && typeof bValue === "number") {
            comparison = aValue - bValue;
        } else {
            comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortDirection === "asc" ? comparison : -comparison;
    });

    const handleSort = (field: keyof Watch) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const getSortIcon = (field: keyof Watch) => {
        if (sortField !== field) {
            return null;
        }
        return sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
    };

    const handleWatchSelect = (watchId: string, checked: boolean) => {
        if (checked) {
            setSelectedWatches((prev) => [...prev, watchId]);
        } else {
            setSelectedWatches((prev) => prev.filter((id) => id !== watchId));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedWatches(sortedWatches.map((watch) => watch.id));
        } else {
            setSelectedWatches([]);
        }
    };

    const handleRowClick = (watchId: string) => {
        const isCurrentlySelected = selectedWatches.includes(watchId);
        handleWatchSelect(watchId, !isCurrentlySelected);
    };

    const handleAddSelected = () => {
        const watchesToAdd = unpaidWatches.filter((watch) => selectedWatches.includes(watch.id));
        onAddWatches(watchesToAdd);
        setSelectedWatches([]);
        onOpenChange(false);
    };

    // Convert EUR to VND (approximate rate: 1 EUR = 26,500 VND)
    const convertToVND = (euroPrice: number) => {
        return euroPrice * 26500;
    };

    const isAllSelected = sortedWatches.length > 0 && selectedWatches.length === sortedWatches.length;
    const isIndeterminate = selectedWatches.length > 0 && selectedWatches.length < sortedWatches.length;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[80vh] max-w-6xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Watches to Payment</DialogTitle>
                    <DialogDescription>Select watches with unpaid payment status to add to this payment</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search watches..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
                        </div>
                        <Button onClick={handleAddSelected} disabled={selectedWatches.length === 0}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Selected ({selectedWatches.length})
                        </Button>
                    </div>

                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox checked={isAllSelected} indeterminate={isIndeterminate} onCheckedChange={handleSelectAll} />
                                    </TableHead>
                                    <TableHead className="w-16">Image</TableHead>
                                    <TableHead className="cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort("name")}>
                                        <div className="flex items-center">
                                            Name
                                            {getSortIcon("name")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort("sku")}>
                                        <div className="flex items-center">
                                            SKU
                                            {getSortIcon("sku")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort("brand")}>
                                        <div className="flex items-center">
                                            Brand
                                            {getSortIcon("brand")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer select-none hover:bg-muted/50" onClick={() => handleSort("seller")}>
                                        <div className="flex items-center">
                                            Seller
                                            {getSortIcon("seller")}
                                        </div>
                                    </TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead className="cursor-pointer select-none text-right hover:bg-muted/50" onClick={() => handleSort("price")}>
                                        <div className="flex items-center justify-end">
                                            Price
                                            {getSortIcon("price")}
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedWatches.map((watch) => (
                                    <TableRow key={watch.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleRowClick(watch.id)}>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Checkbox checked={selectedWatches.includes(watch.id)} onCheckedChange={(checked) => handleWatchSelect(watch.id, checked as boolean)} />
                                        </TableCell>
                                        <TableCell>
                                            <img src={watch.image} alt={watch.name} className="aspect-square h-12 w-12 rounded-md object-cover" />
                                        </TableCell>
                                        <TableCell className="font-medium">{watch.name}</TableCell>
                                        <TableCell>{watch.sku || "-"}</TableCell>
                                        <TableCell>{watch.brand}</TableCell>
                                        <TableCell>{watch.seller}</TableCell>
                                        <TableCell className="max-w-xs truncate" title={watch.notes}>
                                            {watch.notes}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div>
                                                <div>€{watch.price.toLocaleString()}</div>
                                                <div className="text-xs text-muted-foreground">₫{convertToVND(watch.price).toLocaleString()}</div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {sortedWatches.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                                            No unpaid watches available to add
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddWatchToPaymentDialog;
