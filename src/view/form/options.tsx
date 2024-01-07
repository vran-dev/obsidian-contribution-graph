import { Messages, isZh } from "src/i18/messages";
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
		label: Messages.form_graph_type_git.get(),
		value: "default",
		selected: true,
	},
	{
		label: Messages.form_graph_type_month_track.get(),
		value: "month-track",
	},
	{
		label: Messages.form_graph_type_calendar.get(),
		value: "calendar",
	},
];

export const startOfWeekOptions: SelectOption<string>[] = [
	{
		label: Messages.weekday_sunday.get(),
		value: "0",
		selected: !isZh(),
	},
	{
		label: Messages.weekday_monday.get(),
		value: "1",
		selected: isZh(),
	},
	{
		label: Messages.weekday_tuesday.get(),
		value: "2",
	},
	{
		label: Messages.weekday_wednesday.get(),
		value: "3",
	},
	{
		label: Messages.weekday_thursday.get(),
		value: "4",
	},
	{
		label: Messages.weekday_friday.get(),
		value: "5",
	},
	{
		label: Messages.weekday_saturday.get(),
		value: "6",
	},
];

export const cellShapes: SelectOption<string>[] = [
	{
		label: Messages.form_cell_shape_rounded.get(),
		value: "",
		selected: true,
	},
	{
		label: Messages.form_cell_shape_square.get(),
		value: "0%",
	},
	{
		label: Messages.form_cell_shape_circle.get(),
		value: "50%",
	},
];

export const dataSourceTypes: SelectOption<DataSourceType>[] = [
	{
		label: Messages.form_datasource_type_page.get(),
		value: "PAGE",
		selected: true,
	},
	{
		label: Messages.form_datasource_type_all_task.get(),
		value: "ALL_TASK",
	},
	{
		label: Messages.form_datasource_type_task_in_specific_page.get(),
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
				label: Messages.form_datasource_filter_type_none.get(),
				value: "NONE",
			},
			{
				label: Messages.form_datasource_filter_type_status_is.get(),
				value: "STATUS_IS",
			},
			{
				label: Messages.form_datasource_filter_type_contains_any_tag.get(),
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
			label: Messages.form_count_field_count_field_type_default.get(),
			value: "DEFAULT",
		},
		{
			label: Messages.form_count_field_count_field_type_page_prop.get(),
			value: "PAGE_PROPERTY",
		},
	];

	if (source === "ALL_TASK" || source === "TASK_IN_SPECIFIC_PAGE") {
		options.push({
			label: Messages.form_count_field_count_field_type_task_prop.get(),
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
			label: Messages.form_date_field_type_file_ctime.get(),
			value: "FILE_CTIME",
		},
		{
			label: Messages.form_date_field_type_file_mtime.get(),
			value: "FILE_MTIME",
		},
		{
			label: Messages.form_date_field_type_file_name.get(),
			value: "FILE_NAME",
		},

		{
			label: Messages.form_date_field_type_file_specific_page_property.get(),
			value: "PAGE_PROPERTY",
		},
	];

	if (source === "ALL_TASK" || source === "TASK_IN_SPECIFIC_PAGE") {
		options.push({
			label: Messages.form_date_field_type_file_specific_task_property.get(),
			value: "TASK_PROPERTY",
		});
	}

	return options;
};

export const taskStatusOptions: SelectOption<TaskStatus>[] = [
	{
		label: Messages.form_datasource_filter_task_status_completed.get(),
		value: "COMPLETED",
		selected: true,
	},
	{
		label: Messages.form_datasource_filter_task_status_fully_completed.get(),
		value: "FULLY_COMPLETED",
	},
	{
		label: Messages.form_datasource_filter_task_status_incomplete.get(),
		value: "INCOMPLETE",
	},
	{
		label: Messages.form_datasource_filter_task_status_any.get(),
		value: "ANY",
	},
];
