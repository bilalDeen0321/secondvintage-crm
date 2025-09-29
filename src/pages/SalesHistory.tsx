import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
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
import { Head, usePage } from "@inertiajs/react";
import {
    ArrowUpDown,
    DollarSign,
    Download,
    Package,
    Search,
    TrendingUp,
    Upload,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts"; 
import axios from "axios";

import Layout from "../components/Layout";
import { useSearchParams } from "@/hooks/useSearchParams";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SaleRecord {
  id: number | string;
  watchName: string;
  buyer_country: string;
  original_price: string;
  currency: number;
  buyer_name: number;
  buyer_email: number;
  buyer_address: number;
  buyer_city: string; // ISO date string
  buyer_postal_code: string;
  country: string;
  status: string;
}

interface Props {
  sales: SaleRecord[];
}

// interface SaleRecord {
//     id: string;
//     watchName: string;
//     brand: string;
//     sku: string;
//     salePrice: number;
//     acquisitionCost: number;
//     profit: number;
//     profitMargin: number;
//     saleDate: string;
//     platform: string;
//     buyer: string;
//     country: string;
//     paymentMethod: string;
//     status: "Sold" | "Reserved" | "Pending" | "Refunded";
// }

type SortField =
    | "watchName"
    | "brand"
    | "sku"
    | "acquisitionCost"
    | "salePrice"
    | "profit"
    | "profitMargin"
    | "saleDate"
    | "platform"
    | "buyer"
    | "status";
type SortDirection = "asc" | "desc";

const SalesHistory = () => {
      const { sales } = usePage<{ sales: SaleRecord[] }>().props;

     const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorRows, setErrorRows] = useState<string[]>([]);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setSuccessMessage(null);
    setErrorRows([]); 

    const formData = new FormData();
    formData.append("file", file);

  try { 
      const { data } = await axios.post("/sales/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

        setSuccessMessage(data.success);
        setErrorRows(data.errorsList || []); 
        // Auto-close after 2s if successful and no errors
        if (data.success && (!data.errorsList || data.errorsList.length === 0)) {
            setTimeout(() => {
            setOpen(false);
            setFile(null);
            setSuccessMessage(null);
            }, 2000);
        }
        } catch (err: any) { 
        // Handle network/validation errors
        const message =
            err.response?.data?.message || "Upload failed due to server error";
        setErrorRows([message]);
        } finally {
        setLoading(false);
        }
  };

    // Sample sales data with additional watches
    // const [sales] = useState<SaleRecord[]>([
    //     {
    //         id: "1",
    //         watchName: "Rolex Submariner 116610LN",
    //         brand: "Rolex",
    //         sku: "ROL-SUB-001",
    //         salePrice: 12500,
    //         acquisitionCost: 8500,
    //         profit: 4000,
    //         profitMargin: 32,
    //         saleDate: "2024-01-15",
    //         platform: "Chrono24",
    //         buyer: "John Smith",
    //         country: "USA",
    //         paymentMethod: "Bank Transfer",
    //         status: "Sold",
    //     },
    //     {
    //         id: "2",
    //         watchName: "Omega Speedmaster Professional",
    //         brand: "Omega",
    //         sku: "OME-SPE-002",
    //         salePrice: 4800,
    //         acquisitionCost: 3200,
    //         profit: 1600,
    //         profitMargin: 33.3,
    //         saleDate: "2024-01-20",
    //         platform: "eBay",
    //         buyer: "Mike Johnson",
    //         country: "Canada",
    //         paymentMethod: "PayPal",
    //         status: "Sold",
    //     },
    //     {
    //         id: "3",
    //         watchName: "TAG Heuer Monaco",
    //         brand: "TAG Heuer",
    //         sku: "TAG-MON-003",
    //         salePrice: 4200,
    //         acquisitionCost: 2800,
    //         profit: 1400,
    //         profitMargin: 33.3,
    //         saleDate: "2024-01-25",
    //         platform: "Catawiki",
    //         buyer: "David Wilson",
    //         country: "UK",
    //         paymentMethod: "Credit Card",
    //         status: "Sold",
    //     },
    //     {
    //         id: "4",
    //         watchName: "Breitling Navitimer",
    //         brand: "Breitling",
    //         sku: "BRE-NAV-004",
    //         salePrice: 6500,
    //         acquisitionCost: 4200,
    //         profit: 2300,
    //         profitMargin: 35.4,
    //         saleDate: "2024-02-01",
    //         platform: "Tradera",
    //         buyer: "Lars Hansen",
    //         country: "Sweden",
    //         paymentMethod: "Bank Transfer",
    //         status: "Sold",
    //     },
    //     {
    //         id: "5",
    //         watchName: "IWC Pilot Mark XVIII",
    //         brand: "IWC",
    //         sku: "IWC-PIL-005",
    //         salePrice: 5800,
    //         acquisitionCost: 3800,
    //         profit: 2000,
    //         profitMargin: 34.5,
    //         saleDate: "2024-02-10",
    //         platform: "Chrono24",
    //         buyer: "Andreas Mueller",
    //         country: "Germany",
    //         paymentMethod: "Wire Transfer",
    //         status: "Reserved",
    //     },
    //     {
    //         id: "6",
    //         watchName: "Tudor Black Bay 58",
    //         brand: "Tudor",
    //         sku: "TUD-BB-006",
    //         salePrice: 3200,
    //         acquisitionCost: 2400,
    //         profit: 800,
    //         profitMargin: 25,
    //         saleDate: "2024-02-15",
    //         platform: "eBay",
    //         buyer: "Sarah Connor",
    //         country: "Australia",
    //         paymentMethod: "PayPal",
    //         status: "Sold",
    //     },
    //     {
    //         id: "7",
    //         watchName: "Seiko Prospex Diver",
    //         brand: "Seiko",
    //         sku: "SEI-PRO-007",
    //         salePrice: 450,
    //         acquisitionCost: 320,
    //         profit: 130,
    //         profitMargin: 28.9,
    //         saleDate: "2024-03-01",
    //         platform: "Catawiki",
    //         buyer: "Pierre Dubois",
    //         country: "France",
    //         paymentMethod: "Credit Card",
    //         status: "Sold",
    //     },
    //     {
    //         id: "8",
    //         watchName: "Cartier Tank Solo",
    //         brand: "Cartier",
    //         sku: "CAR-TAN-008",
    //         salePrice: 2800,
    //         acquisitionCost: 2100,
    //         profit: 700,
    //         profitMargin: 25,
    //         saleDate: "2024-03-10",
    //         platform: "Tradera",
    //         buyer: "Erik Svensson",
    //         country: "Sweden",
    //         paymentMethod: "Bank Transfer",
    //         status: "Sold",
    //     },
    //     {
    //         id: "9",
    //         watchName: "Panerai Luminor Marina",
    //         brand: "Panerai",
    //         sku: "PAN-LUM-009",
    //         salePrice: 7200,
    //         acquisitionCost: 5400,
    //         profit: 1800,
    //         profitMargin: 25,
    //         saleDate: "2024-03-15",
    //         platform: "Chrono24",
    //         buyer: "Marco Rossi",
    //         country: "Italy",
    //         paymentMethod: "Wire Transfer",
    //         status: "Sold",
    //     },
    //     {
    //         id: "10",
    //         watchName: "Zenith El Primero",
    //         brand: "Zenith",
    //         sku: "ZEN-ELP-010",
    //         salePrice: 5500,
    //         acquisitionCost: 4000,
    //         profit: 1500,
    //         profitMargin: 27.3,
    //         saleDate: "2024-03-20",
    //         platform: "eBay",
    //         buyer: "Hans Schmidt",
    //         country: "Germany",
    //         paymentMethod: "PayPal",
    //         status: "Sold",
    //     },
    //     {
    //         id: "11",
    //         watchName: "Longines Master Collection Moonphase",
    //         brand: "Longines",
    //         sku: "LON-MAS-011",
    //         salePrice: 2200,
    //         acquisitionCost: 1600,
    //         profit: 600,
    //         profitMargin: 27.3,
    //         saleDate: "2024-03-25",
    //         platform: "Chrono24",
    //         buyer: "François Leroy",
    //         country: "France",
    //         paymentMethod: "Bank Transfer",
    //         status: "Sold",
    //     },
    //     {
    //         id: "12",
    //         watchName: "Omega Seamaster Planet Ocean",
    //         brand: "Omega",
    //         sku: "OME-SEA-012",
    //         salePrice: 3800,
    //         acquisitionCost: 2800,
    //         profit: 1000,
    //         profitMargin: 26.3,
    //         saleDate: "2024-04-01",
    //         platform: "eBay",
    //         buyer: "Robert Taylor",
    //         country: "USA",
    //         paymentMethod: "PayPal",
    //         status: "Sold",
    //     },
    //     {
    //         id: "13",
    //         watchName: "Seiko Grand Seiko Heritage",
    //         brand: "Seiko",
    //         sku: "SEI-GS-013",
    //         salePrice: 3200,
    //         acquisitionCost: 2400,
    //         profit: 800,
    //         profitMargin: 25,
    //         saleDate: "2024-04-05",
    //         platform: "Catawiki",
    //         buyer: "Takeshi Yamamoto",
    //         country: "Japan",
    //         paymentMethod: "Credit Card",
    //         status: "Sold",
    //     },
    //     {
    //         id: "14",
    //         watchName: "Longines HydroConquest",
    //         brand: "Longines",
    //         sku: "LON-HYD-014",
    //         salePrice: 1400,
    //         acquisitionCost: 1000,
    //         profit: 400,
    //         profitMargin: 28.6,
    //         saleDate: "2024-04-10",
    //         platform: "Tradera",
    //         buyer: "Nils Andersson",
    //         country: "Sweden",
    //         paymentMethod: "Bank Transfer",
    //         status: "Sold",
    //     },
    //     {
    //         id: "15",
    //         watchName: "Omega De Ville Prestige",
    //         brand: "Omega",
    //         sku: "OME-DEV-015",
    //         salePrice: 2100,
    //         acquisitionCost: 1500,
    //         profit: 600,
    //         profitMargin: 28.6,
    //         saleDate: "2024-04-15",
    //         platform: "Chrono24",
    //         buyer: "Antonio Garcia",
    //         country: "Spain",
    //         paymentMethod: "Wire Transfer",
    //         status: "Sold",
    //     },
    //     {
    //         id: "16",
    //         watchName: "Seiko Samurai SRPD Automatic",
    //         brand: "Seiko",
    //         sku: "SEI-SAM-016",
    //         salePrice: 380,
    //         acquisitionCost: 280,
    //         profit: 100,
    //         profitMargin: 26.3,
    //         saleDate: "2024-04-20",
    //         platform: "eBay",
    //         buyer: "Michael Brown",
    //         country: "Canada",
    //         paymentMethod: "PayPal",
    //         status: "Sold",
    //     },
    //     {
    //         id: "17",
    //         watchName: "Longines Spirit Aviation",
    //         brand: "Longines",
    //         sku: "LON-SPI-017",
    //         salePrice: 2600,
    //         acquisitionCost: 1900,
    //         profit: 700,
    //         profitMargin: 26.9,
    //         saleDate: "2024-04-25",
    //         platform: "Catawiki",
    //         buyer: "Klaus Weber",
    //         country: "Germany",
    //         paymentMethod: "Credit Card",
    //         status: "Reserved",
    //     },
    //     {
    //         id: "18",
    //         watchName: "Omega Constellation Co-Axial",
    //         brand: "Omega",
    //         sku: "OME-CON-018",
    //         salePrice: 3400,
    //         acquisitionCost: 2500,
    //         profit: 900,
    //         profitMargin: 26.5,
    //         saleDate: "2024-05-01",
    //         platform: "Tradera",
    //         buyer: "Per Lindström",
    //         country: "Sweden",
    //         paymentMethod: "Bank Transfer",
    //         status: "Sold",
    //     },
    //     {
    //         id: "19",
    //         watchName: "Seiko 5 Sports Field Watch",
    //         brand: "Seiko",
    //         sku: "SEI-5SP-019",
    //         salePrice: 220,
    //         acquisitionCost: 160,
    //         profit: 60,
    //         profitMargin: 27.3,
    //         saleDate: "2024-05-05",
    //         platform: "eBay",
    //         buyer: "David Kim",
    //         country: "South Korea",
    //         paymentMethod: "PayPal",
    //         status: "Sold",
    //     },
    //     {
    //         id: "20",
    //         watchName: "Longines Flagship Heritage",
    //         brand: "Longines",
    //         sku: "LON-FLA-020",
    //         salePrice: 1800,
    //         acquisitionCost: 1300,
    //         profit: 500,
    //         profitMargin: 27.8,
    //         saleDate: "2024-05-10",
    //         platform: "Chrono24",
    //         buyer: "Jean-Luc Martin",
    //         country: "France",
    //         paymentMethod: "Wire Transfer",
    //         status: "Reserved",
    //     },
    // ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [platformFilter, setPlatformFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    // dropdown filters
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultFilter = searchParams.get('filter') || 'all-time';
    const [timeRange, setTimeRange] = useState(defaultFilter);

    const [sortField, setSortField] = useState<SortField>("saleDate");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    const { props } = usePage();

    console.log('page props: ', props);

    useEffect(() => {
        if (timeRange) {
            setSearchParams({ filter: timeRange });
        }
    }, [timeRange, setSearchParams]);

     const dateFilterOptions = Object.entries(props.filters).map(
        ([value, label]) => ({ value, label })
    );
  
    // Calculate min and max prices for the slider
    // const priceStats = useMemo(() => {
    //     const prices = sales.map((sale) => sale.salePrice);
    //     return {
    //         min: Math.min(...prices),
    //         max: Math.max(...prices),
    //     };
    // }, [sales]);

    // Calculate summary statistics
    // const stats = useMemo(() => {
    //     const completedSales = sales.filter((sale) => sale.status === "Sold");
    //     const totalRevenue = completedSales.reduce(
    //         (sum, sale) => sum + sale.salePrice,
    //         0,
    //     );
    //     const totalProfit = completedSales.reduce(
    //         (sum, sale) => sum + sale.profit,
    //         0,
    //     );
    //     const avgProfitMargin =
    //         completedSales.length > 0
    //             ? completedSales.reduce(
    //                   (sum, sale) => sum + sale.profitMargin,
    //                   0,
    //               ) / completedSales.length
    //             : 0;

    //     return {
    //         totalSales: completedSales.length,
    //         totalRevenue,
    //         totalProfit,
    //         avgProfitMargin: Math.round(avgProfitMargin * 100) / 100,
    //     };
    // }, [sales]);

    const monthlyData = props.monthlyData;
    const monthlySalesCount = props.monthlySalesCount;
    const profitPerPlatformData = props.profitPerPlatform;
    const platformData = props.salesByPlatform;

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const sortedAndFilteredSales = useMemo(() => {
        const filtered = sales.filter((sale) => {
            const matchesSearch =
                sale.watchName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                sale.platform?.includes(searchTerm.toLowerCase()) ||
                sale.sku.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPlatform =
                platformFilter === "All" || sale.platform === platformFilter;
            const matchesStatus =
                statusFilter === "All" || sale.status === statusFilter;

            // Time range filtering
            let matchesTime = true;
            if (timeRange !== "All Time") {
                const saleDate = new Date(sale.saleDate);
                const now = new Date();

                switch (timeRange) {
                    case "Last 7 days":
                        matchesTime =
                            saleDate >=
                            new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        break;
                    case "Last 30 days":
                        matchesTime =
                            saleDate >=
                            new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                        break;
                    case "Last 3 months":
                        matchesTime =
                            saleDate >=
                            new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                        break;
                    case "Last 6 months":
                        matchesTime =
                            saleDate >=
                            new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
                        break;
                    case "This year":
                        matchesTime =
                            saleDate.getFullYear() === now.getFullYear();
                        break;
                    case "Last year":
                        matchesTime =
                            saleDate.getFullYear() === now.getFullYear() - 1;
                        break;
                }
            }

            return (
                matchesSearch && matchesPlatform && matchesStatus && matchesTime
            );
        });

        return filtered.sort((a, b) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let aValue: any = a[sortField];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let bValue: any = b[sortField];

            if (sortField === "saleDate") {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (typeof aValue === "string") {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortDirection === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }, [
        sales,
        searchTerm,
        platformFilter,
        statusFilter,
        sortField,
        sortDirection,
        timeRange,
    ]);

    const chartConfig = {
        revenue: { label: "Revenue", color: "#166534" }, // Dark green
        profit: { label: "Profit", color: "#82ca9d" },
    };

    const profitChartConfig = {
        "Catawiki (Auction)": { label: "Catawiki (Auction)", color: "#FFBB28" },
        "Tradera (Auction)": { label: "Tradera (Auction)", color: "#FF8042" },
        "Chrono24": { label: "Chrono24", color: "#0088FE" },
        "eBay (Fixed Price)": { label: "eBay (Fixed Price)", color: "#00C49F" },
        "eBay (Auction)": { label: "eBay (Auction)", color: "#EC4899" },
        "Webshop (Fixed Price)": { label: "Webshop (Fixed Price)", color: "#22D3EE" },
        "Unknown": { label: "Unknown", color: "#9CA3AF" },
    };


    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    const SortableHeader = ({
        field,
        children,
    }: {
        field: SortField;
        children: React.ReactNode;
    }) => (
        <TableHead
            className="cursor-pointer select-none hover:bg-slate-50"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-1">
                {children}
                <ArrowUpDown className="h-3 w-3" />
                {sortField === field && (
                    <span className="ml-1 text-xs">
                        {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                )}
            </div>
        </TableHead>
    );

    return (
        <Layout>
            <Head title="Sales History & Statistics" />
            <div className="p-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Sales History & Statistics
                        </h1>
                        <p className="mt-1 text-slate-600">
                            Track your sales performance and revenue
                        </p>
                    </div>
                    <Button onClick={() => setOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Import Catawiki Sales Data
                    </Button>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                         <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">

                        <DialogHeader>
                            <DialogTitle>Import Catawiki Sales Data</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <input
                            type="file"
                            accept=".csv,.xlsx"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="block w-full rounded-md border p-2"
                            />

                            {successMessage && (
                            <p className="text-green-600 font-medium">{successMessage}</p>
                            )}

                            {errorRows.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-2 text-red-600 text-sm">
                                <p className="font-semibold">These rows could not be imported:</p>
                                <ul className="list-disc pl-5">
                                {errorRows.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                                </ul>
                            </div>
                            )}

                            <Button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            className="w-full"
                            >
                            {loading ? (
                                <span className="flex items-center">
                                <svg
                                    className="animate-spin h-4 w-4 mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    strokeWidth="4"
                                    ></circle>
                                    <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                    ></path>
                                </svg>
                                Uploading...
                                </span>
                            ) : (
                                "Upload"
                            )}
                            </Button>
                        </div>
                        </DialogContent>
                    </Dialog>
                {/* Time Range Filter */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Time Range Filter
                        </CardTitle>
                        <CardDescription>
                            Filter sales by time period
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Select
                                value={timeRange}
                                onValueChange={setTimeRange}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Select time range" />
                                </SelectTrigger>
                                
                                <SelectContent>
                                 {dateFilterOptions.map((option) => (
                                     <SelectItem
                                     key={option.value}
                                     value={option.value}
                                     >
                                        {option.label}
                                    </SelectItem>
                                ))}
                                </SelectContent>

                                {/* <SelectContent>
                                    <SelectItem value="All Time">
                                        All Time
                                    </SelectItem>
                                    <SelectItem value="Last 7 days">
                                        Last 7 days
                                    </SelectItem>
                                    <SelectItem value="Last 30 days">
                                        Last 30 days
                                    </SelectItem>
                                    <SelectItem value="Last 3 months">
                                        Last 3 months
                                    </SelectItem>
                                    <SelectItem value="Last 6 months">
                                        Last 6 months
                                    </SelectItem>
                                    <SelectItem value="This year">
                                        This year
                                    </SelectItem>
                                    <SelectItem value="Last year">
                                        Last year
                                    </SelectItem>
                                </SelectContent> */}
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">{props.totalSales?.value?.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {props.totalSales?.change !== undefined
                            ? `${props.totalSales.change >= 0 ? '+' : ''}${props.totalSales.change}% from last 30 days`
                            : '0% from last 30 days'}
                        </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">
                            €{props.totalRevenue?.value?.toLocaleString() || '0'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {props.totalRevenue?.change !== undefined
                            ? `${props.totalRevenue.change >= 0 ? '+' : ''}${props.totalRevenue.change}% from last 30 days`
                            : '0% from last 30 days'}
                        </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">
                            €{props.totalProfit?.value?.toLocaleString() || '0'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {props.totalProfit?.change !== undefined
                            ? `${props.totalProfit.change >= 0 ? '+' : ''}${props.totalProfit.change}% from last 30 days`
                            : '0% from last 30 days'}
                        </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Profit Margin</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">
                            {props.avgProfitMargin?.value || '0'}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {props.avgProfitMargin?.change !== undefined
                            ? `${props.avgProfitMargin.change >= 0 ? '+' : ''}${props.avgProfitMargin.change}% from last 30 days`
                            : '0% from last 30 days'}
                        </p>
                        </CardContent>
                    </Card>
                    </div>
                {/* Charts */}
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Revenue & Profit</CardTitle>
                            <CardDescription>
                                Stacked revenue and profit trends over time
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={chartConfig}
                                className="h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis
                                            tickFormatter={(value) =>
                                                `€${value.toLocaleString()}`
                                            }
                                        />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <Bar
                                            dataKey="revenue"
                                            stackId="a"
                                            fill="var(--color-revenue)"
                                        />
                                        <Bar
                                            dataKey="profit"
                                            stackId="a"
                                            fill="var(--color-profit)"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Profit per Platform by Month</CardTitle>
                            <CardDescription>
                                Multi-line chart showing profit trends for each
                                platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={profitChartConfig}
                                className="h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={profitPerPlatformData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis
                                        tickFormatter={(value) => `€${value.toLocaleString()}`}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />

                                        {Object.entries(profitChartConfig).map(([key, cfg]) => (
                                        <Line
                                            key={key}
                                            type="monotone"
                                            dataKey={key}
                                            stroke={cfg.color}
                                            strokeWidth={2}
                                            dot={true}
                                            activeDot={{ r: 6 }}
                                        />
                                        ))}
                                       
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sales by Platform</CardTitle>
                            <CardDescription>
                                Distribution of sales across platforms
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={platformData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ platform, percentage }) =>
                                                `${platform} (${percentage}%)`
                                            }
                                            outerRadius={80}
                                            innerRadius={50}
                                            fill="#8884d8"
                                            dataKey="sales"
                                        >
                                            {platformData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <ChartTooltip
                                            formatter={(value, name, props) => [
                                                `${value} watches`,
                                                `Sales: ${value} | Profit: €${props.payload.profit.toLocaleString()} | ${props.payload.percentage}%`,
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Platform Stats */}
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                {platformData.map((platform, index) => (
                                    <div
                                        key={platform.platform}
                                        className="flex items-center gap-2 rounded-lg border p-2"
                                    >
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    COLORS[
                                                        index % COLORS.length
                                                    ],
                                            }}
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">
                                                {platform.platform}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {platform.sales} sales • €
                                                {platform.profit.toLocaleString()}{" "}
                                                profit • {platform.percentage}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Watches Sold per Month</CardTitle>
                            <CardDescription>
                                Number of watches sold monthly
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlySalesCount}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <ChartTooltip />
                                        <Bar dataKey="count" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 lg:flex-row">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search sales by watch name, brand, or SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Select
                            value={platformFilter}
                            onValueChange={setPlatformFilter}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">
                                    All Platforms
                                </SelectItem>
                                <SelectItem value="Chrono24">
                                    Chrono24
                                </SelectItem>
                                <SelectItem value="eBay">eBay</SelectItem>
                                <SelectItem value="Catawiki">
                                    Catawiki
                                </SelectItem>
                                <SelectItem value="Tradera">Tradera</SelectItem>
                            </SelectContent>
                        </Select>
 

                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Sales Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <SortableHeader field="watchName">
                                        Watch Name
                                    </SortableHeader>
                                    
                                    <SortableHeader field="sku">
                                        SKU
                                    </SortableHeader>
                                    <SortableHeader field="acquisitionCost">
                                        Cost
                                    </SortableHeader>
                                   
                                    <SortableHeader field="profit">
                                        Buyer Name
                                    </SortableHeader>
                                    <SortableHeader field="profitMargin">
                                        Buyer Email
                                    </SortableHeader>
                                   
                                    <SortableHeader field="platform">
                                        Platform
                                    </SortableHeader>
                                    <SortableHeader field="buyer">
                                        Buyer
                                    </SortableHeader>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Catawiki Obj Number</TableHead>
                                    <TableHead>Catawiki Invoice Number</TableHead>
                                    <TableHead>Invoice URL</TableHead>
                                    <TableHead>Status</TableHead>
                                    
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedAndFilteredSales.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell className="font-medium">
                                            {sale.watchName}
                                        </TableCell>
                                         <TableCell className="text-slate-600">
                                            {sale.sku}
                                        </TableCell>
                                        <TableCell>
                                            €
                                            {sale.original_price.toLocaleString()}
                                        </TableCell>
                                        
                                        <TableCell className="font-semibold text-green-600">
                                            {sale.buyer_name}
                                        </TableCell>
                                        <TableCell>
                                            {sale.buyer_email}
                                        </TableCell> 
                                        <TableCell>{sale.platform}</TableCell>
                                        <TableCell>{sale.buyer}</TableCell>
                                        <TableCell>{sale.country}</TableCell>
                                        <TableCell>{sale.catawiki_object_number}</TableCell>
                                        <TableCell>{sale.catawiki_invoice_number}</TableCell>
                                        <TableCell>{sale.catawiki_invoice_url}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    sale.status === "Sold"
                                                        ? "bg-green-100 text-green-800"
                                                        : sale.status ===
                                                            "Reserved"
                                                          ? "bg-yellow-100 text-yellow-800"
                                                          : "bg-red-100 text-red-800"
                                                }
                                            >
                                                {sale.status}
                                            </Badge>
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

export default SalesHistory;
