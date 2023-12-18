import { Plugin } from "obsidian";
import { ContributionGraphConfig } from "./types";
import { GraphRender } from "./graphRender";

export default class ContributionGraph extends Plugin {
	async onload() {
		//@ts-ignore
		window.renderContributionGraph = (
			container: HTMLElement,
			graphConfig: ContributionGraphConfig
		): void => {
			const render = new GraphRender();
			if (graphConfig.graphType === "month-track") {
				render.renderMonthTrack(graphConfig, container);
			} else if (graphConfig.graphType === "calendar") {
				render.renderCalendar(graphConfig, container);
			} else if (
				graphConfig.graphType === "default" ||
				!graphConfig.graphType
			) {
				render.renderDefault(graphConfig, container);
			} else {
				throw new Error(
					`Unsupported graph type: ${graphConfig.graphType}, only support 'default' and 'month-track'`
				);
			}
		};
	}

	onunload() {}
}
