import { Color, Contribution, ContributionCellData } from "./types";

export function getColorByValue(value: number, colors: Color[]) {
	for (let i = 0; i < colors.length; i++) {
		if (value >= colors[i].min && value <= colors[i].max) {
			return colors[i].color;
		}
	}
	return colors[0].color;
}

export function diffDays(date1: Date, date2: Date) {
	const diffTime = Math.abs(date2.getTime() - date1.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
}

export function generateByFixedDate(
	from: Date,
	to: Date,
	contributions: Contribution[]
) {
	const days = diffDays(from, to) + 1;
	// convert contributions to map: date(yyyy-MM-dd) -> value(sum)
	const contributionMapByDate = contributionToMap(contributions);

	const data: ContributionCellData[] = [];
	// fill HOLE cell at the right most column if today is not saturaday
	const weekDay = to.getDay();
	for (let i = 0; i < 6 - weekDay; i++) {
		data.unshift({
			date: "$HOLE$",
			weekDay: -1,
			month: -1,
			monthDate: -1,
			year: -1,
			value: 0,
		});
	}

	// fill data
	for (let i = 0; i < days; i++) {
		const currentDateAtIndex = new Date(to);
		currentDateAtIndex.setDate(currentDateAtIndex.getDate() - i);
		const formattedDate = toFormattedDate(currentDateAtIndex);
		const value = contributionMapByDate.get(formattedDate);
		data.unshift({
			date: formattedDate,
			weekDay: currentDateAtIndex.getDay(),
			month: currentDateAtIndex.getMonth(),
			monthDate: currentDateAtIndex.getDate(),
			year: currentDateAtIndex.getFullYear(),
			value: value ? value : 0,
		});
	}

	// fill HOLE cell at the left most column if start date is not sunday
	const startWeekDay = from.getDay();
	for (let i = 0; i < startWeekDay; i++) {
		data.unshift({
			date: "$HOLE$",
			weekDay: -1,
			month: -1,
			monthDate: -1,
			year: -1,
			value: 0,
		});
	}

	return data;
}

/**
 * - generate two-dimensional matrix data
 * - every column is week, from Sunday to Saturday
 * - every cell is a day
 */
export function generateByLatestDays(
	days: number,
	contributions: Contribution[] = []
): ContributionCellData[] {
	const fromDate = new Date();
	fromDate.setDate(fromDate.getDate() - days + 1);
	return generateByFixedDate(fromDate, new Date(), contributions);
}

function contributionToMap(contributions: Contribution[]) {
	const map = new Map<string, number>();
	for (const item of contributions) {
		if (map.has(item.date)) {
			map.set(item.date, map.get(item.date) + item.value);
		} else {
			map.set(item.date, item.value);
		}
	}
	return map;
}

export function toFormattedDate(date: Date) {
	return `${date.getFullYear()}-${
		date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
	}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
}

export function toFormattedYearMonth(year: number, month: number) {
	return `${year}-${month < 10 ? "0" + month : month}`;
}

export function mapBy<T, R>(
	arr: T[],
	keyMapping: (item: T) => string,
	valueMapping: (item: T) => R,
	aggregator: (a: R, b: R) => R
) {
	const map = new Map<string, R>();
	for (const item of arr) {
		const key = keyMapping(item);
		if (map.has(key)) {
			map.set(key, aggregator(map.get(key), valueMapping(item)));
		} else {
			map.set(key, valueMapping(item));
		}
	}
	return map;
}
