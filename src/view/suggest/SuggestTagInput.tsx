import { ReactNode, useRef, useState } from "react";
import { SuggestItem, Suggest } from "./Suggest";

export class TagOption {
	id: string;
	value: string;
	icon?: ReactNode;
}

export function InputTags(props: {
	tags: TagOption[];
	onChange: (tags: TagOption[]) => void;
	onRemove: (tag: TagOption) => void;
	getItems?: (query: string) => SuggestItem[];
	inputPlaceholder?: string;
	excludeTriggerKeys?: string[];
}): JSX.Element {
	const [value, setValue] = useState("");
	const [hasSelected, setHasSelected] = useState(false);
	const [showSuggest, setShowSuggest] = useState(false);
	const { tags } = props;
	const inputRef = useRef<HTMLInputElement>(null);

	const onTagRemove = (id: string) => {
		const newTags = tags.filter((tag) => tag.id !== id);
		props.onChange(newTags);
	};

	const appendTag = (tagStr: string) => {
		const id = new Date().getTime().toString() + "_" + tagStr;
		const newTags = [...tags, { id: id, value: tagStr }];
		props.onChange(newTags);
	};

	// listen tab\enter\space\comma
	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (hasSelected) {
			return;
		}
		const { key } = e;
		if (props.excludeTriggerKeys?.includes(key)) {
			return;
		}
		if (key === "Tab" || key === "Enter" || key === " ") {
			e.preventDefault();
			setShowSuggest(false);
			const value = inputRef.current?.value;
			if (value) {
				appendTag(value);
				inputRef.current!.value = "";
			}
		}
	};

	return (
		<>
			<div className="suggest-input-tags">
				<div className="tags">
					{tags?.map((tag, index) => {
						return (
							<div className="tag" key={tag.id}>
								<span className="icon">{tag.icon}</span>
								<span>{tag.value}</span>
								<span
									className="remove-button"
									onClick={() => onTagRemove(tag.id)}
								>
									x
								</span>
							</div>
						);
					})}
				</div>
				<input
					ref={inputRef}
					className="input"
					placeholder={props.inputPlaceholder}
					onFocus={() => setShowSuggest(true)}
					onKeyDown={(e) => handleInputKeyDown(e)}
					onChange={(e) => {
						setValue(e.target.value);
						if (!showSuggest) {
							setShowSuggest(true);
						}
					}}
				/>
			</div>
			{inputRef.current && (
				<Suggest
					query={value || ""}
					showSuggest={showSuggest}
					getItems={() => {
						if (props.getItems) {
							return props.getItems(value);
						}
						return [];
					}}
					onSelected={(item, index) => {
						console.log('on selected', item, index)
						if (index >= 0) {
							appendTag(item.value);
							inputRef.current!.value = "";
						}
						if (showSuggest) {
							setShowSuggest(false);
						}
					}}
					onSelectChange={(item, index) => {
						if (index >= 0) {
							setHasSelected(true);
						} else {
							setHasSelected(false);
						}
					}}
					anchorElement={inputRef.current}
					onOpenChange={(show) => setShowSuggest(show)}
				/>
			)}
		</>
	);
}
