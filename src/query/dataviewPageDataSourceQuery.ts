import { DataArray, DataviewApi, Literal } from "obsidian-dataview";
import { BaseDataviewDataSourceQuery } from "./baseDataviewSourceQuery";
import { DataSource, PropertySource } from "./types";

export class DataviewPageDataSourceQuery extends BaseDataviewDataSourceQuery {
	accept(source: DataSource): boolean {
		return source.type === "PAGE";
	}

	doQuery(
		dv: DataviewApi,
		source: DataSource
	): DataArray<Record<string, Literal>> {
		return dv.pages(source.value);
	}

	getValueByCustomizeProperty(
		data: Record<string, Literal>,
		propertyType: PropertySource,
		propertyName: string
	): any {
		if (propertyType === "PAGE") {
			return data[propertyName];
		}
		return undefined;
	}
}
