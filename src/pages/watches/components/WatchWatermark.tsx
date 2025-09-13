import { getError } from "@/app/errors";
import { WatchResource } from "@/types/resources/watch";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
    watch?: WatchResource;
};

type WatchResourceWithAuthors = WatchResource & {
    seller?: { id: number; name: string };
    agent?: { id: number; name: string };
};

export default function WatchWatermark({ watch: initialWatch }: Props) {
    const [loading, setLoading] = useState(false);
    const [watch, setWatch] = useState<WatchResourceWithAuthors | undefined>(initialWatch);

    useEffect(() => {
        if (!initialWatch?.routeKey) return;
        setLoading(true);
        axios
            .get(route("api.watches.with-authors", initialWatch.routeKey))
            .then((res) => setWatch(res.data))
            .catch((err) => toast.error(getError(err)))
            .finally(() => setLoading(false));
    }, [initialWatch.routeKey]);

    if (!watch?.routeKey) return null;
    if (loading) return <div>Loading...</div>;

    const watermarkItems = [
        { role: "Edited by", name: "Admin", date: watch.updated_at },
        { role: "Seller", name: watch.seller?.name },
        { role: "Agent", name: watch.agent?.name },
    ].filter((item) => item.name);

    return (
        <div className="mt-2 text-xs text-slate-500">
            {watermarkItems.map((item, index) => (
                <span key={index}>
                    {index > 0 && " | "}
                    {item.role} <strong>{item.name}</strong>
                    {item.date && ` on ${new Date(item.date).toLocaleDateString()}`}
                </span>
            ))}
        </div>
    );
}
