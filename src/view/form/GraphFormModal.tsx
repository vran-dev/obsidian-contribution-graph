import { Modal, App, MarkdownView, parseYaml, stringifyYaml } from "obsidian";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import { GraphForm } from "./GraphForm";
import { YamlGraphConfig } from "src/processor/types";
import { YamlConfigReconciler } from "src/processor/yamlConfigReconciler";

export class ContributionGraphCreateModal extends Modal {
	root: Root | null = null;

	onSave?: (content: string) => void;

	originalConfigContent?: string;

	constructor(
		app: App,
		originalConfigContent?: string,
		onSave?: (content: string) => void
	) {
		super(app);
		this.originalConfigContent = originalConfigContent;
		this.onSave = onSave;
	}

	async onOpen() {
		const { contentEl } = this;
		const rootContainer = createDiv({
			parent: contentEl,
		});

		let yamlConfig: YamlGraphConfig;
		let ignoreLanguagePrefix = false;
		if (this.originalConfigContent) {
			yamlConfig = this.parseFromOriginalConfig()!;
		} else {
			yamlConfig = this.parseFromSelecttion()!;
			if (yamlConfig) {
				ignoreLanguagePrefix = true;
			}
		}

		if (!yamlConfig) {
			yamlConfig = new YamlGraphConfig();
		}

		let onSubmit: (yamlGraphConfig: YamlGraphConfig) => void;
		if (this.onSave) {
			// update existing Graph
			onSubmit = (yamlGraphConfig: YamlGraphConfig) => {
				this.close();
				this.onSave!(stringifyYaml(yamlGraphConfig));
			};
		} else {
			// create new Graph
			onSubmit = (yamlGraphConfig: YamlGraphConfig) => {
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!markdownView) {
					return;
				}
				const editor = markdownView.editor;
				this.close();
				if (ignoreLanguagePrefix) {
					editor.replaceSelection(stringifyYaml(yamlGraphConfig));
				} else {
					const codeblock = `\`\`\`contributionGraph\n${stringifyYaml(
						yamlGraphConfig
					)}\n\`\`\`\n`;
					editor.replaceSelection(codeblock);
				}
			};
		}

		yamlConfig = YamlConfigReconciler.reconcile(yamlConfig);

		this.root = createRoot(rootContainer);
		this.root.render(
			<StrictMode>
				<GraphForm
					yamlConfig={yamlConfig}
					onSubmit={onSubmit}
					app={this.app}
				/>
			</StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
		const { contentEl } = this;
		contentEl.empty();
	}

	parseFromOriginalConfig(): YamlGraphConfig | null {
		if (
			this.originalConfigContent &&
			this.originalConfigContent.trim() != ""
		) {
			try {
				return parseYaml(this.originalConfigContent) as YamlGraphConfig;
			} catch (e) {
				return null;
			}
		} else {
			return null;
		}
	}

	parseFromSelecttion(): YamlGraphConfig | null {
		const markdownView =
			this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!markdownView) {
			return null;
		}
		const editor = markdownView.editor;
		const selection = editor.getSelection();
		if (selection && selection.trim() != "") {
			try {
				return parseYaml(selection) as YamlGraphConfig;
			} catch (e) {
				return null;
			}
		} else {
			return null;
		}
	}
}
