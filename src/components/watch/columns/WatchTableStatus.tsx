import Status from "@/app/models/Status";
import { WatchResource } from "@/types/resources/watch";

export default function WatchTableStatus({ watch }: { watch: WatchResource }) {
    return <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${Status.toColorClass(watch.status)}`}
    >
        {Status.toHuman(watch.status)}
    </span>
}
