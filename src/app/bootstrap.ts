import axios from "axios";

export function setupAxios(instance: typeof axios) {
    // Base URL (Laravel API or same domain)
    instance.defaults.baseURL = import.meta.env.VITE_APP_URL || "/";

    // Default headers
    instance.defaults.headers.common["Accept"] = "application/json";
    instance.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

    // Laravel CSRF Token
    const token = document.querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

    if (token) {
        instance.defaults.headers.common["X-CSRF-TOKEN"] = token;
    }

    // Send cookies with requests (for sanctum/session auth)
    instance.defaults.withCredentials = true;

    // Optional: Interceptor for request logging / auth injection
    instance.interceptors.request.use(
        (config) => {
            // Example: attach bearer token if stored in localStorage
            const authToken = localStorage.getItem("auth_token");
            if (authToken) {
                config.headers.Authorization = `Bearer ${authToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Optional: Interceptor for response error handling
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            // Handle Laravel validation errors
            if (error.response?.status === 422) {
                console.error("Validation Errors:", error.response.data.errors);
            }

            // Handle Laravel unauthenticated redirect
            if (error.response?.status === 401) {
                window.location.href = route("login");
            }

            return Promise.reject(error);
        }
    );
}
