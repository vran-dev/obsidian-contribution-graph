import { DateTime } from "luxon";

export type DataSourceType = "PAGE" | "TASK";

export type DataSourceFilterType = "TASK_COMPLETED" | "TASK_FULLY_COMPLETED" | "TASK_CONTAINS_TAG" | "CUSTOMIZE"

export class DataSource {
    type: DataSourceType;
    value: string;
    filter?: DataFilter;
    dateField?: DateField;
}

export class DataFilter {
    type: DataSourceFilterType;
    value?: string;
}

export class DateField {
    value: string;
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

    date: DateTime | undefined;

    raw: T;

    constructor(date: DateTime | undefined, raw: T) {
        this.date = date;
        this.raw = raw;
    }
}
