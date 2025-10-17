import { echo } from "@/app/echo";
import Loading from "@/components/Loading";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { WatchResource } from "@/types/resources/watch";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function WatchDescription({ watch }: { watch: WatchResource }) {

    const [aiStatus, setAiStatus] = useState<string | null>(watch.ai_status);
    const [aiMessage, setAiMessage] = useState<string | null>(watch.ai_message);
    const [description, setDescription] = useState<string | null>(watch?.description);

    useEffect(() => {
        if (watch?.routeKey) {
            const eventName = 'WatchAiDescriptionProcessedEvent';
            echo.listen(`watch.${watch.routeKey}`, eventName, (event: WatchResource) => {
                console.log('WatchAiDescriptionProcessedEvent received:', event);
                
                if (event?.ai_status === "success") {
                    loadDescription(watch.routeKey, description => setDescription(description));
                }

                setAiStatus(event?.ai_status);
                setAiMessage(event?.ai_message)
                // setDescription(event?.description)
            })
            return () => echo.leave(`watch.${watch.routeKey}`);
        }
    }, [watch?.routeKey]);

    if (aiStatus === 'loading') {
        return <Loading />;
    }

    if (aiStatus === 'failed') {
        return <WatchAiDescriptionError message={aiMessage} />;
    }

    return description || '-';
}


export function loadDescription(routeKey, callback) {
    axios.post(route("api.make-hooks.ai-description.load"), { routeKey })
        .then(({ data }) => {
            if (data.status === "success") callback(data.description);
            else toast.error(data.message || "Failed to load description.");
        })
        .catch(() => toast.error("Something went wrong."));
}

function loadDescription2(data, setData) {
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    fetch(route("api.make-hooks.ai-description.load"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-CSRF-TOKEN": token,
        },
        body: JSON.stringify({ routeKey: data.routeKey }),
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") setData("description", json.description);
        else toast.error(json.message || "Failed to load description.");
    })
    .catch(() => toast.error("Something went wrong."));
}

export function WatchAiDescriptionError({ message }: { message: string }) {
    return <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50 hover:text-red-800"
            >
                <AlertTriangle className="h-5 w-5" />
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600">
                    AI Description Error
                </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="overflow-auto">
                {message}
            </AlertDialogDescription>
            <AlertDialogFooter>
                <AlertDialogAction>
                    OK
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}