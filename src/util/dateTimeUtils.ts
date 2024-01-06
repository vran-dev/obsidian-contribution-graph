export function isLuxonDateTime(value: any): boolean {
    if (value == null || value == undefined) {
        return false;
    }
    if (
        typeof value === "object" &&
        "isLuxonDateTime" in value &&
        value.isLuxonDateTime === true
    ) {
        return true;
    }
    return false;
}
