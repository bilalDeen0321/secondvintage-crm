import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Head } from "@inertiajs/react";
import { ChevronDown, ChevronUp, Edit, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import CurrencyDisplay from "../components/CurrencyDisplay";
import ImageManager from "../components/ImageManager";
import Layout from "../components/Layout";
import { WatchImage } from "../types/Watch";

interface SellerWatch {
    id: string;
    name: string;
    brand: string;
    serialNumber: string;
    referenceNumber: string;
    caseSize: string;
    price: number;
    currency: string;
    notes: string;
    images: WatchImage[];
    status: "Unpaid" | "Paid";
    createdAt: Date;
    agent: string;
    seller: string;
}

type SortField = "name" | "brand" | "agent" | "seller" | "price" | "status";
type SortDirection = "asc" | "desc";

// Sample watches data
const sampleWatches: SellerWatch[] = [
    {
        id: "1",
        name: "Submariner Date",
        brand: "Rolex",
        serialNumber: "S12345678",
        referenceNumber: "116610LN",
        caseSize: "40mm",
        price: 8500,
        currency: "EUR",
        notes: "Excellent condition, box and papers included",
        images: [
            {
                id: "1",
                url: "/lovable-uploads/6902d75d-7bb8-43ee-93eb-56d642c25393.png",
                useForAI: false,
            },
        ],
        status: "Unpaid",
        createdAt: new Date("2024-01-15"),
        agent: "John Smith",
        seller: "Michael Johnson",
    },
    {
        id: "2",
        name: "Speedmaster Professional",
        brand: "Omega",
        serialNumber: "O87654321",
        referenceNumber: "311.30.42.30.01.005",
        caseSize: "42mm",
        price: 3200,
        currency: "EUR",
        notes: "Manual wind, hesalite crystal",
        images: [
            {
                id: "2",
                url: "/lovable-uploads/a8c00d5a-b861-49cb-a3f7-d2cb8ef864de.png",
                useForAI: false,
            },
        ],
        status: "Paid",
        createdAt: new Date("2024-01-18"),
        agent: "Sarah Davis",
        seller: "Robert Wilson",
    },
    {
        id: "3",
        name: "Royal Oak",
        brand: "Audemars Piguet",
        serialNumber: "AP123456",
        referenceNumber: "15400ST.OO.1220ST.03",
        caseSize: "41mm",
        price: 24000,
        currency: "EUR",
        notes: "Steel bracelet, blue dial",
        images: [
            {
                id: "3",
                url: "/lovable-uploads/0464203d-f5d6-4f95-8d96-7ac6a8a62fba.png",
                useForAI: false,
            },
        ],
        status: "Unpaid",
        createdAt: new Date("2024-01-20"),
        agent: "David Brown",
        seller: "Emma Taylor",
    },
    {
        id: "4",
        name: "Nautilus",
        brand: "Patek Philippe",
        serialNumber: "PP987654",
        referenceNumber: "5711/1A-010",
        caseSize: "40mm",
        price: 85000,
        currency: "EUR",
        notes: "Full set, warranty card included",
        images: [
            {
                id: "4",
                url: "/lovable-uploads/602bc27c-db31-4f3f-8174-9217172c4867.png",
                useForAI: false,
            },
        ],
        status: "Paid",
        createdAt: new Date("2024-01-22"),
        agent: "Lisa Anderson",
        seller: "James Miller",
    },
    {
        id: "5",
        name: "GMT-Master II",
        brand: "Rolex",
        serialNumber: "R456789",
        referenceNumber: "126710BLRO",
        caseSize: "40mm",
        price: 18500,
        currency: "EUR",
        notes: "Pepsi bezel, Oystersteel",
        images: [
            {
                id: "5",
                url: "/lovable-uploads/1f4e1ffe-7868-4e62-bbbe-9b6aba3835d7.png",
                useForAI: false,
            },
        ],
        status: "Unpaid",
        createdAt: new Date("2024-01-25"),
        agent: "Mark Thompson",
        seller: "Sophie Clark",
    },
    {
        id: "6",
        name: "Tank Must",
        brand: "Cartier",
        serialNumber: "C789123",
        referenceNumber: "WSTA0041",
        caseSize: "33.7mm",
        price: 2800,
        currency: "EUR",
        notes: "Large model, steel case",
        images: [],
        status: "Paid",
        createdAt: new Date("2024-01-28"),
        agent: "Anna White",
        seller: "Thomas Lee",
    },
    {
        id: "7",
        name: "Seamaster Planet Ocean",
        brand: "Omega",
        serialNumber: "O321654",
        referenceNumber: "215.30.44.21.01.001",
        caseSize: "43.5mm",
        price: 4200,
        currency: "EUR",
        notes: "Co-Axial Master Chronometer",
        images: [],
        status: "Unpaid",
        createdAt: new Date("2024-02-01"),
        agent: "Chris Martin",
        seller: "Jennifer Garcia",
    },
    {
        id: "8",
        name: "Big Bang",
        brand: "Hublot",
        serialNumber: "H654987",
        referenceNumber: "301.SB.131.RX",
        caseSize: "44mm",
        price: 8900,
        currency: "EUR",
        notes: "Black Magic, ceramic case",
        images: [],
        status: "Paid",
        createdAt: new Date("2024-02-03"),
        agent: "Rachel Green",
        seller: "Kevin Rodriguez",
    },
    {
        id: "9",
        name: "Daytona",
        brand: "Rolex",
        serialNumber: "R789456",
        referenceNumber: "116500LN",
        caseSize: "40mm",
        price: 28500,
        currency: "EUR",
        notes: "White dial, ceramic bezel",
        images: [],
        status: "Unpaid",
        createdAt: new Date("2024-02-05"),
        agent: "Peter Parker",
        seller: "Maria Martinez",
    },
    {
        id: "10",
        name: "Aquanaut",
        brand: "Patek Philippe",
        serialNumber: "PP147258",
        referenceNumber: "5167A-001",
        caseSize: "40mm",
        price: 32000,
        currency: "EUR",
        notes: "Steel case, black embossed dial",
        images: [],
        status: "Paid",
        createdAt: new Date("2024-02-08"),
        agent: "Tony Stark",
        seller: "Linda Jackson",
    },
    {
        id: "11",
        name: "Oyster Perpetual",
        brand: "Rolex",
        serialNumber: "R258147",
        referenceNumber: "124300",
        caseSize: "41mm",
        price: 6200,
        currency: "EUR",
        notes: "Turquoise blue dial",
        images: [],
        status: "Unpaid",
        createdAt: new Date("2024-02-10"),
        agent: "Bruce Wayne",
        seller: "Nancy Lewis",
    },
    {
        id: "12",
        name: "Constellation",
        brand: "Omega",
        serialNumber: "O963852",
        referenceNumber: "131.20.39.20.02.001",
        caseSize: "39mm",
        price: 2900,
        currency: "EUR",
        notes: "Co-Axial Master Chronometer",
        images: [],
        status: "Paid",
        createdAt: new Date("2024-02-12"),
        agent: "Clark Kent",
        seller: "Betty Walker",
    },
    {
        id: "13",
        name: "Santos",
        brand: "Cartier",
        serialNumber: "C741852",
        referenceNumber: "WSSA0009",
        caseSize: "35mm",
        price: 5800,
        currency: "EUR",
        notes: "Medium model, steel and gold",
        images: [],
        status: "Unpaid",
        createdAt: new Date("2024-02-15"),
        agent: "Diana Prince",
        seller: "Steven Hall",
    },
    {
        id: "14",
        name: "Classic Fusion",
        brand: "Hublot",
        serialNumber: "H852963",
        referenceNumber: "511.NX.1171.LR",
        caseSize: "42mm",
        price: 7200,
        currency: "EUR",
        notes: "Titanium case, skeleton dial",
        images: [],
        status: "Paid",
        createdAt: new Date("2024-02-18"),
        agent: "Barry Allen",
        seller: "Carol Young",
    },
    {
        id: "15",
        name: "Submariner No Date",
        brand: "Rolex",
        serialNumber: "R369258",
        referenceNumber: "114060",
        caseSize: "40mm",
        price: 7800,
        currency: "EUR",
        notes: "No date model, ceramic bezel",
        images: [],
        status: "Unpaid",
        createdAt: new Date("2024-02-20"),
        agent: "Hal Jordan",
        seller: "Patricia King",
    },
    {
        id: "16",
        name: "De Ville Prestige",
        brand: "Omega",
        serialNumber: "O741963",
        referenceNumber: "424.13.40.20.02.001",
        caseSize: "39.5mm",
        price: 2200,
        currency: "EUR",
        notes: "Silver dial, leather strap",
        images: [],
        status: "Paid",
        createdAt: new Date("2024-02-22"),
        agent: "Arthur Curry",
        seller: "Michelle Wright",
    },
    {
        id: "17",
        name: "Ballon Bleu",
        brand: "Cartier",
        serialNumber: "C852741",
        referenceNumber: "W69012Z4",
        caseSize: "42mm",
        price: 4200,
        currency: "EUR",
        notes: "Large model, steel case",
        images: [],
        status: "Unpaid",
        createdAt: new Date("2024-02-25"),
        agent: "Victor Stone",
        seller: "Dorothy Lopez",
    },
    {
        id: "18",
        name: "Spirit of Big Bang",
        brand: "Hublot",
        serialNumber: "H963741",
        referenceNumber: "601.NX.0173.LR",
        caseSize: "42mm",
        price: 12500,
        currency: "EUR",
        notes: "Titanium case, skeleton movement",
        images: [],
        status: "Paid",
        createdAt: new Date("2024-02-28"),
        agent: "Oliver Queen",
        seller: "Sandra Hill",
    },
    {
        id: "19",
        name: "Explorer II",
        brand: "Rolex",
        serialNumber: "R741369",
        referenceNumber: "216570",
        caseSize: "42mm",
        price: 9200,
        currency: "EUR",
        notes: "White dial, orange 24-hour hand",
        images: [],
        status: "Unpaid",
        createdAt: new Date("2024-03-02"),
        agent: "John Constantine",
        seller: "Donna Scott",
    },
    {
        id: "20",
        name: "Railmaster",
        brand: "Omega",
        serialNumber: "O159753",
        referenceNumber: "220.10.40.20.01.001",
        caseSize: "40mm",
        price: 3800,
        currency: "EUR",
        notes: "Master Chronometer, anti-magnetic",
        images: [],
        status: "Paid",
        createdAt: new Date("2024-03-05"),
        agent: "Zatanna Zatara",
        seller: "Helen Green",
    },
];

// Agent options for dropdown
const agentOptions = [
    "John Smith",
    "Sarah Davis",
    "David Brown",
    "Lisa Anderson",
    "Mark Thompson",
    "Anna White",
    "Chris Martin",
    "Rachel Green",
    "Peter Parker",
    "Tony Stark",
    "Bruce Wayne",
    "Clark Kent",
    "Diana Prince",
    "Barry Allen",
    "Hal Jordan",
    "Arthur Curry",
    "Victor Stone",
    "Oliver Queen",
    "John Constantine",
    "Zatanna Zatara",
];

// Seller options for dropdown
const sellerOptions = [
    "Michael Johnson",
    "Robert Wilson",
    "Emma Taylor",
    "James Miller",
    "Sophie Clark",
    "Thomas Lee",
    "Jennifer Garcia",
    "Kevin Rodriguez",
    "Maria Martinez",
    "Linda Jackson",
    "Nancy Lewis",
    "Betty Walker",
    "Steven Hall",
    "Carol Young",
    "Patricia King",
    "Michelle Wright",
    "Dorothy Lopez",
    "Sandra Hill",
    "Donna Scott",
    "Helen Green",
];

const Sellers = () => {
    const [watches, setWatches] = useState<SellerWatch[]>(sampleWatches);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedWatch, setSelectedWatch] = useState<SellerWatch | null>(
        null,
    );
    const [sortField, setSortField] = useState<SortField>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const [statusFilter, setStatusFilter] = useState<"All" | "Unpaid" | "Paid">(
        "All",
    );
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        serialNumber: "",
        referenceNumber: "",
        caseSize: "",
        price: "",
        currency: "EUR",
        notes: "",
        agent: "",
        seller: "",
    });
    const [formImages, setFormImages] = useState<WatchImage[]>([]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const filteredAndSortedWatches = [...watches]
        .filter((watch) => {
            if (statusFilter === "All") return true;
            return watch.status === statusFilter;
        })
        .sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (sortField) {
                case "name":
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case "brand":
                    aValue = a.brand.toLowerCase();
                    bValue = b.brand.toLowerCase();
                    break;
                case "agent":
                    aValue = a.agent.toLowerCase();
                    bValue = b.agent.toLowerCase();
                    break;
                case "seller":
                    aValue = a.seller.toLowerCase();
                    bValue = b.seller.toLowerCase();
                    break;
                case "price":
                    aValue = a.price;
                    bValue = b.price;
                    break;
                case "status":
                    aValue = a.status.toLowerCase();
                    bValue = b.status.toLowerCase();
                    break;
                default:
                    return 0;
            }

            if (sortDirection === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? (
            <ChevronUp className="ml-1 inline h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 inline h-4 w-4" />
        );
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditWatch = (watch: SellerWatch) => {
        setSelectedWatch(watch);
        setFormData({
            name: watch.name,
            brand: watch.brand,
            serialNumber: watch.serialNumber,
            referenceNumber: watch.referenceNumber,
            caseSize: watch.caseSize,
            price: watch.price.toString(),
            currency: watch.currency,
            notes: watch.notes,
            agent: watch.agent,
            seller: watch.seller,
        });
        setFormImages(watch.images);
        setIsEditDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newWatch: SellerWatch = {
            id: Date.now().toString(),
            name: formData.name,
            brand: formData.brand,
            serialNumber: formData.serialNumber,
            referenceNumber: formData.referenceNumber,
            caseSize: formData.caseSize,
            price: parseFloat(formData.price) || 0,
            currency: formData.currency,
            notes: formData.notes,
            agent: formData.agent,
            seller: formData.seller,
            images: formImages,
            status: "Unpaid",
            createdAt: new Date(),
        };

        setWatches((prev) => [newWatch, ...prev]);

        // Reset form
        setFormData({
            name: "",
            brand: "",
            serialNumber: "",
            referenceNumber: "",
            caseSize: "",
            price: "",
            currency: "EUR",
            notes: "",
            agent: "",
            seller: "",
        });
        setFormImages([]);
        setIsDialogOpen(false);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedWatch) return;

        const updatedWatch: SellerWatch = {
            ...selectedWatch,
            name: formData.name,
            brand: formData.brand,
            serialNumber: formData.serialNumber,
            referenceNumber: formData.referenceNumber,
            caseSize: formData.caseSize,
            price: parseFloat(formData.price) || 0,
            currency: formData.currency,
            notes: formData.notes,
            agent: formData.agent,
            seller: formData.seller,
            images: formImages,
        };

        setWatches((prev) =>
            prev.map((watch) =>
                watch.id === selectedWatch.id ? updatedWatch : watch,
            ),
        );

        // Reset form
        setFormData({
            name: "",
            brand: "",
            serialNumber: "",
            referenceNumber: "",
            caseSize: "",
            price: "",
            currency: "EUR",
            notes: "",
            agent: "",
            seller: "",
        });
        setFormImages([]);
        setSelectedWatch(null);
        setIsEditDialogOpen(false);
    };

    const totalOutstanding = watches
        .filter((watch) => watch.status !== "Paid")
        .reduce((sum, watch) => sum + watch.price, 0);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Unpaid":
                return "bg-yellow-100 text-yellow-800";
            case "Paid":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Layout>
            <Head title="SV - Seller Watches" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Seller Watches
                        </h1>
                        <p className="mt-1 text-slate-600">
                            Register and manage watch entries
                        </p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Watch
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Register New Watch</DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="agent">Agent</Label>
                                        <Select
                                            value={formData.agent}
                                            onValueChange={(value) =>
                                                handleInputChange(
                                                    "agent",
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select agent" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {agentOptions.map((agent) => (
                                                    <SelectItem
                                                        key={agent}
                                                        value={agent}
                                                    >
                                                        {agent}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="seller">Seller</Label>
                                        <Select
                                            value={formData.seller}
                                            onValueChange={(value) =>
                                                handleInputChange(
                                                    "seller",
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select seller" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sellerOptions.map((seller) => (
                                                    <SelectItem
                                                        key={seller}
                                                        value={seller}
                                                    >
                                                        {seller}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Name *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "name",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="brand">Brand *</Label>
                                        <Input
                                            id="brand"
                                            value={formData.brand}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "brand",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="serialNumber">
                                            Serial Number
                                        </Label>
                                        <Input
                                            id="serialNumber"
                                            value={formData.serialNumber}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "serialNumber",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="referenceNumber">
                                            Reference Number
                                        </Label>
                                        <Input
                                            id="referenceNumber"
                                            value={formData.referenceNumber}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "referenceNumber",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="caseSize">
                                            Case Size
                                        </Label>
                                        <Input
                                            id="caseSize"
                                            value={formData.caseSize}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "caseSize",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g., 40mm"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="price">Price *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "price",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="currency">
                                            Currency
                                        </Label>
                                        <select
                                            id="currency"
                                            value={formData.currency}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "currency",
                                                    e.target.value,
                                                )
                                            }
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="EUR">EUR</option>
                                            <option value="USD">USD</option>
                                            <option value="GBP">GBP</option>
                                            <option value="CHF">CHF</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "notes",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Purchase remarks or comments..."
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label>Images</Label>
                                    <div className="mt-2">
                                        <ImageManager
                                            images={formImages}
                                            onChange={setFormImages}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Register Watch
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Watch Dialog */}
                    <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                    >
                        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Edit Watch</DialogTitle>
                            </DialogHeader>

                            <form
                                onSubmit={handleEditSubmit}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="edit-agent">
                                            Agent
                                        </Label>
                                        <Select
                                            value={formData.agent}
                                            onValueChange={(value) =>
                                                handleInputChange(
                                                    "agent",
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select agent" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {agentOptions.map((agent) => (
                                                    <SelectItem
                                                        key={agent}
                                                        value={agent}
                                                    >
                                                        {agent}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-seller">
                                            Seller
                                        </Label>
                                        <Select
                                            value={formData.seller}
                                            onValueChange={(value) =>
                                                handleInputChange(
                                                    "seller",
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select seller" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sellerOptions.map((seller) => (
                                                    <SelectItem
                                                        key={seller}
                                                        value={seller}
                                                    >
                                                        {seller}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="edit-name">
                                            Name *
                                        </Label>
                                        <Input
                                            id="edit-name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "name",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-brand">
                                            Brand *
                                        </Label>
                                        <Input
                                            id="edit-brand"
                                            value={formData.brand}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "brand",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="edit-serialNumber">
                                            Serial Number
                                        </Label>
                                        <Input
                                            id="edit-serialNumber"
                                            value={formData.serialNumber}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "serialNumber",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-referenceNumber">
                                            Reference Number
                                        </Label>
                                        <Input
                                            id="edit-referenceNumber"
                                            value={formData.referenceNumber}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "referenceNumber",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="edit-caseSize">
                                            Case Size
                                        </Label>
                                        <Input
                                            id="edit-caseSize"
                                            value={formData.caseSize}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "caseSize",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g., 40mm"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-price">
                                            Price *
                                        </Label>
                                        <Input
                                            id="edit-price"
                                            type="number"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "price",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-currency">
                                            Currency
                                        </Label>
                                        <select
                                            id="edit-currency"
                                            value={formData.currency}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "currency",
                                                    e.target.value,
                                                )
                                            }
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="EUR">EUR</option>
                                            <option value="USD">USD</option>
                                            <option value="GBP">GBP</option>
                                            <option value="CHF">CHF</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="edit-notes">Notes</Label>
                                    <Textarea
                                        id="edit-notes"
                                        value={formData.notes}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "notes",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Purchase remarks or comments..."
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label>Images</Label>
                                    <div className="mt-2">
                                        <ImageManager
                                            images={formImages}
                                            onChange={setFormImages}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setIsEditDialogOpen(false)
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">Update Watch</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Summary Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-slate-900">
                                    {watches.length}
                                </div>
                                <div className="text-sm text-slate-600">
                                    Total Watches
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {
                                        watches.filter(
                                            (w) => w.status === "Unpaid",
                                        ).length
                                    }
                                </div>
                                <div className="text-sm text-slate-600">
                                    Unpaid
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {
                                        watches.filter(
                                            (w) => w.status === "Paid",
                                        ).length
                                    }
                                </div>
                                <div className="text-sm text-slate-600">
                                    Paid
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    <CurrencyDisplay
                                        euroAmount={totalOutstanding}
                                    />
                                </div>
                                <div className="text-sm text-slate-600">
                                    Outstanding Amount
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Filter */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700">
                                Filter by Status:
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant={
                                        statusFilter === "All"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setStatusFilter("All")}
                                >
                                    All ({watches.length})
                                </Button>
                                <Button
                                    variant={
                                        statusFilter === "Unpaid"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setStatusFilter("Unpaid")}
                                    className={
                                        statusFilter === "Unpaid"
                                            ? "bg-yellow-600 hover:bg-yellow-700"
                                            : "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                                    }
                                >
                                    Unpaid (
                                    {
                                        watches.filter(
                                            (w) => w.status === "Unpaid",
                                        ).length
                                    }
                                    )
                                </Button>
                                <Button
                                    variant={
                                        statusFilter === "Paid"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setStatusFilter("Paid")}
                                    className={
                                        statusFilter === "Paid"
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "border-green-300 text-green-700 hover:bg-green-50"
                                    }
                                >
                                    Paid (
                                    {
                                        watches.filter(
                                            (w) => w.status === "Paid",
                                        ).length
                                    }
                                    )
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Watches Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Watches
                            {statusFilter !== "All" && (
                                <span className="ml-2 text-base font-normal text-slate-600">
                                    - Showing {statusFilter} (
                                    {filteredAndSortedWatches.length})
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-slate-50"
                                        onClick={() => handleSort("name")}
                                    >
                                        Name {getSortIcon("name")}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-slate-50"
                                        onClick={() => handleSort("brand")}
                                    >
                                        Brand {getSortIcon("brand")}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-slate-50"
                                        onClick={() => handleSort("agent")}
                                    >
                                        Agent {getSortIcon("agent")}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-slate-50"
                                        onClick={() => handleSort("seller")}
                                    >
                                        Seller {getSortIcon("seller")}
                                    </TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-slate-50"
                                        onClick={() => handleSort("price")}
                                    >
                                        Price {getSortIcon("price")}
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-slate-50"
                                        onClick={() => handleSort("status")}
                                    >
                                        Payment Status {getSortIcon("status")}
                                    </TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedWatches.map((watch) => (
                                    <TableRow key={watch.id}>
                                        <TableCell>
                                            <div
                                                className="h-16 w-16 cursor-pointer overflow-hidden rounded-lg bg-slate-100 transition-opacity hover:opacity-80"
                                                onClick={() =>
                                                    handleEditWatch(watch)
                                                }
                                            >
                                                {watch.images.length > 0 ? (
                                                    <img
                                                        src={
                                                            watch.images[0].url
                                                        }
                                                        alt={watch.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src="/lovable-uploads/e4da5380-362e-422c-a981-6370f96719da.png"
                                                        alt="Watch placeholder"
                                                        className="h-full w-full object-cover opacity-50"
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className="cursor-pointer font-medium transition-colors hover:text-blue-600"
                                                onClick={() =>
                                                    handleEditWatch(watch)
                                                }
                                            >
                                                {watch.name}
                                            </span>
                                        </TableCell>
                                        <TableCell>{watch.brand}</TableCell>
                                        <TableCell>{watch.agent}</TableCell>
                                        <TableCell>{watch.seller}</TableCell>
                                        <TableCell>
                                            <div className="max-w-32 truncate text-sm text-slate-600">
                                                {watch.notes || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {watch.currency === "EUR" ? (
                                                <CurrencyDisplay
                                                    euroAmount={watch.price}
                                                />
                                            ) : (
                                                <span className="font-medium">
                                                    {watch.currency}{" "}
                                                    {watch.price.toLocaleString()}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`${getStatusColor(watch.status)}`}
                                            >
                                                {watch.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleEditWatch(watch)
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Sellers;
