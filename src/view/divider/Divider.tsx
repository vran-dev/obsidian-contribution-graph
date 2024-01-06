export function Divider(props: { text?: string }) {
	return (
		<div className="contribution-graph-divider">
			<div></div>
			{props.text && (
				<>
					<span>{props.text}</span>
					<div></div>
				</>
			)}
		</div>
	);
}
