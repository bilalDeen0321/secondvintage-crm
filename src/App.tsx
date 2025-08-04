/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import AgentWatches from "./pages/AgentWatches";
import Login from "./pages/Auth/Login";
import BatchManagement from "./pages/BatchManagement";
import Dashboard from "./pages/Dashboard";
import DashboardB from "./pages/DashboardB";
import DashboardC from "./pages/DashboardC";
import FullDataView from "./pages/FullDataView";
import Invoices from "./pages/Invoices";
import Log from "./pages/Log";
import MultiplatformSales from "./pages/MultiplatformSales";
import NotFound from "./pages/NotFound";
import PerformanceTracking from "./pages/PerformanceTracking";
import Promote from "./pages/Promote";
import SalesHistory from "./pages/SalesHistory";
import Sellers from "./pages/Sellers";
import Settings from "./pages/Settings";
import Tools from "./pages/Tools";
import Users from "./pages/Users";
import VendorPayments from "./pages/VendorPayments";
import WatchManagement from "./pages/WatchManagement";
import WishList from "./pages/WishList";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard-b" element={<DashboardB />} />
                        <Route path="/dashboard-c" element={<DashboardC />} />
                        <Route path="/watches" element={<WatchManagement />} />
                        <Route path="/sales" element={<MultiplatformSales />} />
                        <Route path="/promote" element={<Promote />} />
                        <Route path="/wishlist" element={<WishList />} />
                        <Route path="/data" element={<FullDataView />} />
                        <Route path="/batch" element={<BatchManagement />} />
                        <Route path="/history" element={<SalesHistory />} />
                        <Route
                            path="/performance"
                            element={<PerformanceTracking />}
                        />
                        <Route path="/payments" element={<VendorPayments />} />
                        <Route
                            path="/agent-watches"
                            element={<AgentWatches />}
                        />
                        <Route path="/sellers" element={<Sellers />} />
                        <Route path="/invoices" element={<Invoices />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/tools" element={<Tools />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/log" element={<Log />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export default App;
