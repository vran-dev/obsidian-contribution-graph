export class Message {
	zh: string;
	default: string;

	constructor(zh: string, defaultStr: string) {
		this.zh = zh;
		this.default = defaultStr;
	}

	get(): string {
		const lang = window.localStorage.getItem("language");
		if (lang === "zh") {
			return this.zh;
		}
		return this.default;
	}
}

export function isZh(): boolean {
	const lang = window.localStorage.getItem("language");
	return lang === "zh";
}

export const Messages = {
	/**
	 * context menu
	 */
	context_menu_create: new Message("新建热力图", "Add Heatmap"),

	/**
	 * form
	 */
	form_basic_settings: new Message("基础设置", "Basic Settings"),
	form_style_settings: new Message("样式设置", "Style Settings"),
	form_title: new Message("标题", "Title"),
	form_title_placeholder: new Message("输入标题", "Input title"),
	form_graph_type: new Message("图表类型", "Graph Type"),
	form_graph_type_git: new Message("Git 视图", "Git Style"),
	form_graph_type_month_track: new Message("月追踪视图", "Month Track"),
	form_graph_type_calendar: new Message("日历视图", "Calendar"),
	form_date_range: new Message("日期范围", "Date Range"),
	form_date_range_latest_days: new Message("最近几天", "Latest Days"),
	form_date_range_latest_days_placeholder: new Message(
		"输入天数",
		"Input days"
	),
	form_date_range_fixed_date: new Message("固定日期", "Fixed Date"),
	form_date_range_start_date: new Message("开始日期", "Start Date"),

	form_start_of_week: new Message("每周开始于", "Start of Week"),
	form_data_source_value: new Message("来源", "Source"),
	form_data_source_filter_label: new Message("筛选", "Filter"),

	form_datasource_filter_type_none: new Message("无", "None"),
	form_datasource_filter_type_status_is: new Message("状态等于", "Status Is"),
	form_datasource_filter_type_contains_any_tag: new Message("包含任意标签", "Contains Any Tag"),

	form_datasource_filter_task_none: new Message("无", "None"),
	form_datasource_filter_task_status_completed: new Message(
		"已完成（不包含子任务）",
		"Completed"
	),
	form_datasource_filter_task_status_fully_completed: new Message(
		"已完成（包含子任务）",
		"Fully completed"
	),
	form_datasource_filter_task_status_any: new Message(
		"任意状态",
		"Any Status"
	),
	form_datasource_filter_task_status_incomplete: new Message(
		"未完成",
		"Incomplete"
	),
	form_datasource_filter_contains_tag: new Message(
		"包含任意一个标签",
		"Contains Any Tag"
	),
	form_datasource_filter_contains_tag_input_placeholder: new Message(
		"请输入标签，比如 #todo",
		"Please input tag, such as #todo"
	),
	form_datasource_filter_customize: new Message("自定义", "Customize"),

	form_query_placeholder: new Message(
		'比如 #tag 或 "folder"',
		' such as #tag or "folder"'
	),

	form_date_field: new Message("日期字段", "Date Field"),
	form_date_field_type_file_name: new Message("文件名称", "File Name"),
	form_date_field_type_file_ctime: new Message(
		"文件创建日期",
		"File Create Time"
	),
	form_date_field_type_file_mtime: new Message(
		"文件修改日期",
		"File Modify Time"
	),
	form_date_field_type_file_specific_page_property: new Message(
		"指定页面属性",
		"Specific Page Property"
	),
	form_date_field_type_file_specific_task_property: new Message(
		"指定任务属性",
		"Specific Task Property"
	),

	form_date_field_placeholder: new Message(
		"默认为文件的创建日期",
		"default is file's create time"
	),

	form_date_field_format: new Message("日期格式", "Date Field Format"),
	form_date_field_format_sample: new Message("示例值", "Sample"),
	form_date_field_format_description: new Message(
		"如果你的日期属性值不是标准的格式，需要指定该字段让系统知道如何识别你的日期格式",
		"If your date property value is not a standard format, you need to specify this field so that the system knows how to recognize your date format"
	),
	form_date_field_format_placeholder: new Message(
		"比如 yyyy-MM-dd HH:mm:ss",
		"such as yyyy-MM-dd HH:mm:ss"
	),

	form_date_field_format_type_smart: new Message("自动识别", "Auto Detect"),

	form_date_field_format_type_manual: new Message(
		"指定格式",
		"Specify Format"
	),

	form_count_field_count_field_label: new Message("计数属性", "Count Field"),

	form_count_field_count_field_input_placeholder: new Message(
		"请输入属性名称",
		"Please input property name"
	),

	form_count_field_count_field_type_default: new Message("默认", "Default"),

	form_count_field_count_field_type_page_prop: new Message(
		"页面属性",
		"Page Property"
	),

	form_count_field_count_field_type_task_prop: new Message(
		"任务属性",
		"Task Property"
	),

	form_show_cell_indicators: new Message(
		"显示单元格指示器",
		"Show Cell Indicators"
	),
	form_cell_shape: new Message("单元格形状", "Cell Shape"),
	form_cell_shape_circle: new Message("圆形", "Circle"),
	form_cell_shape_square: new Message("方块", "Square"),
	form_cell_shape_rounded: new Message("圆角", "Rounded"),

	form_datasource_type_page: new Message("页面", "Page"),
	form_datasource_type_all_task: new Message("所有任务", "All Task"),
	form_datasource_type_task_in_specific_page: new Message(
		"指定页面中的任务",
		"Task in Specific Page"
	),

	form_theme: new Message("主题", "Theme"),
	form_theme_placeholder: new Message(
		"选择主题或自定义样式",
		"Select theme or customize style"
	),
	form_cell_style_rules: new Message("单元格样式规则", "Cell Style Rules"),

	form_button_preview: new Message("预览", "Preview"),
	form_button_save: new Message("保存", "Save"),

	/**
	 * weekday
	 */
	weekday_sunday: new Message("周日", "Sunday"),
	weekday_monday: new Message("周一", "Monday"),
	weekday_tuesday: new Message("周二", "Tuesday"),
	weekday_wednesday: new Message("周三", "Wednesday"),
	weekday_thursday: new Message("周四", "Thursday"),
	weekday_friday: new Message("周五", "Friday"),
	weekday_saturday: new Message("周六", "Saturday"),
};

export const weekDayMapping = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const cnWeekDayMapping = ["日", "一", "二", "三", "四", "五", "六"];
export const monthMapping = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export function localizedMonthMapping(month: number) {
	const lang = window.localStorage.getItem("language");
	if (lang === "zh") {
		return `${month + 1}月`;
	}
	return monthMapping[month];
}

export function localizedWeekDayMapping(weekday: number, maxLength?: number) {
	const lang = window.localStorage.getItem("language");
	let localizedWeekday;
	if (lang === "zh") {
		localizedWeekday = cnWeekDayMapping[weekday];
	} else {
		localizedWeekday = weekDayMapping[weekday];
	}

	if (maxLength) {
		return localizedWeekday.substring(0, maxLength);
	} else {
		return localizedWeekday;
	}
}

export function localizedYearMonthMapping(year: number, month: number) {
	const lang = window.localStorage.getItem("language");
	if (lang === "zh") {
		return `${year}年${month + 1}月`;
	}
	return `${monthMapping[month]} ${year}`;
}
