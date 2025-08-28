import { Button } from "@/components/ui/button";
import Link from "@/components/ui/Link";
import { Grid, List } from "lucide-react";

export default function WatchHeaderRight({
    viewMode,
    setViewMode,
}: {
    viewMode: "list" | "grid";
    setViewMode: (mode: "list" | "grid") => void;
}) {
    //complete state and consts list

    return (
        <div className="flex gap-4">
            <div className="flex h-[42px] rounded-lg border border-slate-300">
                <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-full rounded-r-none"
                >
                    <Grid className="h-4 w-4" />
                </Button>
                <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-full rounded-l-none"
                >
                    <List className="h-4 w-4" />
                </Button>
            </div>
            <Link href={route("watches.create")} className="flex items-center gap-2">
                <span className="text-lg">+</span>
                Add New Watch
            </Link>
        </div>
    );
}
