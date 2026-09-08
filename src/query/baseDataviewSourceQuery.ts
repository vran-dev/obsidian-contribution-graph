import { App, Platform } from "obsidian";
import { DataviewApi, getAPI, DataArray, Literal } from "obsidian-dataview";
import { GraphProcessError } from "src/processor/graphProcessError";
import {
	CountFieldType,
	Data,
	DataSource,
	DateFieldType,
	PropertySource,
} from "./types";
import { Moment } from "moment";
import { moment } from "obsidian";
import { Contribution, ContributionItem } from "src/types";
import {
	isLuxonDateTime,
	luxonToMoment,
	parseDateWithFormatAdapter,
} from "src/util/dateTimeUtils";
import { toMomentDate } from "src/util/dateUtils";
import { parseNumberOption } from "src/util/utils";
import { dataviewDataFilterChain } from "./filter/dataviewDataFilter";

export abstract class BaseDataviewDataSourceQuery {
	abstract accept(source: DataSource): boolean;

	query(source: DataSource, app: App): Contribution[] {
		this.reconcileSourceValueIfNotExists(source);
		const dv = this.checkAndGetApi(app);
		const data = this.doQuery(dv, source);
		const queryData = this.mapToQueryData(data, source);
		const unsatisfiedData = queryData.filter((item) => !item.date);
		if (unsatisfiedData.length > 0) {
			console.warn(
				unsatisfiedData.length +
				" data can't be converted to date, please check the date field format",
				unsatisfiedData
			);
		}
		const result = queryData
			.filter((d) => d.date != undefined)
			.groupBy((d) => d.date?.format("YYYY-MM-DD"))
			.map((entry) => {
				// performance optimization
				const value = this.countSumValueByCustomizeProperty(
					entry.rows,
					source.countField?.type,
					source.countField?.value
				);
				const items = entry.rows
					.map((item) => {
						let label;
						if (source.type == "PAGE") {
							// @ts-ignore
							label = item.raw.file.name;
						} else {
							label = item.raw.text;
						}

						const value =
							this.getAndConvertValueByCustomizeProperty(
								item,
								source.countField?.type,
								source.countField?.value
							);

						if (source.countField?.type == "PAGE_PROPERTY") {
							label += ` [${source.countField?.value}:${value}]`;
						}

						return {
							label: label,
							value: value,
							link: {
								// @ts-ignore
								href: item.raw.file.path,
								className: "internal-link",
								rel: 'noopener'
							},
							open: (e) => jump(e, source, item, app),
						} as ContributionItem;
					})
					.array();
				return {
					date: entry.key,
					value: value,
					items: items,
				} as Contribution;
			})
			.array();
		return result;
	}

	reconcileSourceValueIfNotExists(source: DataSource) {
		if (!source.value) {
			source.value = '""';
		}
	}

	checkAndGetApi(app: App): DataviewApi {
		const dv = getAPI(app);
		if (!dv) {
			throw new GraphProcessError({
				summary: "Initialize Dataview failed",
				recommends: ["Please install Dataview plugin"],
			});
		}
		return dv;
	}

	abstract doQuery(
		dv: DataviewApi,
		source: DataSource
	): DataArray<Record<string, Literal>>;

	mapToQueryData(
		data: DataArray<Record<string, Literal>>,
		source: DataSource
	): DataArray<Data<Record<string, Literal>>> {
		if (source.dateField && source.dateField.type) {
			const dateFieldName = source.dateField.value;
			const dateFieldType = source.dateField.type;
			const dateFieldFormat = source.dateField.format;
			return data
				.filter((item) => {
					return dataviewDataFilterChain.every((filter) =>
						filter.filter(source, item, this)
					);
				})
				.map((item) => {
					// @ts-ignore
					const fileName = item.file.name;
					if (dateFieldType == "FILE_CTIME") {
						// @ts-ignore
						return new Data(item, this.toDateMoment(item.file.ctime));
					} else if (dateFieldType == "FILE_MTIME") {
						// @ts-ignore
						return new Data(item, this.toDateMoment(item.file.mtime));
					} else if (dateFieldType == "FILE_NAME") {
						const dateTime = this.toMoment(
							fileName,
							fileName,
							dateFieldFormat
						);
						if (dateTime) {
							return new Data(item, dateTime);
						} else {
							return new Data(item);
						}
					} else {
						const propertySource =
							this.getPropertySourceByDateFieldType(
								source.dateField?.type
							);
						const fieldValue = this.getValueByCustomizeProperty(
							item,
							propertySource,
							dateFieldName || ""
						);
						if (isLuxonDateTime(fieldValue)) {
							return new Data(item, luxonToMoment(fieldValue));
						} else {
							const dateTime = this.toMoment(
								fileName,
								fieldValue as string,
								dateFieldFormat
							);
							return new Data(item, dateTime);
						}
					}
				});
		} else {
			return data.map((item) => {
				// @ts-ignore
				return new Data(item, this.toDateMoment(item.file.ctime));
			});
		}
	}

	/**
	 * Convert a dataview date-ish value (luxon DateTime, epoch millis, or
	 * date string) into a moment, preserving the local calendar date.
	 */
	toDateMoment(value: any): Moment | undefined {
		if (isLuxonDateTime(value)) {
			return luxonToMoment(value);
		}
		return toMomentDate(value);
	}

	toMoment(
		page: string,
		date: string,
		dateFieldFormat?: string
	): Moment | undefined {
		if (typeof date !== "string") {
			console.warn(
				"can't parse date, it's a valid format? " +
				date +
				" in page " +
				page
			);
			return undefined;
		}
		const parsed = parseDateWithFormatAdapter(date, dateFieldFormat);
		if (!parsed) {
			console.warn(
				"can't parse date, it's a valid format? " +
				date +
				" in page " +
				page
			);
			return undefined;
		}
		return parsed;
	}

	countSumValueByCustomizeProperty(
		groupData: DataArray<Data<Record<string, Literal>>>,
		propertyType?: CountFieldType,
		propertyName?: string
	): number {
		if (!propertyType || propertyType == "DEFAULT") {
			return groupData.length;
		}

		if (propertyName) {
			return groupData
				.map((item) => {
					return this.getAndConvertValueByCustomizeProperty(
						item,
						propertyType,
						propertyName
					);
				})
				.array()
				.reduce((a, b) => a + b, 0);
		}
		return groupData.length;
	}

	getAndConvertValueByCustomizeProperty(
		item: Data<Record<string, Literal>>,
		propertyType?: CountFieldType,
		propertyName?: string
	): number {
		if (propertyName) {
			let propertySource: PropertySource;
			switch (propertyType) {
				case "PAGE_PROPERTY":
					propertySource = "PAGE";
					break;
				case "TASK_PROPERTY":
					propertySource = "TASK";
					break;
				default:
					propertySource = "UNKNOWN";
					break;
			}

			const r = this.getValueByCustomizeProperty(
				item.raw,
				propertySource,
				propertyName
			);
			if (r == undefined || r == null) {
				return 0;
			}

			if (r instanceof Array) {
				return r.length;
			}

			if (typeof r === "number" || r instanceof Number) {
				return r as number;
			}

			if (typeof r === "string" || r instanceof String) {
				const n = parseNumberOption(r as string);
				if (n != null) {
					return n;
				}
				return r.trim() === "" ? 0 : 1;
			}

			if (typeof r === "boolean" || r instanceof Boolean) {
				return r ? 1 : 0;
			}
			return 1;
		} else {
			return 1;
		}
	}

	abstract getValueByCustomizeProperty(
		data: Record<string, Literal>,
		propertyType: PropertySource,
		propertyName: string
	): any;

	getPropertySourceByCountFieldType(type: CountFieldType): PropertySource {
		switch (type) {
			case "PAGE_PROPERTY":
				return "PAGE";
			case "TASK_PROPERTY":
				return "TASK";
			default:
				return "UNKNOWN";
		}
	}

	getPropertySourceByDateFieldType(type?: DateFieldType): PropertySource {
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
}

function jump(
	evt: MouseEvent,
	source: DataSource,
	item: Data<Record<string, Literal>>,
	app: App
) {
	if (source.type != "PAGE") {
		const selectionState = {
			eState: {
				cursor: {
					from: {
						line: item.raw.line,
						// @ts-ignore
						ch: item.raw.position.start.col,
					},
					to: {
						// @ts-ignore
						line: item.raw.line + item.raw.lineCount - 1,
						// @ts-ignore
						ch: item.raw.position.end.col,
					},
				},
				line: item.raw.line,
			},
		};
		// MacOS interprets the Command key as Meta.
		app.workspace.openLinkText(
			// @ts-ignore
			item.raw.link.toFile().obsidianLink(),
			// @ts-ignore
			item.raw.path,
			evt.ctrlKey || (evt.metaKey && Platform.isMacOS),
			selectionState as any
		);
	} else {
		app.workspace.openLinkText(
			// @ts-ignore
			item.raw.file?.path,
			"",
			evt.ctrlKey || (evt.metaKey && Platform.isMacOS)
		);
	}
}
