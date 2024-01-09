import { ContributionCellData, ContributionGraphConfig } from "src/types";
import { mapBy } from "src/util/utils";
import { BaseGraphRender } from "./graphRender";
import { distanceBeforeTheStartOfWeek } from "src/util/dateUtils";
import {
	localizedMonthMapping,
	localizedWeekDayMapping,
} from "src/i18/messages";

export class GitStyleTrackGraphRender extends BaseGraphRender {
	constructor() {
		super();
	}

	graphType(): string {
		return "default";
	}

	render(root: HTMLElement, graphConfig: ContributionGraphConfig): void {
		const graphEl = createDiv({
			cls: "contribution-graph",
			parent: root,
		});

		// main
		const main = createDiv({
			cls: `main ${graphConfig.fillTheScreen ? "fill-the-screen" : ""}`,
			parent: graphEl,
		});

		// title
		if (graphConfig.title && graphConfig.title.trim() != "") {
			this.renderTitle(graphConfig, main);
		}

		// main -> charts
		const chartsEl = createDiv({
			cls: ["charts", "default"],
			parent: main,
		});

		this.renderCellRuleIndicator(graphConfig, main);

		// main ->  week day indicator(text cell)
		const weekTextColumns = createDiv({
			cls: "column",
			parent: chartsEl,
		});
		this.renderWeekIndicator(weekTextColumns, graphConfig.startOfWeek);

		const contributionData: ContributionCellData[] =
			this.generateContributionData(graphConfig);

		// fill HOLE cell at the left most column if start date is not ${startOfWeek}
		if (contributionData.length > 0) {
			const from = new Date(contributionData[0].date);
			const weekDayOfFromDate = from.getDay();
			const firstHoleCount = distanceBeforeTheStartOfWeek(
				graphConfig.startOfWeek,
				weekDayOfFromDate
			);
			for (let i = 0; i < firstHoleCount; i++) {
				contributionData.unshift({
					date: "$HOLE$",
					weekDay: -1,
					month: -1,
					monthDate: -1,
					year: -1,
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

		// main -> charts contributionData
		const cellRules = this.getCellRules(graphConfig);

		let columnEl;
		for (let i = 0; i < contributionData.length; i++) {
			// i % 7 == 0 means new column
			if (i % 7 == 0) {
				columnEl = document.createElement("div");
				columnEl.className = "column";
				chartsEl.appendChild(columnEl);
			}

			const contributionItem = contributionData[i];
			// main -> charts -> column -> month indicator
			if (contributionItem.monthDate == 1) {
				const monthCell = createDiv({
					cls: "month-indicator",
					parent: columnEl,
					text: "",
				});
				monthCell.innerText = localizedMonthMapping(
					contributionItem.month
				);
				this.bindMonthTips(
					monthCell,
					contributionItem,
					contributionMapByYearMonth
				);
			}

			// main -> charts -> column -> cell
			const cellEl = document.createElement("div");
			columnEl?.appendChild(cellEl);

			if (contributionItem.value == 0) {
				if (contributionItem.date != "$HOLE$") {
					cellEl.className = "cell empty";
					this.applyCellGlobalStyle(cellEl, graphConfig);
					this.bindCellAttribute(cellEl, contributionItem);
				} else {
					cellEl.className = "cell";
				}
			} else {
				cellEl.className = "cell";
				this.applyCellGlobalStyle(cellEl, graphConfig);
				this.applyCellStyleRule(cellEl, contributionItem, cellRules);
				this.bindCellAttribute(cellEl, contributionItem);
				this.bindCellClickEvent(cellEl, contributionItem, graphConfig);
				this.bindCellTips(cellEl, contributionItem);
			}
		}
	}

	renderWeekIndicator(weekdayContainer: HTMLDivElement, startOfWeek = 0) {
		for (let i = 0; i < 7; i++) {
			const weekdayCell = document.createElement("div");
			weekdayCell.className = "cell week-indicator";
			switch (i) {
				case 1:
				case 3:
				case 5:
					weekdayCell.innerText = localizedWeekDayMapping(
						(i + startOfWeek || 0) % 7
					);
					break;
				default:
					break;
			}
			weekdayContainer.appendChild(weekdayCell);
		}
	}
}
