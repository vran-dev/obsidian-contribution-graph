export function parseDate(date: string | Date) {
  if (typeof date === "string") {
    return new Date(date);
  } else {
    return date;
  }
}