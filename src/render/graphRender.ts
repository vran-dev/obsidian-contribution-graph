import { DEFAULT_RULES } from "src/constants";
import { ContributionGraphConfig, ContributionCellData } from "src/types";
import { parseDate } from "src/util/dateUtils";
import { showTips, hideTips } from "src/util/tooltips";
import {
	generateByLatestDays,
	generateByFixedDate,
} from "./matrixDataGenerator";

export interface GraphRender {
	render(container: HTMLElement, graphConfig: ContributionGraphConfig): void;

	graphType(): string;
}

export abstract class BaseGraphRender implements GraphRender {
	constructor() { }

	render(container: HTMLElement, graphConfig: ContributionGraphConfig): void {
		throw new Error("Method not implemented.");
	}

	abstract graphType(): string;

	renderTitle(graphConfig: ContributionGraphConfig, parent: HTMLElement): HTMLElement {
		const titleEl = document.createElement("div");
		titleEl.className = "title";
		if (graphConfig.title) {
			titleEl.innerText = graphConfig.title;
		}
		if (graphConfig.titleStyle) {
			Object.assign(titleEl.style, graphConfig.titleStyle);
		}
		parent.appendChild(titleEl);
		return titleEl
	}

	renderCellRuleIndicator(
		graphConfig: ContributionGraphConfig,
		parent: HTMLElement
	) {
		if (graphConfig.showCellRuleIndicators === false) {
			console.debug(
				"hide cell rule indicators cause `showCellRuleIndicators` is false"
			);
			return;
		}

		const cellRuleIndicatorContainer = createDiv({
			cls: "cell-rule-indicator-container",
			parent: parent,
		});
		const cellRules = this.getCellRules(graphConfig);
		createDiv({
			cls: "cell text",
			text: "less",
			parent: cellRuleIndicatorContainer,
		});
		cellRules
			.sort((a, b) => a.min - b.min)
			.forEach((rule) => {
				const cellEl = createDiv({
					cls: ["cell"],
					parent: cellRuleIndicatorContainer,
				});
				cellEl.className = "cell";
				cellEl.style.backgroundColor = rule.color;
				cellEl.innerText = rule.text || "";

				// bind tips event
				cellEl.addEventListener("mouseenter", (event) => {
					const summary = `${rule.min} ≤ contributions ＜ ${rule.max}`;
					showTips(event, summary);
					cellEl.addEventListener("mouseleave", (event) => {
						hideTips(event);
					});
				});
			});
		createDiv({
			cls: "cell text",
			text: "more",
			parent: cellRuleIndicatorContainer,
		});
	}

	generateContributionData(graphConfig: ContributionGraphConfig) {
		if (graphConfig.days) {
			return generateByLatestDays(
				graphConfig.days,
				graphConfig.data,
				graphConfig.startOfWeek || 0
			);
		} else if (graphConfig.fromDate && graphConfig.toDate) {
			const fromDate = parseDate(graphConfig.fromDate);
			const toDate = parseDate(graphConfig.toDate);
			return generateByFixedDate(
				fromDate,
				toDate,
				graphConfig.data,
				graphConfig.startOfWeek || 0
			);
		} else {
			throw new Error("Miss days or fromDate and toDate.");
		}
	}

	getCellRules(graphConfig: ContributionGraphConfig) {
		return graphConfig.cellStyleRules &&
			graphConfig.cellStyleRules.length > 0
			? graphConfig.cellStyleRules
			: DEFAULT_RULES;
	}

	bindMonthTips(
		monthCell: HTMLElement,
		contributionItem: ContributionCellData,
		contributionMapByYearMonth: Map<string, number>
	) {
		const yearMonth = `${contributionItem.year}-${contributionItem.month + 1
			}`;
		const yearMonthValue = contributionMapByYearMonth.get(yearMonth) || 0;
		// tips event
		monthCell.addEventListener("mouseenter", (event) => {
			showTips(event, `${yearMonthValue} contributions on ${yearMonth}.`);
		});
		monthCell.addEventListener("mouseleave", (event) => {
			hideTips(event);
		});
	}

	bindCellAttribute(
		cellEl: HTMLElement,
		contributionItem: ContributionCellData
	) {
		cellEl.setAttribute("data-year", contributionItem.year.toString());
		cellEl.setAttribute("data-month", contributionItem.month.toString());
		cellEl.setAttribute("data-date", contributionItem.date.toString());
	}

	bindCellClickEvent(
		cellEl: HTMLElement,
		contributionItem: ContributionCellData,
		graphConfig: ContributionGraphConfig
	) {
		cellEl.onclick = (event: MouseEvent) => {
			if (graphConfig.onCellClick) {
				graphConfig.onCellClick(contributionItem, event);
			}
		};
	}

	bindCellTips(cellEl: HTMLElement, contributionItem: ContributionCellData) {
		cellEl.addEventListener("mouseenter", (event) => {
			const summary = contributionItem.summary
				? contributionItem.summary
				: `${contributionItem.value} contributions on ${contributionItem.date}.`;
			showTips(event, summary);
			cellEl.addEventListener("mouseleave", (event) => {
				hideTips(event);
			});
		});
	}
}
