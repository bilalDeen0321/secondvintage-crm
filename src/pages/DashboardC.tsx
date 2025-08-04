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
    AlertTriangle,
    Clock,
    DollarSign,
    Package,
    Target,
    Zap,
} from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ComposedChart,
    Line,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import Layout from "../components/Layout";

const DashboardC = () => {
    // Inventory status by brand
    const inventoryByBrand = [
        { brand: "Rolex", inStock: 25, listed: 8, sold: 12, value: 450000 },
        { brand: "Omega", inStock: 18, listed: 6, sold: 9, value: 180000 },
        { brand: "TAG Heuer", inStock: 15, listed: 4, sold: 6, value: 95000 },
        { brand: "Breitling", inStock: 12, listed: 3, sold: 5, value: 140000 },
        { brand: "IWC", inStock: 10, listed: 2, sold: 4, value: 120000 },
        { brand: "Seiko", inStock: 8, listed: 1, sold: 3, value: 25000 },
    ];

    // Cash flow data
    const cashFlow = [
        {
            month: "Jan",
            income: 125000,
            expenses: 45000,
            profit: 80000,
            inventory: 950000,
        },
        {
            month: "Feb",
            income: 142000,
            expenses: 52000,
            profit: 90000,
            inventory: 1020000,
        },
        {
            month: "Mar",
            income: 98000,
            expenses: 48000,
            profit: 50000,
            inventory: 980000,
        },
        {
            month: "Apr",
            income: 165000,
            expenses: 58000,
            profit: 107000,
            inventory: 1100000,
        },
        {
            month: "May",
            income: 178000,
            expenses: 62000,
            profit: 116000,
            inventory: 1150000,
        },
        {
            month: "Jun",
            income: 195000,
            expenses: 68000,
            profit: 127000,
            inventory: 1200000,
        },
    ];

    // Aging inventory
    const agingInventory = [
        { range: "0-30 days", count: 45, value: 650000, color: "#10b981" },
        { range: "31-60 days", count: 28, value: 420000, color: "#f59e0b" },
        { range: "61-90 days", count: 18, value: 280000, color: "#ef4444" },
        { range: "90+ days", count: 12, value: 180000, color: "#6b7280" },
    ];

    // Top 10 most valuable watches
    const valuableWatches = [
        {
            name: "Rolex Daytona 116500LN",
            value: 35000,
            status: "In Stock",
            days: 15,
        },
        {
            name: "Patek Philippe Nautilus",
            value: 28000,
            status: "Listed",
            days: 8,
        },
        {
            name: "Rolex GMT-Master II",
            value: 22000,
            status: "In Stock",
            days: 22,
        },
        {
            name: "Omega Speedmaster Pro",
            value: 18000,
            status: "Listed",
            days: 12,
        },
        {
            name: "Breitling Navitimer 01",
            value: 16000,
            status: "In Stock",
            days: 35,
        },
        { name: "IWC Big Pilot", value: 14000, status: "In Stock", days: 18 },
        { name: "TAG Heuer Monaco", value: 12000, status: "Listed", days: 6 },
        {
            name: "Rolex Submariner Date",
            value: 11500,
            status: "In Stock",
            days: 28,
        },
    ];

    // Turnover rate by category
    const turnoverRates = [
        { category: "Sports Watches", rate: 8.5, avgDays: 12 },
        { category: "Luxury Dress", rate: 6.2, avgDays: 18 },
        { category: "Diving Watches", rate: 7.8, avgDays: 14 },
        { category: "Aviation", rate: 5.9, avgDays: 22 },
        { category: "Vintage", rate: 4.3, avgDays: 28 },
        { category: "Complications", rate: 3.8, avgDays: 35 },
    ];

    const chartConfig = {
        income: { label: "Income", color: "#10b981" },
        expenses: { label: "Expenses", color: "#ef4444" },
        profit: { label: "Profit", color: "#3b82f6" },
        inventory: { label: "Inventory Value", color: "#f59e0b" },
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "In Stock":
                return "bg-green-100 text-green-800";
            case "Listed":
                return "bg-blue-100 text-blue-800";
            case "Sold":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getDaysColor = (days: number) => {
        if (days <= 15) return "text-green-600";
        if (days <= 30) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <Layout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Inventory & Financial Dashboard
                    </h1>
                    <p className="mt-1 text-slate-600">
                        Deep dive into inventory management and financial
                        performance
                    </p>
                </div>

                {/* Financial KPIs */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-800">
                                Total Inventory Value
                            </CardTitle>
                            <Package className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-900">
                                €1.2M
                            </div>
                            <p className="mt-1 text-xs text-green-600">
                                +8.3% vs last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-red-800">
                                Slow Moving Items
                            </CardTitle>
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-900">
                                12
                            </div>
                            <p className="mt-1 text-xs text-red-600">
                                90+ days in inventory
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-800">
                                Avg Turnover Rate
                            </CardTitle>
                            <Zap className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-900">
                                6.1x
                            </div>
                            <p className="mt-1 text-xs text-blue-600">
                                Times per year
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-800">
                                Quick Sale Target
                            </CardTitle>
                            <Target className="h-5 w-5 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-900">
                                €280K
                            </div>
                            <p className="mt-1 text-xs text-purple-600">
                                60+ days old inventory
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Charts */}
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cash Flow Analysis</CardTitle>
                            <CardDescription>
                                Monthly income, expenses, and profit trends with
                                inventory value
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={chartConfig}
                                className="h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={cashFlow}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis yAxisId="left" />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                        />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <Bar
                                            yAxisId="left"
                                            dataKey="income"
                                            fill="#10b981"
                                        />
                                        <Bar
                                            yAxisId="left"
                                            dataKey="expenses"
                                            fill="#ef4444"
                                        />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="inventory"
                                            stroke="#f59e0b"
                                            strokeWidth={3}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Inventory Aging Analysis</CardTitle>
                            <CardDescription>
                                Distribution of inventory by age in stock
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{}} className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={agingInventory}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ range, count }) =>
                                                `${range}: ${count}`
                                            }
                                            outerRadius={120}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {agingInventory.map(
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
                                                                {data.range}
                                                            </p>
                                                            <p>
                                                                Count:{" "}
                                                                {data.count}{" "}
                                                                watches
                                                            </p>
                                                            <p>
                                                                Value: €
                                                                {data.value.toLocaleString()}
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
                </div>

                {/* Inventory by Brand */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Inventory Distribution by Brand</CardTitle>
                        <CardDescription>
                            Current stock levels, listings, and total values per
                            brand
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={inventoryByBrand}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="brand" />
                                    <YAxis yAxisId="left" />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                    />
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                    />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="inStock"
                                        fill="#10b981"
                                    />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="listed"
                                        fill="#3b82f6"
                                    />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="sold"
                                        fill="#f59e0b"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-amber-500" />
                                Most Valuable Inventory
                            </CardTitle>
                            <CardDescription>
                                Top watches by individual value
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-80 space-y-3 overflow-y-auto">
                                {valuableWatches.map((watch, index) => (
                                    <div
                                        key={watch.name}
                                        className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-slate-600">
                                                    #{index + 1}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">
                                                        {watch.name}
                                                    </p>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span
                                                            className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(watch.status)}`}
                                                        >
                                                            {watch.status}
                                                        </span>
                                                        <span
                                                            className={`text-xs font-medium ${getDaysColor(watch.days)}`}
                                                        >
                                                            {watch.days} days
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-slate-900">
                                                €{watch.value.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-500" />
                                Turnover Performance
                            </CardTitle>
                            <CardDescription>
                                Average turnover rates by watch category
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {turnoverRates.map((category, index) => (
                                    <div
                                        key={category.category}
                                        className="flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {category.category}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                {category.avgDays} avg days to
                                                sell
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-blue-600">
                                                {category.rate}x
                                            </div>
                                            <div className="text-xs text-slate-600">
                                                per year
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default DashboardC;
