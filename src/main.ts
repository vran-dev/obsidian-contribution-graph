import { Plugin } from "obsidian";
import { ContributionGraphConfig } from "./types";
import { Renders } from "./render/renders";
import { ContributionGraphCodeBlockProcessor } from "./processor/contributionGraphCodeBlockProcessor";

export default class ContributionGraph extends Plugin {
	async onload() {
		this.registerGlobalRenderApi();
		this.registerCodeblockProcessor();
	}

	onunload() {}

	registerGlobalRenderApi() {
		//@ts-ignore
		window.renderContributionGraph = (
			container: HTMLElement,
			graphConfig: ContributionGraphConfig
		): void => {
			Renders.render(container, graphConfig);
		};
	}

	registerCodeblockProcessor() {
		this.registerMarkdownCodeBlockProcessor(
			"contributionGraph",
			(code, el, ctx) => {
				const processor = new ContributionGraphCodeBlockProcessor();
				processor.process(code, el, ctx, this.app);
			}
		);
	}
}
