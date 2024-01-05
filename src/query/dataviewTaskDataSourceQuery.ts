import { DataArray, DataviewApi, Literal } from "obsidian-dataview";
import { BaseDataviewDataSourceQuery } from "./baseDataviewSourceQuery";
import { DataSource } from "./types";

export class DataviewTaskDataSourceQuery extends BaseDataviewDataSourceQuery {

	accept(source: DataSource): boolean {
		return source.type === "TASK";
	}

	doQuery(dv: DataviewApi, source: DataSource): DataArray<Record<string, Literal>> {
		const data = dv.pages(source.value).file.tasks;
		if (!source.filter) {
			return data;
		}

		switch (source.filter.type) {
			case "TASK_COMPLETED":
				// @ts-ignore
				return data.filter((task) => {
					return task.completed;
				});
			case "TASK_FULLY_COMPLETED":
				// @ts-ignore
				return data.filter((task) => {
					return task.completed && task.progress === 1;
				});
			case "TASK_CONTAINS_TAG":
				// @ts-ignore
				return data.filter((task) => {
					return task.tags.includes(source.filter?.value);
				});
			case "CUSTOMIZE":
				// TODO @vran
				return data;
		}

	}

}
