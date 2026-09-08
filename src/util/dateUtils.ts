import { moment } from "obsidian";
import { Moment } from "moment";

export const ISO_DATE_FORMAT = "YYYY-MM-DD";

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parse a date value into a moment.
 *
 * Date-only strings (yyyy-MM-dd) are parsed in the local timezone instead of
 * UTC (which is what `new Date("yyyy-MM-dd")` does per the ECMAScript spec),
 * so the calendar day never shifts for timezones behind UTC.
 */
export function toMomentDate(
	date: string | Date | Moment | number | undefined | null
): Moment | undefined {
	if (date == null) {
		return undefined;
	}
	if (moment.isMoment(date)) {
		return (date as Moment).clone();
	}
	if (typeof date === "string") {
		const trimmed = date.trim();
		const parsed = ISO_DATE_REGEX.test(trimmed)
			? moment(trimmed, ISO_DATE_FORMAT, true)
			: moment(trimmed);
		return parsed.isValid() ? parsed : undefined;
	}
	const parsed = moment(date);
	return parsed.isValid() ? parsed : undefined;
}

export function diffDays(date1: Date | string, date2: Date | string) {
	const from = toMomentDate(date1);
	const to = toMomentDate(date2);
	if (!from || !to) {
		return NaN;
	}
	return to.diff(from, "days");
}

export function toFormattedDate(date: Date | string | Moment) {
	return toMomentDate(date)?.format(ISO_DATE_FORMAT);
}

export function toFormattedYearMonth(year: number, month: number) {
	return `${year}-${month < 10 ? "0" + month : month}`;
}

export function getLastDayOfMonth(year: number, month: number) {
	return moment()
		.year(year)
		.month(month)
		.endOf("month")
		.date();
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

export function isToday(date: Date | string | Moment) {
	const parsed = toMomentDate(date);
	return parsed != undefined && parsed.isSame(moment(), "day");
}

/**
 * if years <= 1, then return the first day of the current year and the last day of the current year
 * if years = 2, then return the first day of the last year and the last day of the current year
 */

export function getLatestYearAbsoluteFromAndEnd(years: number) {
	const normalizedYear = years <= 1 ? 1 : years;
	const start = moment()
		.startOf("year")
		.subtract(normalizedYear - 1, "years");
	const end = moment().endOf("year").startOf("day");
	return {
		start,
		end,
	};
}

/**
 * if months <= 1, then return the first day of the current month and the last day of the current month
 * if months = 2, then return the first day of the last month and the last day of the current month
 */
export function getLatestMonthAbsoluteFromAndEnd(months: number) {
	const normalizedMonth = months <= 1 ? 1 : months;
	const start = moment()
		.startOf("month")
		.subtract(normalizedMonth - 1, "months");
	const end = moment().endOf("month").startOf("day");
	return {
		start,
		end,
	};
}
