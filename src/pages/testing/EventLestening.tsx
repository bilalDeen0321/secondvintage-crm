import { echo } from "@/app/echo";
import { useEffect, useState } from "react";



export default function EventLestening() {
    const [logs, setLogs] = useState(["Listening..."]);

    useEffect(() => {
        // Subscribe to channel and event
        const channel = echo.channel("testing");

        channel.listen("TestingEvent", (data) => {
            setLogs((prevLogs) => [...prevLogs, toBeString(data)]);
        });

        // Cleanup when component unmounts
        return () => {
            channel.stopListening("TestingEvent");
        };
    }, []);

    const toBeString = (data) => {
        if (typeof data === "object") {
            return JSON.stringify(data);
        }
        return String(data ?? "Just received empty message.");
    };

    return (
        <div className="p-4">
            <h1 className="text-lg font-bold mb-2">Event Listening (React)</h1>
            <div className="space-y-1">
                {logs.map((log, i) => (
                    <div key={i} className="text-sm bg-gray-100 p-2 rounded">
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
}
