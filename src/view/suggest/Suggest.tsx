import {
	useFloating,
	offset,
	flip,
	shift,
	inline,
	autoUpdate,
	useDismiss,
	useRole,
	useInteractions,
	hide,
} from "@floating-ui/react";
import { debounce } from "obsidian";
import * as React from "react";
import { CSSProperties, useEffect, useLayoutEffect } from "react";

export function Suggest(props: {
	query: string;
	showSuggest: boolean;
	onSelected: (item: SuggestItem, index: number) => void;
	getItems: (query: string) => SuggestItem[];
	onOpenChange?: (open: boolean) => void;
	anchorElement: Element;
	onSelectChange?: (item: SuggestItem | null, index: number) => void;
	style?: CSSProperties;
}): JSX.Element {
	const { query, onOpenChange, anchorElement, showSuggest } = props;
	const [activeIndex, setActiveIndex] = React.useState<number>(-1);
	const [items, setItems] = React.useState<SuggestItem[]>([]);

	useEffect(() => {
		if (query == undefined || query == null) {
			return;
		}
		const queryItems = debounce(
			(query: string) => {
				setItems(props.getItems(query));
			},
			300,
			true
		);
		queryItems(query);
		return () => {
			queryItems.cancel();
		};
	}, [query, props.getItems]);

	useEffect(() => {
		setActiveIndex(-1);
	}, [query]);

	useEffect(() => {
		if (props.onSelectChange) {
			if (activeIndex == undefined) {
				props.onSelectChange(null, -1);
			} else {
				props.onSelectChange(items[activeIndex], activeIndex);
			}
		}
	}, [activeIndex, items]);

	const { refs, floatingStyles, context } = useFloating({
		open: showSuggest,
		onOpenChange: onOpenChange,
		middleware: [offset(6), flip(), shift(), inline()],
		whileElementsMounted: autoUpdate,
		elements: {
			reference: anchorElement,
		},
	});

	const dismiss = useDismiss(context);
	const role = useRole(context, { role: "tooltip" });
	const { getFloatingProps } = useInteractions([dismiss, role]);

	// Handle keyboard events
	useEffect(() => {
		if (!showSuggest) {
			return;
		}
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				setActiveIndex((index) => {
					return (index + 1) % items.length;
				});
			} else if (event.key === "ArrowUp") {
				event.preventDefault();
				setActiveIndex((selected) => {
					return (selected - 1 + items.length) % items.length;
				});
			} else if (event.key === "Enter") {
				if (activeIndex < 0 || activeIndex >= items.length) {
					return;
				}
				if (items.length > 0) {
					event.preventDefault();
					props.onSelected(items[activeIndex], activeIndex);
				}
			} else if (event.key === "Escape") {
				event.preventDefault();
				hide();
			}
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [activeIndex, items, showSuggest]);

	useLayoutEffect(() => {
		if (!showSuggest || activeIndex == undefined) {
			return;
		}
		const selectContainer = refs.floating?.current;
		const item = selectContainer?.children[activeIndex] as HTMLElement;
		if (item && selectContainer) {
			updateScrollView(selectContainer, item);
		}
	}, [activeIndex, showSuggest]);

	return (
		<>
			{showSuggest && items.length > 0 && (
				<div
					className="suggest-container"
					ref={refs.setFloating}
					style={{
						...floatingStyles,
					}}
					{...getFloatingProps()}
				>
					{items.map((item, index) => {
						return (
							<div
								className={`suggest-item ${
									index === activeIndex ? "selected" : ""
								}`}
								key={item.id}
								onClick={(e) => {
									e.preventDefault();
									props.onSelected(item, index);
									setActiveIndex(index);
								}}
							>
								{item.icon && <div className="suggest-icon">{item.icon}</div>}
								<div className="suggest-content">
									<div className="suggest-label">
										{item.label}
									</div>
									<div className="suggest-description">
										{item.description}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</>
	);
}

export const updateScrollView = (
	container: HTMLElement,
	item: HTMLElement
): void => {
	const containerHeight = container.offsetHeight;
	const itemHeight = item ? item.offsetHeight : 0;

	const top = item.offsetTop;
	const bottom = top + itemHeight;

	if (top < container.scrollTop) {
		container.scrollTop -= container.scrollTop - top + 5;
	} else if (bottom > containerHeight + container.scrollTop) {
		container.scrollTop +=
			bottom - containerHeight - container.scrollTop + 5;
	}
};

export interface SuggestItem {
	id: string;
	label: string;
	value: string;
	icon?: React.ReactNode;
	description?: string;
}
