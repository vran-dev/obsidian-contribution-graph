import { Plugin } from "obsidian";
import { DEFAULT_COLORS, monthMapping, weekDayMapping } from "./constants";
import { showTips, hideTips } from "./tooltips";
import { ContributionGraphConfig, ContributionCellData } from "./types";
import {
	generateByFixedDate,
	generateByLatestDays,
} from "./matrixDataGenerator";
import { parseDate } from "./date";
import { getColorByValue, mapBy } from "./utils";

export default class ContributionGraph extends Plugin {
	async onload() {
		//@ts-ignore
		window.renderContributionGraph = (
			container: HTMLElement,
			graphConfig: ContributionGraphConfig
		): void => {
			function renderWeekdayIndicator(weekdayContainer: HTMLDivElement) {
				for (let i = 0; i < 7; i++) {
					const weekdayCell = document.createElement("div");
					weekdayCell.className = "cell weekday-indicator";
					switch (i) {
						case 1:
						case 3:
						case 5:
							weekdayCell.innerText =
								weekDayMapping[
								(i + (graphConfig.startOfWeek || 0)) % 7
								];
							break;
						default:
							break;
					}
					weekdayContainer.appendChild(weekdayCell);
				}
			}

			function render(
				graphData: ContributionGraphConfig,
				root: HTMLElement
			) {
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
				titleEl.innerText = graphData.title;

				// main -> charts
				const chartsEl = createDiv({
					cls: "charts",
					parent: main,
				});

				// main ->  week day indicator(text cell)
				const weekTextColumns = createDiv({
					cls: "column",
					parent: chartsEl,
				});
				renderWeekdayIndicator(weekTextColumns);

				let contributionData: ContributionCellData[];
				if (graphConfig.days) {
					contributionData = generateByLatestDays(
						graphConfig.days,
						graphConfig.data,
						graphConfig.startOfWeek || 0
					);
				} else if (graphConfig.fromDate && graphConfig.toDate) {
					const fromDate = parseDate(graphConfig.fromDate);
					const toDate = parseDate(graphConfig.toDate);
					contributionData = generateByFixedDate(
						fromDate,
						toDate,
						graphConfig.data,
						graphConfig.startOfWeek || 0
					);
				} else {
					throw new Error("Miss days or fromDate and toDate.");
				}

				// console.log(contributionData)

				const contributionMapByYearMonth = mapBy(
					contributionData,
					(item) => `${item.year}-${item.month + 1}`,
					(item) => item.value,
					(a, b) => a + b
				);

				// main -> charts contributionData
				const colors =
					graphData.colors && graphData.colors.length > 0
						? graphData.colors
						: DEFAULT_COLORS;

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
						monthCell.innerText =
							monthMapping[contributionItem.month];
						const yearMonth = `${contributionItem.year}-${contributionItem.month + 1
							}`;
						const yearMonthValue =
							contributionMapByYearMonth.get(yearMonth) || 0;
						// tips event
						monthCell.addEventListener("mouseenter", (event) => {
							showTips(
								event,
								`${yearMonthValue} contributions on ${yearMonth}.`
							);
						});
						monthCell.addEventListener("mouseleave", (event) => {
							hideTips(event);
						});
					}

					// main -> charts -> column -> cell
					const cellEl = document.createElement("div");
					columnEl?.appendChild(cellEl);

					if (contributionItem.value == 0) {
						if (contributionItem.date != "$HOLE$") {
							cellEl.className = "cell empty";
						} else {
							cellEl.className = "cell";
							// data attribute
							cellEl.setAttribute(
								"data-year",
								contributionItem.year.toString()
							);
							cellEl.setAttribute(
								"data-month",
								contributionItem.month.toString()
							);
						}
					} else {
						cellEl.className = "cell";
						cellEl.style.backgroundColor = getColorByValue(
							contributionItem.value,
							colors
						);

						// data attribute
						cellEl.setAttribute(
							"data-year",
							contributionItem.year.toString()
						);
						cellEl.setAttribute(
							"data-month",
							contributionItem.month.toString()
						);

						// tips event
						cellEl.onclick = (event: MouseEvent) => {
							if (graphConfig.onCellClick) {
								graphConfig.onCellClick(
									contributionItem,
									event
								);
							}
						};
						cellEl.addEventListener("mouseenter", (event) => {
							const summary = contributionItem.summary ? contributionItem.summary : `${contributionItem.value} contributions on ${contributionItem.date}.`
							showTips(event, summary);
							cellEl.addEventListener("mouseleave", (event) => {
								hideTips(event);
							});
						});
					}
				}
			}
			render(graphConfig, container);
		};
	}

	onunload() { }
}
