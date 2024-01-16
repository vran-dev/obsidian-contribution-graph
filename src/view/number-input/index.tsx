import { Notice } from "obsidian";
import { useEffect, useState } from "react";
import { Locals } from "src/i18/messages";

const NumberInput = (props: {
	defaultValue: number;
	onChange: (value: number) => void;
	placeholder?: string;
	min?: number;
	max?: number;
}) => {
	const [value, setValue] = useState<string>(props.defaultValue.toString());
	const local = Locals.get();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;
		const regex = /^-?\d*$/;

		if (inputValue === "") {
			setValue("");
			return;
		}

		if (regex.test(inputValue)) {
			if (props.min !== undefined && Number(inputValue) < props.min) {
				new Notice(
					local.form_number_input_min_warning.replace(
						"{value}",
						props.min.toString()
					)
				);
				setValue(props.min.toString());
				return;
			}

			if (props.max !== undefined && Number(inputValue) > props.max) {
				new Notice(
					local.form_number_input_max_warning.replace(
						"{value}",
						props.max.toString()
					)
				);
				setValue(props.max.toString());
				return;
			}

			setValue(inputValue);
		}
	};

	useEffect(() => {
		if (value == "") {
			props.onChange(props.defaultValue);
		} else {
			props.onChange(parseInt(value));
		}
	}, [value]);

	return (
		<input
			type="text"
			value={value}
			onChange={handleChange}
			placeholder={props.placeholder}
		/>
	);
};

export default NumberInput;
