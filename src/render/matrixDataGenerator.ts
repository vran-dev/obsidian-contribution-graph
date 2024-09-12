import { diffDays } from "../util/dateUtils";
import { Contribution, ContributionCellData } from "../types";
import { DateTime } from "luxon";

export function generateByData(data: Contribution[]) {
	if (!data || data.length === 0) {
		return [];
	}

	const dateData = data.map((item) => {
		if (item.date instanceof Date) {
			return {
				...item,
				timestamp: item.date.getTime(),
			};
		} else {
			return {
				...item,
				date: new Date(item.date),
				timestamp: new Date(item.date).getTime(),
			};
		}
	});

	const sortedData = dateData.sort((a, b) => b.timestamp - a.timestamp);
	const min = sortedData[sortedData.length - 1].timestamp;
	const max = sortedData[0].timestamp;
	return generateByFixedDate(new Date(min), new Date(max), data);
}

export function generateByFixedDate(
	from: Date,
	to: Date,
	data: Contribution[]
) {
	const days = diffDays(from, to) + 1;
	// convert contributions to map: date(yyyy-MM-dd) -> value(sum)
	const contributionMapByDate = contributionToMap(data);

	const cellData: ContributionCellData[] = [];

	const toDateTime = DateTime.fromJSDate(to);
	// fill data
	for (let i = 0; i < days; i++) {
		const currentDateAtIndex = toDateTime.minus({ days: i });
		const isoDate = currentDateAtIndex.toFormat('yyyy-MM-dd');
		const contribution = contributionMapByDate.get(isoDate);

		cellData.unshift({
			date: isoDate,
			weekDay: currentDateAtIndex.weekday == 7 ? 0 : currentDateAtIndex.weekday,
			month: currentDateAtIndex.month - 1,
			monthDate: currentDateAtIndex.day,
			year: currentDateAtIndex.year,
			value: contribution ? contribution.value : 0,
			summary: contribution ? contribution.summary : undefined,
			items: contribution ? contribution.items || [] : [],
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
	data: Contribution[] = []
): ContributionCellData[] {
	const fromDate = new Date();
	fromDate.setDate(fromDate.getDate() - days + 1);
	return generateByFixedDate(fromDate, new Date(), data);
}

function contributionToMap(data: Contribution[]) {
	const map = new Map<string, Contribution>();
	for (const item of data) {
		let key;
		if (typeof item.date === "string") {
			key = item.date;
		} else {
			key = DateTime.fromJSDate(item.date).toFormat('yyyy-MM-dd');
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
