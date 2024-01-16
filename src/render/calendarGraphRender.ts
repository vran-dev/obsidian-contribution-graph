import { ContributionGraphConfig } from "src/types";
import {
	getLastDayOfMonth,
	toFormattedDate,
	distanceBeforeTheStartOfWeek,
	distanceBeforeTheEndOfWeek,
} from "src/util/dateUtils";
import { mapBy } from "src/util/utils";
import { BaseGraphRender } from "./graphRender";
import {
	localizedMonthMapping,
	localizedWeekDayMapping,
	localizedYearMonthMapping,
} from "src/i18/messages";

export class CalendarGraphRender extends BaseGraphRender {
	constructor() {
		super();
	}

	graphType(): string {
		return "calendar";
	}

	render(root: HTMLElement, graphConfig: ContributionGraphConfig): void {
		const graphEl = createDiv({
			cls: "contribution-graph",
			parent: root,
		});

		// main
		const main = createDiv({
			cls: "main",
			parent: graphEl,
		});

		// title
		if (graphConfig.title && graphConfig.title.trim() != "") {
			this.renderTitle(graphConfig, main);
		}

		// main -> charts
		const chartsEl = createDiv({
			cls: ["charts", "calendar"],
			parent: main,
		});

		this.renderCellRuleIndicator(graphConfig, main);

		const activityContainer= this.renderActivityContainer(graphConfig, main);

		const contributionData = this.generateContributionData(
			graphConfig
		).filter((item) => item.date != "$HOLE$");

		// fill first month distance
		if (contributionData.length > 0) {
			const first = contributionData[0];
			const distanceBeforeTheStartOfMonth = first.monthDate - 1;
			const firstDate = new Date(first.date);
			for (let j = 0; j < distanceBeforeTheStartOfMonth; j++) {
				firstDate.setDate(firstDate.getDate() - 1);
				contributionData.unshift({
					date: "$HOLE$",
					weekDay: firstDate.getDay(),
					month: firstDate.getMonth(),
					monthDate: firstDate.getDate(),
					year: firstDate.getFullYear(),
					value: 0,
				});
			}
		}

		// fill last month distance
		if (contributionData.length > 0) {
			const last = contributionData[contributionData.length - 1];
			const lastDay = getLastDayOfMonth(last.year, last.month);
			const distanceBeforeTheEndOfMonth = lastDay - last.monthDate;
			const lastDate = new Date(last.date);
			for (let j = 0; j < distanceBeforeTheEndOfMonth; j++) {
				lastDate.setDate(lastDate.getDate() + 1);
				contributionData.push({
					date: toFormattedDate(lastDate),
					weekDay: lastDate.getDay(),
					month: lastDate.getMonth(),
					monthDate: lastDate.getDate(),
					year: lastDate.getFullYear(),
					value: 0,
				});
			}
		}

		const contributionMapByYearMonth = mapBy(
			contributionData,
			(item) => `${item.year}-${item.month + 1}`,
			(item) => item.value,
			(a, b) => a + b
		);
		const cellRules = this.getCellRules(graphConfig);
		let currentYearMonth = "";
		let monthContainer;
		let rowContainer = null;
		for (let i = 0; i < contributionData.length; i++) {
			const item = contributionData[i];
			const yearMonth = `${item.year}-${item.month + 1}`;
			if (yearMonth != currentYearMonth) {
				currentYearMonth = yearMonth;

				monthContainer = document.createElement("div");
				monthContainer.className = "month-container";
				chartsEl.appendChild(monthContainer);

				const monthIndicator = document.createElement("div");
				monthIndicator.className = "month-indicator";
				if (item.month == 0) {
					monthIndicator.innerText = localizedYearMonthMapping(
						item.year,
						item.month
					);
				} else {
					monthIndicator.innerText = localizedMonthMapping(
						item.month
					);
				}
				monthContainer.appendChild(monthIndicator);
				this.bindMonthTips(
					monthIndicator,
					item,
					contributionMapByYearMonth
				);

				const weekDateIndicators = createDiv({
					cls: ["row", "week-indicator-container"],
					parent: monthContainer,
				});
				for (let i = 0; i < 7; i++) {
					const dateIndicatorCell = document.createElement("div");
					dateIndicatorCell.className = "cell week-indicator";
					const weekText = localizedWeekDayMapping(
						((graphConfig.startOfWeek || 0) + 7 + i) % 7,
						2
					);
					dateIndicatorCell.innerText = weekText;
					weekDateIndicators.appendChild(dateIndicatorCell);
				}

				rowContainer = document.createElement("div");
				rowContainer.className = "row";
				monthContainer?.appendChild(rowContainer);

				// fill start month, if start month date is not 1
				const distance = distanceBeforeTheStartOfWeek(
					graphConfig.startOfWeek || 0,
					item.weekDay
				);
				for (let j = 0; j < distance; j++) {
					const cellEl = document.createElement("div");
					cellEl.className = "cell";
					rowContainer?.appendChild(cellEl);
				}
			}

			if (
				rowContainer == null ||
				item.weekDay == (graphConfig.startOfWeek || 0)
			) {
				rowContainer = document.createElement("div");
				rowContainer.className = "row";
				monthContainer?.appendChild(rowContainer);
			}

			// render cell
			const cellEl = document.createElement("div");
			rowContainer?.appendChild(cellEl);
			cellEl.className = "cell";
			if (item.date == "$HOLE$") {
				cellEl.innerText = "···";
				cellEl.className = "cell";
			} else if (item.value == 0) {
				cellEl.className = "cell empty";
				this.applyCellGlobalStyle(cellEl, graphConfig);
				this.applyCellStyleRule(cellEl, item, cellRules);
				this.bindCellAttribute(cellEl, item);
			} else {
				cellEl.className = "cell";
				this.applyCellGlobalStyle(cellEl, graphConfig);
				this.applyCellStyleRule(cellEl, item, cellRules, () => cellRules[0]);
				this.bindCellAttribute(cellEl, item);
				this.bindCellClickEvent(cellEl, item, graphConfig, activityContainer);
				this.bindCellTips(cellEl, item);
			}

			if (i + 1 < contributionData.length) {
				const next = contributionData[i + 1];
				if (next.month != item.month) {
					const distance = distanceBeforeTheEndOfWeek(
						graphConfig.startOfWeek || 0,
						item.weekDay
					);
					for (let j = 0; j < distance; j++) {
						const cellEl = document.createElement("div");
						cellEl.className = "cell";
						rowContainer?.appendChild(cellEl);
					}
				}
			} else if (i + 1 == contributionData.length) {
				const distance = distanceBeforeTheEndOfWeek(
					graphConfig.startOfWeek || 0,
					item.weekDay
				);
				for (let j = 0; j < distance; j++) {
					const cellEl = document.createElement("div");
					cellEl.className = "cell";
					rowContainer?.appendChild(cellEl);
				}
			}
		}
	}
}
