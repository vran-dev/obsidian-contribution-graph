
export interface Local {
	/**
	 * context menu
	 */
	context_menu_create: string;

	/**
	 * form
	 */
	form_basic_settings: string;
	form_style_settings: string;
	form_title: string;
	form_title_placeholder: string;
	form_graph_type: string;
	form_graph_type_git: string;
	form_graph_type_month_track: string;
	form_graph_type_calendar: string;
	form_date_range: string;
	form_date_range_latest_days: string;
	form_date_range_latest_month: string;
	form_date_range_latest_year: string;
	form_date_range_latest_days_placeholder: string;
	form_date_range_fixed_date: string;
	form_date_range_start_date: string;

	form_start_of_week: string;
	form_data_source_value: string;
	form_data_source_filter_label: string;

	form_datasource_filter_type_none: string;
	form_datasource_filter_type_status_is: string;
	form_datasource_filter_type_contains_any_tag: string;

	form_datasource_filter_task_none: string;
	form_datasource_filter_task_status_completed: string;
	form_datasource_filter_task_status_fully_completed: string;
	form_datasource_filter_task_status_any: string;
	form_datasource_filter_task_status_incomplete: string;
	form_datasource_filter_contains_tag: string;
	form_datasource_filter_contains_tag_input_placeholder: string;

	form_datasource_filter_customize: string;

	form_query_placeholder: string;

	form_date_field: string;
	form_date_field_type_file_name: string;
	form_date_field_type_file_ctime: string;
	form_date_field_type_file_mtime: string;
	form_date_field_type_file_specific_page_property: string;
	form_date_field_type_file_specific_task_property: string;

	form_date_field_placeholder: string;
	form_date_field_format: string;
	form_date_field_format_sample: string;
	form_date_field_format_description: string;
	form_date_field_format_placeholder: string;

	form_date_field_format_type_smart: string;

	form_date_field_format_type_manual: string;
	form_count_field_count_field_label: string;

	form_count_field_count_field_input_placeholder: string;

	form_count_field_count_field_type_default: string;

	form_count_field_count_field_type_page_prop: string;

	form_count_field_count_field_type_task_prop: string;
	form_title_font_size_label: string;
	form_number_input_min_warning: string;
	form_number_input_max_warning: string;
	form_fill_the_screen_label: string;
	form_main_container_bg_color: string;
	form_enable_main_container_shadow: string;
	form_show_cell_indicators: string;
	form_cell_shape: string;
	form_cell_shape_circle: string;
	form_cell_shape_square: string;
	form_cell_shape_rounded: string;

	form_datasource_type_page: string;
	form_datasource_type_all_task: string;
	form_datasource_type_task_in_specific_page: string;

	form_theme: string;
	form_theme_placeholder: string;
	form_cell_style_rules: string;

	form_button_preview: string;
	form_button_save: string;

	/**
	 * weekday
	 */
	weekday_sunday: string;
	weekday_monday: string;
	weekday_tuesday: string;
	weekday_wednesday: string;
	weekday_thursday: string;
	weekday_friday: string;
	weekday_saturday: string;

	/**
	 * graph text
	 */
	you_have_no_contributions_on: string;
	you_have_contributed_to: string;
	click_to_load_more: string;
}
