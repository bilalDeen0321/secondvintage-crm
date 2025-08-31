import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Head, router } from "@inertiajs/react";
import { Download, Filter, Search, Upload } from "lucide-react";
import { useState } from "react";

interface Sale {
    id: number;
    invoice_number: string;
    sale_date: string;
    customer_name: string;
    watch: {
        sku: string;
        name: string;
        brand: string;
        acquisition_cost: number;
    };
    platform: string;
    sale_converted_price: number;
    profit: number;
    profit_margin: number;
}

interface Props {
    sales: {
        data: Sale[];
        links: any[];
        meta: any;
    };
    stats: {
        total_sales: number;
        total_revenue: number;
        total_profit: number;
        platform_breakdown: any[];
    };
    filters: {
        from_date?: string;
        to_date?: string;
        platform?: string;
        search?: string;
    };
}

export default function SalesHistoryIndex({ sales, stats, filters }: Props) {
    const [isImporting, setIsImporting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const { toast } = useToast();

    const handleImport = async (file: File) => {
        setIsImporting(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/sales-history/import", {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
            });

            const result = await response.json();

            if (result.success) {
                toast({
                    title: "Import Successful",
                    description: result.message,
                });
                router.reload();
            } else {
                toast({
                    title: "Import Failed",
                    description: result.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred during import",
                variant: "destructive",
            });
        } finally {
            setIsImporting(false);
        }
    };

    const handleExport = async () => {
        setIsExporting(true);

        try {
            const response = await fetch("/sales-history/export", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
                body: JSON.stringify(filters),
            });

            const result = await response.json();

            if (result.success) {
                // Download the file
                window.open(result.download_url, "_blank");
                toast({
                    title: "Export Complete",
                    description: "Sales data exported successfully",
                });
            } else {
                toast({
                    title: "Export Failed",
                    description: "Failed to export sales data",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An unexpected error occurred during export",
                variant: "destructive",
            });
        } finally {
            setIsExporting(false);
        }
    };

    const getPlatformColor = (platform: string) => {
        const colors = {
            Catawiki: "bg-blue-100 text-blue-800",
            Tradera: "bg-gray-100 text-gray-800",
            eBay: "bg-yellow-100 text-yellow-800",
            Chrono24: "bg-green-100 text-green-800",
            Webshop: "bg-purple-100 text-purple-800",
        };
        return colors[platform] || "bg-gray-100 text-gray-800";
    };

    return (
        <Layout>
            <Head title="Sales History" />

            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Sales History</h1>
                            <p className="mt-1 text-slate-600">
                                View and manage all sales transactions
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={handleExport} disabled={isExporting}>
                                <Download className="mr-2 h-4 w-4" />
                                {isExporting ? "Exporting..." : "Export"}
                            </Button>

                            <label htmlFor="import-file">
                                <Button variant="outline" disabled={isImporting} asChild>
                                    <span>
                                        <Upload className="mr-2 h-4 w-4" />
                                        {isImporting ? "Importing..." : "Import Sales"}
                                    </span>
                                </Button>
                            </label>
                            <input
                                id="import-file"
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImport(file);
                                }}
                            />
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
                        <div className="rounded-lg border bg-white p-6">
                            <div className="text-2xl font-bold text-slate-900">
                                {stats.total_sales}
                            </div>
                            <div className="text-sm text-slate-600">Total Sales</div>
                        </div>
                        <div className="rounded-lg border bg-white p-6">
                            <div className="text-2xl font-bold text-green-600">
                                €{stats.total_revenue.toLocaleString()}
                            </div>
                            <div className="text-sm text-slate-600">Total Revenue</div>
                        </div>
                        <div className="rounded-lg border bg-white p-6">
                            <div className="text-2xl font-bold text-blue-600">
                                €{stats.total_profit.toLocaleString()}
                            </div>
                            <div className="text-sm text-slate-600">Total Profit</div>
                        </div>
                        <div className="rounded-lg border bg-white p-6">
                            <div className="text-2xl font-bold text-purple-600">
                                {stats.total_revenue > 0
                                    ? ((stats.total_profit / stats.total_revenue) * 100).toFixed(1)
                                    : 0}
                                %
                            </div>
                            <div className="text-sm text-slate-600">Avg Profit Margin</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 rounded-lg border bg-white p-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setFilterVisible(!filterVisible)}
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Filters
                            </Button>

                            <div className="max-w-md flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                                    <Input
                                        placeholder="Search by watch name, SKU, or brand..."
                                        className="pl-10"
                                        defaultValue={filters.search}
                                        onChange={(e) => {
                                            router.get(
                                                "/sales-history",
                                                {
                                                    ...filters,
                                                    search: e.target.value,
                                                },
                                                { preserveState: true },
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {filterVisible && (
                            <div className="mt-4 grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        From Date
                                    </label>
                                    <Input
                                        type="date"
                                        defaultValue={filters.from_date}
                                        onChange={(e) => {
                                            router.get(
                                                "/sales-history",
                                                {
                                                    ...filters,
                                                    from_date: e.target.value,
                                                },
                                                { preserveState: true },
                                            );
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        To Date
                                    </label>
                                    <Input
                                        type="date"
                                        defaultValue={filters.to_date}
                                        onChange={(e) => {
                                            router.get(
                                                "/sales-history",
                                                {
                                                    ...filters,
                                                    to_date: e.target.value,
                                                },
                                                { preserveState: true },
                                            );
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Platform
                                    </label>
                                    <Select
                                        defaultValue={filters.platform || "All"}
                                        onValueChange={(value) => {
                                            router.get(
                                                "/sales-history",
                                                {
                                                    ...filters,
                                                    platform: value === "All" ? undefined : value,
                                                },
                                                { preserveState: true },
                                            );
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All Platforms</SelectItem>
                                            <SelectItem value="Catawiki">Catawiki</SelectItem>
                                            <SelectItem value="Tradera">Tradera</SelectItem>
                                            <SelectItem value="eBay">eBay</SelectItem>
                                            <SelectItem value="Chrono24">Chrono24</SelectItem>
                                            <SelectItem value="Webshop">Webshop</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sales Table */}
                <div className="overflow-hidden rounded-lg border bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Invoice
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Watch
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Platform
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Purchase
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Sale
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                        Profit
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {sales.data.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-slate-50">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                                            {sale.invoice_number}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                            {new Date(sale.sale_date).toLocaleDateString()}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                                            {sale.customer_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-900">
                                            <div className="font-medium">{sale.watch.name}</div>
                                            <div className="text-slate-500">
                                                {sale.watch.sku} • {sale.watch.brand}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <Badge className={getPlatformColor(sale.platform)}>
                                                {sale.platform}
                                            </Badge>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-900">
                                            €{sale.watch.acquisition_cost?.toLocaleString() || "0"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                                            €{sale.sale_converted_price.toLocaleString()}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <div
                                                className={`font-medium ${sale.profit >= 0 ? "text-green-600" : "text-red-600"}`}
                                            >
                                                €{sale.profit.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {sale.profit_margin.toFixed(1)}%
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {sales.links && (
                        <div className="border-t border-slate-200 px-6 py-3">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-700">
                                    Showing {sales.meta.from} to {sales.meta.to} of{" "}
                                    {sales.meta.total} results
                                </div>
                                <div className="flex gap-2">
                                    {sales.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.visit(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
