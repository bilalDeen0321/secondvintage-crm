import { WatchResource } from "@/types/resources/watch";

export default function WatchTableNote({ watch }: { watch: WatchResource }) {
    return (
        <div
            className="line-clamp-2 text-xs leading-tight text-slate-600"
            style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
            }}
            title={watch.notes}
        >
            {watch.notes || "-"}
        </div>
    );
}
