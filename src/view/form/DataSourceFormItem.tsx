import { randomUUID } from "crypto";
import { DateTime } from "luxon";
import { Fragment, useState } from "react";
import { Messages } from "src/i18/messages";
import { DataSource, DataSourceType } from "src/query/types";
import { getAllProperties, getTagOptions } from "src/util/page";
import { Icons } from "../icon/Icons";
import { SuggestInput } from "../suggest/SuggestInput";
import { dataSourceTypes, getDataSourceFilterOptions } from "./options";
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

	const changeFilter = (name: string, value: any) => {
		const newFilter = { ...dataSource.filter, [name]: value };
		changeDataSource("filter", newFilter);
	};

	const getTagsFromDataSource = (): TagOption[] => {
		if (!dataSource.filter) {
			return [];
		}
		if (dataSource.filter.type != "CONTAINS_ANY_TAG") {
			return [];
		}
		if (!(dataSource.filter.value instanceof Array)) {
			return [];
		}
		return dataSource.filter.value.map((t) => {
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

	return (
		<Fragment>
			<div className="form-item">
				<span className="label">
					{Messages.form_data_source_value.get()}
				</span>
				<div className="form-content">
					<select
						defaultValue={dataSource.type}
						onChange={(e) => {
							// @ts-ignore
							setDataSourceType(e.target.value);
							changeDataSource("type", e.target.value);
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
							placeholder={Messages.form_query_placeholder.get()}
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
						{Messages.form_data_source_filter_label.get()}
					</span>
					<div className="form-content">
						<select
							defaultValue={dataSource.filter?.type || "NONE"}
							onChange={(e) => {
								changeFilter("type", e.target.value);
							}}
						>
							{getDataSourceFilterOptions("TAG").map((option) => {
								return (
									<option
										value={option.value}
										key={option.value}
									>
										{option.label}
									</option>
								);
							})}
						</select>

						{dataSource?.filter?.type == "CONTAINS_ANY_TAG" ? (
							<InputTags
								tags={getTagsFromDataSource()}
								onChange={(tags) => {
									changeFilter(
										"value",
										tags.map((t) => {
											return t.value;
										})
									);
								}}
								onRemove={(tag) => {
									if (
										dataSource.filter?.value instanceof
										Array
									) {
										changeFilter(
											"value",
											dataSource.filter?.value?.filter(
												(t) => {
													return t != tag.value;
												}
											)
										);
									}
								}}
								getItems={(query) => {
									return getTagOptions(query, props.app);
								}}
								inputPlaceholder={Messages.form_datasource_filter_contains_tag_input_placeholder.get()}
							/>
						) : null}
					</div>
				</div>
			)}

			<div className="form-item">
				<span className="label">{Messages.form_date_field.get()}</span>
				<div className="form-content">
					<SuggestInput
						defaultInputValue={dataSource.dateField?.value}
						onInputChange={(newValue) => {
							changeDateField("value", newValue);
						}}
						inputPlaceholder={Messages.form_date_field_placeholder.get()}
						getItems={(query) => {
							return getAllProperties(query, props.app).map(
								(p, index) => {
									return {
										id: randomUUID(),
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
				</div>
			</div>

			<div className="form-item">
				<span className="label">
					{Messages.form_date_field_format.get()}
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
							{Messages.form_date_field_format_type_smart.get()}
						</option>
						<option value="manual">
							{Messages.form_date_field_format_type_manual.get()}
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
								placeholder={Messages.form_date_field_format_placeholder.get()}
								onChange={(e) => {
									changeDateField("format", e.target.value);
								}}
							/>

							<div className="form-description">
								<a href="https://moment.github.io/luxon/#/formatting?id=table-of-tokens">
									Luxon Format
								</a>
								{" " +
									Messages.form_date_field_format_sample.get()}
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
		</Fragment>
	);
}
