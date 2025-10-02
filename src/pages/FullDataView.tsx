import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Head } from "@inertiajs/react";
import { Database, Download } from "lucide-react";
import { useMemo, useState } from "react";
import BrandSelector from "../components/BrandSelector";
import FieldVisibilityDialog from "../components/FieldVisibilityDialog";
import Layout from "../components/Layout";
import LocationSelector from "../components/LocationSelector";
import { Watch } from "../types/Watch";

// Extended interface for full data view
interface ExtendedWatch extends Watch {
    dateAdded: string;
    dateListed?: string;
    dateSold?: string;
    salesPrice?: number;
    platform?: string;
    condition: string;
    movement: string;
    caseMaterial: string;
    caseSize: string;
    waterResistance: string;
    warranty: string;
    serialNumber: string;
    referenceNumber: string;
    yearOfManufacture: string;
    seller: string;
    purchaseInvoice: string;
    serviceHistory: string;
    retailPrice?: number;
    profit?: number;
    profitMargin?: number;
    batch?: string;
    agentHandler?: string;
    depositId?: string;
    // API related fields
    apiStatus?: string;
    apiLastSync?: string;
    apiPlatformId?: string;
    apiListingUrl?: string;
    apiErrors?: string;
    apiSyncFrequency?: string;
}

const FullDataView = () => {
    const [dataSet, setDataSet] = useState<string>("Watches");
    const [watches] = useState<ExtendedWatch[]>([
        {
            id: "1",
            name: "Rolex Submariner 116610LN",
            sku: "ROL-SUB-001",
            batch: "BATCH-2024-001",
            brand: "Rolex",
            acquisitionCost: 8500,
            agentHandler: "John Smith",
            depositId: "DEP-001-2024",
            batchGroup: "BATCH-2024-001",
            status: "Sold",
            location: "Denmark",
            description:
                "Excellent condition Rolex Submariner with box and papers.",
            aiInstructions:
                "Focus on the bezel condition and bracelet stretch when analyzing.",
            images: [
                {
                    id: "1",
                    url: "/lovable-uploads/e42df4f6-4752-4442-9e7c-06e8184162be.png",
                    useForAI: true,
                },
            ],
            dateAdded: "2024-01-15",
            dateListed: "2024-02-01",
            dateSold: "2024-02-15",
            salesPrice: 11200,
            platform: "Chrono24",
            condition: "Excellent",
            movement: "Automatic",
            caseMaterial: "Stainless Steel",
            caseSize: "40mm",
            waterResistance: "300m",
            warranty: "No warranty",
            serialNumber: "D562789",
            referenceNumber: "116610LN",
            yearOfManufacture: "2019",
            seller: "Private Collector",
            purchaseInvoice: "INV-2024-001",
            serviceHistory: "Last serviced 2023",
            retailPrice: 8100,
            profit: 2700,
            profitMargin: 31.76,
            apiStatus: "Synced",
            apiLastSync: "2024-02-15 14:30",
            apiPlatformId: "CHR24-001",
            apiListingUrl: "https://chrono24.com/listing/001",
            apiErrors: "",
            apiSyncFrequency: "Daily",
        },
        {
            id: "2",
            name: "Omega Speedmaster Professional",
            sku: "OME-SPE-002",
            batch: "BATCH-2024-002",
            brand: "Omega",
            acquisitionCost: 3200,
            agentHandler: "Sarah Johnson",
            depositId: "DEP-002-2024",
            batchGroup: "BATCH-2024-002",
            status: "Listed",
            location: "Vietnam",
            description: "Classic moonwatch with manual wind movement.",
            aiInstructions: "Check chronograph function and pusher condition.",
            images: [
                {
                    id: "2",
                    url: "/lovable-uploads/c9668ac2-5bda-49b2-9679-1759280598e1.png",
                    useForAI: false,
                },
            ],
            dateAdded: "2024-02-10",
            dateListed: "2024-02-20",
            platform: "eBay",
            condition: "Very Good",
            movement: "Manual",
            caseMaterial: "Stainless Steel",
            caseSize: "42mm",
            waterResistance: "50m",
            warranty: "2 years",
            serialNumber: "SP981234",
            referenceNumber: "311.30.42.30.01.005",
            yearOfManufacture: "2021",
            seller: "Authorized Dealer",
            purchaseInvoice: "INV-2024-002",
            serviceHistory: "Never serviced",
            retailPrice: 6400,
            apiStatus: "Active",
            apiLastSync: "2024-02-20 09:15",
            apiPlatformId: "EBAY-002",
            apiListingUrl: "https://ebay.com/listing/002",
            apiErrors: "",
            apiSyncFrequency: "Hourly",
        },
        {
            id: "3",
            name: "TAG Heuer Monaco",
            sku: "TAG-MON-003",
            batch: "BATCH-2024-003",
            brand: "TAG Heuer",
            acquisitionCost: 2800,
            agentHandler: "Mike Chen",
            depositId: "DEP-003-2024",
            batchGroup: "BATCH-2024-003",
            status: "Ready for listing",
            location: "Japan",
            description: "Iconic square case chronograph.",
            aiInstructions: "Analyze case condition and crown operation.",
            images: [
                {
                    id: "3",
                    url: "/lovable-uploads/8a246750-c18b-4b1c-b6af-25185e84d3d7.png",
                    useForAI: true,
                },
            ],
            dateAdded: "2024-03-01",
            condition: "Good",
            movement: "Automatic",
            caseMaterial: "Stainless Steel",
            caseSize: "39mm",
            waterResistance: "100m",
            warranty: "1 year",
            serialNumber: "TH567890",
            referenceNumber: "CAW2111",
            yearOfManufacture: "2020",
            seller: "Watch Dealer",
            purchaseInvoice: "INV-2024-003",
            serviceHistory: "Serviced 2023",
            retailPrice: 4200,
            apiStatus: "Pending",
            apiLastSync: "2024-03-01 16:45",
            apiPlatformId: "",
            apiListingUrl: "",
            apiErrors: "Connection timeout",
            apiSyncFrequency: "Manual",
        },
        {
            id: "4",
            name: "Breitling Navitimer",
            sku: "BRE-NAV-004",
            batch: "BATCH-2024-004",
            brand: "Breitling",
            acquisitionCost: 4200,
            agentHandler: "Lisa Brown",
            depositId: "DEP-004-2024",
            batchGroup: "BATCH-2024-004",
            status: "Reserved",
            location: "In Transit",
            description: "Aviation chronograph with slide rule bezel.",
            images: [
                {
                    id: "4",
                    url: "/lovable-uploads/5557d546-574f-45fb-bd5a-014ec53e5792.png",
                    useForAI: true,
                },
            ],
            dateAdded: "2024-03-15",
            dateListed: "2024-03-25",
            platform: "Catawiki",
            condition: "Excellent",
            movement: "Automatic",
            caseMaterial: "Stainless Steel",
            caseSize: "46mm",
            waterResistance: "30m",
            warranty: "2 years",
            serialNumber: "BR123456",
            referenceNumber: "A23322",
            yearOfManufacture: "2022",
            seller: "Authorized Dealer",
            purchaseInvoice: "INV-2024-004",
            serviceHistory: "Under warranty",
            retailPrice: 5800,
            apiStatus: "Error",
            apiLastSync: "2024-03-25 11:20",
            apiPlatformId: "CAT-004",
            apiListingUrl: "https://catawiki.com/listing/004",
            apiErrors: "Invalid credentials",
            apiSyncFrequency: "Twice daily",
        },
    ]);

    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [brandFilter, setBrandFilter] = useState<string>("All");
    const [locationFilter, setLocationFilter] = useState<string>("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<string>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>(
        {
            id: true,
            name: true,
            sku: true,
            batch: true,
            brand: true,
            status: true,
            acquisitionCost: true,
            agentHandler: true,
            depositId: true,
            batchGroup: true,
            salesPrice: true,
            profit: true,
            dateAdded: true,
            dateListed: true,
            dateSold: true,
            platform: true,
            condition: true,
            movement: true,
            caseMaterial: true,
            caseSize: true,
            waterResistance: true,
            warranty: true,
            serialNumber: true,
            referenceNumber: true,
            yearOfManufacture: true,
            seller: true,
            location: true,
            apiStatus: true,
            apiLastSync: true,
            apiPlatformId: true,
            apiListingUrl: true,
            apiErrors: true,
            apiSyncFrequency: true,
            imageUrls: true,
            description: true,
            aiInstructions: true,
        },
    );

    // Get unique values for filter dropdowns
    const uniqueBrands = [
        "All",
        ...Array.from(new Set(watches.map((w) => w.brand))),
    ];
    const uniqueLocations = [
        "All",
        ...Array.from(new Set(watches.map((w) => w.location))),
    ];

    const statusCounts = {
        All: watches.length,
        Draft: watches.filter((w) => w.status === "Draft").length,
        Review: watches.filter((w) => w.status === "Review").length,
        "Platform Review": watches.filter((w) => w.status === "Platform Review")
            .length,
        "Ready for listing": watches.filter(
            (w) => w.status === "Ready for listing",
        ).length,
        Listed: watches.filter((w) => w.status === "Listed").length,
        Reserved: watches.filter((w) => w.status === "Reserved").length,
        Sold: watches.filter((w) => w.status === "Sold").length,
        "Defect/Problem": watches.filter((w) => w.status === "Defect/Problem")
            .length,
        Standby: watches.filter((w) => w.status === "Standby").length,
    };

    const filteredAndSortedWatches = useMemo(() => {
        const filtered = watches.filter((watch) => {
            const matchesStatus =
                statusFilter === "All" || watch.status === statusFilter;
            const matchesBrand =
                brandFilter === "All" || watch.brand === brandFilter;
            const matchesLocation =
                locationFilter === "All" || watch.location === locationFilter;
            const matchesSearch =
                searchTerm === "" ||
                Object.values(watch).some((value) =>
                    value
                        ?.toString()
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                );
            return (
                matchesStatus &&
                matchesBrand &&
                matchesLocation &&
                matchesSearch
            );
        });

        filtered.sort((a, b) => {
            const aValue = a[sortField as keyof ExtendedWatch];
            const bValue = b[sortField as keyof ExtendedWatch];

            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [
        watches,
        statusFilter,
        brandFilter,
        locationFilter,
        searchTerm,
        sortField,
        sortDirection,
    ]);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const exportToCSV = () => {
        const headers = [
            "ID",
            "Name",
            "SKU",
            "Batch",
            "Brand",
            "Status",
            "Location",
            "Acquisition Cost",
            "Agent Handler",
            "Deposit ID",
            "Batch Group",
            "Sales Price",
            "Profit",
            "Date Added",
            "Date Listed",
            "Date Sold",
            "Platform",
            "Condition",
            "Movement",
            "Case Material",
            "Case Size",
            "Water Resistance",
            "Warranty",
            "Serial Number",
            "Reference Number",
            "Year",
            "Seller",
            "Purchase Invoice",
            "Service History",
            "Description",
            "AI Instructions",
            "Image URLs",
            "API Status",
            "API Last Sync",
            "API Platform ID",
            "API Listing URL",
            "API Errors",
            "API Sync Frequency",
        ];

        const csvData = [
            headers.join(","),
            ...filteredAndSortedWatches.map((watch) =>
                [
                    watch.id,
                    `"${watch.name}"`,
                    watch.sku,
                    watch.batch || "",
                    watch.brand,
                    watch.status,
                    `"${watch.location}"`,
                    watch.acquisitionCost || "",
                    `"${watch.agentHandler || ""}"`,
                    watch.depositId || "",
                    `"${watch.batchGroup || ""}"`,
                    watch.salesPrice || "",
                    watch.profit || "",
                    watch.dateAdded,
                    watch.dateListed || "",
                    watch.dateSold || "",
                    watch.platform || "",
                    watch.condition,
                    watch.movement,
                    watch.caseMaterial,
                    watch.caseSize,
                    watch.waterResistance,
                    watch.warranty,
                    watch.serialNumber,
                    watch.referenceNumber,
                    watch.yearOfManufacture,
                    `"${watch.seller}"`,
                    watch.purchaseInvoice,
                    `"${watch.serviceHistory}"`,
                    `"${watch.description || ""}"`,
                    `"${watch.aiInstructions || ""}"`,
                    `"${watch.images.map((img) => img.url).join("; ")}"`,
                    watch.apiStatus || "",
                    watch.apiLastSync || "",
                    watch.apiPlatformId || "",
                    watch.apiListingUrl || "",
                    `"${watch.apiErrors || ""}"`,
                    watch.apiSyncFrequency || "",
                ].join(","),
            ),
        ].join("\n");

        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", "complete-watch-data.csv");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const getSortIcon = (field: string) => {
        if (sortField !== field) return "";
        return sortDirection === "asc" ? " ↑" : " ↓";
    };

    const handleEditBrands = () => {
        alert(
            "Brand editing feature would be implemented here. This would open a modal to add, edit, or remove brands from the list.",
        );
    };

    const handleEditLocations = () => {
        alert(
            "Location editing feature would be implemented here. This would open a modal to add, edit, or remove locations from the list.",
        );
    };

    const handleFieldToggle = (fieldKey: string, visible: boolean) => {
        setVisibleFields((prev) => ({
            ...prev,
            [fieldKey]: visible,
        }));
    };

    const renderPlaceholderContent = () => {
        return (
            <div className="py-12 text-center">
                <div className="mb-4 text-6xl">🚧</div>
                <h3 className="mb-2 text-xl font-medium text-slate-900">
                    Coming Soon
                </h3>
                <p className="text-slate-600">
                    {dataSet} data view is under development. Currently showing
                    Watches data.
                </p>
            </div>
        );
    };

    return (
        <Layout>
            <Head title="SV - Full Data View" />
            <div className="min-h-screen bg-slate-50">
                <div className="p-8">
                    <div className="mb-8">
                        <div className="mb-6 flex max-w-6xl items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">
                                    Full Data View
                                </h1>
                                <p className="mt-1 text-slate-600">
                                    Complete comprehensive view of all data
                                </p>
                            </div>
                            <div className="flex flex-shrink-0 gap-2">
                                <FieldVisibilityDialog
                                    visibleFields={visibleFields}
                                    onFieldToggle={handleFieldToggle}
                                />
                                <Button
                                    onClick={exportToCSV}
                                    className="flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Export Complete CSV
                                </Button>
                            </div>
                        </div>

                        {/* Data Set Selector */}
                        <div className="mb-6 max-w-xs">
                            <div className="flex items-center gap-3">
                                <Database className="h-5 w-5 text-slate-600" />
                                <Select
                                    value={dataSet}
                                    onValueChange={setDataSet}
                                >
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Select data set..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Watches">
                                            Watches
                                        </SelectItem>
                                        <SelectItem value="Batches">
                                            Batches
                                        </SelectItem>
                                        <SelectItem value="Wish List">
                                            Wish List
                                        </SelectItem>
                                        <SelectItem value="Agents">
                                            Agents
                                        </SelectItem>
                                        <SelectItem value="Sellers">
                                            Sellers
                                        </SelectItem>
                                        <SelectItem value="Payments">
                                            Payments
                                        </SelectItem>
                                        <SelectItem value="Deposits">
                                            Deposits
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {dataSet !== "Watches" ? (
                            renderPlaceholderContent()
                        ) : (
                            <>
                                {/* Stats Cards */}
                                <div className="mb-6 grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                                    {Object.entries(statusCounts).map(
                                        ([status, count]) => (
                                            <div
                                                key={status}
                                                onClick={() =>
                                                    setStatusFilter(status)
                                                }
                                                className={`cursor-pointer rounded-lg border p-4 transition-all ${
                                                    statusFilter === status
                                                        ? "border-amber-200 bg-amber-50"
                                                        : "border-slate-200 bg-white hover:border-slate-300"
                                                }`}
                                            >
                                                <div className="text-2xl font-bold text-slate-900">
                                                    {count}
                                                </div>
                                                <div className="text-sm text-slate-600">
                                                    {status}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>

                                {/* Search and Filters */}
                                <div className="mb-6 flex max-w-4xl flex-col gap-4 lg:flex-row">
                                    <div className="max-w-md flex-1">
                                        <Input
                                            type="text"
                                            placeholder="Search watches by name, brand, SKU, or any data..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex flex-shrink-0 gap-4">
                                        <BrandSelector
                                            value={brandFilter}
                                            onValueChange={setBrandFilter}
                                            brands={uniqueBrands}
                                            onEditBrands={handleEditBrands}
                                        />

                                        <LocationSelector
                                            value={locationFilter}
                                            onValueChange={setLocationFilter}
                                            locations={uniqueLocations}
                                            onEditLocations={
                                                handleEditLocations
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Results info */}
                                <div className="mb-4 flex max-w-4xl items-center justify-between">
                                    <div className="text-sm text-slate-600">
                                        Showing{" "}
                                        {filteredAndSortedWatches.length} of{" "}
                                        {watches.length} watches
                                    </div>
                                    <div className="flex flex-shrink-0 gap-4">
                                        <Select
                                            value={sortField}
                                            onValueChange={setSortField}
                                        >
                                            <SelectTrigger className="w-48">
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="name">
                                                    Name
                                                </SelectItem>
                                                <SelectItem value="brand">
                                                    Brand
                                                </SelectItem>
                                                <SelectItem value="status">
                                                    Status
                                                </SelectItem>
                                                <SelectItem value="dateAdded">
                                                    Date Added
                                                </SelectItem>
                                                <SelectItem value="dateListed">
                                                    Date Listed
                                                </SelectItem>
                                                <SelectItem value="dateSold">
                                                    Date Sold
                                                </SelectItem>
                                                <SelectItem value="acquisitionCost">
                                                    Acquisition Cost
                                                </SelectItem>
                                                <SelectItem value="agentHandler">
                                                    Agent Handler
                                                </SelectItem>
                                                <SelectItem value="depositId">
                                                    Deposit ID
                                                </SelectItem>
                                                <SelectItem value="batchGroup">
                                                    Batch Group
                                                </SelectItem>
                                                <SelectItem value="salesPrice">
                                                    Sales Price
                                                </SelectItem>
                                                <SelectItem value="profit">
                                                    Profit
                                                </SelectItem>
                                                <SelectItem value="platform">
                                                    Platform
                                                </SelectItem>
                                                <SelectItem value="apiStatus">
                                                    API Status
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setSortDirection(
                                                    sortDirection === "asc"
                                                        ? "desc"
                                                        : "asc",
                                                )
                                            }
                                        >
                                            {sortDirection === "asc"
                                                ? "↑"
                                                : "↓"}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {dataSet === "Watches" && (
                        <>
                            <div className="rounded-lg border bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <div style={{ minWidth: "2800px" }}>
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-slate-50">
                                                    {visibleFields.id && (
                                                        <TableHead
                                                            className="sticky left-0 z-10 min-w-12 cursor-pointer border-r bg-slate-50 p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort("id")
                                                            }
                                                        >
                                                            ID
                                                            {getSortIcon("id")}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.name && (
                                                        <TableHead
                                                            className="sticky left-12 z-10 min-w-40 cursor-pointer border-r bg-slate-50 p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "name",
                                                                )
                                                            }
                                                        >
                                                            Name
                                                            {getSortIcon(
                                                                "name",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.sku && (
                                                        <TableHead
                                                            className="min-w-24 cursor-pointer p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "sku",
                                                                )
                                                            }
                                                        >
                                                            SKU
                                                            {getSortIcon("sku")}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.batch && (
                                                        <TableHead
                                                            className="min-w-24 cursor-pointer p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "batch",
                                                                )
                                                            }
                                                        >
                                                            Batch
                                                            {getSortIcon(
                                                                "batch",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.brand && (
                                                        <TableHead
                                                            className="min-w-20 cursor-pointer p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "brand",
                                                                )
                                                            }
                                                        >
                                                            Brand
                                                            {getSortIcon(
                                                                "brand",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.status && (
                                                        <TableHead
                                                            className="min-w-20 cursor-pointer p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "status",
                                                                )
                                                            }
                                                        >
                                                            Status
                                                            {getSortIcon(
                                                                "status",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.acquisitionCost && (
                                                        <TableHead
                                                            className="min-w-28 cursor-pointer p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "acquisitionCost",
                                                                )
                                                            }
                                                        >
                                                            Acquisition Cost
                                                            {getSortIcon(
                                                                "acquisitionCost",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.agentHandler && (
                                                        <TableHead
                                                            className="min-w-24 cursor-pointer p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "agentHandler",
                                                                )
                                                            }
                                                        >
                                                            Agent Handler
                                                            {getSortIcon(
                                                                "agentHandler",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.depositId && (
                                                        <TableHead
                                                            className="min-w-24 cursor-pointer p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "depositId",
                                                                )
                                                            }
                                                        >
                                                            Deposit ID
                                                            {getSortIcon(
                                                                "depositId",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.batchGroup && (
                                                        <TableHead
                                                            className="min-w-24 cursor-pointer p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "batchGroup",
                                                                )
                                                            }
                                                        >
                                                            Batch Group
                                                            {getSortIcon(
                                                                "batchGroup",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.salesPrice && (
                                                        <TableHead
                                                            className="min-w-24 cursor-pointer p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "salesPrice",
                                                                )
                                                            }
                                                        >
                                                            Sales Price
                                                            {getSortIcon(
                                                                "salesPrice",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.profit && (
                                                        <TableHead
                                                            className="min-w-20 cursor-pointer p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "profit",
                                                                )
                                                            }
                                                        >
                                                            Profit
                                                            {getSortIcon(
                                                                "profit",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.dateAdded && (
                                                        <TableHead
                                                            className="min-w-24 cursor-pointer p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "dateAdded",
                                                                )
                                                            }
                                                        >
                                                            Date Added
                                                            {getSortIcon(
                                                                "dateAdded",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.dateListed && (
                                                        <TableHead
                                                            className="min-w-24 cursor-pointer p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "dateListed",
                                                                )
                                                            }
                                                        >
                                                            Date Listed
                                                            {getSortIcon(
                                                                "dateListed",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.dateSold && (
                                                        <TableHead
                                                            className="min-w-24 cursor-pointer p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "dateSold",
                                                                )
                                                            }
                                                        >
                                                            Date Sold
                                                            {getSortIcon(
                                                                "dateSold",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.platform && (
                                                        <TableHead
                                                            className="min-w-20 cursor-pointer p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "platform",
                                                                )
                                                            }
                                                        >
                                                            Platform
                                                            {getSortIcon(
                                                                "platform",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.condition && (
                                                        <TableHead className="min-w-20 p-2 text-xs font-semibold">
                                                            Condition
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.movement && (
                                                        <TableHead className="min-w-20 p-2 text-xs font-semibold">
                                                            Movement
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.caseMaterial && (
                                                        <TableHead className="min-w-24 p-2 text-xs font-semibold">
                                                            Case Material
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.caseSize && (
                                                        <TableHead className="min-w-20 p-2 text-xs font-semibold">
                                                            Case Size
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.waterResistance && (
                                                        <TableHead className="min-w-24 p-2 text-xs font-semibold">
                                                            Water Resistance
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.warranty && (
                                                        <TableHead className="min-w-20 p-2 text-xs font-semibold">
                                                            Warranty
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.serialNumber && (
                                                        <TableHead className="min-w-24 p-2 text-xs font-semibold">
                                                            Serial Number
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.referenceNumber && (
                                                        <TableHead className="min-w-20 p-2 text-xs font-semibold">
                                                            Reference
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.yearOfManufacture && (
                                                        <TableHead className="min-w-16 p-2 text-xs font-semibold">
                                                            Year
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.seller && (
                                                        <TableHead className="min-w-24 p-2 text-xs font-semibold">
                                                            Seller
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.location && (
                                                        <TableHead className="min-w-20 p-2 text-xs font-semibold">
                                                            Location
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.apiStatus && (
                                                        <TableHead
                                                            className="min-w-24 cursor-pointer bg-blue-50 p-2 text-xs font-semibold"
                                                            onClick={() =>
                                                                handleSort(
                                                                    "apiStatus",
                                                                )
                                                            }
                                                        >
                                                            API Status
                                                            {getSortIcon(
                                                                "apiStatus",
                                                            )}
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.apiLastSync && (
                                                        <TableHead className="min-w-32 bg-blue-50 p-2 text-xs font-semibold">
                                                            API Last Sync
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.apiPlatformId && (
                                                        <TableHead className="min-w-24 bg-blue-50 p-2 text-xs font-semibold">
                                                            API Platform ID
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.apiListingUrl && (
                                                        <TableHead className="min-w-48 bg-blue-50 p-2 text-xs font-semibold">
                                                            API Listing URL
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.apiErrors && (
                                                        <TableHead className="min-w-32 bg-blue-50 p-2 text-xs font-semibold">
                                                            API Errors
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.apiSyncFrequency && (
                                                        <TableHead className="min-w-28 bg-blue-50 p-2 text-xs font-semibold">
                                                            API Sync Frequency
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.imageUrls && (
                                                        <TableHead className="min-w-48 p-2 text-xs font-semibold">
                                                            Image URLs
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.description && (
                                                        <TableHead className="min-w-48 p-2 text-xs font-semibold">
                                                            Description
                                                        </TableHead>
                                                    )}
                                                    {visibleFields.aiInstructions && (
                                                        <TableHead className="min-w-48 p-2 text-xs font-semibold">
                                                            AI Instructions
                                                        </TableHead>
                                                    )}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredAndSortedWatches.map(
                                                    (watch) => (
                                                        <TableRow
                                                            key={watch.id}
                                                            className="hover:bg-slate-50"
                                                        >
                                                            {visibleFields.id && (
                                                                <TableCell className="sticky left-0 z-10 border-r bg-white p-2 text-xs font-medium">
                                                                    {watch.id}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.name && (
                                                                <TableCell className="sticky left-12 z-10 min-w-40 border-r bg-white p-2 text-xs font-medium">
                                                                    {watch.name}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.sku && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {watch.sku}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.batch && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {watch.batch ||
                                                                        "N/A"}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.brand && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {
                                                                        watch.brand
                                                                    }
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.status && (
                                                                <TableCell className="p-2">
                                                                    <span
                                                                        className={`rounded px-1 py-0.5 text-xs font-medium ${
                                                                            watch.status ===
                                                                            "Draft"
                                                                                ? "bg-gray-100 text-gray-800"
                                                                                : watch.status ===
                                                                                    "Review"
                                                                                  ? "bg-yellow-100 text-yellow-800"
                                                                                  : watch.status ===
                                                                                      "Platform Review"
                                                                                    ? "bg-orange-100 text-orange-800"
                                                                                    : watch.status ===
                                                                                        "Ready for listing"
                                                                                      ? "bg-blue-100 text-blue-800"
                                                                                      : watch.status ===
                                                                                          "Listed"
                                                                                        ? "bg-green-100 text-green-800"
                                                                                        : watch.status ===
                                                                                            "Reserved"
                                                                                          ? "bg-purple-100 text-purple-800"
                                                                                          : watch.status ===
                                                                                              "Sold"
                                                                                            ? "bg-slate-100 text-slate-800"
                                                                                            : watch.status ===
                                                                                                "Defect/Problem"
                                                                                              ? "bg-red-100 text-red-800"
                                                                                              : watch.status ===
                                                                                                  "Standby"
                                                                                                ? "bg-amber-100 text-amber-800"
                                                                                                : "bg-gray-100 text-gray-800"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            watch.status
                                                                        }
                                                                    </span>
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.acquisitionCost && (
                                                                <TableCell className="p-2 text-xs font-semibold">
                                                                    €
                                                                    {watch.acquisitionCost?.toLocaleString() ||
                                                                        "N/A"}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.agentHandler && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {watch.agentHandler ||
                                                                        "N/A"}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.depositId && (
                                                                <TableCell className="p-2 font-mono text-xs">
                                                                    {watch.depositId ||
                                                                        "N/A"}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.batchGroup && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {watch.batchGroup ||
                                                                        "N/A"}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.salesPrice && (
                                                                <TableCell className="p-2 text-xs font-semibold text-green-600">
                                                                    {watch.salesPrice
                                                                        ? `€${watch.salesPrice.toLocaleString()}`
                                                                        : "N/A"}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.profit && (
                                                                <TableCell
                                                                    className={`p-2 text-xs font-semibold ${watch.profit && watch.profit > 0 ? "text-green-600" : "text-red-600"}`}
                                                                >
                                                                    {watch.profit
                                                                        ? `€${watch.profit.toLocaleString()}`
                                                                        : "N/A"}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.dateAdded && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {
                                                                        watch.dateAdded
                                                                    }
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.dateListed && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {watch.dateListed ||
                                                                        "N/A"}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.dateSold && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {watch.dateSold ||
                                                                        "N/A"}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.platform && (
                                                                <TableCell className="p-2">
                                                                    {watch.platform ? (
                                                                        <span className="rounded bg-blue-100 px-1 py-0.5 text-xs text-blue-800">
                                                                            {
                                                                                watch.platform
                                                                            }
                                                                        </span>
                                                                    ) : (
                                                                        "N/A"
                                                                    )}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.condition && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {
                                                                        watch.condition
                                                                    }
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.movement && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {
                                                                        watch.movement
                                                                    }
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.caseMaterial && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {
                                                                        watch.caseMaterial
                                                                    }
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.caseSize && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {
                                                                        watch.caseSize
                                                                    }
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.waterResistance && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {
                                                                        watch.waterResistance
                                                                    }
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.warranty && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {
                                                                        watch.warranty
                                                                    }
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.serialNumber && (
                                                                <TableCell className="p-2 font-mono text-xs">
                                                                    {
                                                                        watch.serialNumber
                                                                    }
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.referenceNumber && (
                                                                <TableCell className="p-2 font-mono text-xs">
                                                                    {
                                                                        watch.referenceNumber
                                                                    }
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.yearOfManufacture && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {
                                                                        watch.yearOfManufacture
                                                                    }
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.seller && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {
                                                                        watch.seller
                                                                    }
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.location && (
                                                                <TableCell className="p-2 text-xs">
                                                                    {
                                                                        watch.location
                                                                    }
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.apiStatus && (
                                                                <TableCell className="bg-blue-50 p-2">
                                                                    <span
                                                                        className={`rounded px-1 py-0.5 text-xs font-medium ${
                                                                            watch.apiStatus ===
                                                                            "Synced"
                                                                                ? "bg-green-100 text-green-800"
                                                                                : watch.apiStatus ===
                                                                                    "Active"
                                                                                  ? "bg-blue-100 text-blue-800"
                                                                                  : watch.apiStatus ===
                                                                                      "Error"
                                                                                    ? "bg-red-100 text-red-800"
                                                                                    : watch.apiStatus ===
                                                                                        "Pending"
                                                                                      ? "bg-yellow-100 text-yellow-800"
                                                                                      : "bg-gray-100 text-gray-800"
                                                                        }`}
                                                                    >
                                                                        {watch.apiStatus ||
                                                                            "N/A"}
                                                                    </span>
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.apiLastSync && (
                                                                <TableCell className="bg-blue-50 p-2 text-xs">
                                                                    {watch.apiLastSync ||
                                                                        "N/A"}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.apiPlatformId && (
                                                                <TableCell className="bg-blue-50 p-2 font-mono text-xs">
                                                                    {watch.apiPlatformId ||
                                                                        "N/A"}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.apiListingUrl && (
                                                                <TableCell className="bg-blue-50 p-2 text-xs">
                                                                    {watch.apiListingUrl ? (
                                                                        <a
                                                                            href={
                                                                                watch.apiListingUrl
                                                                            }
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="block truncate text-blue-600 hover:underline"
                                                                        >
                                                                            {
                                                                                watch.apiListingUrl
                                                                            }
                                                                        </a>
                                                                    ) : (
                                                                        "N/A"
                                                                    )}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.apiErrors && (
                                                                <TableCell className="bg-blue-50 p-2 text-xs">
                                                                    {watch.apiErrors ? (
                                                                        <span className="text-red-600">
                                                                            {
                                                                                watch.apiErrors
                                                                            }
                                                                        </span>
                                                                    ) : (
                                                                        "None"
                                                                    )}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.apiSyncFrequency && (
                                                                <TableCell className="bg-blue-50 p-2 text-xs">
                                                                    {watch.apiSyncFrequency ||
                                                                        "N/A"}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.imageUrls && (
                                                                <TableCell className="max-w-xs p-2">
                                                                    <div className="text-xs text-slate-600">
                                                                        {watch.images.map(
                                                                            (
                                                                                img,
                                                                                idx,
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        idx
                                                                                    }
                                                                                    className="truncate"
                                                                                >
                                                                                    {
                                                                                        img.url
                                                                                    }
                                                                                </div>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.description && (
                                                                <TableCell className="max-w-xs truncate p-2 text-xs">
                                                                    {watch.description ||
                                                                        "N/A"}
                                                                </TableCell>
                                                            )}
                                                            {visibleFields.aiInstructions && (
                                                                <TableCell className="max-w-xs truncate p-2 text-xs">
                                                                    {watch.aiInstructions ||
                                                                        "N/A"}
                                                                </TableCell>
                                                            )}
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>

                            {filteredAndSortedWatches.length === 0 && (
                                <div className="py-12 text-center">
                                    <div className="mb-4 text-6xl">📊</div>
                                    <h3 className="mb-2 text-xl font-medium text-slate-900">
                                        No data found
                                    </h3>
                                    <p className="text-slate-600">
                                        Try adjusting your search terms or
                                        filters
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default FullDataView;
