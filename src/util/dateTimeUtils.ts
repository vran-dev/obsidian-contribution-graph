import { moment } from "obsidian";
import { Moment } from "moment";
import { DateTime } from "luxon";
import type { DateFormatType } from "src/query/types";

/**
 * Dataview returns luxon `DateTime` values for date fields / file ctime / mtime,
 * so we detect them by shape and convert them to moment via their calendar date
 * (in the value's own zone) to avoid any timezone shifting.
 */
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

export function luxonToMoment(value: any): Moment | undefined {
	if (!isLuxonDateTime(value)) {
		return undefined;
	}
	// toISODate() keeps the calendar date in the value's own zone; parsing the
	// date-only string as local avoids UTC offsets shifting the day.
	const isoDate = value.toISODate();
	if (typeof isoDate !== "string") {
		return undefined;
	}
	const parsed = moment(isoDate, "YYYY-MM-DD", true);
	return parsed.isValid() ? parsed : undefined;
}

/**
 * Adapter layer for user-configured date formats.
 *
 * Custom formats remain Luxon formats for backward compatibility. Parsed
 * values are reduced to their calendar date before conversion to Moment so
 * timezone offsets cannot move a contribution to another day.
 */
export function parseDateWithFormatAdapter(
	date: string,
	format?: string,
	formatType?: DateFormatType
): Moment | undefined {
	try {
		if (format) {
			if (formatType === "moment") {
				const formatted = moment(date, format, true);
				if (formatted.isValid()) {
					return formatted;
				}
			}

			if (formatType !== "moment") {
				const formatted = DateTime.fromFormat(date, format);
				if (formatted.isValid) {
					return luxonToMoment(formatted);
				}
			}
		}

		const parsers = [
			DateTime.fromISO,
			DateTime.fromRFC2822,
			DateTime.fromHTTP,
			DateTime.fromSQL,
		];
		for (const parse of parsers) {
			const parsed = parse(date);
			if (parsed.isValid) {
				return luxonToMoment(parsed);
			}
		}
	} catch (e) {
		// invalid input, let the caller decide how to report it
	}
	return undefined;
}