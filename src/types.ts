export interface ContributionGraphConfig {
	title: string;
	days: number | undefined;
	fromDate: Date | string | undefined;
	toDate: Date | string | undefined;
	contributions: Contribution[];
	colors: Color[];
}

export interface Contribution {
	date: string;
	value: number;
}

export interface Color {
	color: string;
	min: number;
	max: number;
}

export interface ContributionCellData {
	date: string; // yyyy-MM-dd
	weekDay: number; // 0 - 6
	month: number; // 0 - 11
	monthDate: number; // 1 - 31
	year: number; // sample: 2020
	value: number;
}
