import { moment } from "obsidian";
import { Moment } from "moment";

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
 * Translate luxon format tokens (used by configs created before the moment
 * migration, e.g. `yyyy-MM-dd`) into the equivalent moment tokens so existing
 * user configurations keep working. Runs of the same letter are mapped as a
 * whole token, so a moment-style `ddd` the user may have written is left
 * intact while a luxon `dd` still becomes `DD`.
 */
const LUXON_TO_MOMENT_RUNS: Record<string, Partial<Record<number | "*", string>>> = {
	// years: any run longer than 2 means a full year
	y: { 1: "YYYY", 2: "YY", "*": "YYYY" },
	// days of month (runs of 3+ are already moment weekday tokens)
	d: { 1: "D", 2: "DD" },
	// luxon standalone weekdays -> moment names / ISO number
	c: { 1: "E", 2: "E", 3: "ddd", 4: "dddd" },
	E: { 3: "ddd", 4: "dddd" },
	// luxon standalone months -> moment month tokens
	L: { 1: "M", 2: "MM", 3: "MMM", 4: "MMMM" },
};

export function translateLuxonFormatToMoment(format: string): string {
	return format.replace(/([A-Za-z])\1*/g, (run) => {
		const byLength = LUXON_TO_MOMENT_RUNS[run[0]];
		if (!byLength) {
			return run;
		}
		return byLength[run.length] ?? byLength["*"] ?? run;
	});
}

/**
 * Adapter layer for user-configured date formats.
 *
 * Configs written with moment tokens (e.g. `YYYY-MM-DD`, the same syntax the
 * Obsidian daily-notes plugin uses) are applied as-is. Configs written with
 * legacy luxon tokens (e.g. `yyyy-MM-dd`, saved before the moment migration)
 * are auto-translated and retried. Without a format, moment's lenient smart
 * detect handles ISO 8601 / RFC 2822 / `yyyy-MM-dd HH:mm` style values in the
 * local timezone.
 */
export function parseDateWithFormatAdapter(
	date: string,
	format?: string
): Moment | undefined {
	try {
		if (format) {
			const byMomentTokens = moment(date, format, true);
			if (byMomentTokens.isValid()) {
				return byMomentTokens;
			}

			const byLuxonTokens = moment(
				date,
				translateLuxonFormatToMoment(format),
				true
			);
			if (byLuxonTokens.isValid()) {
				return byLuxonTokens;
			}
		}

		const smartDetected = moment(date);
		if (smartDetected.isValid()) {
			return smartDetected;
		}
	} catch (e) {
		// invalid input, let the caller decide how to report it
	}
	return undefined;
}