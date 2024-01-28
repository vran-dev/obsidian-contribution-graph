import { Local } from "./types";

export class En implements Local {
    /**
     * context menu
     */
    context_menu_create = "Add Heatmap";

    /**
     * form
     */
    form_basic_settings = "Basic Settings";
    form_style_settings = "Style Settings";
    form_about = "About";
    form_author = "Author";
	form_project_url = "Project";
	form_sponsor = "Sponsor";
    form_title = "Title";
    form_title_placeholder = "Input title";
    form_graph_type = "Graph Type";
    form_graph_type_git = "Git Style";
    form_graph_type_month_track = "Month Track";
    form_graph_type_calendar = "Calendar";
    form_date_range = "Date Range";
    form_date_range_latest_days = "Latest Days";
    form_date_range_latest_month = "Latest Whole Month";
	form_date_range_latest_year = "Latest Whole Year";
    form_date_range_latest_days_placeholder = "Input days";
    form_date_range_fixed_date = "Fixed Date";
    form_date_range_start_date = "Start Date";

    form_start_of_week = "Start of Week";
    form_data_source_value = "Source";
    form_data_source_filter_label = "Filter";

    form_datasource_filter_type_none = "None";
    form_datasource_filter_type_status_is = "Status Is";
    form_datasource_filter_type_contains_any_tag = "Contains Any Tag";

    form_datasource_filter_task_none = "None";
    form_datasource_filter_task_status_completed = "Completed";
    form_datasource_filter_task_status_fully_completed = "Fully completed";
    form_datasource_filter_task_status_any = "Any Status";
    form_datasource_filter_task_status_incomplete = "Incomplete";
    form_datasource_filter_contains_tag = "Contains Any Tag";
    form_datasource_filter_contains_tag_input_placeholder = "Please input tag, such as #todo";
    form_datasource_filter_customize = "Customize";

    form_query_placeholder = ' such as #tag or "folder"';

    form_date_field = "Date Field";
    form_date_field_type_file_name = "File Name";
    form_date_field_type_file_ctime = "File Create Time";
    form_date_field_type_file_mtime = "File Modify Time";
    form_date_field_type_file_specific_page_property = "Specific Page Property";
    form_date_field_type_file_specific_task_property = "Specific Task Property";

    form_date_field_placeholder = "default is file's create time";

    form_date_field_format = "Date Field Format";
    form_date_field_format_sample = "Sample";
    form_date_field_format_description =
        "If your date property value is not a standard format, you need to specify this field so that the system knows how to recognize your date format";
    form_date_field_format_placeholder = "such as yyyy-MM-dd HH:mm:ss";

    form_date_field_format_type_smart = "Auto Detect";

    form_date_field_format_type_manual = "Specify Format";

    form_count_field_count_field_label = "Count Field";

    form_count_field_count_field_input_placeholder = "Please input property name";

    form_count_field_count_field_type_default = "Default";

    form_count_field_count_field_type_page_prop = "Page Property";

    form_count_field_count_field_type_task_prop = "Task Property";
    form_title_font_size_label = "Title font Size";
    form_number_input_min_warning = "allow min value is {value}";
	form_number_input_max_warning = "allow max value is {value}";
    form_fill_the_screen_label = "Fill The Screen";
    form_main_container_bg_color = "Background Color";
	form_enable_main_container_shadow = "Enable Shadow";
    form_show_cell_indicators = "Show Cell Indicators";
    form_cell_shape = "Cell Shape";
    form_cell_shape_circle = "Circle";
    form_cell_shape_square = "Square";
    form_cell_shape_rounded = "Rounded";

    form_datasource_type_page = "Page";
    form_datasource_type_all_task = "All Task";
    form_datasource_type_task_in_specific_page = "Task in Specific Page";

    form_theme = "Theme";
    form_theme_placeholder = "Select theme or customize style";
    form_cell_style_rules = "Cell Style Rules";

    form_button_preview = "Preview";
    form_button_save = "Save";

    /**
     * weekday
     */
    weekday_sunday = "Sunday";
    weekday_monday = "Monday";
    weekday_tuesday = "Tuesday";
    weekday_wednesday = "Wednesday";
    weekday_thursday = "Thursday";
    weekday_friday = "Friday";
    weekday_saturday = "Saturday";

    /**
     * graph text
     */
    you_have_no_contributions_on = "No contributions on {date}";
    you_have_contributed_to = "{value} contributions on {date}";
    click_to_load_more = "Click to load more...";
}