import { CellStyleRule } from "./types";

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
			map.set(key, aggregator(map.get(key), valueMapping(item)));
		} else {
			map.set(key, valueMapping(item));
		}
	}
	return map;
}

export function matchCellStyleRule(value: number, rules: CellStyleRule[]): CellStyleRule {
	for (let i = 0; i < rules.length; i++) {
		if (value >= rules[i].min && value < rules[i].max) {
			return rules[i];
		}
	}
	return rules[0];
}
