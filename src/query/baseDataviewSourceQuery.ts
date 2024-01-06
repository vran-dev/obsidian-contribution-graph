import { App } from "obsidian";
import { DataviewApi, getAPI, DataArray, Literal } from "obsidian-dataview";
import { GraphProcessError } from "src/processor/graphProcessError";
import {
	Data,
	DataSource,
	FILE_CTIME_FIELD,
	FILE_MTIME_FIELD,
	FILE_NAME,
} from "./types";
import { DateTime } from "luxon";
import { Contribution } from "src/types";
import { isLuxonDateTime } from "src/util/dateTimeUtils";

export abstract class BaseDataviewDataSourceQuery {
	abstract accept(source: DataSource): boolean;

	query(source: DataSource, app: App): Contribution[] {
		this.reconcileSourceValueIfNotExists(source);
		const dv = this.checkAndGetApi(app);
		const data = this.doQuery(dv, source);
		const queryData = this.mapToQueryData(data, source);
		const unsatisfiedData = queryData.filter((item) => !item.date);
		if (unsatisfiedData.length > 0) {
			console.warn(
				unsatisfiedData.length +
					" data can't be converted to date, please check the date field format",
				unsatisfiedData
			);
		}
		return queryData
			.filter((d) => d.date != undefined)
			.groupBy((d) => d.date?.toFormat("yyyy-MM-dd"))
			.map((entry) => {
				return {
					date: entry.key,
					value: entry.rows.length,
				} as Contribution;
			})
			.array();
	}

	reconcileSourceValueIfNotExists(source: DataSource) {
		if (!source.value) {
			source.value = '""';
		}
	}

	checkAndGetApi(app: App): DataviewApi {
		const dv = getAPI(app);
		if (!dv) {
			throw new GraphProcessError({
				summary: "Initialize Dataview failed",
				recommends: ["Please install Dataview plugin"],
			});
		}
		return dv;
	}

	abstract doQuery(
		dv: DataviewApi,
		source: DataSource
	): DataArray<Record<string, Literal>>;

	mapToQueryData(
		data: DataArray<Record<string, Literal>>,
		source: DataSource
	): DataArray<Data<Record<string, Literal>>> {
		if (source.dateField && source.dateField.value) {
			const dateFieldName = source.dateField.value;
			const dateFieldFormat = source.dateField.format;
			return data
				.filter((item) => {
					if (
						dateFieldName == FILE_CTIME_FIELD ||
						dateFieldName == FILE_MTIME_FIELD ||
						dateFieldName == FILE_NAME
					) {
						return true;
					}

					const fieldValue = item[dateFieldName];
					if (!fieldValue) {
						return false;
					}
					if (!isLuxonDateTime(fieldValue)) {
						return false;
					}
					return true;
				})
				.map((item) => {
					// @ts-ignore
					const fileName = item.file.name;
					if (dateFieldName == FILE_CTIME_FIELD) {
						// @ts-ignore
						return new Data(item, item.file.ctime);
					} else if (dateFieldName == FILE_MTIME_FIELD) {
						// @ts-ignore
						return new Data(item, item.file.mtime);
					} else if (dateFieldName == FILE_NAME) {
						const dateTime = this.toDateTime(
							fileName,
							fileName,
							dateFieldFormat
						);
						if (dateTime) {
							return new Data(item, dateTime);
						} else {
							return new Data(item);
						}
					} else {
						const fieldValue = item[dateFieldName];
						if (isLuxonDateTime(fieldValue)) {
							return new Data(item, fieldValue as DateTime);
						} else {
							const dateTime = this.toDateTime(
								fileName,
								fieldValue as string,
								dateFieldFormat
							);
							return new Data(item, dateTime);
						}
					}
				});
		} else {
			return data.map((item) => {
				// @ts-ignore
				return new Data(item, item.file.ctime);
			});
		}
	}

	toDateTime(
		page: string,
		date: string,
		dateFieldFormat?: string
	): DateTime | undefined {
		if (typeof date !== "string") {
			console.warn(
				"can't parse date, it's a valid format? " +
					date +
					" in page " +
					page
			);
			return undefined;
		}
		try {
			let dateTime = null;
			if (dateFieldFormat) {
				dateTime = DateTime.fromFormat(date, dateFieldFormat);
				if (dateTime.isValid) {
					return dateTime;
				}
			}

			dateTime = DateTime.fromISO(date);
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
			dateTime = DateTime.fromFormat(date, "yyyy-MM-dd'T'HH:mm");
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
		return undefined;
	}
}
