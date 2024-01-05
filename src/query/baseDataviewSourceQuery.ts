import { App } from "obsidian";
import { DataviewApi, getAPI, DataArray, Literal } from "obsidian-dataview";
import { GraphProcessError } from "src/processor/graphProcessError";
import { Data, DataSource, FILE_CTIME_FIELD, FILE_MTIME_FIELD, FILE_NAME } from "./types";
import { DateTime } from "luxon";
import { Contribution } from "src/types";
import { isLuxonDateTime } from "src/util/dateTimeUtils";

export abstract class BaseDataviewDataSourceQuery {

    abstract accept(source: DataSource): boolean

    query(source: DataSource, app: App): Contribution[] {
        this.checkSource(source);
        const dv = this.checkApi(app);
        const data = this.doQuery(dv, source);

        const dateField = source.dateField;
        let validData;
        if (dateField) {
            const dateFieldName = dateField.value;
            const dateFieldFormat = dateField.format;
            validData = data.filter(d => this.ignoreIfMissingDateField(d, dateFieldName))
                .filter(d => this.ignoreIfSpecificDateFieldIsNotDateTime(d, dateFieldName, dateFieldFormat))
        } else {
            validData = data
        }

        const dateFieldName = dateField ? dateField.value : FILE_CTIME_FIELD;
        return Array.from(validData
            .map(d => this.toData(d, dateFieldName, dateField?.format))
            .groupBy(d => d.date?.toFormat("yyyy-MM-dd"))
            .map(entry => {
                return {
                    date: entry.key,
                    value: entry.rows.length,
                } as Contribution
            }))
    }

    checkSource(source: DataSource) {
        if (!source.value) {
            throw new GraphProcessError({
                summary: "Data source value is empty",
                recommends: [
                    "Please set data source value",
                ]
            });
        }
    }

    checkApi(app: App): DataviewApi {
        const dv = getAPI(app);
        if (!dv) {
            throw new GraphProcessError({
                summary: "Initialize Dataview failed",
                recommends: [
                    "Please install Dataview plugin",
                ]
            });
        }
        return dv;
    }

    abstract doQuery(dv: DataviewApi, source: DataSource): DataArray<Record<string, Literal>>;

    ignoreIfMissingDateField = (data: Record<string, Literal>, dateFieldName?: string): boolean => {
        if (!dateFieldName) {
            return false;
        }
        if (dateFieldName == FILE_CTIME_FIELD
            || dateFieldName == FILE_MTIME_FIELD
            || dateFieldName == FILE_NAME) {
            return false;
        }
        return data[dateFieldName] != null && data[dateFieldName] != undefined;
    }

    ignoreIfSpecificDateFieldIsNotDateTime = (data: Record<string, Literal>,
        dateFieldName?: string,
        dateFieldFormat?: string
    ): boolean => {
        if (!dateFieldName) {
            return false;
        }
        if (dateFieldName == FILE_CTIME_FIELD
            || dateFieldName == FILE_MTIME_FIELD) {
            return false;
        }
        if (dateFieldName == FILE_NAME) {
            // TODO @vran
            return false;
        }
        if (isLuxonDateTime(data[dateFieldName])) {
            return false;
        }
        // @ts-ignore
        return this.toDateTime(data.file.name, dateFieldName, dateFieldFormat) != undefined;
    }

    toData(raw: Record<string, Literal>, dateFieldName: string, dateFieldFormat?: string): Data<Record<string, Literal>> {
        // @ts-ignore
        const pageName = raw.file.name;
        const fieldValue = raw[dateFieldName];
        if (isLuxonDateTime(fieldValue)) {
            return new Data(fieldValue as DateTime, raw);
        } else {
            const dateTime = this.toDateTime(pageName, fieldValue as string, dateFieldFormat);
            return new Data(dateTime, raw);
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
