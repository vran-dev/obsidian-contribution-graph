import { DEFAULT_RULES } from "src/constants";
import {
	ContributionGraphConfig,
	ContributionCellData,
	CellStyleRule,
	ContributionItem,
} from "src/types";
import { parseDate } from "src/util/dateUtils";
import {
	generateByLatestDays,
	generateByFixedDate,
	generateByData,
} from "./matrixDataGenerator";
import { matchCellStyleRule } from "src/util/utils";
import { setTooltip } from "obsidian";
import { Locals } from "src/i18/messages";

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

	createGraphEl(root: HTMLElement): HTMLDivElement {
		return createDiv({
			cls: "contribution-graph",
			parent: root,
		});
	}

	createMainEl(
		parent: HTMLElement,
		graphConfig: ContributionGraphConfig
	): HTMLDivElement {
		let cls = "main";
		if (graphConfig.fillTheScreen && this.graphType() != "calendar") {
			cls = `main ${graphConfig.fillTheScreen ? "fill-the-screen" : ""}`;
		}
		const main = createDiv({
			cls: cls,
			parent: parent,
		});
		if (graphConfig.mainContainerStyle) {
			Object.assign(main.style, graphConfig.mainContainerStyle);
		}
		return main;
	}

	renderTitle(
		graphConfig: ContributionGraphConfig,
		parent: HTMLElement
	): HTMLElement {
		const titleEl = document.createElement("div");
		titleEl.className = "title";
		if (graphConfig.title) {
			titleEl.innerText = graphConfig.title;
		}
		if (graphConfig.titleStyle) {
			Object.assign(titleEl.style, graphConfig.titleStyle);
		}
		parent.appendChild(titleEl);
		return titleEl;
	}

	renderCellRuleIndicator(
		graphConfig: ContributionGraphConfig,
		parent: HTMLElement
	) {
		if (graphConfig.showCellRuleIndicators === false) {
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
				const summary = `${rule.min} ≤ contributions ＜ ${rule.max}`;
				setTooltip(cellEl, summary);
			});
		createDiv({
			cls: "cell text",
			text: "more",
			parent: cellRuleIndicatorContainer,
		});
	}

	renderActivityContainer(
		graphConfig: ContributionGraphConfig,
		parent: HTMLElement
	): HTMLElement {
		const activityContainer = createDiv({
			cls: "activity-container",
			parent: parent,
		});
		return activityContainer;
	}

	renderActivity(
		graphConfig: ContributionGraphConfig,
		cellData: ContributionCellData,
		contaienr: HTMLElement
	) {
		contaienr.empty();

		const closeButton = createEl("button", {
			cls: "close-button",
			text: "x",
			parent: contaienr,
		});

		closeButton.onclick = () => {
			contaienr.empty();
		};

		let summary;
		if (cellData.value > 0) {
			summary = Locals.get()
				.you_have_contributed_to.replace("{date}", cellData.date)
				.replace("{value}", cellData.value.toString());
		} else {
			summary = Locals.get()
				.you_have_no_contributions_on.replace("{date}", cellData.date)
				.replace("{value}", "0");
		}
		createDiv({
			cls: "activity-summary",
			parent: contaienr,
			text: summary,
		});

		const content = createDiv({
			cls: "activity-content",
			parent: contaienr,
		});

		// list-main
		const list = createDiv({
			cls: "activity-list",
			parent: content,
		});

		// show top 10 items
		const size = 10;
		const items = cellData.items || [];
		renderActivityItem(items.slice(0, size), list);

		const navigation = createDiv({
			cls: "activity-navigation",
			parent: content,
		});

		let page = 1;
		if (items.length > size) {
			const loadMore = createEl("a", {
				text: Locals.get().click_to_load_more,
				href: "#",
				parent: navigation,
			});
			loadMore.onclick = (event) => {
				event.preventDefault();
				page++;
				renderActivityItem(
					items.slice((page - 1) * size, page * size),
					list
				);
				if (page * size >= items.length) {
					loadMore.remove();
				}
			};
		}
	}

	generateContributionData(graphConfig: ContributionGraphConfig) {
		if (graphConfig.days) {
			return generateByLatestDays(graphConfig.days, graphConfig.data);
		} else if (graphConfig.fromDate && graphConfig.toDate) {
			const fromDate = parseDate(graphConfig.fromDate);
			const toDate = parseDate(graphConfig.toDate);
			return generateByFixedDate(fromDate, toDate, graphConfig.data);
		} else {
			return generateByData(graphConfig.data);
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
		setTooltip(
			monthCell,
			`${yearMonthValue} contributions on ${yearMonth}.`
		);
	}

	applyCellGlobalStyle(
		cellEl: HTMLElement,
		graphConfig: ContributionGraphConfig
	) {
		if (graphConfig.cellStyle) {
			Object.assign(cellEl.style, graphConfig.cellStyle);
		}
	}

	applyCellGlobalStylePartial(
		cellEl: HTMLElement,
		graphConfig: ContributionGraphConfig,
		props: string[]
	) {
		if (graphConfig.cellStyle) {
			const partialStyle = props.reduce((acc, cur) => {
				// @ts-ignore
				acc[cur] = graphConfig.cellStyle[cur];
				return acc;
			}, {});
			Object.assign(cellEl.style, partialStyle);
		}
	}

	applyCellStyleRule(
		cellEl: HTMLElement,
		contributionItem: ContributionCellData,
		cellRules: CellStyleRule[],
		defaultCellStyleRule?: () => CellStyleRule
	) {
		const cellStyleRule = matchCellStyleRule(
			contributionItem.value,
			cellRules
		);
		if (cellStyleRule != null) {
			cellEl.style.backgroundColor = cellStyleRule.color;
			cellEl.innerText = cellStyleRule.text || "";
			return;
		}

		if (defaultCellStyleRule) {
			const defaultRule = defaultCellStyleRule();
			cellEl.style.backgroundColor = defaultRule.color;
			cellEl.innerText = defaultRule.text || "";
		}
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
		graphConfig: ContributionGraphConfig,
		activityContainer?: HTMLElement
	) {
		cellEl.onclick = (event: MouseEvent) => {
			if (graphConfig.onCellClick) {
				graphConfig.onCellClick(contributionItem, event);
			}

			if (activityContainer) {
				this.renderActivity(
					graphConfig,
					contributionItem,
					activityContainer
				);
			}
		};
	}

	bindCellTips(cellEl: HTMLElement, contributionItem: ContributionCellData) {
		cellEl.addEventListener("mouseenter", (event) => {
			const summary = contributionItem.summary
				? contributionItem.summary
				: `${contributionItem.value} contributions on ${contributionItem.date}.`;
			setTooltip(cellEl, summary);
		});
	}
}

function renderActivityItem(items: ContributionItem[], listMain: HTMLElement) {
	(items || []).slice(0, 10).forEach((item) => {
		const listItem = createDiv({
			cls: "activity-item",
			parent: listMain,
		});

		const linkEl = createEl("a", {
			text: item.label,
			href: "#",
			parent: listItem,
			cls: "label",
		});
		linkEl.onclick = (event) => {
			event.preventDefault();
			if (item.open) {
				item.open(event);
			}
		};
	});
}
