import { CellStyleRule } from "../types";

export function mapBy<T, R>(
	arr: T[],
	keyMapping: (item: T) => string,
	valueMapping: (item: T) => R,
	aggregator: (a: R, b: R) => R
) {
	const map = new Map<string, R>();
	for (const item of arr) {
		const key = keyMapping(item);
		if (map.has(key)) {
			//@ts-ignore
			map.set(key, aggregator(map.get(key), valueMapping(item)));
		} else {
			map.set(key, valueMapping(item));
		}
	}
	return map;
}

export function matchCellStyleRule(value: number, rules: CellStyleRule[]): CellStyleRule | null {
	for (let i = 0; i < rules.length; i++) {
		if (value >= rules[i].min && value < rules[i].max) {
			return rules[i];
		}
	}
	return null;
}

export function parseNumberOption(str: string): number | null {
	const trimmedStr = str.trim();

	if (trimmedStr === "") {
		return null;
	}
	const num = Number(trimmedStr);

	if (Number.isNaN(num)) {
		return null;
	}
	return num;
}