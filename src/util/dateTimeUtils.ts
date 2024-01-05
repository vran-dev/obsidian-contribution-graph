export function isLuxonDateTime(value: any): boolean {
    if (
        typeof value === "object" &&
        "isLuxonDateTime" in value &&
        value.isLuxonDateTime === true
    ) {
        return true;
    }
    return false;
}
