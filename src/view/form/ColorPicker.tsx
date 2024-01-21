import {
	useFloating,
	offset,
	flip,
	shift,
	inline,
	autoUpdate,
	useDismiss,
	useInteractions,
} from "@floating-ui/react";
import { Chrome, ColorResult } from "@uiw/react-color";
import { useState } from "react";

export function ColorPicker(props: {
	color?: string;
	onChange: (color: string) => void;
}): JSX.Element {
	const [showColorPicker, setShowColorPicker] = useState(false);
	const { refs, floatingStyles, context } = useFloating({
		open: showColorPicker,
		onOpenChange: (open) => setShowColorPicker(open),
		middleware: [offset(6), flip(), shift(), inline()],
		whileElementsMounted: autoUpdate,
	});

	const dismiss = useDismiss(context);
	const { getFloatingProps } = useInteractions([dismiss]);

	return (
		<>
			<span
				className="color-indicator"
				style={{
					backgroundColor: props.color,
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
						color={props.color}
						onChange={(color: ColorResult) => {
							props.onChange(color.hexa);
						}}
					/>
				</div>
			) : null}
		</>
	);
}
