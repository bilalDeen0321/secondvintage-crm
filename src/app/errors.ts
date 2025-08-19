// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getError(error: any) {

    // Server returned a response 
    if (error?.response?.data?.message) {
        return String(error?.response?.data?.message);
    }

    if (error?.response?.message) {
        return String(error?.response?.message);
    }

    if (error?.message) {
        return String(error?.message);
    }

    return String(error)
}