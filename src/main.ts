import {
	Editor,
	MarkdownFileInfo,
	MarkdownRenderChild,
	MarkdownView,
	Plugin,
} from "obsidian";
import { ContributionGraphConfig } from "./types";
import { Renders } from "./render/renders";
import { ContributionGraphRawProcessor } from "./processor/contributionGraphCodeBlockProcessor";
import { ContributionGraphCreateModal } from "./view/form/GraphFormModal";
import { mountEditButtonToCodeblock } from "./view/codeblock/CodeblockEditButtonMount";

export default class ContributionGraph extends Plugin {
	async onload() {
		this.registerGlobalRenderApi();
		this.registerCodeblockProcessor();
		this.registerContributionGraphCreateCommand();
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
				const processor = new ContributionGraphRawProcessor();
				processor.processCodeblock(code, el, ctx, this.app);
				if (el.parentElement) {
					mountEditButtonToCodeblock(code, el.parentElement);
				}
			}
		);
	}

	registerContributionGraphCreateCommand() {
		this.addCommand({
			id: "contribution-graph-create-command",
			name: "create contribution graph",
			editorCallback: (
				editor: Editor,
				ctx: MarkdownView | MarkdownFileInfo
			) => {
				new ContributionGraphCreateModal(this.app).open();
			},
		});
	}
}
