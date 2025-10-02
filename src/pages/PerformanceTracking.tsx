import { Badge } from "@/components/ui/badge";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Head } from "@inertiajs/react";
import { Award, Star, Target, TrendingUp, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import Layout from "../components/Layout";

interface PerformanceData {
    watchName: string;
    brand: string;
    sku: string;
    totalSold: number;
    totalRevenue: number;
    totalProfit: number;
    avgProfitMargin: number;
    highestSalePrice: number;
    avgSalePrice: number;
    daysToSell: number;
    performanceScore: number;
}

interface BrandPerformance {
    brand: string;
    totalWatchesSold: number;
    totalRevenue: number;
    totalProfit: number;
    avgProfitMargin: number;
    avgDaysToSell: number;
    performanceScore: number;
}

const PerformanceTracking = () => {
    // Sample performance data for individual watches
    const [watchPerformance] = useState<PerformanceData[]>([
        {
            watchName: "Rolex Submariner 116610LN",
            brand: "Rolex",
            sku: "ROL-SUB-001",
            totalSold: 3,
            totalRevenue: 37500,
            totalProfit: 12000,
            avgProfitMargin: 32.0,
            highestSalePrice: 12500,
            avgSalePrice: 12500,
            daysToSell: 15,
            performanceScore: 95,
        },
        {
            watchName: "Omega Speedmaster Professional",
            brand: "Omega",
            sku: "OME-SPE-002",
            totalSold: 5,
            totalRevenue: 24000,
            totalProfit: 8000,
            avgProfitMargin: 33.3,
            highestSalePrice: 4800,
            avgSalePrice: 4800,
            daysToSell: 12,
            performanceScore: 88,
        },
        {
            watchName: "TAG Heuer Monaco",
            brand: "TAG Heuer",
            sku: "TAG-MON-003",
            totalSold: 2,
            totalRevenue: 8400,
            totalProfit: 2800,
            avgProfitMargin: 33.3,
            highestSalePrice: 4200,
            avgSalePrice: 4200,
            daysToSell: 18,
            performanceScore: 82,
        },
        {
            watchName: "Breitling Navitimer",
            brand: "Breitling",
            sku: "BRE-NAV-004",
            totalSold: 4,
            totalRevenue: 26000,
            totalProfit: 9200,
            avgProfitMargin: 35.4,
            highestSalePrice: 6500,
            avgSalePrice: 6500,
            daysToSell: 10,
            performanceScore: 92,
        },
        {
            watchName: "IWC Pilot Mark XVIII",
            brand: "IWC",
            sku: "IWC-PIL-005",
            totalSold: 3,
            totalRevenue: 17400,
            totalProfit: 6000,
            avgProfitMargin: 34.5,
            highestSalePrice: 5800,
            avgSalePrice: 5800,
            daysToSell: 14,
            performanceScore: 85,
        },
    ]);

    // Calculate brand performance
    const brandPerformance = useMemo(() => {
        const brandMap = new Map<string, BrandPerformance>();

        watchPerformance.forEach((watch) => {
            if (!brandMap.has(watch.brand)) {
                brandMap.set(watch.brand, {
                    brand: watch.brand,
                    totalWatchesSold: 0,
                    totalRevenue: 0,
                    totalProfit: 0,
                    avgProfitMargin: 0,
                    avgDaysToSell: 0,
                    performanceScore: 0,
                });
            }

            const brand = brandMap.get(watch.brand)!;
            brand.totalWatchesSold += watch.totalSold;
            brand.totalRevenue += watch.totalRevenue;
            brand.totalProfit += watch.totalProfit;
        });

        // Calculate averages and scores
        brandMap.forEach((brand) => {
            const brandWatches = watchPerformance.filter(
                (w) => w.brand === brand.brand,
            );
            brand.avgProfitMargin =
                brandWatches.reduce((sum, w) => sum + w.avgProfitMargin, 0) /
                brandWatches.length;
            brand.avgDaysToSell =
                brandWatches.reduce((sum, w) => sum + w.daysToSell, 0) /
                brandWatches.length;
            brand.performanceScore =
                brandWatches.reduce((sum, w) => sum + w.performanceScore, 0) /
                brandWatches.length;
        });

        return Array.from(brandMap.values()).sort(
            (a, b) => b.performanceScore - a.performanceScore,
        );
    }, [watchPerformance]);

    // Top performers
    const topWatches = useMemo(() => {
        return [...watchPerformance]
            .sort((a, b) => b.performanceScore - a.performanceScore)
            .slice(0, 5);
    }, [watchPerformance]);

    const topBrands = useMemo(() => {
        return brandPerformance.slice(0, 3);
    }, [brandPerformance]);

    // Chart data for performance over time
    const performanceOverTime = useMemo(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        return months.map((month) => ({
            month,
            avgScore: Math.floor(Math.random() * 20) + 75,
            totalProfit: Math.floor(Math.random() * 15000) + 8000,
        }));
    }, []);

    const chartConfig = {
        avgScore: { label: "Avg Performance Score", color: "#8884d8" },
        totalProfit: { label: "Total Profit", color: "#82ca9d" },
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return "bg-green-100 text-green-800";
        if (score >= 80) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    const getScoreIcon = (score: number) => {
        if (score >= 90) return Trophy;
        if (score >= 80) return Award;
        return Target;
    };

    return (
        <Layout>
            <Head title="SV - Performance Tracking" />
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Performance Tracking
                    </h1>
                    <p className="mt-1 text-slate-600">
                        High scores and profit analytics for watches and brands
                    </p>
                </div>

                {/* High Score Cards */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-amber-800">
                                Top Performing Watch
                            </CardTitle>
                            <Trophy className="h-5 w-5 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold text-amber-900">
                                {topWatches[0]?.watchName}
                            </div>
                            <div className="text-2xl font-bold text-amber-800">
                                {topWatches[0]?.performanceScore} pts
                            </div>
                            <p className="mt-1 text-xs text-amber-600">
                                €{topWatches[0]?.totalProfit.toLocaleString()}{" "}
                                total profit
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-800">
                                Top Brand
                            </CardTitle>
                            <Star className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold text-blue-900">
                                {topBrands[0]?.brand}
                            </div>
                            <div className="text-2xl font-bold text-blue-800">
                                {Math.round(topBrands[0]?.performanceScore)} pts
                            </div>
                            <p className="mt-1 text-xs text-blue-600">
                                {topBrands[0]?.totalWatchesSold} watches sold
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-800">
                                Highest Profit Margin
                            </CardTitle>
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold text-green-900">
                                {
                                    watchPerformance.sort(
                                        (a, b) =>
                                            b.avgProfitMargin -
                                            a.avgProfitMargin,
                                    )[0]?.watchName
                                }
                            </div>
                            <div className="text-2xl font-bold text-green-800">
                                {watchPerformance
                                    .sort(
                                        (a, b) =>
                                            b.avgProfitMargin -
                                            a.avgProfitMargin,
                                    )[0]
                                    ?.avgProfitMargin.toFixed(1)}
                                %
                            </div>
                            <p className="mt-1 text-xs text-green-600">
                                profit margin
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Charts */}
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Over Time</CardTitle>
                            <CardDescription>
                                Average performance scores and profit trends
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={chartConfig}
                                className="h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={performanceOverTime}>
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
                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="avgScore"
                                            stroke="var(--color-avgScore)"
                                            strokeWidth={3}
                                        />
                                        <Bar
                                            yAxisId="right"
                                            dataKey="totalProfit"
                                            fill="var(--color-totalProfit)"
                                            opacity={0.6}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Brand Performance Comparison</CardTitle>
                            <CardDescription>
                                Total profit by brand
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={{
                                    profit: {
                                        label: "Profit",
                                        color: "#8884d8",
                                    },
                                }}
                                className="h-[300px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={brandPerformance}
                                        layout="horizontal"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis
                                            type="category"
                                            dataKey="brand"
                                            width={80}
                                        />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <Bar
                                            dataKey="totalProfit"
                                            fill="#8884d8"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Performing Watches */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            Top Performing Watches
                        </CardTitle>
                        <CardDescription>
                            Highest scoring watches based on profit, sales
                            speed, and margins
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Watch Name</TableHead>
                                    <TableHead>Brand</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Units Sold</TableHead>
                                    <TableHead>Total Revenue</TableHead>
                                    <TableHead>Total Profit</TableHead>
                                    <TableHead>Avg Margin</TableHead>
                                    <TableHead>Avg Days to Sell</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {topWatches.map((watch, index) => {
                                    const ScoreIcon = getScoreIcon(
                                        watch.performanceScore,
                                    );
                                    return (
                                        <TableRow key={watch.sku}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-slate-600">
                                                        #{index + 1}
                                                    </span>
                                                    {index < 3 && (
                                                        <ScoreIcon className="h-4 w-4 text-amber-500" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {watch.watchName}
                                            </TableCell>
                                            <TableCell>{watch.brand}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getScoreColor(
                                                        watch.performanceScore,
                                                    )}
                                                >
                                                    {watch.performanceScore}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {watch.totalSold}
                                            </TableCell>
                                            <TableCell>
                                                €
                                                {watch.totalRevenue.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="font-semibold text-green-600">
                                                €
                                                {watch.totalProfit.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {watch.avgProfitMargin.toFixed(
                                                    1,
                                                )}
                                                %
                                            </TableCell>
                                            <TableCell>
                                                {watch.daysToSell} days
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Brand Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-blue-500" />
                            Brand Performance Rankings
                        </CardTitle>
                        <CardDescription>
                            Overall performance metrics by brand
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Brand</TableHead>
                                    <TableHead>Performance Score</TableHead>
                                    <TableHead>Total Watches Sold</TableHead>
                                    <TableHead>Total Revenue</TableHead>
                                    <TableHead>Total Profit</TableHead>
                                    <TableHead>Avg Profit Margin</TableHead>
                                    <TableHead>Avg Days to Sell</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {brandPerformance.map((brand, index) => {
                                    const ScoreIcon = getScoreIcon(
                                        brand.performanceScore,
                                    );
                                    return (
                                        <TableRow key={brand.brand}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg font-bold text-slate-600">
                                                        #{index + 1}
                                                    </span>
                                                    {index < 3 && (
                                                        <ScoreIcon className="h-4 w-4 text-blue-500" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-lg font-medium">
                                                {brand.brand}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getScoreColor(
                                                        Math.round(
                                                            brand.performanceScore,
                                                        ),
                                                    )}
                                                >
                                                    {Math.round(
                                                        brand.performanceScore,
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {brand.totalWatchesSold}
                                            </TableCell>
                                            <TableCell>
                                                €
                                                {brand.totalRevenue.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="font-semibold text-green-600">
                                                €
                                                {brand.totalProfit.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {brand.avgProfitMargin.toFixed(
                                                    1,
                                                )}
                                                %
                                            </TableCell>
                                            <TableCell>
                                                {Math.round(
                                                    brand.avgDaysToSell,
                                                )}{" "}
                                                days
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default PerformanceTracking;
