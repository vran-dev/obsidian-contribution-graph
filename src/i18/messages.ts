import { En } from "./en";
import { Local } from "./types";
import { Zh } from "./zh";

export class Locals {

	static get(): Local {
		const lang = window.localStorage.getItem("language");
		if (lang === "zh") {
			return new Zh();
		}
		return new En();
	}
}

export function isZh(): boolean {
	const lang = window.localStorage.getItem("language");
	return lang === "zh";
}

export const weekDayMapping = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const cnWeekDayMapping = ["日", "一", "二", "三", "四", "五", "六"];

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

export function localizedMonthMapping(month: number) {
	const lang = window.localStorage.getItem("language");
	if (lang === "zh") {
		return `${month + 1}月`;
	}
	return monthMapping[month];
}

export function localizedWeekDayMapping(weekday: number, maxLength?: number) {
	const lang = window.localStorage.getItem("language");
	let localizedWeekday;
	if (lang === "zh") {
		localizedWeekday = cnWeekDayMapping[weekday];
	} else {
		localizedWeekday = weekDayMapping[weekday];
	}

	if (maxLength) {
		return localizedWeekday.substring(0, maxLength);
	} else {
		return localizedWeekday;
	}
}

export function localizedYearMonthMapping(year: number, month: number) {
	const lang = window.localStorage.getItem("language");
	if (lang === "zh") {
		return `${year}年${month + 1}月`;
	}
	return `${monthMapping[month]} ${year}`;
}
