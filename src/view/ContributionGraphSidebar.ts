import { Component, ItemView, ViewStateResult, stringifyYaml } from "obsidian";
import { CodeBlockProcessor } from "src/processor/codeBlockProcessor";
import { YamlGraphConfig } from "src/processor/types";
import { ContributionGraphCreateModal } from "./form/GraphFormModal";

export const CONTRIBUTION_GRAPH_SIDEBAR = "contribution-graph-sidebar";

export class ContributionGraphSidebar extends ItemView {
	private config = stringifyYaml(new YamlGraphConfig());
	private graphEl?: HTMLElement;
	private renderScope?: Component;
	private configModal?: ContributionGraphCreateModal;

	getViewType(): string {
		return CONTRIBUTION_GRAPH_SIDEBAR;
	}

	getDisplayText(): string {
		return "Contribution Graph";
	}

	getIcon(): string {
		return "gantt-chart";
	}

	getState(): Record<string, unknown> {
		return { ...super.getState(), config: this.config };
	}

	async setState(state: { config?: unknown }, result: ViewStateResult): Promise<void> {
		await super.setState(state, result);
		if (typeof state?.config === "string" && state.config !== this.config) {
			this.config = state.config;
			await this.renderGraph();
		}
	}

	async onOpen(): Promise<void> {
		this.contentEl.addClass("contribution-graph-sidebar");
		this.contentEl.createEl("button", { text: "Configure graph" }).onclick = () => {
			this.configModal = new ContributionGraphCreateModal(this.app, this.config, (config) => {
				this.config = config;
				this.app.workspace.requestSaveLayout();
				void this.renderGraph();
			});
			this.configModal.open();
		};
		this.contentEl.createEl("button", { text: "Refresh graph" }).onclick = () => {
			void this.renderGraph();
		};
		this.graphEl = this.contentEl.createDiv();
		await this.renderGraph();
	}

	async onClose(): Promise<void> {
		this.configModal?.close();
		this.configModal = undefined;
		if (this.renderScope) this.removeChild(this.renderScope);
		this.renderScope = undefined;
		this.graphEl = undefined;
		this.contentEl.empty();
	}

	private async renderGraph(): Promise<void> {
		if (!this.graphEl) return;
		if (this.renderScope) this.removeChild(this.renderScope);
		this.renderScope = this.addChild(new Component());
		this.graphEl.empty();
		await new CodeBlockProcessor().renderFromConfig(
			this.config,
			this.graphEl,
			this.app,
			this.renderScope
		);
	}
}
