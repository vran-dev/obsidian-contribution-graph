import { DataArray, DataviewApi, Literal } from "obsidian-dataview";
import { BaseDataviewDataSourceQuery } from "./baseDataviewSourceQuery";
import { DataSource } from "./types";

export class DataviewPageDataSourceQuery extends BaseDataviewDataSourceQuery {

	accept(source: DataSource): boolean {
		return source.type === "PAGE";
	}

	doQuery(dv: DataviewApi, source: DataSource): DataArray<Record<string, Literal>> {
		return dv.pages(source.value);
	}

}
