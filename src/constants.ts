import { CellStyleRule } from "./types";

export const monthMapping = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

export const weekDayMapping = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const DEFAULT_COLORS: CellStyleRule[] = [
	{
		color: "#9be9a8",
		min: 1,
		max: 2,
	},
	{
		color: "#40c463",
		min: 3,
		max: 5,
	},
	{
		color: "#30a14e",
		min: 6,
		max: 10,
	},
	{
		color: "#216e39",
		min: 10,
		max: 999,
	},
];
