import { ContributionGraphConfig } from "src/types";
import { mapBy } from "src/util/utils";
import { BaseGraphRender } from "./graphRender";
import {
	localizedMonthMapping,
	localizedYearMonthMapping,
} from "src/i18/messages";

export class MonthTrackGraphRender extends BaseGraphRender {
	constructor() {
		super();
	}

	graphType(): string {
		return "month-track";
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
			cls: ["charts", "month-track"],
			parent: main,
		});

		this.renderCellRuleIndicator(graphConfig, main);

		// main ->  month date indicator(text cell)
		const dateIndicatorRow = createDiv({
			cls: "row",
			parent: chartsEl,
		});

		dateIndicatorRow.appendChild(
			createDiv({
				cls: "cell month-indicator",
				text: "",
			})
		);
		this.renderMonthDateIndicator(dateIndicatorRow);

		const activityContainer= this.renderActivityContainer(graphConfig, main);
		
		const contributionData = this.generateContributionData(
			graphConfig
		).filter((item) => item.date != "$HOLE$");

		const contributionMapByYearMonth = mapBy(
			contributionData,
			(item) => `${item.year}-${item.month + 1}`,
			(item) => item.value,
			(a, b) => a + b
		);
		const cellRules = this.getCellRules(graphConfig);

		let monthDataRowEl;
		let currentYearMonth = "";
		for (let i = 0; i < contributionData.length; i++) {
			const contributionItem = contributionData[i];
			const yearMonth = `${contributionItem.year}-${contributionItem.month}`;
			if (yearMonth != currentYearMonth) {
				// if prev month's last date < 31, fill placeholder cell
				if (i > 0) {
					const prev = contributionData[i - 1];
					const fillMax = 31 - prev.monthDate;
					for (let j = 0; j < fillMax; j++) {
						const cellEl = document.createElement("div");
						cellEl.className = "cell";
						monthDataRowEl?.appendChild(cellEl);
					}
				}

				// new month data row
				monthDataRowEl = document.createElement("div");
				monthDataRowEl.className = "row";
				chartsEl.appendChild(monthDataRowEl);
				currentYearMonth = yearMonth;

				// month indicator
				const monthIndicator = document.createElement("div");
				monthIndicator.className = "cell month-indicator";
				monthIndicator.innerText =
					contributionItem.month == 0
						? localizedYearMonthMapping(
								contributionItem.year,
								contributionItem.month
						  )
						: localizedMonthMapping(contributionItem.month);

				this.bindMonthTips(
					monthIndicator,
					contributionItem,
					contributionMapByYearMonth
				);
				monthDataRowEl.appendChild(monthIndicator);
			}

			// fill hole at start month, if start month date is not 1
			if (i == 0) {
				const startDate = new Date(contributionItem.date).getDate();
				const fillMax = startDate - 1;
				for (let j = 0; j < fillMax; j++) {
					const cellEl = document.createElement("div");
					cellEl.className = "cell";
					cellEl.innerText = "···";
					monthDataRowEl?.appendChild(cellEl);
				}
			}

			// render cell
			const cellEl = document.createElement("div");
			this.applyCellGlobalStyle(cellEl, graphConfig);
			monthDataRowEl?.appendChild(cellEl);
			if (contributionItem.value == 0) {
				cellEl.className = "cell empty";
				this.applyCellStyleRule(cellEl, contributionItem, cellRules);
				this.bindCellAttribute(cellEl, contributionItem);
			} else {
				cellEl.className = "cell";

				this.applyCellStyleRule(cellEl, contributionItem, cellRules, () => cellRules[0]);
				this.bindCellAttribute(cellEl, contributionItem);
				this.bindCellClickEvent(cellEl, contributionItem, graphConfig, activityContainer);
				this.bindCellTips(cellEl, contributionItem);
			}
		}

		// fill hole at last month, if last month date is not end of month
		if (contributionData.length > 0) {
			const last = contributionData[contributionData.length - 1];
			const fillMax = 31 - last.monthDate;
			for (let j = 0; j < fillMax; j++) {
				const cellEl = document.createElement("div");
				cellEl.className = "cell";
				monthDataRowEl?.appendChild(cellEl);
			}
		}
	}

	renderMonthDateIndicator(dateIndicatorRow: HTMLDivElement) {
		for (let i = 0; i < 31; i++) {
			const dateIndicatorCell = document.createElement("div");
			dateIndicatorCell.className = "cell date-indicator";
			dateIndicatorCell.innerText = `${i + 1}`;
			dateIndicatorRow.appendChild(dateIndicatorCell);
		}
	}
}
