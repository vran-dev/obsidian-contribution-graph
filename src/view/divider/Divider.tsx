export function Divider(props: { text: string }) {
	return (
		<div className="contribution-graph-divider">
			<div></div>
			<span>{props.text}</span>
			<div></div>
		</div>
	);
}
