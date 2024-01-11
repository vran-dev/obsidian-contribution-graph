import { Locals, isZh } from "src/i18/messages";
import { Icons } from "../icon/Icons";
import { ChooseOption } from "../choose/Choose";
import { SelectOption } from "./GraphForm";
import {
	CountFieldType,
	DataSourceFilterType,
	DataSourceType,
	DateFieldType,
	TaskStatus,
} from "src/query/types";
import { DateRangeType } from "src/processor/types";

export const titleAlignChooseOptions: ChooseOption[] = [
	{
		tip: "left",
		icon: Icons.ALIGN_LEFT,
		value: "left",
	},
	{
		tip: "center",
		icon: Icons.ALIGN_CENTER,
		value: "center",
	},
	{
		tip: "right",
		icon: Icons.ALIGN_RIGHT,
		value: "right",
	},
];

export const graphOptions: SelectOption<string>[] = [
	{
		label: Locals.get().form_graph_type_git,
		value: "default",
		selected: true,
	},
	{
		label: Locals.get().form_graph_type_month_track,
		value: "month-track",
	},
	{
		label: Locals.get().form_graph_type_calendar,
		value: "calendar",
	},
];

export const startOfWeekOptions: SelectOption<string>[] = [
	{
		label: Locals.get().weekday_sunday,
		value: "0",
		selected: !isZh(),
	},
	{
		label: Locals.get().weekday_monday,
		value: "1",
		selected: isZh(),
	},
	{
		label: Locals.get().weekday_tuesday,
		value: "2",
	},
	{
		label: Locals.get().weekday_wednesday,
		value: "3",
	},
	{
		label: Locals.get().weekday_thursday,
		value: "4",
	},
	{
		label: Locals.get().weekday_friday,
		value: "5",
	},
	{
		label: Locals.get().weekday_saturday,
		value: "6",
	},
];

export const cellShapes: SelectOption<string>[] = [
	{
		label: Locals.get().form_cell_shape_rounded,
		value: "",
		selected: true,
	},
	{
		label: Locals.get().form_cell_shape_square,
		value: "0%",
	},
	{
		label: Locals.get().form_cell_shape_circle,
		value: "50%",
	},
];

export const dataSourceTypes: SelectOption<DataSourceType>[] = [
	{
		label: Locals.get().form_datasource_type_page,
		value: "PAGE",
		selected: true,
	},
	{
		label: Locals.get().form_datasource_type_all_task,
		value: "ALL_TASK",
	},
	{
		label: Locals.get().form_datasource_type_task_in_specific_page,
		value: "TASK_IN_SPECIFIC_PAGE",
	},
];

export function getDataSourceFilterOptions(
	type: string
): SelectOption<DataSourceFilterType>[] {
	if (type === "PAGE") {
		return [];
	} else {
		return [
			{
				label: Locals.get().form_datasource_filter_type_none,
				value: "NONE",
			},
			{
				label: Locals.get().form_datasource_filter_type_status_is,
				value: "STATUS_IS",
			},
			{
				label: Locals.get()
					.form_datasource_filter_type_contains_any_tag,
				value: "CONTAINS_ANY_TAG",
			},
		];
	}
}

export const countFieldTypes = (
	source: DataSourceType
): SelectOption<CountFieldType>[] => {
	const options: SelectOption<CountFieldType>[] = [
		{
			label: Locals.get().form_count_field_count_field_type_default,
			value: "DEFAULT",
		},
		{
			label: Locals.get().form_count_field_count_field_type_page_prop,
			value: "PAGE_PROPERTY",
		},
	];

	if (source === "ALL_TASK" || source === "TASK_IN_SPECIFIC_PAGE") {
		options.push({
			label: Locals.get().form_count_field_count_field_type_task_prop,
			value: "TASK_PROPERTY",
		});
	}
	return options;
};

export const dateFieldTypes = (
	source: DataSourceType
): SelectOption<DateFieldType>[] => {
	const options: SelectOption<DateFieldType>[] = [
		{
			label: Locals.get().form_date_field_type_file_ctime,
			value: "FILE_CTIME",
		},
		{
			label: Locals.get().form_date_field_type_file_mtime,
			value: "FILE_MTIME",
		},
		{
			label: Locals.get().form_date_field_type_file_name,
			value: "FILE_NAME",
		},

		{
			label: Locals.get()
				.form_date_field_type_file_specific_page_property,
			value: "PAGE_PROPERTY",
		},
	];

	if (source === "ALL_TASK" || source === "TASK_IN_SPECIFIC_PAGE") {
		options.push({
			label: Locals.get()
				.form_date_field_type_file_specific_task_property,
			value: "TASK_PROPERTY",
		});
	}

	return options;
};

export const taskStatusOptions: SelectOption<TaskStatus>[] = [
	{
		label: Locals.get().form_datasource_filter_task_status_completed,
		value: "COMPLETED",
		selected: true,
	},
	{
		label: Locals.get().form_datasource_filter_task_status_fully_completed,
		value: "FULLY_COMPLETED",
	},
	{
		label: Locals.get().form_datasource_filter_task_status_incomplete,
		value: "INCOMPLETE",
	},
	{
		label: Locals.get().form_datasource_filter_task_status_any,
		value: "ANY",
	},
];

export const dateTypeOptions: SelectOption<DateRangeType>[] = [
	{
		label: Locals.get().form_date_range_latest_days,
		value: "LATEST_DAYS",
	},
	{
		label: Locals.get().form_date_range_fixed_date,
		value: "FIXED_DATE_RANGE",
	},
	{
		label: Locals.get().form_date_range_latest_month,
		value: "LATEST_MONTH",
	},
	{
		label: Locals.get().form_date_range_latest_year,
		value: "LATEST_YEAR",
	},
];
