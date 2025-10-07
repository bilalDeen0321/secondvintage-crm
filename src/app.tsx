import './app/global';
import "./index.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";
import Provider from "./Provider";

const appName = import.meta.env.VITE_APP_NAME || "";

createInertiaApp({
    title: (title) => `${title || "Home"}  ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob("./pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(
                el,
                <Provider>
                    <App {...props} />
                </Provider>,
            );
            return;
        }

        createRoot(el).render(
            <Provider>
                <App {...props} />
            </Provider>,
        );
    },
    progress: {
        color: "#4B5563",
    },
});
