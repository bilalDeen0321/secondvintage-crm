import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

const Provider = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <TooltipProvider>
                <Toaster />
                <Sonner position="top-right" />
                {children}
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick={true}
                    pauseOnFocusLoss
                    pauseOnHover
                />
            </TooltipProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export default Provider;
