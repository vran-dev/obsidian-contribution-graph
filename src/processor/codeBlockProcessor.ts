import { App, MarkdownPostProcessorContext, parseYaml } from "obsidian";
import { Renders } from "src/render/renders";

import { MISS_CONFIG } from "./bizErrors";
import { GraphProcessError } from "./graphProcessError";
import { CompositeDataSourceQuery } from "src/query/compositeDataSourceQuery";
import { YamlGraphConfig } from "./types";
import { YamlConfigReconciler } from "./yamlConfigReconciler";
import { getAPI } from "obsidian-dataview";

export class CodeBlockProcessor {
	dataSourceQuery: CompositeDataSourceQuery = new CompositeDataSourceQuery();

	async renderFromCodeBlock(
		code: string,
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext,
		app: App
	) {
		try {
			const graphConfig: YamlGraphConfig = this.loadYamlConfig(el, code);
			await this.renderFromYaml(graphConfig, el, app);
		} catch (e) {
			if (e instanceof GraphProcessError) {
				Renders.renderErrorTips(el, e.summary, e.recommends);
			} else {
				console.error(e);
				const notice = "unexpected error: " + e.message;
				Renders.renderErrorTips(el, notice);
			}
		}
	}

	async renderFromYaml(graphConfig: YamlGraphConfig, el: HTMLElement, app: App) {
		const renderCallback = () => {
			try {
				// validate
				YamlGraphConfig.validate(graphConfig);
				const data = this.dataSourceQuery.query(
					graphConfig.dataSource,
					app
				);

				const aggregatedData = [];
				if (graphConfig.data) {
					aggregatedData.push(...graphConfig.data);
				}
				aggregatedData.push(...data);
				graphConfig.data = aggregatedData;

				// render
				Renders.render(
					el,
					YamlGraphConfig.toContributionGraphConfig(graphConfig)
				);
			} catch (e) {
				if (e instanceof GraphProcessError) {
					Renders.renderErrorTips(el, e.summary, e.recommends);
				} else {
					console.error(e);
					const notice = "unexpected error: " + e.message;
					Renders.renderErrorTips(el, notice);
				}
			}
		}

		const dv = getAPI(app);
		if (!dv) {
			throw new GraphProcessError({
				summary: "Initialize Dataview failed",
				recommends: ["Please install Dataview plugin"],
			});
		}
		if (dv.index.initialized) {
			renderCallback();
		} else {
			// @ts-ignore
			app.metadataCache.on("dataview:index-ready", () => {
				renderCallback();
			})
		}
	}

	loadYamlConfig(el: HTMLElement, code: string): YamlGraphConfig {
		if (code == null || code.trim() == "") {
			throw new GraphProcessError(MISS_CONFIG());
		}

		try {
			// @ts-ignore
			const yamlConfig: YamlGraphConfig = parseYaml(code);
			return YamlConfigReconciler.reconcile(yamlConfig);
		} catch (e) {
			if (e.mark?.line) {
				throw new GraphProcessError({
					summary:
						"yaml parse error at line " +
						(e.mark.line + 1) +
						", please check the format",
				});
			} else {
				throw new GraphProcessError({
					summary:
						"content parse error, please check the format(such as blank, indent)",
				});
			}
		}
	}
}
