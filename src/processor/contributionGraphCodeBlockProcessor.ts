import { App, MarkdownPostProcessorContext } from "obsidian";
import { DataviewDataFetcher } from "./dataFetcher";
import { load } from "js-yaml";
import { Renders } from "src/render/renders";
import {
	CellStyleRule,
	Contribution,
	ContributionGraphConfig,
} from "src/types";
import {
	INVALID_DATE_FORMAT,
	INVALID_GRAPH_TYPE,
	INVALID_START_OF_WEEK,
	MISS_CONFIG,
	MISS_DAYS_OR_RANGE_DATE,
	MISS_QUERY_OR_DATA,
} from "./errorTips";

export class ContributionGraphCodeBlockProcessor {
	process(
		code: string,
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext,
		app: App
	) {
		// validation
		const graphConfig: YamlGraphConfig | null = this.loadYamlConfig(
			el,
			code
		);
		if (!graphConfig) {
			return;
		}
		const res = YamlGraphConfig.validation(graphConfig);
		if (!res.valid) {
			Renders.renderErrorTips(
				el,
				res.message || "unknown error, please check at console"
			);
			return;
		}

		// fetch data
		const data = new DataviewDataFetcher().fetch(
			graphConfig.query,
			graphConfig.dateField,
			app
		);
		const aggregatedData = [];
		if (graphConfig.data) {
			aggregatedData.push(...graphConfig.data);
		}
		aggregatedData.push(...data);
		graphConfig.data = aggregatedData;

		// render
		console.log(YamlGraphConfig.toContributionGraphConfig(graphConfig));
		Renders.render(
			el,
			YamlGraphConfig.toContributionGraphConfig(graphConfig)
		);
	}

	loadYamlConfig(el: HTMLElement, code: string): YamlGraphConfig | null {
		if (code == null || code.trim() == "") {
			Renders.renderErrorTips(el, MISS_CONFIG());
			return null;
		}

		try {
			return load(code);
		} catch (e) {
			if (e.mark?.line) {
				Renders.renderErrorTips(
					el,
					"yaml parse error at line " +
						(e.mark.line + 1) +
						", please check the format"
				);
			}
			return null;
		}
	}
}

export class YamlGraphConfig {
	title: string;
	graphType: string;
	query: string;
	days: number;
	fromDate?: string;
	toDate?: string;
	dateField?: string;
	data: Contribution[];
	startOfWeek: number;
	cellStyleRules: CellStyleRule[];
	showCellRuleIndicators: boolean;

	constructor() {
		this.title = "Contributions";
		this.graphType = "default";
		this.query = "";
		this.showCellRuleIndicators = true;
		this.cellStyleRules = [];
		this.startOfWeek = 0;
	}

	static toContributionGraphConfig(
		config: YamlGraphConfig
	): ContributionGraphConfig {
		return {
			title: config.title,
			data: config.data,
			days: config.days,
			fromDate: config.fromDate,
			toDate: config.toDate,
			cellStyleRules: config.cellStyleRules,
			showCellRuleIndicators: config.showCellRuleIndicators,
			graphType: config.graphType,
			startOfWeek: config.startOfWeek,
		};
	}

	static validation(config: YamlGraphConfig): ValidationResult {
		if (!config) {
			return {
				valid: false,
				message: MISS_CONFIG(),
			};
		}
		if (!config.query && !config.data) {
			return {
				valid: false,
				message: MISS_QUERY_OR_DATA(),
			};
		}

		if (config.graphType) {
			const graphTypes = ["default", "month-track", "calendar"];
			if (!graphTypes.includes(config.graphType)) {
				return {
					valid: false,
					message: INVALID_GRAPH_TYPE(config.graphType),
				};
			}
		}

		if (!config.days) {
			if (!config.fromDate || !config.toDate) {
				return {
					valid: false,
					message: MISS_DAYS_OR_RANGE_DATE(),
				};
			}
		}

		if (config.fromDate || config.toDate) {
			// yyyy-MM-dd
			const dateReg = /^\d{4}-\d{2}-\d{2}$/;
			if (config.fromDate && !dateReg.test(config.fromDate)) {
				return {
					valid: false,
					message: INVALID_DATE_FORMAT(config.fromDate),
				};
			}

			if (config.toDate && !dateReg.test(config.toDate)) {
				return {
					valid: false,
					message: INVALID_DATE_FORMAT(config.toDate),
				};
			}
		}

		if (config.startOfWeek) {
			const statOfWeeks = [0, 1, 2, 3, 4, 5, 6];
			if (!statOfWeeks.includes(config.startOfWeek)) {
				return {
					valid: false,
					message: INVALID_START_OF_WEEK(config.startOfWeek),
				};
			}
		}

		return {
			valid: true,
		};
	}
}

export class ValidationResult {
	valid: boolean;
	message?: string;
}
