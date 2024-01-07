import { MarkdownView, getIcon } from "obsidian";
import { ContributionGraphCreateModal } from "../form/GraphFormModal";

export function mountEditButtonToCodeblock(
	code: string,
	codeblockDom: HTMLElement
) {
	const formEditButton = document.createElement("div");
	formEditButton.className = "contribution-graph-codeblock-edit-button";
	const iconEl = getIcon("gantt-chart");
	if (iconEl) {
		formEditButton.appendChild(iconEl);
	}
	codeblockDom.addEventListener("mouseover", () => {
		formEditButton.style.opacity = "1";
		justifyTop(codeblockDom, formEditButton);
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

function justifyTop(codeblockDom: HTMLElement, formEditButton: HTMLDivElement) {
	const obCodeblocButtonEls =
		codeblockDom.getElementsByClassName("edit-block-button");
	let top: string | undefined;
	if (obCodeblocButtonEls.length > 0) {
		const obCodeblocButtonEl = obCodeblocButtonEls[0];
		// @ts-ignore
		top = obCodeblocButtonEl.computedStyleMap().get("top")?.toString();
	}

	if (top) {
		formEditButton.style.top = top;
	} else {
		formEditButton.style.top = "0";
	}
}
