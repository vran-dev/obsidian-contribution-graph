
![](attachment/d20ba90e31c16a3c4d79cba9298577de.png)

## What

Contribution Graph is a plugin for [obsidin.md](https://obsidian.md/) which could generate interactive contribution graphs like GitHub to track your notes, habits, activity, history, and so on.

[![Buy me a coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://www.buymeacoffee.com/vran)

## Features

- diverse views, support week-track(default), month-track, and calendar view.
- personalized style, you can configure different cell colors and fill cells with emojis.
- use fixed date range or latest date to generate graph
- interactive charts, you can customize cell click event, hover to show statistic data
- simply integrate with DataviewJS, use contribution graph's api to dynamically render charts 

![](attachment/74103317de5336b5283338c56171f268.png)

## Quick Start

- ctrl+p (or command+p on mac) to open the command select panel
- write `contribution` to search and click `create contribution graph` command
- click the `save` button, and then a heatmap will be created.

![Alt text](attachment/contribution-graph-create.gif)


### How to modify graph?

Jut click the edit button at top right corner

![Alt text](attachment/contribution-graph-edit.gif)

### Configurations

| name                   | description                                                           | type                    | default    | sample     | required                                 |
| ---------------------- | --------------------------------------------------------------------- | ----------------------- | ---------- | ---------- | ---------------------------------------- |
| title                  | the title of the graph                                                | string                  | Contributions         |            | false                                    |
| titleStyle             | the style of the title                                                | object                  |          |            |   false                                       |
| days                   | Maximum number of days for the chart to display (starting from today) | number                  |            | 365        | true if miss **fromDate** and **toDate** |
| fromDate               | The start date of the chart                                           | date, format yyyy-MM-dd |            | 2023-01-01 | true if miss **days**                    |
| toDate                 | The end date of the chart                                             | date, format yyyy-MM-dd |            | 2023-12-31 | true if miss **days**                    |
| query                  | dataview query syntax, contribution graph will use it to count files  | string                  |            |            | true                                     |
| dateField              | Date attributes of files used for data distribution                   | string                  | file.ctime | createTime | false                                    |
| startOfWeek            | start of week                                                         | number                  | 0          |            | false                                    |
| showCellRuleIndicators | Control the display and hiding of cell rule indicator elements        | boolean                 | true       |            | false                                    |
| cellStyleRules         | cell style rule                                                       | array                   |            |            | false                                    |

## More Usage Guid

- [API Usage, Integrate with DataviewJS ](README_ADVANCE.md)
- [Codeblock Usage](README_BASE.md)
