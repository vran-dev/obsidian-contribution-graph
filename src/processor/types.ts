import { isZh } from "src/i18/messages";
import { DataSource } from "src/query/types";
import {
	Contribution,
	CellStyleRule,
	ContributionGraphConfig,
} from "src/types";
import {
	MISS_CONFIG,
	MISS_DATASOURCE_OR_DATA,
	INVALID_GRAPH_TYPE,
	MISS_DAYS_OR_RANGE_DATE,
	INVALID_DATE_FORMAT,
	INVALID_START_OF_WEEK,
} from "./bizErrors";
import { GraphProcessError } from "./graphProcessError";
import {
	getLatestMonthAbsoluteFromAndEnd,
	getLatestYearAbsoluteFromAndEnd,
	toFormattedDate,
} from "src/util/dateUtils";

export class YamlGraphConfig {
	/**
	 * basic settings
	 */
	title?: string;
	graphType: string;
	dataSource: DataSource;
	dateRangeValue?: number;
	dateRangeType?: DateRangeType;
	fromDate?: string;
	toDate?: string;
	data: Contribution[];

	/**
	 * style settings
	 */
	titleStyle: Partial<CSSStyleDeclaration>;
	fillTheScreen: boolean;
	startOfWeek: number;
	enableMainContainerShadow?: boolean;
	showCellRuleIndicators: boolean;
	mainContainerStyle?: Partial<CSSStyleDeclaration>;
	cellStyle?: Partial<CSSStyleDeclaration>;
	cellStyleRules?: CellStyleRule[];

	// deprecated
	days?: number;
	query?: string;
	dateField?: string;
	dateFieldFormat?: string;

	constructor() {
		this.title = "Contributions";
		this.graphType = "default";
		this.dateRangeValue = 180;
		this.dateRangeType = "LATEST_DAYS";
		this.startOfWeek = isZh() ? 1 : 0;
		this.showCellRuleIndicators = true;
		this.titleStyle = {
			textAlign: "left",
			fontSize: "1.5em",
			fontWeight: "normal",
		};
		this.dataSource = {
			type: "PAGE",
			value: "",
			dateField: {},
		} as DataSource;
		this.fillTheScreen = false;
		this.enableMainContainerShadow = false;

		// deprecated
		this.query = undefined;
		this.dateFieldFormat = undefined;
		this.dateField = undefined;
		this.days = undefined;
	}

	static toContributionGraphConfig(
		config: YamlGraphConfig
	): ContributionGraphConfig {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { query, dateField, ...rest } = config;
		
		if (config.dateRangeType != "FIXED_DATE_RANGE") {
			if (config.dateRangeType == "LATEST_DAYS") {
				return {
					days: config.dateRangeValue,
					...rest,
				} as ContributionGraphConfig;
			}

			if (config.dateRangeType == "LATEST_MONTH") {
				const { start, end } = getLatestMonthAbsoluteFromAndEnd(
					config.dateRangeValue || 0
				);
				return {
					...rest,
					days: undefined,
					fromDate: toFormattedDate(start),
					toDate: toFormattedDate(end),
				} as ContributionGraphConfig;
			}

			if (config.dateRangeType == "LATEST_YEAR") {
				const { start, end } = getLatestYearAbsoluteFromAndEnd(
					config.dateRangeValue || 0
				);
				return {
					...rest,
					days: undefined,
					fromDate: toFormattedDate(start),
					toDate: toFormattedDate(end),
				} as ContributionGraphConfig;
			}
		}
		return rest as ContributionGraphConfig;
	}

	static validate(config: YamlGraphConfig): void {
		if (!config) {
			throw new GraphProcessError(MISS_CONFIG());
		}
		if (!config.dataSource && !config.data) {
			throw new GraphProcessError(MISS_DATASOURCE_OR_DATA());
		}

		if (config.graphType) {
			const graphTypes = ["default", "month-track", "calendar"];
			if (!graphTypes.includes(config.graphType)) {
				throw new GraphProcessError(
					INVALID_GRAPH_TYPE(config.graphType)
				);
			}
		}

		if (!config.dateRangeValue) {
			if (!config.fromDate || !config.toDate) {
				throw new GraphProcessError(MISS_DAYS_OR_RANGE_DATE());
			}
		}

		if (config.fromDate || config.toDate) {
			// yyyy-MM-dd
			const dateReg = /^\d{4}-\d{2}-\d{2}$/;
			if (config.fromDate && !dateReg.test(config.fromDate)) {
				throw new GraphProcessError(
					INVALID_DATE_FORMAT(config.fromDate)
				);
			}

			if (config.toDate && !dateReg.test(config.toDate)) {
				throw new GraphProcessError(INVALID_DATE_FORMAT(config.toDate));
			}
		}

		if (config.startOfWeek) {
			const statOfWeeks = [0, 1, 2, 3, 4, 5, 6];
			if (typeof config.startOfWeek !== "number") {
				try {
					config.startOfWeek = parseInt(config.startOfWeek);
				} catch (e) {
					throw new GraphProcessError(
						INVALID_START_OF_WEEK(config.startOfWeek)
					);
				}
			}
			if (!statOfWeeks.includes(config.startOfWeek)) {
				throw new GraphProcessError(
					INVALID_START_OF_WEEK(config.startOfWeek)
				);
			}
		}
	}
}

export class ValidationResult {
	valid: boolean;
	message?: string;
}

export type DateRangeType =
	| "LATEST_DAYS"
	| "LATEST_MONTH"
	| "LATEST_YEAR"
	| "FIXED_DATE_RANGE";
