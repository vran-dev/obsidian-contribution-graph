import { DateTime } from "luxon";

export type DataSourceType = "PAGE" | "ALL_TASK" | "TASK_IN_SPECIFIC_PAGE";

export type DataSourceFilterType = "NONE" | "STATUS_IS" | "CONTAINS_ANY_TAG";

export class DataSource {
	type: DataSourceType;
	value: string;
	filters?: DataFilter[];
	dateField?: DateField;
	countField?: CountField;
}

export class DataFilter {
	id: string;
	type: DataSourceFilterType;
	value?: string | string[];
}

export class DateField {
	type: DateFieldType;
	value?: string;
	format?: string;
}

export class CountField {
	type: CountFieldType;
	value?: string;
}

export type DateFieldType =
	| "FILE_CTIME"
	| "FILE_MTIME"
	| "FILE_NAME"
	| "PAGE_PROPERTY"
	| "TASK_PROPERTY";

export const FILE_CTIME_FIELD = "file.ctime";

export const FILE_MTIME_FIELD = "file.mtime";

export const FILE_NAME = "file.name";

export type CountFieldType = "DEFAULT" | "PAGE_PROPERTY" | "TASK_PROPERTY";

export type PropertySource = "UNKNOWN" | "PAGE" | "TASK";

export type TaskStatus = "COMPLETED" | "INCOMPLETE" | "FULLY_COMPLETED" | "ANY";

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
