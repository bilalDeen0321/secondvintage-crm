export { };

declare global {
    interface Array<T> {
        unique(removeFalsy?: boolean): T[];
    }
}
