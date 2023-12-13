import { diffDays, toFormattedDate } from "./date";
import { Contribution, ContributionCellData } from "./types";

export function generateByFixedDate(
	from: Date,
	to: Date,
	data: Contribution[],
	startOfWeek = 0 // 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday
) {
	const days = diffDays(from, to) + 1;
	// convert contributions to map: date(yyyy-MM-dd) -> value(sum)
	const contributionMapByDate = contributionToMap(data);

	const cellData: ContributionCellData[] = [];
	// fill HOLE cell at the right most column if today is not saturaday
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
		const value = contributionMapByDate.get(formattedDate);
		cellData.unshift({
			date: formattedDate,
			weekDay: currentDateAtIndex.getDay(),
			month: currentDateAtIndex.getMonth(),
			monthDate: currentDateAtIndex.getDate(),
			year: currentDateAtIndex.getFullYear(),
			value: value ? value : 0,
		});
	}

	// fill HOLE cell at the left most column if start date is not sunday
	const weekDayOfFromDate = from.getDay();
	const firstHoleCount = (weekDayOfFromDate - startOfWeek + 7) % 7;
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
	startOfWeek = 0 // 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday
): ContributionCellData[] {
	const fromDate = new Date();
	fromDate.setDate(fromDate.getDate() - days + 1);
	return generateByFixedDate(
		fromDate,
		new Date(),
		data,
		startOfWeek
	);
}

function contributionToMap(data: Contribution[]) {
	const map = new Map<string, number>();
	for (const item of data) {
		if (map.has(item.date)) {
			map.set(item.date, map.get(item.date) + item.value);
		} else {
			map.set(item.date, item.value);
		}
	}
	return map;
}
