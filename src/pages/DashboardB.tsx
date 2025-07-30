
import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, LineChart, Line, BarChart, Bar } from 'recharts';
import { TrendingUp, Globe, Eye, Heart, DollarSign, Clock } from 'lucide-react';

const DashboardB = () => {
  // Market trends data
  const marketTrends = [
    { month: 'Jan', rolex: 85, omega: 72, tagHeuer: 65, breitling: 58, iwc: 62 },
    { month: 'Feb', rolex: 88, omega: 75, tagHeuer: 68, breitling: 61, iwc: 65 },
    { month: 'Mar', rolex: 82, omega: 70, tagHeuer: 63, breitling: 55, iwc: 59 },
    { month: 'Apr', rolex: 92, omega: 78, tagHeuer: 71, breitling: 64, iwc: 68 },
    { month: 'May', rolex: 95, omega: 82, tagHeuer: 74, breitling: 67, iwc: 71 },
    { month: 'Jun', rolex: 98, omega: 85, tagHeuer: 77, breitling: 70, iwc: 74 },
  ];

  // Price vs demand scatter plot
  const priceVsDemand = [
    { price: 5000, demand: 85, brand: 'Omega', size: 120 },
    { price: 12000, demand: 95, brand: 'Rolex', size: 200 },
    { price: 3500, demand: 72, brand: 'TAG Heuer', size: 90 },
    { price: 7500, demand: 78, brand: 'Breitling', size: 110 },
    { price: 6000, demand: 74, brand: 'IWC', size: 100 },
    { price: 2800, demand: 65, brand: 'Seiko', size: 80 },
    { price: 15000, demand: 88, brand: 'Patek Philippe', size: 150 },
  ];

  // Geographic performance
  const geoPerformance = [
    { region: 'Sweden', sales: 45, revenue: 180000, growth: 12 },
    { region: 'Norway', sales: 32, revenue: 140000, growth: 8 },
    { region: 'Denmark', sales: 28, revenue: 125000, growth: 15 },
    { region: 'Finland', sales: 18, revenue: 85000, growth: 22 },
    { region: 'Germany', sales: 15, revenue: 75000, growth: 18 },
    { region: 'UK', sales: 12, revenue: 65000, growth: 25 },
  ];

  // Watch popularity radar chart
  const watchCategories = [
    { category: 'Luxury', value: 95 },
    { category: 'Sports', value: 78 },
    { category: 'Vintage', value: 88 },
    { category: 'Dress', value: 72 },
    { category: 'Diving', value: 85 },
    { category: 'Aviation', value: 68 },
  ];

  // Hourly website traffic
  const websiteTraffic = [
    { hour: '00:00', visitors: 12, conversions: 2 },
    { hour: '06:00', visitors: 8, conversions: 1 },
    { hour: '09:00', visitors: 45, conversions: 8 },
    { hour: '12:00', visitors: 67, conversions: 12 },
    { hour: '15:00', visitors: 52, conversions: 9 },
    { hour: '18:00', visitors: 78, conversions: 15 },
    { hour: '21:00', visitors: 89, conversions: 18 },
  ];

  const chartConfig = {
    rolex: { label: "Rolex", color: "#f59e0b" },
    omega: { label: "Omega", color: "#3b82f6" },
    tagHeuer: { label: "TAG Heuer", color: "#10b981" },
    breitling: { label: "Breitling", color: "#ef4444" },
    iwc: { label: "IWC", color: "#8b5cf6" },
  };

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Market Intelligence Dashboard</h1>
          <p className="text-slate-600 mt-1">Advanced analytics and market trends</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Market Sentiment</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">+18.2%</div>
              <p className="text-xs text-blue-600 mt-1">vs last quarter</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Global Reach</CardTitle>
              <Globe className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">6 Countries</div>
              <p className="text-xs text-green-600 mt-1">Active markets</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Page Views</CardTitle>
              <Eye className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">24.5K</div>
              <p className="text-xs text-purple-600 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-800">Wishlist Adds</CardTitle>
              <Heart className="h-5 w-5 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-900">342</div>
              <p className="text-xs text-pink-600 mt-1">+12% this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts */}
        <Tabs defaultValue="trends" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Market Trends</TabsTrigger>
            <TabsTrigger value="demand">Price vs Demand</TabsTrigger>
            <TabsTrigger value="geography">Geographic</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Market Performance</CardTitle>
                <CardDescription>Trending scores for luxury watch brands over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="rolex" stackId="1" stroke="#f59e0b" fill="#fef3c7" />
                      <Area type="monotone" dataKey="omega" stackId="1" stroke="#3b82f6" fill="#dbeafe" />
                      <Area type="monotone" dataKey="tagHeuer" stackId="1" stroke="#10b981" fill="#d1fae5" />
                      <Area type="monotone" dataKey="breitling" stackId="1" stroke="#ef4444" fill="#fee2e2" />
                      <Area type="monotone" dataKey="iwc" stackId="1" stroke="#8b5cf6" fill="#ede9fe" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demand" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Price vs Market Demand</CardTitle>
                <CardDescription>Relationship between watch pricing and market demand (bubble size = market share)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={priceVsDemand}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="price" name="Price (€)" />
                      <YAxis dataKey="demand" name="Demand Score" />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload[0]) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                                <p className="font-semibold">{data.brand}</p>
                                <p>Price: €{data.price.toLocaleString()}</p>
                                <p>Demand: {data.demand}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Scatter dataKey="demand" fill="#3b82f6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geography" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Performance</CardTitle>
                <CardDescription>Sales performance by region with growth indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={geoPerformance} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="region" type="category" width={80} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Watch Category Performance</CardTitle>
                  <CardDescription>Popularity scores across different watch categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={watchCategories}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Website Traffic & Conversions</CardTitle>
                  <CardDescription>Hourly visitor patterns and conversion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={websiteTraffic}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line yAxisId="left" type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={3} />
                        <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Regions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geoPerformance.slice(0, 4).map((region, index) => (
                  <div key={region.region} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-600">#{index + 1}</span>
                      <span className="font-medium">{region.region}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">+{region.growth}%</div>
                      <div className="text-xs text-slate-600">{region.sales} sales</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Rolex maintains market leadership</p>
                    <p className="text-sm text-slate-600">98% trend score this month</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Vintage category growing</p>
                    <p className="text-sm text-slate-600">88% popularity score</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Nordic markets expanding</p>
                    <p className="text-sm text-slate-600">+15% average growth</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full p-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Generate Market Report
                </button>
                <button className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                  Export Analytics Data
                </button>
                <button className="w-full p-3 bg-slate-100 text-slate-900 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                  Schedule Price Update
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardB;
