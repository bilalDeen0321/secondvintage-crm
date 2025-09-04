/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

type DownloadOptions = AxiosRequestConfig & {
    filename?: string; // optional fallback filename
    onStart?: () => void;
    onSuccess?: (response: AxiosResponse) => void;
    onError?: (error: AxiosError | Error) => void;
    onFinish?: (response?: AxiosResponse, request?: AxiosRequestConfig) => void;
};

/**
 * Helper to download a file only when ready, otherwise behaves as normal request.
 */
export async function downloadFile(
    url: string,
    data: Record<string, any> = {},
    options: DownloadOptions = {}
) {
    if (options?.onStart) options.onStart();

    const {
        method = "POST",
        filename: fallbackFilename = "download",
        onSuccess,
        onError,
        onFinish,
        ...axiosConfig
    } = options;

    let response: AxiosResponse | undefined;

    try {
        const config: AxiosRequestConfig =
            method.toUpperCase() === "GET"
                ? { params: data }
                : { data };

        response = await axios.request({
            url,
            method,
            responseType: "blob",
            ...config,
            ...axiosConfig,
        });

        const disposition = response.headers["content-disposition"];

        // Only trigger download if server sent Content-Disposition: attachment
        if (disposition && disposition.includes("attachment") && response.data?.size > 0) {
            // Determine filename
            let filename = fallbackFilename;
            const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (match && match[1]) filename = match[1].replace(/['"]/g, "");

            // Trigger download
            const blob = new Blob([response.data], { type: response.headers["content-type"] });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();

            if (onSuccess) onSuccess(response);
        } else {
            // Normal response (not ready to download)
            if (onSuccess) onSuccess(response);
        }
    } catch (error: any) {
        if (onError) onError(error);
        else console.error("Request failed:", error);
    } finally {
        if (onFinish) onFinish(response, options);
    }
}
