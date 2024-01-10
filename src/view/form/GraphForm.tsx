import { useRef, useState } from "react";
import { CodeBlockProcessor } from "src/processor/codeBlockProcessor";
import { CellStyleRule } from "src/types";
import { Choose } from "../choose/Choose";
import { CellRuleItem } from "./CellRuleFormItem";
import { THEMES } from "./GraphTheme";
import { Locals } from "src/i18/messages";
import { App } from "obsidian";

import {
	cellShapes,
	titleAlignChooseOptions,
	graphOptions,
	startOfWeekOptions,
} from "./options";
import { DataSourceFormItem } from "./DataSourceFormItem";
import { YamlGraphConfig } from "src/processor/types";
import { Tab } from "../tab/Tab";

export function CreateContributionGraphForm(props: {
	yamlConfig: YamlGraphConfig;
	onSubmit: (yamlGraphConfig: YamlGraphConfig) => void;
	app: App;
}): JSX.Element {
	const { yamlConfig } = props;
	const local = Locals.get();
	const previewContainerRef = useRef<HTMLDivElement>(null);

	const [isLatestDate, setIsLatestDate] = useState(
		yamlConfig.days !== undefined ||
			(!yamlConfig.fromDate && !yamlConfig.toDate)
	);
	const [formData, setFormData] = useState(yamlConfig);
	const [cellRules, setCellRules] = useState<CellStyleRule[]>(
		yamlConfig.cellStyleRules || []
	);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		changeFormData(name, value);
	};

	const handleThemeChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;
		const theme = THEMES.find((t) => t.name == value);
		if (theme) {
			changeFormData("cellStyleRules", theme.rules);
			setCellRules(theme.rules);
		}
	};

	const handleCellShapeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { value } = e.target;
		changeFormData("cellStyle", {
			...formData.cellStyle,
			borderRadius: value,
		});
	};

	const getDefaultCellShape = (): string => {
		if (formData.cellStyle && formData.cellStyle.borderRadius) {
			return (
				cellShapes.find(
					(p) => p.value == formData.cellStyle?.borderRadius
				)?.value || ""
			);
		}
		return "";
	};

	const changeFormData = (name: string, value: any) => {
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const addCellRule = () => {
		const newRule = {
			id: new Date().getTime(),
			min: 1,
			max: 2,
			color: "#63aa82",
			text: "",
		};
		setCellRules([...cellRules, newRule]);
	};

	const onSubmit = () => {
		formData.cellStyleRules = cellRules;
		props.onSubmit(formData);
	};

	const onPreview = () => {
		if (previewContainerRef.current) {
			previewContainerRef.current.empty();
			const processor = new CodeBlockProcessor();
			// copy new instance
			const copiedFormData = JSON.parse(JSON.stringify(formData));
			copiedFormData.cellStyleRules = cellRules;
			processor.renderFromYaml(
				copiedFormData,
				previewContainerRef.current!,
				props.app
			);
		}
	};

	return (
		<>
			<Tab
				activeIndex={0}
				tabs={[
					{
						title: local.form_basic_settings,
						children: (
							<div className="contribution-graph-modal-form">
								<div className="form-group">
									<div className="form-item">
										<span className="label">
											{local.form_title}
										</span>
										<div className="form-content">
											<input
												name="title"
												type="text"
												defaultValue={formData.title}
												placeholder={local.form_title_placeholder}
												onChange={handleInputChange}
												style={{
													...formData.titleStyle,
													fontSize: "inherits",
													fontWeight:
														formData.titleStyle
															?.fontWeight ||
														"normal",
													// @ts-ignore
													textAlign:
														formData.titleStyle
															?.textAlign ||
														"left",
												}}
											/>

											<Choose
												options={
													titleAlignChooseOptions
												}
												defaultValue={
													formData.titleStyle
														?.textAlign || "left"
												}
												onChoose={(option) => {
													changeFormData(
														"titleStyle",
														{
															...formData.titleStyle,
															textAlign:
																option.value,
														}
													);
												}}
											/>
										</div>
									</div>

									<div className="form-item">
										<span className="label">
											{local.form_graph_type}
										</span>
										<div className="form-content">
											<select
												name="graphType"
												defaultValue={
													formData.graphType ||
													graphOptions.find(
														(p) => p.selected
													)?.value
												}
												onChange={handleInputChange}
											>
												{graphOptions.map((option) => (
													<option
														value={option.value}
														key={option.value}
													>
														{option.label}
													</option>
												))}
											</select>
										</div>
									</div>

									<div className="form-item">
										<span className="label">
											{local.form_date_range}
										</span>
										<div className="form-content">
											<select
												defaultValue={
													isLatestDate
														? "latest"
														: "fixed"
												}
												onChange={() => {
													if (isLatestDate) {
														// change to fixed date should clear days field
														changeFormData(
															"days",
															undefined
														);
													}
													setIsLatestDate(
														!isLatestDate
													);
												}}
											>
												<option value="fixed">
													{local.form_date_range_fixed_date}
												</option>
												<option value="latest">
													{local.form_date_range_latest_days}
												</option>
											</select>
										</div>
									</div>

									<div className="form-item">
										<span className="label"></span>
										<div className="form-content">
											{isLatestDate ? (
												<>
													<input
														id="days"
														name="days"
														type="number"
														defaultValue={
															formData.days
														}
														min={1}
														placeholder={local.form_date_range_latest_days_placeholder}
														onChange={(e) =>
															changeFormData(
																"days",
																parseInt(
																	e.target
																		.value
																)
															)
														}
													/>
												</>
											) : (
												<>
													<input
														id="fromDate"
														name="fromDate"
														type="date"
														defaultValue={
															formData.fromDate
														}
														placeholder="from date, such as 2023-01-01"
														onChange={
															handleInputChange
														}
													/>
													&nbsp;-&nbsp;
													<input
														id="toDate"
														name="toDate"
														type="date"
														defaultValue={
															formData.toDate
														}
														placeholder="to date, such as 2023-12-31"
														onChange={
															handleInputChange
														}
													/>
												</>
											)}
										</div>
									</div>

									<DataSourceFormItem
										dataSource={formData.dataSource}
										onChange={(newDataSource) => {
											changeFormData(
												"dataSource",
												newDataSource
											);
										}}
										app={props.app}
									/>
								</div>
							</div>
						),
					},
					{
						title: local.form_style_settings,
						children: (
							<div className="contribution-graph-modal-form">
								<div className="form-group">
									<div className="form-item">
										<span className="label">
											{local.form_fill_the_screen_label}
										</span>
										<div className="form-content">
											<input
												type="checkbox"
												className="checkbox"
												defaultChecked={
													formData.fillTheScreen
												}
												onChange={() =>
													changeFormData(
														"fillTheScreen",
														!formData.fillTheScreen
													)
												}
											/>
										</div>
									</div>
									{formData.graphType ==
									"month-track" ? null : (
										<div className="form-item">
											<span className="label">
												{local.form_start_of_week}
											</span>
											<div className="form-content">
												<select
													id="startOfWeek"
													name="startOfWeek"
													defaultValue={
														formData.startOfWeek !=
														undefined
															? formData.startOfWeek
															: startOfWeekOptions.find(
																	(p) =>
																		p.selected
															  )?.value
													}
													onChange={handleInputChange}
												>
													{startOfWeekOptions.map(
														(option) => (
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
														)
													)}
												</select>
											</div>
										</div>
									)}
									<div className="form-item">
										<span className="label">
											{local.form_show_cell_indicators}
										</span>
										<div className="form-content">
											<input
												name="showCellRuleIndicators"
												type="checkbox"
												className="checkbox"
												defaultChecked={
													formData.showCellRuleIndicators
												}
												onChange={() =>
													changeFormData(
														"showCellRuleIndicators",
														!formData.showCellRuleIndicators
													)
												}
											/>
										</div>
									</div>
									<div className="form-item">
										<span className="label">
											{local.form_cell_shape}
										</span>
										<div className="form-content">
											<select
												name="cellShape"
												defaultValue={getDefaultCellShape()}
												onChange={handleCellShapeChange}
											>
												{cellShapes.map((option) => (
													<option
														value={option.value}
														key={option.label}
													>
														{option.label}
													</option>
												))}
											</select>
										</div>
									</div>
									<div className="form-item">
										<span className="label">
											{local.form_theme}
										</span>
										<div className="form-content">
											<select
												name="theme"
												aria-placeholder="select theme to generate style"
												onChange={handleThemeChanged}
											>
												{THEMES.map((option) => (
													<option
														value={option.name}
														key={option.name}
													>
														{option.name}
													</option>
												))}
											</select>
										</div>
									</div>
									<div className="form-item">
										<span className="label">
											{local.form_cell_style_rules}
										</span>
										<div className="form-vertical-content">
											{cellRules.map((rule) => {
												return (
													<CellRuleItem
														rule={rule}
														key={rule.id}
														onChange={(newRule) => {
															const newRules =
																cellRules.map(
																	(r) => {
																		if (
																			r.id ==
																			newRule.id
																		) {
																			return newRule;
																		} else {
																			return r;
																		}
																	}
																);
															setCellRules(
																newRules
															);
														}}
														onRemove={(
															id: string
														) => {
															const newRules =
																cellRules.filter(
																	(r) =>
																		r.id !=
																		id
																);
															setCellRules(
																newRules
															);
														}}
													/>
												);
											})}
											<button
												onClick={() => addCellRule()}
												className="list-add-button"
											>
												+
											</button>
										</div>
									</div>
								</div>
							</div>
						),
					},
				]}
			></Tab>
			<div className="contribution-graph-modal-form">
				<div
					className="preview-container"
					ref={previewContainerRef}
				></div>
				<div className="form-item">
					<div className="form-content">
						<button className="button" onClick={onPreview}>
							{local.form_button_preview}
						</button>
						<button className="button" onClick={onSubmit}>
							{local.form_button_save}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export class SelectOption<T> {
	label: string;
	value: T;
	selected?: boolean;

	constructor(label: string, value: T, selected?: boolean) {
		this.label = label;
		this.value = value;
		this.selected = selected;
	}
}
