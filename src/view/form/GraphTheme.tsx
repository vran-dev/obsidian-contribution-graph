import { DEFAULT_RULES } from "src/constants";
import { CellStyleRule } from "src/types";

export interface Theme {
	name: string;
	description?: string;
	rules: CellStyleRule[];
}

export const THEMES = [
	{
		name: "choose theme to generate colors",
		description: "",
		rules: [],
	},
	{
		name: "default",
		description: "",
		rules: DEFAULT_RULES,
	},
	{
		name: "Ocean",
		description: "",
		rules: buildPureColorTheme(
			"Ocean",
			"#8dd1e2",
			"#63a1be",
			"#376d93",
			"#012f60"
		),
	},
	{
		name: "Halloween",
		description: "",
		rules: buildPureColorTheme(
			"Halloween",
			"#fdd577",
			"#faaa53",
			"#f07c44",
			"#d94e49"
		),
	},
	{
		name: "Lovely",
		description: "",
		rules: buildPureColorTheme(
			"Lovely",
			"#fedcdc",
			"#fdb8bf",
			"#f892a9",
			"#ec6a97"
		),
	},
	{
		name: "Wine",
		description: "",
		rules: buildPureColorTheme(
			"Wine",
			"#d8b0b3",
			"#c78089",
			"#ac4c61",
			"#830738"
		),
	},
];

export function buildPureColorTheme(
	themeName: string,
	a: string,
	b: string,
	c: string,
	d: string
) {
	return [
		{
			id: `${themeName}_a`,
			color: a,
			min: 1,
			max: 2,
		},
		{
			id: `${themeName}_b`,
			color: b,
			min: 2,
			max: 3,
		},
		{
			id: `${themeName}_c`,
			color: c,
			min: 3,
			max: 5,
		},
		{
			id: `${themeName}_d`,
			color: d,
			min: 5,
			max: 9999,
		},
	];
}
