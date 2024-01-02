import { useState } from "react";
import { CellStyleRule } from "src/types";

export function CellRuleItem(props: {
	rule: CellStyleRule;
	onChange: (rule: CellStyleRule) => void;
	onRemove: (id: string) => void;
}): JSX.Element {
	const [rule, setRule] = useState(props.rule);
	const changeRule = (name: string, value: any) => {
		const newRule = { ...rule, [name]: value };
		setRule(newRule);
		props.onChange(newRule);
	};

	return (
		<div className="form-item">
			<div className="form-content">
			<button
				className="cell-rule-remove-button"
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
			<input
				type="color"
				defaultValue={props.rule.color}
				className="cell-rule-color"
				onChange={(e) => changeRule("color", e.target.value)}
			/>
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
