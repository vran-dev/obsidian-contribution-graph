import { Editor, MarkdownFileInfo, MarkdownView, Plugin } from "obsidian";
import { ContributionGraphConfig } from "./types";
import { Renders } from "./render/renders";
import { CodeBlockProcessor } from "./processor/codeBlockProcessor";
import { ContributionGraphCreateModal } from "./view/form/GraphFormModal";
import { mountEditButtonToCodeblock } from "./view/codeblock/CodeblockEditButtonMount";
import { Locals } from "./i18/messages";
import { CONTRIBUTION_GRAPH_SIDEBAR, ContributionGraphSidebar } from "./view/ContributionGraphSidebar";
import "../style/styles.css";

export default class ContributionGraph extends Plugin {
	private openingSidebar = false;

	async onload() {
		this.registerView(CONTRIBUTION_GRAPH_SIDEBAR, (leaf) => new ContributionGraphSidebar(leaf));
		this.addCommand({
			id: "open-sidebar",
			name: "Open contribution graph in right sidebar",
			callback: () => this.openSidebar(),
		});
		this.registerGlobalRenderApi();
		this.registerCodeblockProcessor();
		this.registerContributionGraphCreateCommand();
		this.registerContextMenu();
	}

	private async openSidebar(): Promise<void> {
		if (this.openingSidebar) return;
		this.openingSidebar = true;
		try {
			const workspace = this.app.workspace;
			let leaf = workspace.getLeavesOfType(CONTRIBUTION_GRAPH_SIDEBAR)[0];
			if (!leaf) {
				leaf = workspace.getRightLeaf(false);
				if (!leaf) return;
				await leaf.setViewState({ type: CONTRIBUTION_GRAPH_SIDEBAR });
			}
			await workspace.revealLeaf(leaf);
		} finally {
			this.openingSidebar = false;
		}
	}

	onunload() {
		// @ts-ignore
		window.renderContributionGraph = undefined;
	}

	registerContextMenu() {
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, info) => {
				menu.addItem((item) => {
					item.setTitle(Locals.get().context_menu_create);
					item.setIcon("gantt-chart");
					item.onClick(() => {
						new ContributionGraphCreateModal(this.app).open();
					});
				});
			})
		);
	}

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
				const processor = new CodeBlockProcessor();
				processor.renderFromCodeBlock(code, el, ctx, this.app);
				if (el.parentElement) {
					mountEditButtonToCodeblock(
						this.app,
						code,
						el.parentElement
					);
				}
			}
		);
	}

	registerContributionGraphCreateCommand() {
		this.addCommand({
			id: "create-graph",
			name: Locals.get().context_menu_create,
			editorCallback: (
				editor: Editor,
				ctx: MarkdownView | MarkdownFileInfo
			) => {
				new ContributionGraphCreateModal(this.app).open();
			},
		});
	}
}
