import { DataArray, DataviewApi, Literal } from "obsidian-dataview";
import { BaseDataviewDataSourceQuery } from "./baseDataviewSourceQuery";
import { DataFilter, DataSource, PropertySource } from "./types";

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

		if (!source.filters || source.filters.length === 0) {
			return taskData;
		}
		return taskData.filter((task) => {
			if (!source.filters) {
				return true;
			}
			return source.filters.every((filter) => {
				switch (filter.type) {
					case "NONE":
						return true;
					case "STATUS_IS":
						return this.filterByStatusIs(filter, task);
					case "STATUS_IN":
						return this.filterByStatusIn(filter, task);
					case "CONTAINS_ANY_TAG":
						return this.filterByContainsAnyTag(filter, task);
					default:
						return true;
				}
			});
		});
	}

	filterByStatusIn(
		filter: DataFilter,
		data: Record<string, Literal>
	): boolean {
		const statusArr = filter.value as string[];
		return statusArr.some((value) => {
			if (value == "COMPLETED") {
				return data.completed as boolean;
			} else if (value == "INCOMPLETE") {
				return data.status == " ";
			} else if (value == "CANCELED") {
				return data.status == "-";
			} else if (value == "ANY") {
				return true;
			} else if (value == "FULLY_COMPLETED") {
				return data.fullyCompleted as boolean;
			} else {
				return data.status === value;
			}
		});
	}

	filterByStatusIs(
		filter: DataFilter,
		data: Record<string, Literal>
	): boolean {
		if (filter.value == "COMPLETED") {
			return data.completed as boolean;
		} else if (filter.value == "INCOMPLETE") {
			return data.status == " ";
		} else if (filter.value == "CANCELED") {
			return data.status == "-";
		} else if (filter.value == "ANY") {
			return true;
		} else if (filter.value == "FULLY_COMPLETED") {
			return data.fullyCompleted as boolean;
		} else {
			return data.status === filter.value;
		}
	}

	filterByContainsAnyTag(
		filter: DataFilter,
		task: Record<string, Literal>
	): boolean {
		if (filter?.value instanceof Array) {
			const values: string[] = filter?.value;
			if (values.length === 0) {
				return true;
			} else {
				// @ts-ignore
				return task.tags.some(
					// @ts-ignore
					(tag) =>
						values.find(
							(value) => value.toLowerCase() === tag.toLowerCase()
						) !== undefined
				);
			}
		} else {
			return true;
		}
	}

	getValueByCustomizeProperty(
		data: Record<string, Literal>,
		propertyType: PropertySource,
		propertyName: string
	): any {
		if (propertyType === "PAGE") {
			if (data.file) {
				// @ts-ignore
				return data.file[propertyName];
			}
		}

		if (propertyType === "TASK") {
			return data[propertyName];
		}
		return undefined;
	}
}
