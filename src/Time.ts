import {
	addMinutes as baseAddMinutes,
	addWeeks as baseAddWeeks,
	addMonths as baseAddMonths,
	addYears as baseAddYears,
	format as baseFormat,
	parse as baseParse,
	compareAsc as baseCompareAsc
} from 'date-fns';

export const addMinutes =
	(amount: number) =>
	(date: Date): Date =>
		baseAddMinutes(date, amount);

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

export const format =
	(formatString: string) =>
	(date: Date): string =>
		baseFormat(date, formatString);

export const parse =
	(formatString: string) =>
	(dateString: string): Date =>
		baseParse(dateString, formatString, new Date());

export const compare =
	(dateLeft: Date) =>
	(dateRight: Date): number =>
		baseCompareAsc(dateLeft, dateRight);
