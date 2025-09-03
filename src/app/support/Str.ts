/* eslint-disable @typescript-eslint/no-explicit-any */

import { readonly } from "../utils";

/**
 * String utility class providing various string manipulation methods
 */
class Str {
    /**
     * The cache of snake-cased words.
     */
    private static snakeCache: Record<string, Record<string, string>> = {};

    /**
     * The cache of camel-cased words.
     */
    private static camelCache: Record<string, string> = {};

    /**
     * The cache of studly-cased words.
     */
    private static studlyCache: Record<string, string> = {};

    /**
     * The callback that should be used to generate random strings.
     */
    private static randomStringFactory: ((length: number) => string) | null = null;

    /**
     * Return the remainder of a string after the first occurrence of a given value.
     */
    public static after(subject: string, search: string): string {
        if (search === '') return subject;
        const index = subject.indexOf(search);
        return index === -1 ? subject : subject.substring(index + search.length);
    }

    /**
     * Return the remainder of a string after the last occurrence of a given value.
     */
    public static afterLast(subject: string, search: string): string {
        if (search === '') return subject;
        const index = subject.lastIndexOf(search);
        return index === -1 ? subject : subject.substring(index + search.length);
    }

    /**
     * Get the portion of a string before the first occurrence of a given value.
     */
    public static before(subject: string, search: string): string {
        if (search === '') return subject;
        const index = subject.indexOf(search);
        return index === -1 ? subject : subject.substring(0, index);
    }

    /**
     * Get the portion of a string before the last occurrence of a given value.
     */
    public static beforeLast(subject: string, search: string): string {
        if (search === '') return subject;
        const index = subject.lastIndexOf(search);
        return index === -1 ? subject : subject.substring(0, index);
    }

    /**
     * Get the portion of a string between two given values.
     */
    public static between(subject: string, from: string, to: string): string {
        if (from === '' || to === '') return subject;
        return this.beforeLast(this.after(subject, from), to);
    }

    /**
     * Get the smallest possible portion of a string between two given values.
     */
    public static betweenFirst(subject: string, from: string, to: string): string {
        if (from === '' || to === '') return subject;
        return this.before(this.after(subject, from), to);
    }

    /**
     * Convert a value to camel case.
     */
    public static camel(value: string): string {
        if (this.camelCache[value]) {
            return this.camelCache[value];
        }
        return this.camelCache[value] = this.lcfirst(this.studly(value));
    }

    /**
     * Get the character at the specified index.
     */
    public static charAt(subject: string, index: number): string | false {
        const length = subject.length;
        if (index < 0 ? index < -length : index > length - 1) {
            return false;
        }
        return subject.charAt(index < 0 ? length + index : index);
    }

    /**
     * Remove the given string(s) if it exists at the start of the haystack.
     */
    public static chopStart(subject: string, needle: string | string[]): string {
        const needles = Array.isArray(needle) ? needle : [needle];
        for (const n of needles) {
            if (subject.startsWith(n)) {
                return subject.substring(n.length);
            }
        }
        return subject;
    }

    /**
     * Remove the given string(s) if it exists at the end of the haystack.
     */
    public static chopEnd(subject: string, needle: string | string[]): string {
        const needles = Array.isArray(needle) ? needle : [needle];
        for (const n of needles) {
            if (subject.endsWith(n)) {
                return subject.substring(0, subject.length - n.length);
            }
        }
        return subject;
    }

    /**
     * Determine if a given string contains a given substring.
     */
    public static contains(haystack: string | null, needles: string | string[], ignoreCase = false): boolean {
        if (haystack === null) return false;

        if (ignoreCase) {
            haystack = haystack.toLowerCase();
        }

        const needleArray = Array.isArray(needles) ? needles : [needles];

        for (const needle of needleArray) {
            const searchNeedle = ignoreCase ? needle.toLowerCase() : needle;
            if (searchNeedle !== '' && haystack.includes(searchNeedle)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Determine if a given string contains all array values.
     */
    public static containsAll(haystack: string, needles: string[], ignoreCase = false): boolean {
        for (const needle of needles) {
            if (!this.contains(haystack, needle, ignoreCase)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Determine if a given string doesn't contain a given substring.
     */
    public static doesntContain(haystack: string | null, needles: string | string[], ignoreCase = false): boolean {
        return !this.contains(haystack, needles, ignoreCase);
    }

    /**
     * Determine if a given string ends with a given substring.
     */
    public static endsWith(haystack: string | null, needles: string | string[]): boolean {
        if (haystack === null) return false;

        const needleArray = Array.isArray(needles) ? needles : [needles];

        for (const needle of needleArray) {
            if (needle !== '' && haystack.endsWith(needle)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Determine if a given string doesn't end with a given substring.
     */
    public static doesntEndWith(haystack: string | null, needles: string | string[]): boolean {
        return !this.endsWith(haystack, needles);
    }

    /**
     * Cap a string with a single instance of a given value.
     */
    public static finish(value: string, cap: string): string {
        const escaped = cap.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(?:${escaped})+$`);
        return value.replace(regex, '') + cap;
    }

    /**
     * Determine if a given string matches a given pattern.
     */
    public static is(pattern: string | string[], value: string, ignoreCase = false): boolean {
        const patterns = Array.isArray(pattern) ? pattern : [pattern];

        for (const p of patterns) {
            if (p === '*' || p === value) {
                return true;
            }

            if (ignoreCase && p.toLowerCase() === value.toLowerCase()) {
                return true;
            }

            // Convert wildcard pattern to regex
            const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*');
            const flags = ignoreCase ? 'i' : '';
            const regex = new RegExp(`^${escaped}$`, flags);

            if (regex.test(value)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Determine if a given value is valid JSON.
     */
    public static isJson(value: any): boolean {
        if (typeof value !== 'string') return false;

        try {
            JSON.parse(value);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Determine if a given value is a valid URL.
     */
    public static isUrl(value: any): boolean {
        if (typeof value !== 'string') return false;

        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Determine if a given value is a valid UUID.
     */
    public static isUuid(value: any): boolean {
        if (typeof value !== 'string') return false;

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }

    /**
     * Convert a string to kebab case.
     */
    public static kebab(value: string): string {
        return this.snake(value, '-');
    }

    /**
     * Return the length of the given string.
     */
    public static length(value: string): number {
        return value.length;
    }

    /**
     * Limit the number of characters in a string.
     */
    public static limit(value: string, limit = 100, end = '...'): string {
        if (value.length <= limit) {
            return value;
        }
        return value.substring(0, limit).trimEnd() + end;
    }

    /**
     * Convert the given string to lower-case.
     */
    public static lower(value: string): string {
        return value.toLowerCase();
    }

    /**
     * Limit the number of words in a string.
     */
    public static words(value: string, words = 100, end = '...'): string {
        const wordArray = value.trim().split(/\s+/);
        if (wordArray.length <= words) {
            return value;
        }
        return wordArray.slice(0, words).join(' ') + end;
    }

    /**
     * Get the string matching the given pattern.
     */
    public static match(pattern: string, subject: string): string {
        const regex = new RegExp(pattern);
        const matches = subject.match(regex);
        if (!matches) return '';
        return matches[1] || matches[0];
    }

    /**
     * Remove all non-numeric characters from a string.
     */
    public static numbers(value: string): string {
        return value.replace(/[^0-9]/g, '');
    }

    /**
     * Pad both sides of a string with another.
     */
    public static padBoth(value: string, length: number, pad = ' '): string {
        const totalPadding = Math.max(0, length - value.length);
        const leftPadding = Math.floor(totalPadding / 2);
        const rightPadding = totalPadding - leftPadding;
        return pad.repeat(leftPadding) + value + pad.repeat(rightPadding);
    }

    /**
     * Pad the left side of a string with another.
     */
    public static padLeft(value: string, length: number, pad = ' '): string {
        return value.padStart(length, pad);
    }

    /**
     * Pad the right side of a string with another.
     */
    public static padRight(value: string, length: number, pad = ' '): string {
        return value.padEnd(length, pad);
    }

    /**
     * Generate a more truly "random" alpha-numeric string.
     */
    public static random(length = 16): string {
        if (this.randomStringFactory) {
            return this.randomStringFactory(length);
        }

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Replace the given value in the given string.
     */
    public static replace(search: string | string[], replace: string | string[], subject: string): string {
        if (Array.isArray(search) && Array.isArray(replace)) {
            let result = subject;
            for (let i = 0; i < search.length; i++) {
                const replaceValue = replace[i] || '';
                result = result.split(search[i]).join(replaceValue);
            }
            return result;
        }

        const searchStr = Array.isArray(search) ? search[0] : search;
        const replaceStr = Array.isArray(replace) ? replace[0] : replace;
        return subject.split(searchStr).join(replaceStr);
    }

    /**
     * Replace the first occurrence of a given value in the string.
     */
    public static replaceFirst(search: string, replace: string, subject: string): string {
        if (search === '') return subject;

        const index = subject.indexOf(search);
        if (index === -1) return subject;

        return subject.substring(0, index) + replace + subject.substring(index + search.length);
    }

    /**
     * Replace the last occurrence of a given value in the string.
     */
    public static replaceLast(search: string, replace: string, subject: string): string {
        if (search === '') return subject;

        const index = subject.lastIndexOf(search);
        if (index === -1) return subject;

        return subject.substring(0, index) + replace + subject.substring(index + search.length);
    }

    /**
     * Reverse the given string.
     */
    public static reverse(value: string): string {
        return value.split('').reverse().join('');
    }

    /**
     * Begin a string with a single instance of a given value.
     */
    public static start(value: string, prefix: string): string {
        const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`^(?:${escaped})+`);
        return prefix + value.replace(regex, '');
    }

    /**
     * Convert the given string to upper-case.
     */
    public static upper(value: string): string {
        return value.toUpperCase();
    }

    /**
     * Convert the given string to title case.
     */
    public static title(value: string): string {
        return value.replace(/\w\S*/g, (txt) =>
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }

    /**
     * Generate a URL friendly "slug" from a given string.
     */
    public static slug(title: string, separator = '-'): string {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
            .replace(/\s+/g, separator) // Replace spaces with separator
            .replace(new RegExp(`${separator}+`, 'g'), separator) // Replace multiple separators
            .replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), ''); // Trim separators
    }

    /**
     * Convert a string to snake case.
     */
    public static snake(value: string, delimiter = '_'): string {
        const key = value;

        if (this.snakeCache[key] && this.snakeCache[key][delimiter]) {
            return this.snakeCache[key][delimiter];
        }

        if (!this.snakeCache[key]) {
            this.snakeCache[key] = {};
        }

        const result = value
            .replace(/([A-Z])/g, `${delimiter}$1`)
            .toLowerCase()
            .replace(/^_/, '');

        return this.snakeCache[key][delimiter] = result;
    }

    /**
     * Determine if a given string starts with a given substring.
     */
    public static startsWith(haystack: string | null, needles: string | string[]): boolean {
        if (haystack === null) return false;

        const needleArray = Array.isArray(needles) ? needles : [needles];

        for (const needle of needleArray) {
            if (needle !== '' && haystack.startsWith(needle)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Determine if a given string doesn't start with a given substring.
     */
    public static doesntStartWith(haystack: string | null, needles: string | string[]): boolean {
        return !this.startsWith(haystack, needles);
    }

    /**
     * Convert a value to studly caps case.
     */
    public static studly(value: string): string {
        if (this.studlyCache[value]) {
            return this.studlyCache[value];
        }

        const result = value
            .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
            .replace(/^(.)/, (_, char) => char.toUpperCase());

        return this.studlyCache[value] = result;
    }

    /**
     * Convert a value to Pascal case.
     */
    public static pascal(value: string): string {
        return this.studly(value);
    }

    /**
     * Returns the portion of the string specified by the start and length parameters.
     */
    public static substr(string: string, start: number, length?: number): string {
        return string.substr(start, length);
    }

    /**
     * Make a string's first character lowercase.
     */
    public static lcfirst(string: string): string {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }

    /**
     * Make a string's first character uppercase.
     */
    public static ucfirst(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Get the number of words a string contains.
     */
    public static wordCount(string: string): number {
        return string.trim().split(/\s+/).filter(word => word.length > 0).length;
    }

    /**
     * Generate a UUID (version 4).
     */
    public static uuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Set the callable that will be used to generate random strings.
     */
    public static createRandomStringsUsing(factory: ((length: number) => string) | null = null): void {
        this.randomStringFactory = factory;
    }

    /**
     * Remove all strings from the casing caches.
     */
    public static flushCache(): void {
        this.snakeCache = {};
        this.camelCache = {};
        this.studlyCache = {};
    }
}

readonly(Str, Object.keys(Str));

export default Str;