import { DateTime } from "luxon";
import { Fragment, useState } from "react";
import { Locals } from "src/i18/messages";
import { DataFilter, DataSource, DataSourceType } from "src/query/types";
import { getAllProperties, getTagOptions } from "src/util/page";
import { Icons } from "../icon/Icons";
import { SuggestInput } from "../suggest/SuggestInput";
import {
	countFieldTypes,
	dataSourceTypes,
	dateFieldTypes,
	getDataSourceFilterOptions,
	taskStatusOptions,
} from "./options";
import { App } from "obsidian";
import { InputTags, TagOption } from "../suggest/SuggestTagInput";

export function DataSourceFormItem(props: {
	dataSource: DataSource;
	onChange: (dataSource: DataSource) => void;
	app: App;
}): JSX.Element {
	const { dataSource } = props;
	const [dateFormatType, setDateFormatType] = useState(
		dataSource.dateField?.format ? "manual" : "smart_detect"
	);
	const [dataSourceType, setDataSourceType] = useState(
		dataSource.type || "PAGE"
	);

	const changeDataSource = (name: string, value: any) => {
		const newDataSource = { ...dataSource, [name]: value };
		props.onChange(newDataSource);
	};

	const changeDateField = (name: string, value: any) => {
		const newDateField = { ...dataSource.dateField, [name]: value };
		changeDataSource("dateField", newDateField);
	};

	const changeCountField = (name: string, value: any) => {
		const newCountField = { ...dataSource.countField, [name]: value };
		changeDataSource("countField", newCountField);
	};

	const changeFilter = (id: string, name: string, value: any) => {
		const newFilters = dataSource.filters?.map((f) => {
			if (f.id == id) {
				return { ...f, [name]: value };
			}
			return f;
		});
		changeDataSource("filters", newFilters);
	};

	const addFilter = (id: string) => {
		const newFilters = dataSource.filters || [];
		newFilters.push({
			id: id,
			type: "NONE",
		});
		changeDataSource("filters", newFilters);
	};

	const removeFilter = (id: string) => {
		const newFilters = dataSource.filters?.filter((f) => f.id != id);
		changeDataSource("filters", newFilters || []);
	};

	const onDataSourceTypeChange = (newSource: DataSourceType) => {
		const newDataSource = { ...dataSource, type: newSource };
		if (newSource === "PAGE") {
			newDataSource.filters = [];

			if (newDataSource.dateField?.type === "TASK_PROPERTY") {
				newDataSource.dateField = {
					type: "FILE_CTIME",
				};
			}

			if (dataSource.countField?.type === "TASK_PROPERTY") {
				changeCountField("type", "DEFAULT");
				changeCountField("value", undefined);
				newDataSource.countField = {
					type: "DEFAULT",
				};
			}
		}
		props.onChange(newDataSource);
	};

	const getTagsFromDataSource = (filter: DataFilter): TagOption[] => {
		if (filter.type != "CONTAINS_ANY_TAG") {
			return [];
		}
		if (!(filter.value instanceof Array)) {
			return [];
		}
		return filter.value.map((t) => {
			return {
				id: t,
				label: t,
				value: t,
			};
		});
	};

	const taskDataSource: DataSourceType[] = [
		"ALL_TASK",
		"TASK_IN_SPECIFIC_PAGE",
	];

	const local = Locals.get()
	return (
		<Fragment>
			<div className="form-item">
				<span className="label">
					{local.form_data_source_value}
				</span>
				<div className="form-content">
					<select
						defaultValue={dataSource.type || "PAGE"}
						onChange={(e) => {
							setDataSourceType(e.target.value as DataSourceType);
							onDataSourceTypeChange(
								e.target.value as DataSourceType
							);
						}}
					>
						{dataSourceTypes.map((option) => {
							return (
								<option value={option.value} key={option.value}>
									{option.label}
								</option>
							);
						})}
					</select>
					{dataSourceType != "ALL_TASK" && (
						<input
							type="text"
							defaultValue={dataSource.value}
							placeholder={local.form_query_placeholder}
							onChange={(e) => {
								changeDataSource("value", e.target.value);
							}}
						/>
					)}
				</div>
			</div>

			{taskDataSource.includes(dataSource.type) && (
				<div className="form-item">
					<span className="label">
						{local.form_data_source_filter_label}
					</span>
					<div className="form-vertical-content">
						{dataSource.filters?.map((filter, index) => {
							return (
								<>
									<div className="form-content" key={filter.id}>
										<select
											defaultValue={filter.type || "NONE"}
											onChange={(e) => {
												changeFilter(
													filter.id,
													"type",
													e.target.value
												);
											}}
										>
											{getDataSourceFilterOptions(
												"TASK"
											).map((op) => {
												return (
													<option
														value={op.value}
														key={op.value}
													>
														{op.label}
													</option>
												);
											})}
										</select>

										{filter.type == "STATUS_IS" && (
											<select
												defaultValue={
													filter?.type || "NONE"
												}
												onChange={(e) => {
													changeFilter(
														filter.id,
														"value",
														e.target.value
													);
												}}
											>
												{taskStatusOptions.map(
													(option) => {
														return (
															<option
																value={
																	option.value
																}
																key={
																	option.value
																}
															>
																{option.label}
															</option>
														);
													}
												)}
											</select>
										)}

										{filter?.type == "CONTAINS_ANY_TAG" ? (
											<InputTags
												tags={getTagsFromDataSource(
													filter
												)}
												onChange={(tags) => {
													changeFilter(
														filter.id,
														"value",
														tags.map((t) => {
															return t.value;
														})
													);
												}}
												onRemove={(tag) => {
													if (
														filter?.value instanceof
														Array
													) {
														changeFilter(
															filter.id,
															"value",
															filter?.value?.filter(
																(t) => {
																	return (
																		t !=
																		tag.value
																	);
																}
															)
														);
													}
												}}
												getItems={(query) => {
													return getTagOptions(
														query,
														props.app
													);
												}}
												inputPlaceholder={local.form_datasource_filter_contains_tag_input_placeholder}
											/>
										) : null}

										<button className="list-remove-button" onClick={e => removeFilter(filter.id)}>
											x
										</button>
									</div>
								</>
							);
						})}
						<div className="form-content">
							<button
								className="list-add-button"
								onClick={(e) =>
									addFilter(Date.now().toString())
								}
							>
								+
							</button>
						</div>
					</div>
				</div>
			)}

			<div className="form-item">
				<span className="label">{local.form_date_field}</span>
				<div className="form-content">
					<select
						defaultValue={
							dataSource.dateField?.type || "FILE_CTIME"
						}
						onChange={(e) => {
							changeDateField("type", e.target.value);
						}}
					>
						{dateFieldTypes(dataSource.type).map((option) => {
							return (
								<option value={option.value} key={option.value}>
									{option.label}
								</option>
							);
						})}
					</select>
					{dataSource.dateField?.type == "PAGE_PROPERTY" && (
						<SuggestInput
							defaultInputValue={dataSource.dateField?.value}
							onInputChange={(newValue) => {
								changeDateField("value", newValue);
							}}
							inputPlaceholder={local.form_date_field_placeholder}
							getItems={(query) => {
								return getAllProperties(query, props.app).map(
									(p, index) => {
										return {
											id: p.name,
											value: p.name,
											label: p.name,
											icon: Icons.CODE,
											description: p.sampleValue || "",
										};
									}
								);
							}}
							onSelected={(item) => {
								changeDateField("value", item.value);
							}}
						/>
					)}

					{dataSource.dateField?.type == "TASK_PROPERTY" && (
						<input
							type="text"
							defaultValue={dataSource.dateField?.value || ""}
							placeholder={local.form_date_field_placeholder}
							onChange={(e) => {
								changeDateField("value", e.target.value);
							}}
						/>
					)}
				</div>
			</div>

			<div className="form-item">
				<span className="label">
					{local.form_date_field_format}
				</span>
				<div className="form-vertical-content">
					<select
						defaultValue={dateFormatType}
						onChange={(e) => {
							setDateFormatType(e.target.value);
							if (e.target.value == "smart_detect") {
								changeDateField("format", undefined);
							}
						}}
					>
						<option value="smart_detect">
							{local.form_date_field_format_type_smart}
						</option>
						<option value="manual">
							{local.form_date_field_format_type_manual}
						</option>
					</select>
					{dateFormatType == "manual" ? (
						<>
							<input
								type="text"
								defaultValue={
									dataSource.dateField?.format || ""
								}
								name="dateFieldFormat"
								placeholder={local.form_date_field_format_placeholder}
								onChange={(e) => {
									changeDateField("format", e.target.value);
								}}
							/>

							<div className="form-description">
								<a href="https://moment.github.io/luxon/#/formatting?id=table-of-tokens">
									Luxon Format
								</a>
								{" " +
									local.form_date_field_format_sample}
								:
								{" " +
									DateTime.fromJSDate(
										new Date("2024-01-01 00:00:00")
									).toFormat(
										dataSource.dateField?.format ||
											"yyyy-MM-dd'T'HH:mm:ss"
									)}
							</div>
						</>
					) : null}
				</div>
			</div>

			<div className="form-item">
				<span className="label">
					{local.form_count_field_count_field_label}
				</span>
				<div className="form-vertical-content">
					<select
						defaultValue={dataSource.countField?.type || "DEFAULT"}
						onChange={(e) => {
							changeCountField("type", e.target.value);
						}}
					>
						{countFieldTypes(dataSource.type).map((option) => {
							return (
								<option value={option.value} key={option.value}>
									{option.label}
								</option>
							);
						})}
					</select>
					{dataSource.countField?.type == "PAGE_PROPERTY" ||
					dataSource.countField?.type == "TASK_PROPERTY" ? (
						<SuggestInput
							defaultInputValue={
								dataSource.countField?.value || ""
							}
							onInputChange={(newValue) => {
								changeCountField("value", newValue);
							}}
							inputPlaceholder={local.form_count_field_count_field_input_placeholder}
							getItems={(query) => {
								return getAllProperties(query, props.app).map(
									(p, index) => {
										return {
											id: p.name,
											value: p.name,
											label: p.name,
											icon: Icons.CODE,
											description: p.sampleValue || "",
										};
									}
								);
							}}
							onSelected={(item) => {
								changeCountField("value", item.value);
							}}
						/>
					) : null}
				</div>
			</div>
		</Fragment>
	);
}
