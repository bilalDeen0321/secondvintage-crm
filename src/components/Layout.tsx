import { usePage } from "@inertiajs/react";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useIsMobile } from "../hooks/use-mobile";
import Sidebar from "./Sidebar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const isMobile = useIsMobile();

    const { props } = usePage();

    useEffect(() => {
        const { flash, errors } = { flash: props?.flash, errors: props?.errors };

        if (flash?.success) toast.success(flash.success);
        if (flash?.info) toast.info(flash.info);
        if (flash?.error) toast.error(flash.error);
        if (flash?.warning) toast.error(flash.warning);
        if (flash?.message) toast(flash.message, { type: flash.status || "info" });

        const errorKeys = Object.keys(errors || {});
        if (errorKeys.length > 0) toast.error(errors[errorKeys[0]]);
    }, [props.flash, props.errors]);

    return (
        <div className="flex min-h-screen bg-background">
            {!isMobile && <Sidebar />}
            <div className="flex flex-1 flex-col">
                {isMobile && (
                    <header className="flex items-center justify-between border-b border-border bg-card p-4 lg:hidden">
                        <div className="flex items-center space-x-3">
                            <Sidebar />
                            <img src="/lovable-uploads/514150da-8678-460a-bcbc-ee548d8d6098.png" alt="Second Vintage" className="h-8 object-contain" />
                        </div>
                    </header>
                )}
                <main className="flex-1 bg-background">{children}</main>
            </div>
        </div>
    );
};

export default Layout;
