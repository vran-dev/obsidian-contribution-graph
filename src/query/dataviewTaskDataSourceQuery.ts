import { DataArray, DataviewApi, Literal } from "obsidian-dataview";
import { BaseDataviewDataSourceQuery } from "./baseDataviewSourceQuery";
import { DataSource } from "./types";

export class DataviewTaskDataSourceQuery extends BaseDataviewDataSourceQuery {
	accept(source: DataSource): boolean {
		return (
			source.type === "ALL_TASK" ||
			source.type === "TASK_IN_SPECIFIC_PAGE"
		);
	}

	doQuery(
		dv: DataviewApi,
		source: DataSource
	): DataArray<Record<string, Literal>> {
		let pageData;
		if (source.type === "ALL_TASK") {
			pageData = dv.pages('""');
		} else {
			pageData = dv.pages(source.value);
		}

		const taskData = pageData
			// @ts-ignore
			.filter((p) => p.file.tasks.length > 0)
			.flatMap((p) => {
				const fileTasks: DataArray<Record<string, Literal>> =
					// @ts-ignore
					p.file.tasks.map((task) => {
						return {
							...task,
							file: p.file,
						};
					});
				return fileTasks.array();
			});

		if (!source.filter) {
			return taskData;
		}
		switch (source.filter.type) {
			case "NONE":
				return taskData;
			case "TASK_COMPLETED":
				// @ts-ignore
				return taskData.filter((task) => {
					return task.completed;
				});
			case "TASK_FULLY_COMPLETED":
				// @ts-ignore
				return taskData.filter((task) => {
					return task.fullyCompleted;
				});
			case "CONTAINS_ANY_TAG":
				return taskData.filter((task) => {
					if (source.filter?.value instanceof Array) {
						const values: string[] = source.filter?.value;
						if (values.length === 0) {
							return true;
						} else {
							// @ts-ignore
							return task.tags.some(
								// @ts-ignore
								(tag) =>
									values.find(
										(value) =>
											value.toLowerCase() ===
											tag.toLowerCase()
									) !== undefined
							);
						}
					} else {
						return true;
					}
				});
			case "CUSTOMIZE":
				// TODO @vran
				return taskData;
			default:
				return taskData;
		}
	}
}
