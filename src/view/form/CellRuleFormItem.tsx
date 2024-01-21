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
} from "@floating-ui/react";
import { Chrome, ColorResult } from "@uiw/react-color";
import { useState } from "react";
import { CellStyleRule } from "src/types";

export function CellRuleItem(props: {
	rule: CellStyleRule;
	onChange: (rule: CellStyleRule) => void;
	onRemove: (id: string) => void;
}): JSX.Element {
	const [rule, setRule] = useState(props.rule);
	const [showColorPicker, setShowColorPicker] = useState(false);
	const changeRule = (name: string, value: any) => {
		const newRule = { ...rule, [name]: value };
		setRule(newRule);
		props.onChange(newRule);
	};

	const { refs, floatingStyles, context } = useFloating({
		open: showColorPicker,
		onOpenChange: (open) => setShowColorPicker(open),
		middleware: [offset(6), flip(), shift(), inline()],
		whileElementsMounted: autoUpdate,
	});

	const dismiss = useDismiss(context);
	const { getFloatingProps } = useInteractions([dismiss]);

	return (
		<div className="form-item">
			<div className="form-content" ref={refs.setReference}>
				<button
					className="list-remove-button"
					//@ts-ignore
					onClick={() => props.onRemove(props.rule.id)}
				>
					x
				</button>
				<input
					type="number"
					defaultValue={props.rule.min}
					placeholder="min"
					className="cell-rule-value"
					onChange={(e) => changeRule("min", e.target.value)}
				/>
				<span>≤</span>
				<span>contributions</span>
				<span>＜</span>
				<input
					type="number"
					defaultValue={props.rule.max}
					placeholder="max"
					className="cell-rule-value"
					onChange={(e) => changeRule("max", e.target.value)}
				/>
				<span>=</span>
				<span
					className="color-indicator"
					style={{
						backgroundColor: props.rule.color,
					}}
					onClick={() => setShowColorPicker(!showColorPicker)}
				></span>
				{showColorPicker ? (
					<div
						ref={refs.setFloating}
						style={{
							...floatingStyles,
						}}
						{...getFloatingProps()}
					>
						<Chrome
							color={props.rule.color}
							onChange={(color: ColorResult) => {
								changeRule("color", color.hexa);
							}}
						/>
					</div>
				) : null}
				<input
					type="text"
					defaultValue={props.rule.text}
					placeholder="emoji"
					className="cell-rule-text"
					onChange={(e) => changeRule("text", e.target.value)}
				/>
			</div>
		</div>
	);
}
