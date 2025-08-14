if (!Array.prototype.unique) {
    Array.prototype.unique = function <T>(this: T[], removeFalsy = true): T[] {
        const values = removeFalsy ? this.filter(Boolean) : this;
        return [...new Set(values)];
    };
}
