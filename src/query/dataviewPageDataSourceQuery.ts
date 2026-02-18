import { App } from "obsidian";
import { DataArray, DataviewApi, Literal } from "obsidian-dataview";
import { BaseDataviewDataSourceQuery } from "./baseDataviewSourceQuery";
import { Data, DataSource, PropertySource } from "./types";

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

	async enrichQueryData(
		queryData: DataArray<Data<Record<string, Literal>>>,
		source: DataSource,
		app: App
	): Promise<DataArray<Data<Record<string, Literal>>>> {
		if (
			source.type !== "PAGE" ||
			source.countField?.type !== "QUERY_INSTANCES"
		) {
			return queryData;
		}
		const pattern = this.getSearchPatternFromQuery(source.value);
		const arr = queryData.array();
		for (const data of arr) {
			const raw = data.raw as Record<string, Literal & { _instanceCount?: number }>;
			// @ts-ignore - file exists on page rows
			const path = data.raw.file?.path;
			if (!path) {
				raw._instanceCount = 0;
				continue;
			}
			try {
				const content = await app.vault.adapter.read(path);
				raw._instanceCount = this.countOccurrences(content, pattern);
			} catch {
				raw._instanceCount = 0;
			}
		}
		return queryData;
	}

	private getSearchPatternFromQuery(value: string): string {
		const trimmed = value.trim();
		if (
			trimmed.length >= 2 &&
			trimmed.startsWith('"') &&
			trimmed.endsWith('"')
		) {
			return trimmed.slice(1, -1);
		}
		return trimmed;
	}

	private countOccurrences(content: string, pattern: string): number {
		if (!pattern) return 0;
		let count = 0;
		let pos = 0;
		while (true) {
			const i = content.indexOf(pattern, pos);
			if (i === -1) break;
			count++;
			pos = i + 1;
		}
		return count;
	}

	getValueByCustomizeProperty(
		data: Record<string, Literal>,
		propertyType: PropertySource,
		propertyName: string
	): any {
		if (propertyType === "PAGE" && propertyName === "_instanceCount") {
			const count = (data as Record<string, unknown>)._instanceCount;
			return typeof count === "number" ? count : 0;
		}
		if (propertyType === "PAGE") {
			return data[propertyName];
		}
		return undefined;
	}
}
