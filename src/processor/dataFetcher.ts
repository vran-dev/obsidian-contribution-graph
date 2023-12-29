import { App } from "obsidian";
import { Contribution } from "../types";
import { getAPI } from "obsidian-dataview";
import { GraphProcessError } from "./graphProcessError";
import { DateTime } from "luxon";

export class DataviewDataFetcher {
	fetch(
		query: string,
		dateField?: string,
		dateFieldFormat?: string,
		app?: App
	): Contribution[] {
		if (!query) {
			return [];
		}
		const dv = getAPI(app);
		if (!dv) {
			throw new GraphProcessError("Dataview query not available");
		}
		const result = dv.pages(query);
		if (dateField) {
			return this.groupByCustomField(result, dateField, dateFieldFormat);
		} else {
			return this.groupByFileCTime(result);
		}
	}

	groupByCustomField(
		result: any,
		dateFieldName: string,
		dateFieldFormat?: string
	) {
		const convertFailedPages: ConvertFail[] = [];
		const data = result
			// @ts-ignore
			.map((page) => {
				return this.toPageWrapper(page, dateFieldName, dateFieldFormat);
			})
			// @ts-ignore
			.filter((wrapper) => {
				if (wrapper.date == null) {
					convertFailedPages.push({
						page: wrapper.page.file.name,
						reason:
							"can't find field " + dateFieldName + " in page",
					});
					return false;
				}

				try {
					wrapper.date.toFormat("yyyy-MM-dd");
					return true;
				} catch (e) {
					convertFailedPages.push({
						page: wrapper.page.file.name,
						reason:
							"can't convert dateField " +
							dateFieldName +
							" to date, please check the format, it should be like: 2022-02-02T00:00:00",
					});
					return false;
				}
			})
			// @ts-ignore
			.groupBy((wrapper) => {
				return wrapper.date.toFormat("yyyy-MM-dd");
			})
			// @ts-ignore
			.map((entry) => {
				return {
					date: entry.key,
					value: entry.rows.length,
				};
			});
		if (convertFailedPages.length > 0) {
			console.warn("this page can't be processed", convertFailedPages);
		}
		return data;
	}

	groupByFileCTime(data: any) {
		return (
			data
				// @ts-ignore
				.groupBy((p) => p.file.ctime.toFormat("yyyy-MM-dd"))
				// @ts-ignore
				.map((entry) => {
					return {
						date: entry.key,
						value: entry.rows.length,
					};
				})
		);
	}

	isLuxonDateTime(value: any): boolean {
		if (
			typeof value === "object" &&
			"isLuxonDateTime" in value &&
			value.isLuxonDateTime === true
		) {
			return true;
		}
		return false;
	}

	smartParse(page: string, date: string): DateTime | null {
		try {
			let dateTime = DateTime.fromISO(date);
			if (dateTime.isValid) {
				return dateTime;
			}
			dateTime = DateTime.fromRFC2822(date);
			if (dateTime.isValid) {
				return dateTime;
			}
			dateTime = DateTime.fromHTTP(date);
			if (dateTime.isValid) {
				return dateTime;
			}
			dateTime = DateTime.fromSQL(date);
			if (dateTime.isValid) {
				return dateTime;
			}
			dateTime = DateTime.fromFormat(date, "yyyy-MM-dd HH:mm");
			if (dateTime.isValid) {
				return dateTime;
			}
			dateTime = DateTime.fromFormat(date, "yyyy-MM-ddTHH:mm");
			if (dateTime.isValid) {
				return dateTime;
			}
		} catch (e) {
			console.warn(
				"can't parse date, it's a valid format? " +
					date +
					" in page " +
					page
			);
		}
		return null;
	}

	toPageWrapper(
		page: any,
		dateFieldName: string,
		dateFieldFormat?: string
	): PageWrapper {
		if (!page[dateFieldName]) {
			return new PageWrapper(
				null,
				page,
				"can't find field " + dateFieldName
			);
		}

		const dateField = page[dateFieldName];
		if (this.isLuxonDateTime(dateField)) {
			return new PageWrapper(dateField, page);
		} else if (dateFieldFormat) {
			try {
				return new PageWrapper(
					DateTime.fromFormat(dateField, dateFieldFormat),
					page
				);
			} catch (e) {
				return new PageWrapper(
					null,
					page,
					"can't parse date, it's a valid format? " +
						dateField +
						" in page " +
						page.file.name
				);
			}
		} else {
			return new PageWrapper(
				this.smartParse(page.file.name, dateField),
				page
			);
		}
	}
}

export class ConvertFail {
	page: string;
	reason: string;
}

class PageWrapper {
	date: DateTime | null;
	page: any;
	message?: string;

	constructor(date: DateTime | null, page: any, message?: string) {
		this.date = date;
		this.page = page;
		this.message = message;
	}
}
