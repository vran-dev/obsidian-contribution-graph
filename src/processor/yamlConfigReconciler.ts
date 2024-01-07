import { YamlGraphConfig } from "./types";

export class YamlConfigReconciler {
	constructor() {}

	static reconcile(yamlConfig: YamlGraphConfig): YamlGraphConfig {
		return YamlConfigReconciler.reconcile_from_0_4_0(yamlConfig);
	}

	static reconcile_from_0_4_0(yamlConfig: YamlGraphConfig): YamlGraphConfig {
		if (!yamlConfig.query && yamlConfig.dataSource) {
			return yamlConfig;
		}
		if (!yamlConfig.dataSource) {
			yamlConfig.dataSource = {
				type: "PAGE",
				value: yamlConfig.query || '""',
				filters: [],
				dateField: {
					type: "PAGE_PROPERTY",
					value: yamlConfig.dateField,
					format: yamlConfig.dateFieldFormat,
				},
				countField: {
					type: "DEFAULT",
				},
			};
		}

		yamlConfig.query = undefined;
		yamlConfig.dateField = undefined;
		yamlConfig.dateFieldFormat = undefined;
		return yamlConfig;
	}
}
