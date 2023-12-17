export function parseDate(date: string | Date) {
	if (typeof date === "string") {
		return new Date(date);
	} else {
		return date;
	}
}

export function diffDays(date1: Date, date2: Date) {
	const diffTime = Math.abs(date2.getTime() - date1.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
}

export function toFormattedDate(date: Date) {
	return `${date.getFullYear()}-${
		date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
	}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
}

export function toFormattedYearMonth(year: number, month: number) {
	return `${year}-${month < 10 ? "0" + month : month}`;
}

export function getLastDayOfMonth(year: number, month: number) {
	return new Date(year, month + 1, 0).getDate();
}

export function distanceBeforeTheStartOfWeek(
	startOfWeek: number,
	weekDate: number
) {
	return (weekDate - startOfWeek + 7) % 7;
}

export function distanceBeforeTheEndOfWeek(
	startOfWeek: number,
	weekDate: number
) {
	return (startOfWeek - weekDate + 6) % 7;
}
