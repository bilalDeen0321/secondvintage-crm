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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Head } from "@inertiajs/react";
import { Crown, DollarSign, Filter, Globe, Package } from "lucide-react";
import { useState } from "react";
import {
    Bar,
    CartesianGrid,
    Cell,
    ComposedChart,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import Layout from "../components/Layout";

const Dashboard = () => {
    const [dateFilter, setDateFilter] = useState("all-time");

    // Sample data for charts
    const revenueData = [
        { month: "Jan", revenue: 45000, profit: 32000, watches: 12 },
        { month: "Feb", revenue: 52000, profit: 38000, watches: 15 },
        { month: "Mar", revenue: 38000, profit: 25000, watches: 9 },
        { month: "Apr", revenue: 61000, profit: 45000, watches: 18 },
        { month: "May", revenue: 55000, profit: 40000, watches: 16 },
        { month: "Jun", revenue: 67000, profit: 50000, watches: 20 },
    ];

    // Updated brand sales data with profit information - limited to top 5
    const topBrandsWithProfit = [
        {
            brand: "Rolex",
            sales: 15,
            revenue: 285000,
            profit: 125000,
            avgProfit: 8333,
        },
        {
            brand: "Omega",
            sales: 12,
            revenue: 68000,
            profit: 32000,
            avgProfit: 2667,
        },
        {
            brand: "Breitling",
            sales: 8,
            revenue: 58000,
            profit: 28000,
            avgProfit: 3500,
        },
        {
            brand: "TAG Heuer",
            sales: 7,
            revenue: 42000,
            profit: 18000,
            avgProfit: 2571,
        },
        {
            brand: "IWC",
            sales: 5,
            revenue: 45000,
            profit: 22000,
            avgProfit: 4400,
        },
    ];

    const platformSalesData = [
        { platform: "Catawiki", sales: 12, percentage: 46.2 },
        { platform: "Tradera", sales: 8, percentage: 30.8 },
        { platform: "Webshop", sales: 6, percentage: 23.1 },
    ];

    // Watch inventory brand distribution
    const watchInventoryBrandDistribution = [
        { brand: "Rolex", count: 25, percentage: 28.1, color: "#f59e0b" },
        { brand: "Omega", count: 18, percentage: 20.2, color: "#3b82f6" },
        { brand: "TAG Heuer", count: 15, percentage: 16.9, color: "#10b981" },
        { brand: "Breitling", count: 12, percentage: 13.5, color: "#ef4444" },
        { brand: "IWC", count: 10, percentage: 11.2, color: "#8b5cf6" },
        { brand: "Others", count: 9, percentage: 10.1, color: "#6b7280" },
    ];

    // New data for watches sold per month
    const watchesSoldPerMonth = [
        { month: "Jan", watches: 12, value: 285000 },
        { month: "Feb", watches: 15, value: 342000 },
        { month: "Mar", watches: 9, value: 198000 },
        { month: "Apr", watches: 18, value: 425000 },
        { month: "May", watches: 16, value: 385000 },
        { month: "Jun", watches: 20, value: 485000 },
    ];

    // World sales data for bar chart - Updated with profit data, sorted by profit descending
    const globalSalesData = [
        { country: "Sweden", sales: 45, value: 180000, profit: 75000 },
        { country: "Norway", sales: 32, value: 140000, profit: 58000 },
        { country: "Denmark", sales: 28, value: 125000, profit: 52000 },
        { country: "Finland", sales: 18, value: 85000, profit: 35000 },
        { country: "Germany", sales: 15, value: 75000, profit: 31000 },
        { country: "United Kingdom", sales: 12, value: 65000, profit: 27000 },
        { country: "Netherlands", sales: 8, value: 45000, profit: 18000 },
        { country: "Belgium", sales: 6, value: 32000, profit: 13000 },
    ].sort((a, b) => b.profit - a.profit);

    const chartConfig = {
        revenue: {
            label: "Revenue",
            color: "#10b981",
        },
        profit: {
            label: "Profit",
            color: "#3b82f6",
        },
        watches: {
            label: "Watches Sold",
            color: "hsl(var(--chart-2))",
        },
        sales: {
            label: "Sales",
            color: "hsl(var(--chart-3))",
        },
        Rolex: {
            label: "Rolex",
            color: "#f59e0b",
        },
        Omega: {
            label: "Omega",
            color: "#3b82f6",
        },
        "TAG Heuer": {
            label: "TAG Heuer",
            color: "#10b981",
        },
        Breitling: {
            label: "Breitling",
            color: "#ef4444",
        },
        globalSales: { label: "Global Sales", color: "#10b981" },
    };

    // Custom Y-axis formatter for Euro values
    const formatYAxisEuro = (value: number) => {
        if (value >= 1000) {
            return `€${(value / 1000).toFixed(0)}k`;
        }
        return `€${value}`;
    };

    // Date filter options
    const dateFilterOptions = [
        { value: "all-time", label: "All Time" },
        { value: "this-year", label: "This Year" },
        { value: "last-year", label: "Last Year" },
        { value: "last-6-months", label: "Last 6 Months" },
        { value: "last-3-months", label: "Last 3 Months" },
        { value: "last-month", label: "Last Month" },
        { value: "this-month", label: "This Month" },
    ];

    return (
        <Layout>
            <Head title="Dashboard" />
            <div className="p-8">
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-slate-600">
                            Welcome to Second Vintage CRM
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-600" />
                        <Select
                            value={dateFilter}
                            onValueChange={setDateFilter}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select time period" />
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
                        </Select>
                    </div>
                </div>

                {/* Top KPIs */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-800">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-900">
                                €318,000
                            </div>
                            <p className="mt-1 text-xs text-blue-600">
                                6 months total
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-800">
                                Total Inventory
                            </CardTitle>
                            <Package className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-900">
                                €1.2M
                            </div>
                            <p className="mt-1 text-xs text-green-600">
                                127 watches
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-amber-800">
                                Denmark Inventory
                            </CardTitle>
                            <Package className="h-5 w-5 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-900">
                                €850K
                            </div>
                            <p className="mt-1 text-xs text-amber-600">
                                89 watches
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-800">
                                External Inventory
                            </CardTitle>
                            <Package className="h-5 w-5 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-900">
                                €350K
                            </div>
                            <p className="mt-1 text-xs text-purple-600">
                                38 watches
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Stats */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">
                                    Total Watches
                                </p>
                                <p className="text-3xl font-bold text-slate-900">
                                    127
                                </p>
                            </div>
                            <div className="text-4xl">⌚</div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">
                                    In Stock
                                </p>
                                <p className="text-3xl font-bold text-green-600">
                                    89
                                </p>
                            </div>
                            <div className="text-4xl">📦</div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">
                                    Listed
                                </p>
                                <p className="text-3xl font-bold text-blue-600">
                                    23
                                </p>
                            </div>
                            <div className="text-4xl">🏷️</div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600">
                                    Sold This Month
                                </p>
                                <p className="text-3xl font-bold text-amber-600">
                                    15
                                </p>
                            </div>
                            <div className="text-4xl">💰</div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid - Updated to 3x2 layout */}
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Revenue & Profit Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue & Profit</CardTitle>
                            <CardDescription>
                                Monthly revenue and profit trends
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis
                                            tickFormatter={formatYAxisEuro}
                                        />
                                        <ChartTooltip
                                            content={({
                                                active,
                                                payload,
                                                label,
                                            }) => {
                                                if (
                                                    active &&
                                                    payload &&
                                                    payload.length
                                                ) {
                                                    return (
                                                        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                                                            <p className="font-semibold">
                                                                {label}
                                                            </p>
                                                            {payload.map(
                                                                (
                                                                    entry,
                                                                    index,
                                                                ) => (
                                                                    <p
                                                                        key={
                                                                            index
                                                                        }
                                                                        style={{
                                                                            color: entry.color,
                                                                        }}
                                                                    >
                                                                        {
                                                                            entry.name
                                                                        }
                                                                        : €
                                                                        {entry.value?.toLocaleString()}
                                                                    </p>
                                                                ),
                                                            )}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="profit"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Watch Inventory Brand Distribution - Changed to Donut Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Watch Inventory Brand Distribution
                            </CardTitle>
                            <CardDescription>
                                Distribution of watches by brand
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={
                                                watchInventoryBrandDistribution
                                            }
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ brand, percentage }) =>
                                                `${brand}: ${percentage}%`
                                            }
                                            outerRadius={120}
                                            innerRadius={60}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {watchInventoryBrandDistribution.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <ChartTooltip
                                            content={({ active, payload }) => {
                                                if (
                                                    active &&
                                                    payload &&
                                                    payload[0]
                                                ) {
                                                    const data =
                                                        payload[0].payload;
                                                    return (
                                                        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                                                            <p className="font-semibold">
                                                                {data.brand}
                                                            </p>
                                                            <p>
                                                                Count:{" "}
                                                                {data.count}{" "}
                                                                watches
                                                            </p>
                                                            <p>
                                                                Percentage:{" "}
                                                                {
                                                                    data.percentage
                                                                }
                                                                %
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Watches Sold per Month Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Watches Sold per Month</CardTitle>
                            <CardDescription>
                                Monthly watch sales volume and value
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <ComposedChart data={watchesSoldPerMonth}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis yAxisId="left" />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            tickFormatter={formatYAxisEuro}
                                        />
                                        <ChartTooltip
                                            content={({
                                                active,
                                                payload,
                                                label,
                                            }) => {
                                                if (
                                                    active &&
                                                    payload &&
                                                    payload.length
                                                ) {
                                                    return (
                                                        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                                                            <p className="font-semibold">
                                                                {label}
                                                            </p>
                                                            {payload.map(
                                                                (
                                                                    entry,
                                                                    index,
                                                                ) => (
                                                                    <p
                                                                        key={
                                                                            index
                                                                        }
                                                                        style={{
                                                                            color: entry.color,
                                                                        }}
                                                                    >
                                                                        {entry.name ===
                                                                        "watches"
                                                                            ? `Watches: ${entry.value}`
                                                                            : `Value: €${entry.value?.toLocaleString()}`}
                                                                    </p>
                                                                ),
                                                            )}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar
                                            yAxisId="left"
                                            dataKey="watches"
                                            fill="#3b82f6"
                                        />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Two-column layout for Top Brands and Global Sales */}
                    <div className="grid grid-cols-1 gap-6 lg:col-span-2 lg:grid-cols-2">
                        {/* Top Brands with Profit List - Limited to 5 */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Crown className="h-5 w-5 text-amber-500" />
                                    Top 5 Brands by Profit
                                </CardTitle>
                                <CardDescription>
                                    Sales performance and profit by brand
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {topBrandsWithProfit.map((brand, index) => (
                                        <div
                                            key={brand.brand}
                                            className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-slate-600">
                                                    #{index + 1}
                                                </span>
                                                <div>
                                                    <p className="font-medium text-slate-900">
                                                        {brand.brand}
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                        {brand.sales} sales
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-green-600">
                                                    €
                                                    {brand.profit.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    €
                                                    {brand.avgProfit.toLocaleString()}{" "}
                                                    avg
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top 5 Most Profitable Countries List */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-blue-500" />
                                    Top 5 Most Profitable Countries
                                </CardTitle>
                                <CardDescription>
                                    Countries ranked by total profit
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {globalSalesData
                                        .slice(0, 5)
                                        .map((country, index) => (
                                            <div
                                                key={country.country}
                                                className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-medium text-slate-600">
                                                        #{index + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-medium text-slate-900">
                                                            {country.country}
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            {country.sales}{" "}
                                                            sales
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-green-600">
                                                        €
                                                        {country.profit.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        €
                                                        {country.value.toLocaleString()}{" "}
                                                        revenue
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Platform Sales Chart - Changed to Donut Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Sales Distribution</CardTitle>
                            <CardDescription>
                                Sales across different platforms
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={platformSalesData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ platform, percentage }) =>
                                                `${platform}: ${percentage}%`
                                            }
                                            outerRadius={120}
                                            innerRadius={60}
                                            fill="#8884d8"
                                            dataKey="sales"
                                        >
                                            <Cell fill="#f59e0b" />
                                            <Cell fill="#3b82f6" />
                                            <Cell fill="#10b981" />
                                        </Pie>
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold text-slate-900">
                        Recent Activity
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-3">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                    New watch added: Rolex Submariner
                                </p>
                                <p className="text-sm text-slate-600">
                                    2 hours ago
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-3">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                    Watch listed on Catawiki: Omega Speedmaster
                                </p>
                                <p className="text-sm text-slate-600">
                                    4 hours ago
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg bg-amber-50 p-3">
                            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                    Sale completed: TAG Heuer Monaco - Sold for
                                    €12,500
                                </p>
                                <p className="text-sm text-slate-600">
                                    1 day ago
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-3">
                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                    Price updated: Breitling Navitimer - Reduced
                                    to €8,900
                                </p>
                                <p className="text-sm text-slate-600">
                                    2 days ago
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 rounded-lg bg-slate-50 p-3">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                    Watch serviced: IWC Pilot's Watch - Service
                                    completed
                                </p>
                                <p className="text-sm text-slate-600">
                                    3 days ago
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
