import { DEFAULT_RULES } from "./constants";

export class ContributionGraphConfig {
	/**
	 * the title of the graph
	 */
	title = "Contribution Graph";

	/**
	 * the style of the title
	 */
	titleStyle: Partial<CSSStyleDeclaration> = {};

	/**
	 * recent days to show
	 */
	days?: number | undefined;

	/**
	 * the start date of the graph，if `days` is set, this value will be ignored
	 */
	fromDate?: Date | string | undefined;

	/**
	 * the end date of the graph，if `days` is set, this value will be ignored
	 */
	toDate?: Date | string | undefined;

	/**
	 * the data to show at cell
	 */
	data: Contribution[];

	/**
	 * the rules to style the cell
	 */
	cellStyleRules: CellStyleRule[] = DEFAULT_RULES;

	/**
	 * set false to hide rule indicators
	 */
	showCellRuleIndicators = true;

	/**
	 * `default`: every column is a week day from top to bottom
	 * `month-track`: every row is a month from left to right
	 *
	 * default value: `default`
	 */
	graphType: "default" | "month-track" | "calendar" = "default";

	/**
	 * value range: 0->Sunday, 1->Monday, 2->Tuesday, 3->Wednesday, 4->Thursday, 5->Friday, 6->Saturday
	 * default value: 0
	 * notice: it's not work when `graphType` is `month-track`
	 */
	startOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;

	/**
	 * callback when cell is clicked
	 */
	onCellClick?: (
		cellData: ContributionCellData,
		event: MouseEvent | undefined
	) => void | undefined;
}

export interface Contribution {
	/**
	 * the date of the contribution, format: yyyy-MM-dd
	 */
	date: string | Date;
	/**
	 * the value of the contribution
	 */
	value: number;
	/**
	 * the summary of the contribution, will be shown when hover on the cell
	 */
	summary: string | undefined;
}

export interface CellStyleRule {
	// the background color for the cell
	color: string;
	// the text in the cell
	text?: string | undefined;
	// the inlusive min value
	min: number;
	// the exclusive max value
	max: number;
}

export class ContributionCellData {
	date: string; // yyyy-MM-dd
	weekDay: number; // 0 - 6
	month: number; // 0 - 11
	monthDate: number; // 1 - 31
	year: number; // sample: 2020
	value: number;
	summary?: string;
}
