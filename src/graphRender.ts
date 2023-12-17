import { DEFAULT_RULES, monthMapping, weekDayMapping } from "./constants";
import {
	distanceBeforeTheEndOfWeek,
	distanceBeforeTheStartOfWeek,
	getLastDayOfMonth,
	parseDate,
	toFormattedDate,
} from "./dateUtils";
import {
	generateByLatestDays,
	generateByFixedDate,
} from "./matrixDataGenerator";
import { showTips, hideTips } from "./tooltips";
import { ContributionCellData, ContributionGraphConfig } from "./types";
import { mapBy, matchCellStyleRule } from "./utils";

export class GraphRender {
	renderMonthTrack(graphConfig: ContributionGraphConfig, root: HTMLElement) {
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
		const titleEl = createDiv({
			cls: "title",
			parent: main,
		});
		titleEl.innerText = graphConfig.title;

		// main -> charts
		const chartsEl = createDiv({
			cls: ["charts", "month-track"],
			parent: main,
		});

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
						? `${contributionItem.year}  ${monthMapping[contributionItem.month]}`
						: monthMapping[contributionItem.month];

				this.bindMonthTips(
					monthIndicator,
					contributionItem,
					contributionMapByYearMonth
				);
				monthDataRowEl.appendChild(monthIndicator);
			}

			// fill start month, if start month date is not 1
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
			monthDataRowEl?.appendChild(cellEl);
			if (contributionItem.value == 0) {
				cellEl.className = "cell empty";
				this.bindCellAttribute(cellEl, contributionItem);
			} else {
				cellEl.className = "cell";
				const cellStyleRule = matchCellStyleRule(
					contributionItem.value,
					cellRules
				);
				cellEl.style.backgroundColor = cellStyleRule.color;
				cellEl.innerText = cellStyleRule.text || "";

				this.bindCellAttribute(cellEl, contributionItem);
				this.bindCellClickEvent(cellEl, contributionItem, graphConfig);
				this.bindCellTips(cellEl, contributionItem);
			}
		}

		// fill last month, if last month date is not 31
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

	renderDefault(graphConfig: ContributionGraphConfig, root: HTMLElement) {
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
		const titleEl = createDiv({
			cls: "title",
			parent: main,
		});
		titleEl.innerText = graphConfig.title;

		// main -> charts
		const chartsEl = createDiv({
			cls: ["charts", "default"],
			parent: main,
		});

		// main ->  week day indicator(text cell)
		const weekTextColumns = createDiv({
			cls: "column",
			parent: chartsEl,
		});
		this.renderWeekIndicator(weekTextColumns, graphConfig.startOfWeek);

		const contributionData: ContributionCellData[] =
			this.generateContributionData(graphConfig);
		// console.log(contributionData)

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
				monthCell.innerText = monthMapping[contributionItem.month];
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
				} else {
					cellEl.className = "cell";
					this.bindCellAttribute(cellEl, contributionItem);
				}
			} else {
				cellEl.className = "cell";
				const cellStyleRule = matchCellStyleRule(
					contributionItem.value,
					cellRules
				);
				cellEl.style.backgroundColor = cellStyleRule.color;
				cellEl.innerText = cellStyleRule.text || "";

				this.bindCellAttribute(cellEl, contributionItem);
				this.bindCellClickEvent(cellEl, contributionItem, graphConfig);
				this.bindCellTips(cellEl, contributionItem);
			}
		}
	}

	renderCalendar(graphConfig: ContributionGraphConfig, root: HTMLElement) {
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
		const titleEl = createDiv({
			cls: "title",
			parent: main,
		});
		titleEl.innerText = graphConfig.title;

		// main -> charts
		const chartsEl = createDiv({
			cls: ["charts", "calendar"],
			parent: main,
		});
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
					monthIndicator.innerText = `${monthMapping[item.month]} ${item.year}`;
				} else {
					monthIndicator.innerText = monthMapping[item.month];
				}
				monthContainer.appendChild(monthIndicator);
				this.bindMonthTips(monthIndicator, item, contributionMapByYearMonth);

				const weekDateIndicators = createDiv({
					cls: ["row", "week-indicator-container"],
					parent: monthContainer,
				})
				for (let i = 0; i < 7; i++) {
					const dateIndicatorCell = document.createElement("div");
					dateIndicatorCell.className = "cell week-indicator";
					const weekText = weekDayMapping[((graphConfig.startOfWeek || 0) + 7 + i) % 7].substring(0, 2)
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
				this.bindCellAttribute(cellEl, item);
			} else {
				cellEl.className = "cell";
				const cellStyleRule = matchCellStyleRule(item.value, cellRules);
				cellEl.style.backgroundColor = cellStyleRule.color;
				cellEl.innerText = cellStyleRule.text || "";

				this.bindCellAttribute(cellEl, item);
				this.bindCellClickEvent(cellEl, item, graphConfig);
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
			} else if ((i + 1) == contributionData.length) {
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

	renderMonthDateIndicator(dateIndicatorRow: HTMLDivElement) {
		for (let i = 0; i < 31; i++) {
			const dateIndicatorCell = document.createElement("div");
			dateIndicatorCell.className = "cell date-indicator";
			dateIndicatorCell.innerText = `${i + 1}`;
			dateIndicatorRow.appendChild(dateIndicatorCell);
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
					weekdayCell.innerText =
						weekDayMapping[(i + startOfWeek || 0) % 7];
					break;
				default:
					break;
			}
			weekdayContainer.appendChild(weekdayCell);
		}
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
