import { Messages, isZh } from "src/i18/messages";
import { Icons } from "../icon/Icons";
import { ChooseOption } from "../choose/Choose";
import { SelectOption } from "./GraphForm";
import { DataSourceFilterType } from "src/query/types";

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

export const graphOptions: SelectOption[] = [
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

export const startOfWeekOptions: SelectOption[] = [
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

export const cellShapes: SelectOption[] = [
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

export const dataSourceTypes: SelectOption[] = [
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

export function getDataSourceFilterOptions(type: string): SelectOption[] {
	if (type === "PAGE") {
		return [];
	} else {
		return [
			{
				label: Messages.form_datasource_filter_task_none.get(),
				value: "NONE",
			},
			{
				label: Messages.form_datasource_filter_task_completed.get(),
				value: "TASK_COMPLETED",
			},
			{
				label: Messages.form_datasource_filter_task_fully_completed.get(),
				value: "TASK_FULLY_COMPLETED",
			},
			{
				label: Messages.form_datasource_filter_contains_tag.get(),
				value: "CONTAINS_ANY_TAG",
			},
			// {
			// 	label: Messages.form_datasource_filter_customize.get(),
			// 	value: "CUSTOMIZE",
			// },
		];
	}
}
