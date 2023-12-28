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
import { GraphProcessError } from "./graphProcessError";
import { isZh } from "src/i18/messages";

export class ContributionGraphRawProcessor {
	processCodeblock(
		code: string,
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext,
		app: App
	) {
		try {
			// validate
			const graphConfig: YamlGraphConfig = this.loadYamlConfig(el, code);
			this.processYamlGraphConfig(graphConfig, el);
		} catch (e) {
			if (e instanceof GraphProcessError) {
				el.innerHTML = e.reason;
			} else {
				el.innerHTML = "unexpected error: <pre>" + e.message + "</pre>";
			}
		}
	}

	processYamlGraphConfig(graphConfig: YamlGraphConfig, el: HTMLElement) {
		try {
			// validate
			YamlGraphConfig.validate(graphConfig);

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
			Renders.render(
				el,
				YamlGraphConfig.toContributionGraphConfig(graphConfig)
			);
		} catch (e) {
			if (e instanceof GraphProcessError) {
				el.innerHTML = e.reason;
			} else {
				el.innerHTML = "unexpected error: <pre>" + e.message + "</pre>";
			}
		}
	}

	loadYamlConfig(el: HTMLElement, code: string): YamlGraphConfig {
		if (code == null || code.trim() == "") {
			throw new GraphProcessError(MISS_CONFIG());
		}

		try {
			// @ts-ignore
			return load(code);
		} catch (e) {
			if (e.mark?.line) {
				throw new GraphProcessError(
					"yaml parse error at line " +
						(e.mark.line + 1) +
						", please check the format"
				);
			} else {
				throw new GraphProcessError(
					"content parse error, please check the format(such as blank, indent)"
				);
			}
		}
	}
}

export class YamlGraphConfig {
	title?: string;
	titleStyle: Partial<CSSStyleDeclaration>;
	graphType: string;
	query: string;
	days?: number;
	fromDate?: string;
	toDate?: string;
	dateField?: string;
	data: Contribution[];
	startOfWeek: number;
	cellStyle?: Partial<CSSStyleDeclaration>;
	cellStyleRules?: CellStyleRule[];
	showCellRuleIndicators: boolean;

	constructor() {
		this.title = "Contributions";
		this.graphType = "default";
		this.query = '""';
		this.days = 180;
		this.startOfWeek = isZh() ? 1 : 0;
		this.showCellRuleIndicators = true;
		this.titleStyle = {
			textAlign: "left",
			fontSize: "1.5em",
			fontWeight: "normal",
		};
	}

	static toContributionGraphConfig(
		config: YamlGraphConfig
	): ContributionGraphConfig {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { query, dateField, ...rest } = config;
		const graphConfig = rest as ContributionGraphConfig;
		return graphConfig;
	}

	static validate(config: YamlGraphConfig): void {
		if (!config) {
			throw new GraphProcessError(MISS_CONFIG());
		}
		if (!config.query && !config.data) {
			throw new GraphProcessError(MISS_QUERY_OR_DATA());
		}

		if (config.graphType) {
			const graphTypes = ["default", "month-track", "calendar"];
			if (!graphTypes.includes(config.graphType)) {
				throw new GraphProcessError(
					INVALID_GRAPH_TYPE(config.graphType)
				);
			}
		}

		if (!config.days) {
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
