export function getuniquePlatforms(watchPlatforms: Record<string, string>): string[] {

    return [
        "All",
        ...Array.from(
            new Set(Object.values(watchPlatforms).filter((p) => p !== "None")),
        ),
        "None",
    ]
}
