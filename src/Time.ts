import {
	addMinutes as baseAddMinutes,
	addHours as baseAddHours,
	addDays as baseAddDays,
	addWeeks as baseAddWeeks,
	addMonths as baseAddMonths,
	addYears as baseAddYears,
	format as baseFormat,
	parse as baseParse,
	compareAsc as baseCompareAsc,
	subMinutes as baseSubMinutes,
	subHours as baseSubHours,
	subWeeks as baseSubWeeks,
	subMonths as baseSubMonths,
	subYears as baseSubYears,
	subDays as baseSubDays,
	differenceInDays as baseDifferenceInDays,
	set as baseSet
} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

export interface SetTimeOptions {
	readonly year?: number;
	readonly month?: number;
	readonly date?: number;
	readonly hours?: number;
	readonly minutes?: number;
	readonly seconds?: number;
	readonly milliseconds?: number;
}

export const differenceInDays =
	(start: Date) =>
	(end: Date): number =>
		baseDifferenceInDays(start, end);

export const fromMillis = (millis: number): Date => new Date(millis);

export const set =
	(options: SetTimeOptions) =>
	(date: Date): Date =>
		baseSet(date, options);

export const setUtc =
	(options: SetTimeOptions) =>
	(date: Date): Date =>
		baseAddMinutes(baseSet(date, options), date.getTimezoneOffset() * -1);

export const addMinutes =
	(amount: number) =>
	(date: Date): Date =>
		baseAddMinutes(date, amount);

export const addHours =
	(amount: number) =>
	(date: Date): Date =>
		baseAddHours(date, amount);

export const addDays =
	(amount: number) =>
	(date: Date): Date =>
		baseAddDays(date, amount);

export const addWeeks =
	(amount: number) =>
	(date: Date): Date =>
		baseAddWeeks(date, amount);

export const addMonths =
	(amount: number) =>
	(date: Date): Date =>
		baseAddMonths(date, amount);

export const addYears =
	(amount: number) =>
	(date: Date): Date =>
		baseAddYears(date, amount);

export const subMinutes =
	(amount: number) =>
	(date: Date): Date =>
		baseSubMinutes(date, amount);

export const subHours =
	(amount: number) =>
	(date: Date): Date =>
		baseSubHours(date, amount);

export const subDays =
	(amount: number) =>
	(date: Date): Date =>
		baseSubDays(date, amount);

export const subWeeks =
	(amount: number) =>
	(date: Date): Date =>
		baseSubWeeks(date, amount);

export const subMonths =
	(amount: number) =>
	(date: Date): Date =>
		baseSubMonths(date, amount);

export const subYears =
	(amount: number) =>
	(date: Date): Date =>
		baseSubYears(date, amount);

export const format =
	(formatString: string) =>
	(date: Date): string =>
		baseFormat(date, formatString);

export const formatTZ =
	(timeZone: string) =>
	(formatString: string) =>
	(date: Date): string =>
		formatInTimeZone(date, timeZone, formatString);

export const parse =
	(formatString: string) =>
	(dateString: string): Date =>
		baseParse(dateString, formatString, new Date());

export const compare =
	(dateLeft: Date) =>
	(dateRight: Date): number =>
		baseCompareAsc(dateLeft, dateRight);
