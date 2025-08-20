import Link from "@/components/ui/Link";
import { WatchResource } from "@/types/resources/watch";
import { usePage } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    nextItem?: WatchResource;
    previousItem?: WatchResource;
};

export default function WatchFormNavigation() {
    const { nextItem, previousItem } = usePage().props as Props;
    return (
        <>
            {previousItem && (
                <Link
                    type="button"
                    variant="outline"
                    size="sm"
                    href={route("watches.show", previousItem?.routeKey)}
                    className="absolute left-8 top-1/2 z-10 -translate-y-1/2 transform bg-white shadow-lg hover:bg-gray-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Link>
            )}

            {nextItem && (
                <Link
                    type="button"
                    variant="outline"
                    size="sm"
                    href={route("watches.show", nextItem?.routeKey)}
                    className="absolute right-8 top-1/2 z-10 -translate-y-1/2 transform bg-white shadow-lg hover:bg-gray-50"
                >
                    <ChevronRight className="h-4 w-4" />
                </Link>
            )}
        </>
    );
}
