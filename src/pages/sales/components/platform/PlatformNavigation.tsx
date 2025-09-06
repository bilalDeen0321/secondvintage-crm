import Link from "@/components/ui/Link";
import { WatchResource } from "@/types/resources/watch";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { usePage } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PageProps = InertiaPageProps & {
    nextItem: Pick<WatchResource, "id" | "routeKey"> | null;
    prevItem: Pick<WatchResource, "id" | "routeKey"> | null;
};

export function PlatformNavigation() {
    const { nextItem, prevItem } = usePage<PageProps>().props;
    return (
        <>
            {prevItem && (
                <Link href={route("sales.show", prevItem.routeKey)} size="icon" variant="outline" className="fixed left-8 top-1/2 z-[60] -translate-y-1/2 transform border-2 bg-white shadow-lg hover:bg-gray-50" style={{ left: "calc(50vw - 600px - 60px)" }}>
                    <ChevronLeft className="h-5 w-5" />
                </Link>
            )}

            {nextItem && (
                <Link href={route("sales.show", nextItem.routeKey)} size="icon" variant="outline" className="fixed right-8 top-1/2 z-[60] -translate-y-1/2 transform border-2 bg-white shadow-lg hover:bg-gray-50" style={{ right: "calc(50vw - 600px - 60px)" }}>
                    <ChevronRight className="h-5 w-5" />
                </Link>
            )}
        </>
    );
}
