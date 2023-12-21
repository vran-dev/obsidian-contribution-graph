import {
	diffDays,
	distanceBeforeTheStartOfWeek,
	toFormattedDate,
} from "../util/dateUtils";
import { Contribution, ContributionCellData } from "../types";

export function generateByFixedDate(
	from: Date,
	to: Date,
	data: Contribution[],
	startOfWeek = 0
) {
	const days = diffDays(from, to) + 1;
	// convert contributions to map: date(yyyy-MM-dd) -> value(sum)
	const contributionMapByDate = contributionToMap(data);

	const cellData: ContributionCellData[] = [];
	// fill HOLE cell at the right most column if today is not saturaday
	// TODO remove this logic, it's should be process by the caller
	const weekDayOfToDate = to.getDay();

	const lastHoleCount = (startOfWeek - weekDayOfToDate + 7) % 7;
	for (let i = 0; i < lastHoleCount; i++) {
		cellData.unshift({
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
		const contribution = contributionMapByDate.get(formattedDate);
		cellData.unshift({
			date: formattedDate,
			weekDay: currentDateAtIndex.getDay(),
			month: currentDateAtIndex.getMonth(),
			monthDate: currentDateAtIndex.getDate(),
			year: currentDateAtIndex.getFullYear(),
			value: contribution ? contribution.value : 0,
			summary: contribution ? contribution.summary : undefined,
		});
	}

	// fill HOLE cell at the left most column if start date is not sunday
	// TODO remove this logic, it's should be process by the caller
	const weekDayOfFromDate = from.getDay();
	const firstHoleCount = distanceBeforeTheStartOfWeek(
		startOfWeek,
		weekDayOfFromDate
	);
	for (let i = 0; i < firstHoleCount; i++) {
		cellData.unshift({
			date: "$HOLE$",
			weekDay: -1,
			month: -1,
			monthDate: -1,
			year: -1,
			value: 0,
		});
	}

	return cellData;
}

/**
 * - generate two-dimensional matrix data
 * - every column is week, from Sunday to Saturday
 * - every cell is a day
 */
export function generateByLatestDays(
	days: number,
	data: Contribution[] = [],
	startOfWeek = 0
): ContributionCellData[] {
	const fromDate = new Date();
	fromDate.setDate(fromDate.getDate() - days + 1);
	return generateByFixedDate(fromDate, new Date(), data, startOfWeek);
}

function contributionToMap(data: Contribution[]) {
	const map = new Map<string, Contribution>();
	for (const item of data) {
		let key;
		if (typeof item.date === "string") {
			key = item.date;
		} else {
			key = toFormattedDate(item.date);
		}
		if (map.has(key)) {
			const newItem = {
				...item,
				// @ts-ignore
				value: map.get(key).value + item.value,
			};
			map.set(key, newItem);
		} else {
			map.set(key, item);
		}
	}
	return map;
}
