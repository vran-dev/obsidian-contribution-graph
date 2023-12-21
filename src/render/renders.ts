import { ContributionGraphConfig } from "src/types";
import { CalendarGraphRender } from "./calendarGraphRender";
import { MonthTrackGraphRender } from "./monthTrackGraphRender";
import { WeekTrackGraphRender } from "./weekTrackGraphRender";

export class Renders {
	static renders = [
		new CalendarGraphRender(),
		new MonthTrackGraphRender(),
		new WeekTrackGraphRender(),
	];

	static render(
		container: HTMLElement,
		graphConfig: ContributionGraphConfig
	): void {
		if (graphConfig.graphType === undefined) {
			graphConfig.graphType = "default";
		}
		const render = this.renders.find(
			(r) => r.graphType() === graphConfig.graphType
		);
		if (render) {
			render.render(container, graphConfig);
		} else {
			this.renderErrorTips(
				container,
				`
Not Support graph type - ${graphConfig.graphType}.
please set graphType to one of ${Renders.renders
					.map((r) => r.graphType())
					.join(", ")}
`
			);
		}
	}

	static renderErrorTips(container: HTMLElement, message: string): void {
		const errorContainer = createDiv({
			cls: "contribution-graph-render-error-container",
			parent: container,
		});
		errorContainer.innerHTML = message;
	}
}
