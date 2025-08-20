import { echo } from "@/app/echo";
import Loading from "@/components/Loading";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { WatchResource } from "@/types/resources/watch";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export default function WatchDescription({ watch }: { watch: WatchResource }) {

    const [aiStatus, setAiStatus] = useState<string | null>(watch.ai_status);

    useEffect(() => {
        echo.listen(`watch.${watch.routeKey}`, 'WatchAiDescriptionProcessedEvent', (event) => {
            setAiStatus(event.ai_status);
            console.log(event)
        })
        return () => echo.leave(`watch.${watch.routeKey}`);
    }, [watch.routeKey]);

    if (aiStatus === 'loading') {
        return <Loading />;
    }

    if (aiStatus === 'failed') {
        return <WatchAiDescriptionError watch={watch} />;
    }

    return watch.description || '-';
}


export function WatchAiDescriptionError({ watch }: { watch: WatchResource }) {
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
                <AlertDialogDescription>{watch.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction>
                    OK
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}