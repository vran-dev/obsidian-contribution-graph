// 鼠标移入事件处理程序
export function showTips(event: MouseEvent, text: string) {
	// 创建并添加 tooltip 元素
	const tooltip = createDiv({
		cls: "tooltip",
		text: text,
		parent: document.body,
	});
	tooltip.style.minWidth = "140px";

	// 调整 tooltip 元素的位置
	if (event.target) {
		//@ts-ignore
		const rect = event.target.getBoundingClientRect();
		tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + "px";
		tooltip.style.left = rect.left + "px";
	}
}

// 鼠标移出事件处理程序
export function hideTips(event: MouseEvent) {
	// 隐藏或删除 tooltip 元素
	const tooltip = document.querySelector(".tooltip");
	if (tooltip) {
		document.body.removeChild(tooltip);
	}
}
