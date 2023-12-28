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

export const Messages = {
	/**
	 * context menu
	 */
	context_menu_create: new Message("新建热力图", "Add Heatmap"),

	/**
	 * form
	 */
	form_graph_settings: new Message("图表设置", "Graph Settings"),
	form_style_settings: new Message("样式设置", "Style Settings"),
	form_title: new Message("标题", "Title"),
	form_title_placeholder: new Message("输入标题", "Input title"),
	form_graph_type: new Message("图表类型", "Graph Type"),
	form_graph_type_git: new Message("Git 风格", "Git Style"),
	form_graph_type_month_track: new Message("月追踪视图", "Month Track"),
	form_graph_type_calendar: new Message("日历", "Calendar"),
	form_date_range: new Message("日期范围", "Date Range"),
	form_date_range_latest_days: new Message("最近几天", "Latest Days"),
	form_date_range_latest_days_placeholder: new Message(
		"输入天数",
		"Input days"
	),
	form_date_range_fixed_date: new Message("固定日期", "Fixed Date"),
	form_date_range_start_date: new Message("开始日期", "Start Date"),

	form_start_of_week: new Message("每周开始于", "Start of Week"),
	form_query: new Message("查询", "Query"),

	form_query_placeholder: new Message(
		'比如 #tag 或 "folder"',
		' such as #tag or "folder"'
	),

	form_date_field: new Message("日期字段", "Date Field"),
	form_date_field_placeholder: new Message(
		"默认为文件的创建日期",
		"default is file's create time"
	),

	form_show_cell_indicators: new Message(
		"显示单元格指示器",
		"Show Cell Indicators"
	),
	form_cell_shape: new Message("单元格形状", "Cell Shape"),
	form_cell_shape_circle: new Message("圆形", "Circle"),
	form_cell_shape_square: new Message("方形", "Square"),
	form_cell_shape_rounded: new Message("圆角", "Rounded"),
	form_theme: new Message("主题", "Theme"),
	form_theme_placeholder: new Message(
		"选择主题或自定义样式",
		"Select theme or customize style"
	),
	form_cell_style_rules: new Message("单元格样式规则", "Cell Style Rules"),

	form_button_preview: new Message("预览", "Preview"),
	form_button_save: new Message("保存", "Save"),
};
