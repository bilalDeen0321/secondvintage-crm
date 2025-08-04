import config from "@/app/config";
import { menus } from "@/app/menus";
import { Link, usePage } from "@inertiajs/react";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const SidebarContent = ({ onItemClick }: { onItemClick?: () => void }) => {
    const { url, props } = usePage();

    const menuItems = menus.filter((m) =>
        props.auth.permissions.includes(m.permission),
    );

    return (
        <>
            {/* Header */}
            <div className="border-b border-slate-700 p-6">
                <Link prefetch href="/" onClick={onItemClick}>
                    <img
                        src={config.logo}
                        alt={config.name}
                        className="mb-2 max-h-12 max-w-full cursor-pointer object-contain transition-opacity hover:opacity-80"
                    />
                </Link>
                <p className="text-sm text-slate-400">CRM System</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = url === item.path;

                        return (
                            <li key={item.name} className={item.opacity || ""}>
                                <Link
                                    prefetch
                                    href={item.path}
                                    onClick={onItemClick}
                                    className={`group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-slate-800 ${
                                        isActive
                                            ? "text-white shadow-lg"
                                            : "text-slate-300 hover:text-white"
                                    }`}
                                    style={{
                                        backgroundColor: isActive
                                            ? `hsl(var(--theme-sidebar-active))`
                                            : undefined,
                                    }}
                                >
                                    <Icon
                                        className={`mr-3 h-5 w-5 ${
                                            isActive
                                                ? "text-white"
                                                : "text-slate-400 group-hover:text-slate-300"
                                        }`}
                                    />
                                    <span className="truncate">
                                        {item.name}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="border-t border-slate-700 p-4">
                <Link
                    href={route("logout")}
                    className="flex w-full items-center rounded-lg px-3 py-3 text-slate-300 transition-all duration-200 hover:bg-slate-800 hover:text-white"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span>Logout</span>
                </Link>
            </div>
        </>
    );
};

const MobileSidebar = () => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="w-64 border-slate-700 p-0 text-white"
                style={{ backgroundColor: `hsl(var(--theme-sidebar-bg))` }}
            >
                <div className="flex min-h-full flex-col">
                    <SidebarContent onItemClick={() => setOpen(false)} />
                </div>
            </SheetContent>
        </Sheet>
    );
};

const Sidebar = () => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return <MobileSidebar />;
    }

    return (
        <div
            className="flex min-h-screen w-64 flex-col text-white"
            style={{ backgroundColor: `hsl(var(--theme-sidebar-bg))` }}
        >
            <SidebarContent />
        </div>
    );
};

export default Sidebar;
