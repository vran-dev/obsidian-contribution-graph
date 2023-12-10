import { Plugin } from "obsidian";

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
		color: "#ebedf0",
		min: 0,
		max: 0,
	},
	{
		color: "#9be9a8",
		min: 1,
		max: 10,
	},
	{
		color: "#40c463",
		min: 11,
		max: 15,
	},
	{
		color: "#30a14e",
		min: 16,
		max: 20,
	},
	{
		color: "#216e39",
		min: 21,
		max: 999,
	},
];

const DEFAULT_SETTINGS: ContributionGraphData = {
	title: "Contributions",
	days: 365,
	contributions: [],
	colors: [],
};

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

				// header
				const headerEl = createDiv({
					cls: "header",
					parent: graphEl,
				});
				headerEl.innerText = graphData.title;
				// main
				const main = createDiv({
					cls: "main",
					parent: graphEl,
				});

				// main -> month indicator
				const monthIndicatorEl = createDiv({
					cls: "month-indicator",
					parent: main,
				});

				createDiv({
					cls: "text-cell",
					parent: monthIndicatorEl,
				});

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
					weekdayCell.className = "text-cell";
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

				// generate color indicator(color cell)
				const monthMapping = [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				];
				for (let i = 0; i < contributionData.length; i++) {
					const monthCell = document.createElement("div");
					monthCell.className = "cell";
					monthIndicatorEl.appendChild(monthCell);

					const weekContribution = contributionData[i];

					const columnEl = document.createElement("div");
					columnEl.className = "column";
					for (let j = 0; j < weekContribution.length; j++) {
						if (weekContribution[j].monthDate == 1) {
							monthCell.className = "cell text";
							monthCell.innerText =
								monthMapping[weekContribution[j].month];
						}
						
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
								DEFAULT_COLORS
							);
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
	weekDay: number;
	month: number;
	monthDate: number;
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

function generateData(days: number, contributions?: Contribution[]) {
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

	const data = [];
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
