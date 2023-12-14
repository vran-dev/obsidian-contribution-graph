import { Color } from "./types";

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

export function getColorByValue(value: number, colors: Color[]) {
	for (let i = 0; i < colors.length; i++) {
		if (value >= colors[i].min && value < colors[i].max) {
			return colors[i].color;
		}
	}
	return colors[0].color;
}
