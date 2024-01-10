import { Literal } from "obsidian-dataview";
import {
	CountFieldType,
	DataSource,
	DateFieldType,
	PropertySource,
} from "../types";
import { BaseDataviewDataSourceQuery } from "../baseDataviewSourceQuery";

export interface DataViewDataFilter {
	filter(
		source: DataSource,
		item: Record<string, Literal>,
		query: BaseDataviewDataSourceQuery
	): boolean;
}

export class CountFieldDataViewDataFilter implements DataViewDataFilter {
	filter(
		source: DataSource,
		item: Record<string, Literal>,
		query: BaseDataviewDataSourceQuery
	): boolean {
		if (!source.countField) {
			return true;
		}
		if (source.countField.type == 'DEFAULT') {
			return true;
		}
		const propertyType = getPropertySourceByCountFieldType(
			source.countField.type
		);
		const fieldValue = query.getValueByCustomizeProperty(
			item,
			propertyType,
			source.countField.value || ""
		);
		if (fieldValue == undefined || fieldValue == null) {
			return false;
		}
		return true;
	}
}

export class DateFieldDataViewDataFilter implements DataViewDataFilter {
	filter(
		source: DataSource,
		item: Record<string, Literal>,
		query: BaseDataviewDataSourceQuery
	): boolean {
		if (source.dateField && source.dateField.value) {
			const dateFieldName = source.dateField.value;
			const dateFieldType = source.dateField.type;
			if (
				dateFieldType == "FILE_CTIME" ||
				dateFieldType == "FILE_MTIME" ||
				dateFieldType == "FILE_NAME"
			) {
				return true;
			}

			const propertySource = getPropertySourceByDateFieldType(
				source.dateField?.type
			);
			const fieldValue = query.getValueByCustomizeProperty(
				item,
				propertySource,
				dateFieldName
			);
			if (!fieldValue) {
				return false;
			}
		}
		return true;
	}
}

export const dataviewDataFilterChain: DataViewDataFilter[] = [
	new CountFieldDataViewDataFilter(),
	new DateFieldDataViewDataFilter(),
];

function getPropertySourceByCountFieldType(
	type: CountFieldType
): PropertySource {
	switch (type) {
		case "PAGE_PROPERTY":
			return "PAGE";
		case "TASK_PROPERTY":
			return "TASK";
		default:
			return "UNKNOWN";
	}
}

function getPropertySourceByDateFieldType(
	type?: DateFieldType
): PropertySource {
	switch (type) {
		case "FILE_CTIME":
		case "FILE_MTIME":
		case "FILE_NAME":
		case "PAGE_PROPERTY":
			return "PAGE";
		case "TASK_PROPERTY":
			return "TASK";
		default:
			return "UNKNOWN";
	}
}
