import { getError } from "@/app/errors";
import { WatchResource } from "@/types/resources/watch";
import axios from "axios";
import { toast } from "react-toastify";
import { PlatformField } from "./_actions";

export const fetchPlatformData = (async (watchKey: WatchResource['routeKey'], platform: string) => {
    try {
        const response = await axios.get(route("platform-data.fetch", watchKey),
            { params: { platform } },
        );
        console.log("Fetched platform data:", response.data);
        return (response.data?.data || []) as PlatformField[];
    } catch (error) {
        toast.error(getError(error));
    }

    return [];
});