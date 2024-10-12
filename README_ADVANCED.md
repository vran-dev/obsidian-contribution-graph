## Examples of Week Track Graph 

The following shows how to render charts using dataviewjs

## Create a week track graph for a fixed time period

### Week track graph for fixed year

![Alt text](attachment/advance-1.png)

```js
const from = '2022-01-01'
const to = '2022-12-31'
const data = [
	{
		date: '2022-01-01', // yyyy-MM-dd
		value: 1
	},
	{
		date: '2022-02-01', // yyyy-MM-dd
		value: 2
	},
	{
		date: '2022-03-01', // yyyy-MM-dd
		value: 3
	},
	{
		date: '2022-04-01', // yyyy-MM-dd
		value: 4
	},
	{
		date: '2022-05-01', // yyyy-MM-dd
		value: 5
	}
]

const calendarData = {
    title:  `${from} to ${to}`, // graph title
    data: data, // data
    fromDate: from, // from date, yyyy-MM-dd
    toDate: to // to date, yyyy-MM-dd
}
renderContributionGraph(this.container, calendarData)
```


### Week track graph for current year

![Alt text](attachment/advance-2.png)

```js
const currentYear = new Date().getFullYear()
const from = currentYear + '-01-01'
const to = currentYear + '-12-31'
const data = dv.pages('#project')
	.groupBy(p =>  p.file.ctime.toFormat('yyyy-MM-dd')) // 
	.map(entry =>{
		return {
			date: entry.key,
			value: entry.rows.length
		}
	})

const calendarData = {
    title:  `${from} to ${to}`,
    data: data,
    fromDate: from,
    toDate: to
}
renderContributionGraph(this.container, calendarData)
```

### Week track graph for current month

![Alt text](attachment/advance-3.png)

```js
const currentYear = new Date().getFullYear()
const month = new Date().getMonth()// 0~11
const nextMonth = month + 1
const lastDayOfCurrentMonth = new Date(currentYear, nextMonth, 0).getDate()
const formattedLastDayOfCurrentMonth = lastDayOfCurrentMonth < 10 ? '0'+lastDayOfCurrentMonth:lastDayOfCurrentMonth
const formattedMonth = month < 9 ? '0' + (month+1): '' + (month+1)
const from = `${currentYear}-${formattedMonth}-01'`
const to = `${currentYear}-${formattedMonth}-${formattedLastDayOfCurrentMonth}'`

const data = dv.pages('#project')
	.groupBy(p => p.file.ctime.toFormat('yyyy-MM-dd'))
	.map(entry => {
		return {
			date: entry.key,
			value: entry.rows.length
		}
	})

const calendarData = {
    title:  `${from} to ${to}`,
    data: data,
    fromDate: from,
    toDate: to
}
renderContributionGraph(this.container, calendarData)
```

### week track graph for current week

![Alt text](attachment/advance-4.png)


```js
function formatDateString(date) {
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');
  return year + '-' + month + '-' + day;
}

function getStartAndEndOfWeek() {
  var currentDate = new Date();
  var currentDayOfWeek = currentDate.getDay();
  var diffToStartOfWeek = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  var startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - diffToStartOfWeek);
  var endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6);
  
  var formattedStart = formatDateString(startOfWeek);
  var formattedEnd = formatDateString(endOfWeek);
  
  return {
    start: formattedStart,
    end: formattedEnd
  };
}

const data = [] // your data here
const weekDate = getStartAndEndOfWeek()
const from = weekDate.start
const to = weekDate.end

const calendarData = {
    title:  `${from} to ${to}`,
    data: data,
    fromDate: from,
    toDate: to
}
renderContributionGraph(this.container, calendarData)

```

## Create a week track graph at relative time periods

fixed dates, you can also use the days attribute to generate a chart of relative dates

### Week track graph in the lastest 365 days

![Alt text](attachment/advance-5.png)

```js
const data = dv.pages('#project')
	.groupBy(p => p.file.ctime.toFormat('yyyy-MM-dd'))
	.map(entry =>{
		return {
			date: entry.key,
			value: entry.rows.length
		}
	})
const calendarData = {
    days: 365,
    title: 'Contributions in the last 365 days ',
    data: data
}
renderContributionGraph(this.container, calendarData)
```
### Settings for the week track grapg
#### Begin with Monday

By default, the first row represents Sunday, you can change it by configuring `startOfWeek`, the allowable values is 0~6

![Alt text](attachment/advance-6.png)

```js
const currentYear = new Date().getFullYear()
const from = currentYear + '-01-01'
const to = currentYear + '-12-31'
const data = dv.pages('""')
	.groupBy(p => p.file.ctime.toFormat('yyyy-MM-dd'))
	.map(p =>  {
		return {
			date: p.key,
			value: p.rows.length
		}
	})

const calendarData = {
    title:  `${from} to ${to}`,
    data: data,
    fromDate: from,
    toDate: to,
    startOfWeek: 1 // set to 1 means start with monday
}
renderContributionGraph(this.container, calendarData)
```

#### Customize cell click event

By configuring the oncellclick attribute, you can set the cell click behavior you want.

The following shows an example of automatically performing a keyword search after clicking on a cell.

![Alt text](attachment/advance-7.png)

```js
const data = dv.pages('#project')
	.groupBy(p => p.file.ctime.toFormat('yyyy-MM-dd'))
	.map(entry =>{
		return {
			date: entry.key,
			value: entry.rows.length
		}
	})
const calendarData = {
    days: 365,
    title: 'Contributions in the last 365 days ',
    data: data,
    onCellClick: (item) => {
	    // generate search key
	    const key = `["tags":project] ["createTime":${item.date}]`
	    // use global-search plugin to search data
		app.internalPlugins.plugins['global-search'].instance.openGlobalSearch(key)
    },
}
renderContributionGraph(this.container, calendarData)
```
#### Customize Cells

By configuring the cellStyleRules attribute, you can customize the cell's background color or inner text

if the number of contributions at a specified date is larger or equal to `min`, less than `max`, then the `rule` will be matched

> min <= {contributions} < max

| name  | type   | description |
| ----- | ------ | ----------- |
| color | string | hex color   |
| min   |  number      | the min contribution            |
| max   |  number      | the max contribution            |

- customize background color

![Alt text](attachment/advance-8.png)

```js
const data = dv.pages('#project')
	.filter(p => p.createTime)
	.groupBy(p => p.createTime.toFormat('yyyy-MM-dd')) // your shold hava createTime field
	.map(entry =>{
		return {
			date: entry.key,
			value: entry.rows.length
		}
	})
const calendarData = {
    days: 365,
    title: 'Contributions in the last 365 days ',
    data: data,
    onCellClick: (item) => {
	    const key = `["tags":project] ["createTime":${item.date}]`
		app.internalPlugins.plugins['global-search'].instance.openGlobalSearch(key)
    },
    cellStyleRules: [
		{
			color: "#f1d0b4",
			min: 1,
			max: 2,
		},
		{
			color: "#e6a875",
			min: 2,
			max: 3,
		},
		{
			color: "#d97d31",
			min: 3,
			max: 4,
		},
		{
			color: "#b75d13",
			min: 4,
			max: 999,
		},
	]
}
renderContributionGraph(this.container, calendarData)
```

#### Customize inner text

![Alt text](attachment/advance-9.png)

```js
const data = dv.pages('#project')
	.groupBy(p => p.file.ctime.toFormat('yyyy-MM-dd'))
	.map(entry =>{
		return {
			date: entry.key,
			value: entry.rows.length
		}
	})
const calendarData = {
    days: 365,
    title: 'Contributions in the last 365 days ',
    data: data,
    onCellClick: (item) => {
	    const key = `["tags":project] ["createTime":${item.date}]`
		app.internalPlugins.plugins['global-search'].instance.openGlobalSearch(key)
    },
    cellStyleRules: [
	    {
		    min: 1,
		    max: 2,
		    text: '🌲'
	    },
	    {
		    min: 2,
		    max: 3,
		    text: '😥'
	    },
	    {
		    min: 3,
		    max: 4,
		    text: '✈'
	    },
	    {
		    min: 4,
		    max: 99,
		    text: '✈'
	    }
    ]
}
renderContributionGraph(this.container, calendarData)
```

## Use Month Track Graph 

In addition to the weekly tracking chart (the default), you can also generate a monthly tracking chart.

In a monthly tracking chart, each row represents the date of an entire month, like this

![Alt text](attachment/advance-10.png)

Configuration is very simple, just set the graphType to month-track and you're good to go!

```js
const from = '2022-01-01'
const to = '2022-12-31'
const data = dv.pages('#project')
	.groupBy(p => p.file.ctime.toFormat('yyyy-MM-dd'))
	.map(entry => {
		return { date: entry.key, value: entry.rows.length }
	})

const options = {
    title: `Contributions from ${from} to ${to}`,
    data: data,
    days: 365,
    fromDate: from,
    toDate: to,
    graphType: "month-track" // set this field value as 'month-track'
}
renderContributionGraph(this.container, options)
```

## Use Calendar Graph

Same as the previous example, it's only need to set the graphType to calendar and you will get a calendar graph

![Alt text](attachment/advance-11.png)

## Full Render Configuration

```js

export class ContributionGraphConfig {
	/**
	 * the title of the graph
	 */
	title = "Contribution Graph";

	/**
	 * the style of the titleo
	 */
	titleStyle: Partial<CSSStyleDeclaration> = {};

	/**
	 * recent days to show
	 */
	days?: number | undefined;

	/**
	 * the start date of the graph，if `days` is set, this value will be ignored
	 */
	fromDate?: Date | string | undefined;

	/**
	 * the end date of the graph，if `days` is set, this value will be ignored
	 */
	toDate?: Date | string | undefined;

	/**
	 * the data to show at cell
	 */
	data: Contribution[];

	/**
	 * the rules to style the cell
	 */
	cellStyleRules: CellStyleRule[] = DEFAULT_RULES;

	/**
	 * set false to hide rule indicators
	 */
	showCellRuleIndicators = true;

	/**
	 * `default`: every column is a week day from top to bottom
	 * `month-track`: every row is a month from left to right
	 *
	 * default value: `default`
	 */
	graphType: "default" | "month-track" | "calendar" = "default";

	/**
	 * value range: 0->Sunday, 1->Monday, 2->Tuesday, 3->Wednesday, 4->Thursday, 5->Friday, 6->Saturday
	 * default value: 0
	 * notice: it's not work when `graphType` is `month-track`
	 */
	startOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0;

	/**
	 * callback when cell is clicked
	 */
	onCellClick?: (
		cellData: ContributionCellData,
		event: MouseEvent | undefined
	) => void | undefined;
}

export interface Contribution {
	/**
	 * the date of the contribution, format: yyyy-MM-dd
	 */
	date: string;
	/**
	 * the value of the contribution
	 */
	value: number;
	/**
	 * the summary of the contribution, will be shown when hover on the cell
	 */
	summary: string | undefined;
}

export interface CellStyleRule {
	// the background color for the cell
	color: string;
	// the text in the cell
	text?: string | undefined;
	// the inlusive min value
	min: number;
	// the exclusive max value
	max: number;
}

```