import { MarkdownView } from "obsidian";
import { ContributionGraphCreateModal } from "../form/GraphFormModal";

export function mountEditButtonToCodeblock(
	code: string,
	codeblockDom: HTMLElement
) {
	const formEditButton = document.createElement("div");
	formEditButton.className = "contribution-graph-codeblock-edit-button";
	const icon =
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide lucide-gantt-chart"><path d="M8 6h10"/><path d="M6 12h9"/><path d="M11 18h7"/></svg>';
	formEditButton.innerHTML = icon;
	codeblockDom.addEventListener("mouseover", () => {
		formEditButton.style.opacity = "1";
	});
	codeblockDom.addEventListener("mouseout", () => {
		formEditButton.style.opacity = "0";
	});

	formEditButton.onclick = () => {
		new ContributionGraphCreateModal(this.app, code, (content) => {
			const markdownView =
				this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!markdownView) {
				console.error("markdownView is null");
				return;
			}
			const editor = markdownView.editor;
			// @ts-ignore
			const editorView = editor.cm as EditorView;
			const pos = editorView.posAtDOM(codeblockDom);
			const start = pos + "```contributionGraph\n".length;
			// set selection
			editorView.dispatch({
				changes: {
					from: start,
					to: start + (code ? code.length : 0),
					insert: content,
				},
			});
		}).open();
	};
	codeblockDom.appendChild(formEditButton);
	return formEditButton;
}
