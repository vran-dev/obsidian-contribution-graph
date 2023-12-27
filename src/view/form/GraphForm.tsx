import { useRef, useState } from "react";
import {
	YamlGraphConfig,
	ContributionGraphRawProcessor,
} from "src/processor/contributionGraphCodeBlockProcessor";
import { CellStyleRule } from "src/types";
import { Choose, ChooseOption } from "./Choose";
import { CellRuleItem } from "./CellRuleFormItem";
import { Divider } from "../divider/Divider";
import { THEMES } from "./GraphTheme";

export function CreateContributionGraphForm(props: {
	yamlConfig: YamlGraphConfig;
	onSubmit: (yamlGraphConfig: YamlGraphConfig) => void;
}): JSX.Element {
	const { yamlConfig } = props;
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
			previewContainerRef.current.innerHTML = "";
			const processor = new ContributionGraphRawProcessor();
			// copy new instance
			const copiedFormData = JSON.parse(JSON.stringify(formData));
			copiedFormData.cellStyleRules = cellRules;
			processor.processYamlGraphConfig(
				copiedFormData,
				previewContainerRef.current!
			);
		}
	};

	return (
		<div className="contribution-graph-modal-form">
			<div className="form-group">
				<Divider text="Graph Settings" />
				<div className="form-item">
					<span className="label">Title</span>
					<div className="form-content">
						<input
							name="title"
							type="text"
							defaultValue={formData.title}
							placeholder="Contribution Graph Title"
							onChange={handleInputChange}
							style={{
								...formData.titleStyle,
								fontWeight:
									formData.titleStyle?.fontWeight || "normal",
								// @ts-ignore
								textAlign:
									formData.titleStyle?.textAlign || "left",
							}}
						/>

						<Choose
							options={titleAlignChooseOptions}
							defaultValue={
								formData.titleStyle?.textAlign || "left"
							}
							onChoose={(option) => {
								changeFormData("titleStyle", {
									...formData.titleStyle,
									textAlign: option.value,
								});
							}}
						/>
					</div>
				</div>

				<div className="form-item">
					<span className="label">Graph Type</span>
					<div className="form-content">
						<select
							name="graphType"
							defaultValue={
								formData.graphType ||
								graphOptions.find((p) => p.selected)?.value
							}
							onChange={handleInputChange}
						>
							{graphOptions.map((option) => (
								<option value={option.value} key={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="form-item">
					<span className="label">Date Range</span>
					<div className="form-content">
						<select
							defaultValue={isLatestDate ? "latest" : "fixed"}
							onChange={() => {
								if (isLatestDate) {
									// change to fixed date should clear days field
									changeFormData("days", undefined);
								}
								setIsLatestDate(!isLatestDate);
							}}
						>
							<option value="fixed">Fixed Date</option>
							<option value="latest">Latest Date</option>
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
									defaultValue={formData.days}
									min={1}
									placeholder="please input the number of the latest days"
									onChange={(e) =>
										changeFormData(
											"days",
											parseInt(e.target.value)
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
									defaultValue={formData.fromDate}
									placeholder="from date, such as 2023-01-01"
									onChange={handleInputChange}
								/>
								&nbsp;-&nbsp;
								<input
									id="toDate"
									name="toDate"
									type="date"
									defaultValue={formData.toDate}
									placeholder="to date, such as 2023-12-31"
									onChange={handleInputChange}
								/>
							</>
						)}
					</div>
				</div>

				{formData.graphType == "month-track" ? null : (
					<div className="form-item">
						<span className="label">Start of Week</span>
						<div className="form-content">
							<select
								id="startOfWeek"
								name="startOfWeek"
								defaultValue={
									formData.startOfWeek ||
									startOfWeekOptions.find((p) => p.selected)
										?.value
								}
								onChange={handleInputChange}
							>
								{startOfWeekOptions.map((option) => (
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
				)}
				<div className="form-item">
					<span className="label">Query</span>
					<div className="form-content">
						<input
							name="query"
							type="text"
							defaultValue={formData.query}
							placeholder='such as #tag or "folder_name"'
							onChange={handleInputChange}
						/>
					</div>
				</div>

				<div className="form-item">
					<span className="label">Date Field</span>
					<div className="form-content">
						<input
							type="text"
							defaultValue={formData.dateField}
							name="dateField"
							placeholder="default is file.ctime"
							onChange={handleInputChange}
						/>
					</div>
				</div>
			</div>

			<div className="form-group">
				<Divider text="Style Settings" />
				<div className="form-item">
					<span className="label">Show Cell Indicators</span>
					<div className="form-content">
						<input
							name="showCellRuleIndicators"
							type="checkbox"
							className="checkbox"
							defaultChecked={formData.showCellRuleIndicators}
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
					<span className="label">Cell Shape</span>
					<div className="form-content">
						<select
							name="cellShape"
							defaultValue={getDefaultCellShape()}
							onChange={handleCellShapeChange}
						>
							{cellShapes.map((option) => (
								<option value={option.value} key={option.label}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="form-item">
					<span className="label">Theme</span>
					<div className="form-content">
						<select
							name="theme"
							aria-placeholder="select theme to generate style"
							onChange={handleThemeChanged}
						>
							{THEMES.map((option) => (
								<option value={option.name} key={option.name}>
									{option.name}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="form-item">
					<span className="label">Cell Style Rules</span>
					<div className="form-vertical-content">
						{cellRules.map((rule) => {
							return (
								<CellRuleItem
									rule={rule}
									// @ts-ignore
									key={rule.id}
									onChange={(newRule) => {
										const newRules = cellRules.map((r) => {
											// @ts-ignore
											if (r.id == newRule.id) {
												return newRule;
											} else {
												return r;
											}
										});
										setCellRules(newRules);
									}}
									onRemove={(id: string) => {
										const newRules = cellRules.filter(
											// @ts-ignore
											(r) => r.id != id
										);
										setCellRules(newRules);
									}}
								/>
							);
						})}
						<button
							onClick={() => addCellRule()}
							className="cell-rule-add-button"
						>
							+
						</button>
					</div>
				</div>
			</div>

			<div className="form-item">
				<div className="form-content">
					<button className="button" onClick={onPreview}>
						Preview
					</button>
					<button className="button" onClick={onSubmit}>
						Save
					</button>
				</div>
			</div>

			<div className="preview-container" ref={previewContainerRef}></div>
		</div>
	);
}

export class SelectOption {
	label: string;
	value: string;
	selected?: boolean;

	constructor(label: string, value: string, selected?: boolean) {
		this.label = label;
		this.value = value;
		this.selected = selected;
	}
}

const titleAlignChooseOptions: ChooseOption[] = [
	{
		tip: "left",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="svg-icon lucide lucide-align-left"
			>
				<line x1="21" x2="3" y1="6" y2="6" />
				<line x1="15" x2="3" y1="12" y2="12" />
				<line x1="17" x2="3" y1="18" y2="18" />
			</svg>
		),
		value: "left",
	},
	{
		tip: "center",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="svg-icon lucide lucide-align-center"
			>
				<line x1="21" x2="3" y1="6" y2="6" />
				<line x1="17" x2="7" y1="12" y2="12" />
				<line x1="19" x2="5" y1="18" y2="18" />
			</svg>
		),
		value: "center",
	},
	{
		tip: "right",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="svg-icon lucide lucide-align-right"
			>
				<line x1="21" x2="3" y1="6" y2="6" />
				<line x1="21" x2="9" y1="12" y2="12" />
				<line x1="21" x2="7" y1="18" y2="18" />
			</svg>
		),
		value: "right",
	},
];

const graphOptions: SelectOption[] = [
	{
		label: "Week Track",
		value: "default",
		selected: true,
	},
	{
		label: "Month Track",
		value: "month-track",
	},
	{
		label: "Calendar",
		value: "calendar",
	},
];

const startOfWeekOptions: SelectOption[] = [
	{
		label: "Sunday",
		value: "0",
		selected: true,
	},
	{
		label: "Monday",
		value: "1",
	},
	{
		label: "Tuesday",
		value: "2",
	},
	{
		label: "Wednesday",
		value: "3",
	},
	{
		label: "Thursday",
		value: "4",
	},
	{
		label: "Friday",
		value: "5",
	},
	{
		label: "Saturday",
		value: "6",
	},
];

const cellShapes: SelectOption[] = [
	{
		label: "Round",
		value: "",
		selected: true,
	},
	{
		label: "Square",
		value: "0%",
	},
	{
		label: "Circle",
		value: "50%",
	},
];
