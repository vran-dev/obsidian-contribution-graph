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

export const DEFAULT_RULES: CellStyleRule[] = [
	{
		id: "default_a",
		color: "#ebedf0",
		min: 0,
		max: 1,
	},
	{
		id: "default_b",
		color: "#9be9a8",
		min: 1,
		max: 2,
	},
	{
		id: "default_c",
		color: "#40c463",
		min: 2,
		max: 5,
	},
	{
		id: "default_d",
		color: "#30a14e",
		min: 5,
		max: 10,
	},
	{
		id: "default_e",
		color: "#216e39",
		min: 10,
		max: 999,
	},
];
