import { useState } from "react";

export function Choose(props: {
	options: ChooseOption[];
	defaultValue: string;
	onChoose: (option: ChooseOption) => void;
}): JSX.Element {
	const { onChoose } = props;
	const [data, setData] = useState(props.options);
	const [defaultValue, setDefaultValue] = useState(props.defaultValue);

	const choosed = (option: ChooseOption) => {
		setDefaultValue(option.value);
		onChoose(option);
	};
	return (
		<div className="contribution-graph-choose">
			{data.map((option) => (
				<div
					key={option.value}
					className={
						option.value == defaultValue ? "item choosed" : "item"
					}
					ariea-label={option.tip}
					onClick={(e) => choosed(option)}
				>
					<div className="icon">{option.icon}</div>
				</div>
			))}
		</div>
	);
}

export class ChooseOption {
	constructor(
		public tip: string,
		public icon: JSX.Element,
		public value: string
	) {}
}
