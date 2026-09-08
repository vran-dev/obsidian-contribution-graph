import { moment } from "obsidian";
import { Moment } from "moment";
import { ISO_DATE_FORMAT, toMomentDate } from "../util/dateUtils";
import { Contribution, ContributionCellData } from "../types";

export function generateByData(data: Contribution[]) {
	if (!data || data.length === 0) {
		return [];
	}

	const datedData = data
		.map((item) => ({
			item,
			date: toMomentDate(item.date),
		}))
		.filter((entry) => entry.date != undefined)
		.sort((a, b) => a.date!.valueOf() - b.date!.valueOf());

	if (datedData.length === 0) {
		return [];
	}

	const min = datedData[0].date!;
	const max = datedData[datedData.length - 1].date!;
	return generateByFixedDate(min, max, data);
}

export function generateByFixedDate(
	from: Date | string | Moment,
	to: Date | string | Moment,
	data: Contribution[]
) {
	const fromMoment = toMomentDate(from)?.startOf("day");
	const toMoment = toMomentDate(to)?.startOf("day");
	if (!fromMoment || !toMoment) {
		return [];
	}

	const days = toMoment.diff(fromMoment, "days") + 1;
	if (days < 1) {
		return [];
	}

	// convert contributions to map: date(yyyy-MM-dd) -> value(sum)
	const contributionMapByDate = contributionToMap(data);

	const cellData: ContributionCellData[] = [];

	// fill data
	for (let i = 0; i < days; i++) {
		const currentDateAtIndex = toMoment.clone().subtract(i, "days");
		const isoDate = currentDateAtIndex.format(ISO_DATE_FORMAT);
		const contribution = contributionMapByDate.get(isoDate);

		cellData.unshift({
			date: isoDate,
			weekDay: currentDateAtIndex.day(),
			month: currentDateAtIndex.month(),
			monthDate: currentDateAtIndex.date(),
			year: currentDateAtIndex.year(),
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
	const today = moment();
	const fromDate = today.clone().startOf("day").subtract(days - 1, "days");
	return generateByFixedDate(fromDate, today, data);
}

function contributionToMap(data: Contribution[]) {
	const map = new Map<string, Contribution>();
	for (const item of data) {
		const dateMoment = toMomentDate(item.date);
		const key = dateMoment
			? dateMoment.format(ISO_DATE_FORMAT)
			: String(item.date);
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
