import { Local } from "./types";

export class Zh implements Local {
	default = "默认";
	click_to_reset = "点击重置";
    /**
     * context menu
     */
    context_menu_create = "新建热力图";

    /**
     * form
     */
    form_basic_settings = "基础设置";
    form_style_settings = "样式设置";
    form_about = "关于";
    form_contact_me = "联系我";
	form_project_url = "项目地址";
	form_sponsor = "赞助";
    form_title = "标题";
    form_title_placeholder = "输入标题";
    form_graph_type = "图表类型";
    form_graph_type_git = "Git 视图";
    form_graph_type_month_track = "月追踪视图";
    form_graph_type_calendar = "日历视图";
    form_date_range = "日期范围";
    form_date_range_latest_days = "最近几天";
    form_date_range_latest_month = "最近几个整月";
	form_date_range_latest_year = "最近几个整年";
    form_date_range_input_placeholder = "在这里输入数值";
    form_date_range_fixed_date = "固定日期";
    form_date_range_start_date = "开始日期";

    form_start_of_week = "每周开始于";
    form_data_source_value = "来源";
    form_data_source_filter_label = "筛选";

    form_datasource_filter_type_none = "无";
    form_datasource_filter_type_status_is = "状态等于";
    form_datasource_filter_type_contains_any_tag = "包含任意标签";

    form_datasource_filter_task_none = "无";
    form_datasource_filter_task_status_completed = "已完成（不包含子任务）";
    form_datasource_filter_task_status_fully_completed = "已完成（包含子任务）";
    form_datasource_filter_task_status_any = "任意状态";
    form_datasource_filter_task_status_incomplete = "未完成";
    form_datasource_filter_contains_tag = "包含任意一个标签";
    form_datasource_filter_contains_tag_input_placeholder = "请输入标签，比如 #todo";
    form_datasource_filter_customize = "自定义";

    form_query_placeholder = '比如 #tag 或 "folder"';

    form_date_field = "日期字段";
    form_date_field_type_file_name = "文件名称";
    form_date_field_type_file_ctime = "文件创建日期";
    form_date_field_type_file_mtime = "文件修改日期";
    form_date_field_type_file_specific_page_property = "指定文档属性";
    form_date_field_type_file_specific_task_property = "指定任务属性";

    form_date_field_placeholder = "默认为文件的创建日期";

    form_date_field_format = "日期格式";
    form_date_field_format_sample = "示例值";
    form_date_field_format_description = "如果你的日期属性值不是标准的格式，需要指定该字段让系统知道如何识别你的日期格式";
    form_date_field_format_placeholder = "比如 yyyy-MM-dd HH:mm:ss";

    form_date_field_format_type_smart = "自动识别";

    form_date_field_format_type_manual = "指定格式";

    form_count_field_count_field_label = "打分属性";

    form_count_field_count_field_input_placeholder = "请输入属性名称";

    form_count_field_count_field_type_default = "默认";

    form_count_field_count_field_type_page_prop = "文档属性";

    form_count_field_count_field_type_task_prop = "任务属性";
    form_title_font_size_label = "标题字体大小";
    form_number_input_min_warning = "允许的最小值为 {value}";
	form_number_input_max_warning = "允许的最大值为 {value}";
    form_fill_the_screen_label = "充满屏幕";
    form_main_container_bg_color = "背景颜色";
	form_enable_main_container_shadow = "启用阴影";
    form_show_cell_indicators = "显示单元格指示器";
    form_cell_shape = "单元格形状";
    form_cell_shape_circle = "圆形";
    form_cell_shape_square = "方块";
    form_cell_shape_rounded = "圆角";
    form_cell_min_height = "单元格最小高度";
	form_cell_min_width = "单元格最小宽度";

    form_datasource_type_page = "文档";
    form_datasource_type_all_task = "所有任务";
    form_datasource_type_task_in_specific_page = "指定文档中的任务";

    form_theme = "主题";
    form_theme_placeholder = "选择主题或自定义样式";
    form_cell_style_rules = "单元格样式规则";

    form_button_preview = "预览";
    form_button_save = "保存";

    /**
     * weekday
     */
    weekday_sunday = "周日";
    weekday_monday = "周一";
    weekday_tuesday = "周二";
    weekday_wednesday = "周三";
    weekday_thursday = "周四";
    weekday_friday = "周五";
    weekday_saturday = "周六";

    /**
     * graph text
     */
    you_have_no_contributions_on = "你在 {date} 没有任何贡献";
    you_have_contributed_to = "你在 {date} 有 {value} 次贡献";
    click_to_load_more = "点击加载更多......";
}