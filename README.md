
![](release/README/1.png)

A interactive contribution graph like github to track your notes, habits, activity, history and so on.

## Features

- Render fixed date range chart
- Render recent date range chart
- Customize start of weekday
- Customize cell style
- Interactive charts, you can customize cell click event, hover to show statistic data
- Integrate with DataviewJS

## Sample

The following shows how to render charts using dataviewjs

### Create a chart for a fixed time period

- for fixed year

```dataviewjs
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

![](./release/README/20231214103105075.png)


- for current year

```dataviewjs
const currentYear = new Date().getFullYear()
const from = currentYear + '-01-01'
const to = currentYear + '-12-31'
const data = dv.pages('#project')
	.map(p => {
		return {
			date: p.createTime.toFormat('yyyy-MM-dd'),
			value: p
		}
	})
	.groupBy(p => p.date)
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

![](./release/README/20231214102940657.png)

- for current month

```dataviewjs
const currentYear = new Date().getFullYear()
const month = new Date().getMonth()// 0~11
const nextMonth = month + 1
const lastDayOfCurrentMonth = new Date(currentYear, nextMonth, 0).getDate()
const formattedLastDayOfCurrentMonth = lastDayOfCurrentMonth < 10 ? '0'+lastDayOfCurrentMonth:lastDayOfCurrentMonth
const formattedMonth = month < 9 ? '0' + (month+1): '' + (month+1)
const from = `${currentYear}-${formattedMonth}-01'`
const to = `${currentYear}-${formattedMonth}-${formattedLastDayOfCurrentMonth}'`

const data = []

const calendarData = {
    title:  `${from} to ${to}`,
    data: data,
    fromDate: from,
    toDate: to
}
renderContributionGraph(this.container, calendarData)
```

![](./release/README/20231214102821580.png)

- for current week

```dataviewjs

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

const data = []
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

![](./release/README/20231214102814024.png)
### Create a chart of recent time periods

fixed dates, you can also use the days attribute to generate a chart of recent dates

- in the lastest 365 days

```dataviewjs
const data = dv.pages('#project')
	.map(p => {
		return {
			date: p.createTime.toFormat('yyyy-MM-dd'),
			value: p
		}
	})
	.groupBy(p => p.date)
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

![](./release/README/20231214102807898.png)
### Begin with Monday

By default, the first row represents Sunday, you can change it by configuring `startOfWeek`, the allowable values is 0~6

```dataviewjs
const currentYear = new Date().getFullYear()
const from = currentYear + '-01-01'
const to = currentYear + '-12-31'
const data = []

const calendarData = {
    title:  `${from} to ${to}`,
    data: data,
    fromDate: from,
    toDate: to,
    startOfWeek: 1 // set to 1 means start with monday
}
renderContributionGraph(this.container, calendarData)
```

![](./release/README/20231214102759579.png)
### Customize cell click event

By configuring the oncellclick attribute, you can set the cell click behavior you want.

The following shows an example of automatically performing a keyword search after clicking on a cell.

```dataviewjs
const data = dv.pages('#project')
	.map(p => {
		return {
			date: p.createTime.toFormat('yyyy-MM-dd'),
			value: p
		}
	})
	.groupBy(p => p.date)
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

![](./release/README/20231214102752275.png)

### Customize Cells

By configuring the cellStyleRules attribute, you can customize the cell's background color or inner text

if the number of contributions at a specified date is larger or equal to `min`, less than `max`, then the `rule` will be matched

> min <= {contributions} < max

| name  | type   | description |
| ----- | ------ | ----------- |
| color | string | hex color   |
| min   |  number      | the min contribution            |
| max   |  number      | the max contribution            |

- customize background color

```dataviewjs
const data = dv.pages('#project')
	.map(p => {
		return {
			date: p.createTime.toFormat('yyyy-MM-dd'),
			value: p
		}
	})
	.groupBy(p => p.date)
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
			color: "#FFF8DC",
			min: 1,
			max: 2,
		},
		{
			color: "#FFECB3",
			min: 2,
			max: 3,
		},
		{
			color: "#FFD700",
			min: 3,
			max: 4,
		},
		{
			color: "#FFC200",
			min: 4,
			max: 999,
		},
	]
}
renderContributionGraph(this.container, calendarData)

```

![](./release/README/20231214102737916.png)


- customize inner text

```dataviewjs
const data = dv.pages('#project')
	.flatMap(p => {
		const arr = []
		if (p.doneTime) {
			arr.push({
				date: p.doneTime.toFormat('yyyy-MM-dd'),
				value: p,
				group: 'done'
			})
		} 
		if (p.createTime) {
			arr.push({
				date: p.createTime.toFormat('yyyy-MM-dd'),
				value: p,
				group: 'created'
			})
		}
		if(!p.createTime && !p.doneTime) {
			console.warn(`project ${p.file.name} missing createTime or doneTime field`)
		}
		return arr
	})
	.groupBy(p => p.date)
	.map(entry =>{
		const doneGroupCount = entry.rows.filter(i => i.group == 'done').length
		const createdGroupCount = entry.rows.filter(i => i.group == 'created').length
		return {
			date: entry.key,
			value: entry.rows.length,
			summary: `create ${createdGroupCount} and done ${doneGroupCount} projects at ${entry.key}`
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

![Alt text](release/README/2.png)