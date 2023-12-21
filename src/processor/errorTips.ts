function errorTipsHtmlTemplate(title: string, codes: string[]) {
	return `
<p>${title}<p>
${codes.map((code) => `<pre>${code}</pre>`).join("<br>")}
	`;
}

export const MISS_CONFIG = (invalidValue?: string | number | boolean) =>
	errorTipsHtmlTemplate("Empty Graph, please add config, for example", [
		`title: 'Contributions'
days: 365
query: '#tag'`,
	]);

export const MISS_QUERY_OR_DATA = (invalidValue?: string | number | boolean) =>
	errorTipsHtmlTemplate("please set query or data property, for example", [
		`query: '#tag' # means all notes with tag 'tag'
days: 365`,

		`query: '#tag and "folder"' # means all notes with tag 'tag' and in folder 'folder', folder should surrounded by quotes
fromDate: '2023-01-01' 
toDate: '2023-12-31'  `
	]);

export const INVALID_GRAPH_TYPE = (invalidValue?: string | number | boolean) =>
	errorTipsHtmlTemplate(
		`graphType "${invalidValue}" is invalid, value must be one of [default, month-track, calendar], for example`,
		[
			`graphType: 'default'
days: 365
query: '#project' `,

			`graphType: 'month-track'
days: 365
query: '#project' `,

			`graphType: 'calendar'
days: 365
query: '#project' `,
		]
	);

export const MISS_DAYS_OR_RANGE_DATE = (
	invalidValue?: string | number | boolean
) =>
	errorTipsHtmlTemplate(
		"please set days or fromDate and toDate property, for example",
		[
			`days: 365
query: '#project' `,

			`fromDate: '2023-01-01'
toDate: '2023-12-31'
query: '#project'`,
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
