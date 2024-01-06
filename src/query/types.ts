import { DateTime } from "luxon";

export type DataSourceType = "PAGE" | "ALL_TASK" | "TASK_IN_SPECIFIC_PAGE";

export type DataSourceFilterType =
	| "NONE"
	| "TASK_COMPLETED"
	| "TASK_FULLY_COMPLETED"
	| "CONTAINS_ANY_TAG"
	| "CUSTOMIZE";

export class DataSource {
	type: DataSourceType;
	value: string;
	filter?: DataFilter;
	dateField?: DateField;
}

export class DataFilter {
	type: DataSourceFilterType;
	value?: string | string[];
}

export class DateField {
	value?: string;
	format?: string;
}

export const FILE_CTIME_FIELD = "file.ctime";

export const FILE_MTIME_FIELD = "file.mtime";

export const FILE_NAME = "file.name";

export class ConvertFailData {
	source: string;
	summary: string;
}

export class Data<T> {
	raw: T;
	date?: DateTime;

	constructor(raw: T, date?: DateTime) {
		this.date = date;
		this.raw = raw;
	}
}
