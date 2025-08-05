import config from "@/app/config";
import { HtmlHTMLAttributes } from "react";


export default function ApplicationLogo(props: HtmlHTMLAttributes<HTMLImageElement>) {
    return (
        <img {...props}
            src={config.logo}
            alt={config.name}
            className="mx-auto mb-6 h-12"
        />
    );
}
