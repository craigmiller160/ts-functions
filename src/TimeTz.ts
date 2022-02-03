import { zonedTimeToUtc, utcToZonedTime, formatInTimeZone } from 'date-fns-tz';

export const toUtc =
	(timeZone: string) =>
	(date: Date): Date =>
		zonedTimeToUtc(date, timeZone);

export const fromUtc =
	(timeZone: string) =>
	(date: Date): Date =>
		utcToZonedTime(date, timeZone);

export const format =
	(timeZone: string) =>
	(formatString: string) =>
	(date: Date): string =>
		formatInTimeZone(date, timeZone, formatString);
