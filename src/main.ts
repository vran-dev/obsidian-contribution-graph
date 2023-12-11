import { Plugin } from "obsidian";
import { monthMapping } from "./constants";
import { showTips, hideTips } from "./tooltips";

interface ContributionGraphData {
	title: string;
	days: number;
	contributions: Contribution[];
	colors: Color[];
}

interface Contribution {
	date: string;
	value: number;
}

interface Color {
	color: string;
	min: number;
	max: number;
}

const DEFAULT_COLORS: Color[] = [
	{
		color: "#9be9a8",
		min: 1,
		max: 2,
	},
	{
		color: "#40c463",
		min: 3,
		max: 5,
	},
	{
		color: "#30a14e",
		min: 6,
		max: 10,
	},
	{
		color: "#216e39",
		min: 10,
		max: 999,
	},
];

export default class ContributionGraph extends Plugin {
	async onload() {
		//@ts-ignore
		window.renderContributionGraph = (
			container: HTMLElement,
			data: ContributionGraphData
		): void => {
			function render(
				graphData: ContributionGraphData,
				root: HTMLElement
			) {
				const contributionData = generateData(
					graphData.days,
					data.contributions
				);
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

				for (let i = 0; i < 7; i++) {
					const weekdayCell = document.createElement("div");
					weekdayCell.className = "cell weekday-indicator";
					switch (i) {
						case 1:
							weekdayCell.innerText = "Mon";
							break;
						case 3:
							weekdayCell.innerText = "Wed";
							break;
						case 5:
							weekdayCell.innerText = "Fri";
							break;
						default:
							break;
					}
					weekTextColumns.appendChild(weekdayCell);
				}

				const colors =
					graphData.colors && graphData.colors.length > 0
						? graphData.colors
						: DEFAULT_COLORS;
				for (let i = 0; i < contributionData.length; i++) {
					const weekContribution = contributionData[i];
					const columnEl = document.createElement("div");
					columnEl.className = "column";

					for (let j = 0; j < weekContribution.length; j++) {
						// month text cell
						if (weekContribution[j].monthDate == 1) {
							const monthCell = createDiv({
								cls: "month-indicator",
								parent: columnEl,
								text: "",
							});
							monthCell.innerText =
								monthMapping[weekContribution[j].month];

							monthCell.addEventListener(
								"mouseenter",
								(event) => {
									const expectMonth =
										weekContribution[j].month;
									const expectYear = weekContribution[j].year;

									const elements = document.querySelectorAll(
										`.cell[data-year="${expectYear}"][data-month="${expectMonth}"]`
									);
									elements.forEach((element) => {
										element.classList.add("highlight");
									});
								}
							);
							monthCell.addEventListener(
								"mouseleave",
								(event) => {
									const expectMonth =
										weekContribution[j].month;
									const expectYear = weekContribution[j].year;
									const elements = document.querySelectorAll(
										`.cell[data-year="${expectYear}"][data-month="${expectMonth}"]`
									);
									elements.forEach((element) => {
										element.classList.remove("highlight");
									});
								}
							);
						}

						// contribution cell
						const box = document.createElement("div");
						if (weekContribution[j].value == 0) {
							if (weekContribution[j].date != "$HOLE$") {
								box.className = "cell empty";
							} else {
								box.className = "cell";
							}
						} else {
							box.className = "cell";
							box.style.backgroundColor = getColor(
								weekContribution[j].value,
								colors
							);
							box.setAttribute(
								"data-year",
								weekContribution[j].year.toString()
							);
							box.setAttribute(
								"data-month",
								weekContribution[j].month.toString()
							);
							box.addEventListener("mouseenter", (event) => {
								showTips(
									event,
									`${weekContribution[j].value} contributions on ${weekContribution[j].date}.`
								);
							});
							box.addEventListener("mouseleave", (event) => {
								hideTips(event);
							});
						}
						columnEl.appendChild(box);
					}
					chartsEl.appendChild(columnEl);
				}
			}
			render(data, container);
		};
	}

	onunload() {}
}

interface ContributionData {
	date: string;
	weekDay: number; // 0 - 6
	month: number; // 0 - 11
	monthDate: number; // 1 - 31
	year: number; // sample: 2020
	value: number;
}

function getColor(value: number, colors: Color[]) {
	for (let i = 0; i < colors.length; i++) {
		if (value >= colors[i].min && value <= colors[i].max) {
			return colors[i].color;
		}
	}
	return colors[0].color;
}

/**
 * generate two-dimensional matrix data
 * - every column is week, from Sunday to Saturday
 * - every cell is a day
 */
function generateData(
	days: number,
	contributions?: Contribution[]
): ContributionData[][] {
	// convert contributions to map
	const contributionMapByDate = new Map<string, number>();
	if (contributions) {
		for (let i = 0; i < contributions.length; i++) {
			if (contributionMapByDate.has(contributions[i].date)) {
				contributionMapByDate.set(
					contributions[i].date,
					contributionMapByDate.get(contributions[i].date) +
						contributions[i].value
				);
			} else {
				contributionMapByDate.set(
					contributions[i].date,
					contributions[i].value
				);
			}
		}
	}

	const data: ContributionData[][] = [];
	let columns: ContributionData[] = [];
	data.unshift(columns);
	for (let i = 0; i < days; i++) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		const formattedDate = `${date.getFullYear()}-${
			date.getMonth() < 9
				? "0" + (date.getMonth() + 1)
				: date.getMonth() + 1
		}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;

		const value = contributionMapByDate.get(formattedDate);
		columns.unshift({
			date: formattedDate,
			weekDay: date.getDay(),
			month: date.getMonth(),
			monthDate: date.getDate(),
			year: date.getFullYear(),
			value: value ? value : 0,
		});

		// fill the rest of the week with empty cells if the first day of the week is not Sunday
		if (i == days - 1) {
			const diff = 7 - columns.length;
			for (let x = 0; x < diff; x++) {
				columns.unshift({
					date: "$HOLE$",
					weekDay: -1,
					month: -1,
					monthDate: -1,
					year: -1,
					value: 0,
				});
			}
		}

		// Sunday is the first day of the week
		if (date.getDay() == 0) {
			columns = [];
			data.unshift(columns);
		}
	}
	return data;
}
