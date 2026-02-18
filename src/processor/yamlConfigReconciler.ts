import { DateRangeType, YamlGraphConfig } from "./types";

export class YamlConfigReconciler {
	constructor() {}

	static reconcile(yamlConfig: YamlGraphConfig): YamlGraphConfig {
		return YamlConfigReconciler.reconcile_from_0_4_0(yamlConfig);
	}

	static reconcile_from_0_4_0(yamlConfig: YamlGraphConfig): YamlGraphConfig {
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
					type: yamlConfig.countQueryInstances
						? "QUERY_INSTANCES"
						: "DEFAULT",
				},
			};
		}

		if (!yamlConfig.dateRangeType) {
			const hasLatestDays = yamlConfig.days !== undefined;
			const dateTypeValue: DateRangeType = hasLatestDays
				? "LATEST_DAYS"
				: "FIXED_DATE_RANGE";
			yamlConfig.dateRangeType = dateTypeValue;
		}

		if (!yamlConfig.dateRangeValue) {
			yamlConfig.dateRangeValue = yamlConfig.days;
		}

		yamlConfig.query = undefined;
		yamlConfig.dateField = undefined;
		yamlConfig.dateFieldFormat = undefined;
		yamlConfig.countQueryInstances = undefined;
		return yamlConfig;
	}
}
