import { Modal, App, Editor } from "obsidian";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import { dump, load } from "js-yaml";
import { YamlGraphConfig } from "src/processor/contributionGraphCodeBlockProcessor";
import { CreateContributionGraphForm } from "./GraphForm";

export class ContributionGraphCreateModal extends Modal {
	root: Root | null = null;

	editor: Editor;

	onSave?: (content: string) => void;

	originalConfigContent?: string;

	constructor(
		app: App,
		editor: Editor,
		originalConfigContent?: string,
		onSave?: (content: string) => void
	) {
		super(app);
		this.editor = editor;
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
				this.onSave!(dump(yamlGraphConfig));
			};
		} else {
			// create new Graph
			onSubmit = (yamlGraphConfig: YamlGraphConfig) => {
				this.close();
				if (ignoreLanguagePrefix) {
					this.editor.replaceSelection(dump(yamlGraphConfig));
				} else {
					const codeblock = `\`\`\`contributionGraph\n${dump(
						yamlGraphConfig
					)}\n\`\`\`\n`;
					this.editor.replaceSelection(codeblock);
				}
			};
		}

		this.root = createRoot(rootContainer);
		this.root.render(
			<StrictMode>
				<CreateContributionGraphForm
					yamlConfig={yamlConfig}
					onSubmit={onSubmit}
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
				return load(this.originalConfigContent) as YamlGraphConfig;
			} catch (e) {
				return null;
			}
		} else {
			return null;
		}
	}

	parseFromSelecttion(): YamlGraphConfig | null {
		const selection = this.editor.getSelection();
		if (selection && selection.trim() != "") {
			try {
				return load(selection) as YamlGraphConfig;
			} catch (e) {
				return null;
			}
		} else {
			return null;
		}
	}
}
