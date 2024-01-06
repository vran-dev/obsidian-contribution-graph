function errorTipsHtmlTemplate(title: string, recommends: string[]) {
	return {
		summary: title,
		recommends: recommends,
	};
}

export const MISS_CONFIG = (invalidValue?: string | number | boolean) =>
	errorTipsHtmlTemplate("Empty Graph, please add config, for example", [
		`title: 'Contributions'
days: 365
dataSource: '#tag' # means all notes with tag 'tag'
  type: "page" # or "task"
  value: '""' # means all notes in folder`,
	]);

export const MISS_DATASOURCE_OR_DATA = (invalidValue?: string | number | boolean) =>
	errorTipsHtmlTemplate(
		"please set dataSource or data property, for example",
		[
			`dataSource: '#tag' # means all notes with tag 'tag'
  type: "page" # or "task"
  value: '""' # means all notes
days: 365`,

			`dataSource: '#tag and "folder"' # means all notes with tag 'tag' and in folder 'folder', folder should surrounded by quotes
  type: "page" # or "task"
	value: '""' # means all notes
fromDate: '2023-01-01' 
toDate: '2023-12-31'  `,
		]
	);

export const INVALID_GRAPH_TYPE = (invalidValue?: string | number | boolean) =>
	errorTipsHtmlTemplate(
		`graphType "${invalidValue}" is invalid, value must be one of [default, month-track, calendar], for example`,
		[
			`graphType: 'default'
days: 365
dataSource: '#tag' # means all notes with tag 'tag'
  type: "page" # or "task"
  value: '""' # means all notes in folde `,
		]
	);

export const MISS_DAYS_OR_RANGE_DATE = (
	invalidValue?: string | number | boolean
) =>
	errorTipsHtmlTemplate(
		"please set days or fromDate and toDate property, for example",
		[
			`days: 365
dataSource: '#tag' # means all notes with tag 'tag'
  type: "page" # or "task"
  value: '""' # means all notes in folde `,

			`fromDate: '2023-01-01'
toDate: '2023-12-31'
dataSource: '#tag' # means all notes with tag 'tag'
  type: "page" # or "task"
  value: '""' # means all notes in folde`,
		]
	);

export const INVALID_DATE_FORMAT = (invalidValue?: string | number | boolean) =>
	errorTipsHtmlTemplate(
		`"${invalidValue}" is invalid, fromDate and toDate must be yyyy-MM-dd, for example`,
		[
			`fromDate: '2023-01-01'
toDate: '2023-12-31'
data: []`,
		]
	);

export const INVALID_START_OF_WEEK = (
	invalidValue?: string | number | boolean
) =>
	errorTipsHtmlTemplate(
		`startOfWeek value ${invalidValue} is invalid, should be 0~6, 0=Sunday, 1=Monday, 2=Thursday and etc. for example`,
		[
			`fromDate: '2023-01-01'
toDate: '2023-12-31'
data: []
startOfWeek: 1`,
		]
	);
