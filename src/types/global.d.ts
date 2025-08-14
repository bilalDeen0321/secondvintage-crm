import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { AxiosInstance } from "axios";
import { route as ziggyRoute } from "ziggy-js";
import { PageProps as AppPageProps } from "./";

declare global {
    interface Window {
        axios: AxiosInstance;
    }


    var route: typeof ziggyRoute;

    interface ReadonlyArray<T> {
        unique(removeFalsy?: boolean): T[];
    }
}

declare module "@inertiajs/core" {
    interface PageProps extends InertiaPageProps, AppPageProps { }
}

