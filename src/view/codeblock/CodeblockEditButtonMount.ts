import { MarkdownView } from "obsidian";
import { ContributionGraphCreateModal } from "../form/GraphFormModal";

export function mountEditButtonToCodeblock(code: string, el: HTMLElement) {
	const formEdit = document.createElement("div");
	formEdit.className = "contribution-graph-codeblock-edit-button";
	const icon =
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide lucide-gantt-chart"><path d="M8 6h10"/><path d="M6 12h9"/><path d="M11 18h7"/></svg>';
	formEdit.innerHTML = icon;
	el.addEventListener("mouseover", () => {
		formEdit.style.opacity = "1";
	});
	el.addEventListener("mouseout", () => {
		formEdit.style.opacity = "0";
	});

	const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
	if (markdownView) {
		const editor = markdownView.editor;
		formEdit.onclick = () => {
			new ContributionGraphCreateModal(
				this.app,
				editor,
				code,
				(content) => {
					// @ts-ignore
					const editorView = editor.cm as EditorView;
					const pos = editorView.posAtDOM(el);
					const start = pos + "```contributionGraph\n".length;
					// set selection
					editorView.dispatch({
						changes: {
							from: start,
							to: start + (code ? code.length : 0),
							insert: content,
						},
					});
				}
			).open();
		};
		el.appendChild(formEdit);
	}
}
